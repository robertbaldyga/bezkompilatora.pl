---
title: "Zarządzanie procesami w Linuxie"
date: 2018-07-09
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["procesy", "linux", "scheduler", "kernel", "zarządzanie zasobami"]
image: "/images/uploads/2018/07/hyperspace-high-speed.jpg"
summary: "Chyba każdy, kto choć trochę interesuje się informatyką, kojarzy postać Alana Turinga i ideę wymyślonej przez niego maszyny stanów (nazywanej maszyną Turinga). Model stworzony przez tego brytyjskiego matematyka, uważanego za jednego z twórców informatyki, reprezentuje prostą formę komputera…"
---

Chyba każdy, kto choć trochę interesuje się informatyką, kojarzy postać Alana Turinga i ideę wymyślonej przez niego maszyny stanów (nazywanej *maszyną Turinga*). Model stworzony przez tego brytyjskiego matematyka, uważanego za jednego z twórców informatyki, reprezentuje prostą formę komputera wykonującego instrukcje zapisane w pamięci jedna po drugiej. Tak jak to robią dzisiejsze komputery. Przynajmniej w pewnym przybliżeniu, bo jak się okazuje rzeczywistość jest nieco bardziej skomplikowana.

### Krótka historia współbieżności

Model matematyczny nie przewidział wszystkiego. Procesory od samego początku nie mogły cieszyć się swobodą wykonywania instrukcji jedna po drugiej w niezmąconym niczym spokoju. Już 8008, jeden z pierwszych produkowanych na masową skalę procesorów, stworzony przez firmę Intel prawie pół wieku temu, posiadał obsługę *przerwań*, które skutecznie uniemożliwiały mu działanie w pełni zgodne z Turingowskim ideałem.

Przerwanie (ang. interrupt) to sygnał generowany przez zewnętrzne lub wewnętrzne urządzenie procesora, który może w dowolnym momencie zatrzymać główny program i zmusić procesor do wykonania tzw. *procedury obsługi przerwania*. Po jej zakończeniu wykonanie głównego programu jest przywracane i wszystko toczy się dalej, aż do momentu wystąpienia kolejnego przerwania (czyli niezbyt długo – zazwyczaj do kilku milisekund).

##### Wątki

Późniejszy rozwój technologii również nie przyczynił się do zapewnienia procesorom większego spokoju. W związku z rosnącą liczbą peryferiów, potencjalnych źródeł przerwań było coraz więcej. W dodatku zaczęły pojawiać się pierwsze systemy operacyjne wspierające współbieżność, czyli możliwość wykonania kilku programów “jednocześnie” na tym samym procesorze. Powodowało to dodatkowe komplikacje natury software’owej.

Problem polegał na tym, że jednoczesne wykonywanie kilku programów na pojedynczym procesorze nie było możliwe. Nie istniały jeszcze wtedy systemy wieloprocesorowe, a użytkownicy potrzebowali współbieżności. Wymyślono wtedy prostą sztuczkę na “oszukanie” użytkownika, tak żeby wydawało mu się, że programy wykonują się współbieżnie.

Efekt ten osiągany był poprzez przełączanie się między programami w krótkich odstępach czasu. Po upływie określonego czasu program dobrowolnie kończył swoje działanie, a procesor przełączał się na kolejny program oczekujący na wykonanie. Podczas przełączania między programami procesor musiał zapamiętać stan aktualnie wykonywanego programu (poprzez zapisanie stanu rejestrów procesora), a następnie odtwarzał go podczas powrotu do jego wykonania. Taki model działania można w dużym uproszczeniu nazwać wielowątkowym.

##### Konteksty wykonania

Współbieżność miała swoje zalety – możliwe było korzystanie z kilku programów jednocześnie – ale wprowadzała również nowe problemy. Jednym z nich było ryzyko, że programy działające na tym samym procesorze i współdzielące tą samą pamięć będą ze sobą wzajemnie kolidować. Powodowało to nie tylko trudności w tworzeniu programów, które musiały same zadbać o to, żeby nie wchodzić w drogę innym, ale otwierało też furtkę dla złośliwego oprogramowania. W odpowiedzi na to twórcy procesorów wprowadzili kolejne usprawnienia – separację pamięci oraz tzw. ringi, czyli poziomy uprawnień do wykonania określonych operacji.

Dzięki nim każdy program mógł mieć przypisaną osobną przestrzeń adresową z wydzieloną tylko dla niego pulą dostępnej pamięci, a nad sprawiedliwym podziałem zasobów czuwało jądro systemu działające w najniższym ringu (czyli dającym największe uprawnienia). Tak powstał system wieloprocesowy, czyli taki, w którym każdy program wykonywany jest jako osobny, wyizolowany proces.

Jak się zapewne domyślasz, jednym z przykładów takiego systemu jest właśnie Linux. O jego sposobie zarządzania procesami opowiemy sobie w dzisiejszym wpisie.

### Anatomia Linuxowego procesu

Na proces w Linuxie składa się szereg zasobów, takich jak zaalokowana pamięć, przydzielony czas procesora, czy otwarte deskryptory plików, które mogą reprezentować zarówno pliki na dysku jak i urządzenia. Przydzielaniem tych zasobów zajmuje się jądro systemu, które dba również o to, żeby dostęp do nich miały tylko uprawnione procesy. Każdy proces posiada też unikalny numer PID, który służy do jego identyfikacji.

Proces może posiadać oddzielny zestaw zasobów, ale może też współdzielić wybraną ich część z innymi procesami. Na przykład dwa procesy mogą operować w tej samej przestrzeni adresowej. Jeżeli jeden z nich zaalokuje nową pamięć lub wmapuje plik w swoją przestrzeń adresową, drugi proces automatycznie zyskuje do niej dostęp.

Takie procesy współdzielące przestrzeń adresową mogą przypominać dwa wątki jednego procesu. W istocie jest w tym sporo prawdy, ponieważ jądro Linuxa nie rozróżnia wątków i procesów. Programy wielowątkowe działają właśnie jako kilka procesów współdzielących między sobą zasoby.

##### Forkowanie

Procesy w Linuxie powstają poprzez rozwidlenie (zwane też klonowaniem), polegające na stworzeniu wiernej kopii klonowanego procesu. Nazwy te pochodzą od angielskich nazw wywołań systemowych **fork()** i **clone()**, służących właśnie do rozwidlania procesu. W programistycznym żargonie popularne jest też spolszczone słowo *forkowanie*.

W efekcie forkowania powstają dwa procesy – proces rodzic, który zainicjował całą operację, oraz proces dziecko, utworzony w jej wyniku. W Linuxie każdy proces ma swojego rodzica – wyjątkiem jest proces o numerze PID 1, który jest tworzony przez jądro podczas uruchamiania systemu. Wszystkie pozostałe procesy są jego potomkami.

### Co może zrobić proces?

To pytanie może się wydawać dziwne, ponieważ proces może zrobić cokolwiek, co jest zapisane w programie, który wykonuje. Jednak z perspektywy systemu operacyjnego, proces w czasie swojego wykonania może robić w zasadzie jedną z dwóch rzeczy – wykonywać swój kod w przestrzeni użytkownika lub wykonywać kod jądra po wejściu w wywołanie systemowe. Warto zauważyć, że w przypadku działania w przestrzeni użytkownika proces wykonuje własny kod programu, natomiast działając w przestrzeni jądra zawsze wykonuje kod jądra – proces nie ma możliwości uruchomienia kodu użytkownika wewnątrz jądra systemu.

Nawet najprostszy program może używać wielu wywołań systemowych (co pokazywałem już na przykładzie programu “Hello World!” w [tym wpisie](/blog/co-skrywa-program-hello-world/)). W związku z tym w trakcie swojego działania wielokrotnie przechodzi on z przestrzeni użytkownika do jądra i z powrotem. Te dwa tryby działania znacząco się od siebie różnią i o różnicach między nimi będę wspominał w dalszej części wpisu.

### Planista – strażnik czasu i zasobów

Linux jest systemem wieloprocesowym, co oznacza, że ma on możliwość wykonywania kilku procesów współbieżnie na tym samym procesorze. W takim systemie potrzebny jest arbiter, który będzie przydzielał procesom czas procesora i zasoby, tak aby wzajemnie ze sobą nie kolidowały. W Linuxie przydzielaniem procesom czasu procesora zajmuje się planista (ang. scheduler) działający w przestrzeni jądra. Zgodnie z określonym algorytmem szeregowania zadań przełącza on co chwilę wykonujący się aktualnie proces, symulując w ten sposób współbieżność.

Planista odpowiedzialny jest też za tzw. przełączanie kontekstu, czyli “przepięcie” zasobów odpowiednich dla danego procesu podczas jego przełączania. Ma on wiedzę o zasobach, które są własnością poszczególnych procesów oraz o tym, które z nich są między nimi współdzielone. Dzięki temu może więc ustawić każdemu procesowi odpowiedni kontekst wykonania zanim ten zostanie ostatecznie uruchomiony.

### W jaki sposób przełączane są procesy?

Kiedy proces zostanie wybrany przez planistę i jego kontekst zostanie ustawiony, jest on startowany dokładnie w tym miejscu, w którym został zatrzymany ostatnim razem. Z perspektywy procesu operacja ta jest więc praktycznie niezauważalna, chyba, że sprawdzi on aktualny czas na zegarze czasu rzeczywistego. Linux z natury nie jest systemem czasu rzeczywistego, co oznacza, że każdy proces może zostać przerwany na bliżej nieokreślony czas – nie ma zapewnionej żadnej gwarancji.

Po upływie przydzielonego czasu proces jest zatrzymywany przez planistę w dość brutalny sposób – poprzez tzw. *wywłaszczenie*. Polega ono na natychmiastowym przerwaniu działania procesu i zapisaniu jego stanu na potrzeby późniejszego jego przywrócenia. Taka sytuacja ma jednak miejsce jedynie wtedy, gdy proces wykonuje się w przestrzeni użytkownika. Proces działający w przestrzeni jądra nie może być wywłaszczony, chyba że jądro zostanie skompilowane z odpowiednią opcją, która jest domyślnie wyłączona na większości współczesnych dystrybucji.

Proces w przestrzeni jądra nie będzie wywłaszczony dopóki sam zrezygnuje z czasu procesora. Może to zrobić na przykład wywołując funkcję czekającą na jakieś zdarzenie lub bezpośrednio komunikując planiście, że chce zostać wywłaszczony. W przeciwnym wypadku wywłaszczenie nastąpi dopiero po powrocie z wywołania systemowego do przestrzeni użytkownika.

### Jak działa planista?

Możesz zastanawiać się w jaki sposób działa planista, skoro procesor może wykonywać tylko jeden program na raz, a przez większość czasu zajęty jest on przecież wykonywaniem programu użytkownika. Odpowiedź jest prosta – planista ma zaplecze sprzętowe. Część jego kodu wykonywana jest w procedurze obsługi przerwania, generowanego regularnie przez jeden z wewnętrznych zegarów procesora.

Takie przerwanie, występujące wiele razy na sekundę, za każdym razem zatrzymuje na chwilę wykonanie głównego programu i zmusza procesor do uruchomienia specjalnej procedury. W przypadku planisty procedura ta sprawdza, czy powinno już nastąpić wywłaszczenie i jeżeli tak, to startowana jest operacja przełączenia procesu na kolejny oczekujący na wykonanie.

### Stany procesu

Do tej pory rozważaliśmy procesy, które są w trakcie wykonania oraz takie, które są gotowe do wykonania i oczekują tylko na wycinek czasu procesora. Procesy w Linuxie mogą jednak przyjmować szereg różnych innych stanów – w niektóre z nich mogą wejść samodzielnie, inne mogą być na nich wymuszone, a jeszcze inne dostępne są tylko dla procesów działających w przestrzeni jądra. Programując pod Linuxem warto o tych stanach wiedzieć coś więcej, więc poniżej omawiam je pokrótce.

##### Stany **R** i **S**

Dwa najbardziej podstawowe stany, to stan  **R** (*runnable*) oznaczający gotowość do wykonania oraz stan **S** (*sleep interruptible*), mówiący o tym, że proces jest aktualnie w stanie uśpienia i oczekuje na wystąpienie jakiegoś zdarzenia. Procesy, którymi jest zainteresowany planista są właśnie w stanie **R**.

Wejście w stan **S** następuje na przykład podczas wywołania funkcji **sleep()**. Funkcja ta przełącza proces w stan uśpienia na określony czas i do jego upłynięcia proces nie jest brany pod uwagę przez algorytm szeregujący planisty. Warto zauważyć, że funkcja **sleep()** kryje pod sobą wywołanie systemowe **nanosleep()** i to właśnie wewnątrz tego wywołania proces przechodzi w stan uśpienia. W efekcie proces może przejść w stan **S** wyłącznie podczas wykonywania kodu jądra.

##### Stany **D** i **I**

Do stanu **S** bardzo podobny jest stan **D** (*sleep uninterruptible*), który również oznacza oczekiwanie na wystąpienie zdarzenia, jednak w przeciwieństwie do stanu **S** oczekiwanie to nie może być przerwane przez wystąpienie *sygnału*.

Sygnał to zdarzenie przerywające normalne wykonanie programu, spowodowane jakąś szczególną sytuacją w systemie. Przykładem może być tu sygnał **SIGINT** wymuszający zakończenie programu. Sygnał ten można na przykład wysłać do programu działającego w wierszu poleceń używając kombinacji klawiszy **Ctrl+C**.

Stan **D** jest wykorzystywany głównie w sterownikach urządzeń. Muszą one zadbać o to, żeby nie pozostawić urządzenia w nieokreślonym stanie, w związku z czym nie mogą pozwolić na przerwanie oczekiwania na jakieś zdarzenie związane z urządzeniem przez sygnał.

Bliźniaczym stanem dla stanu **D** jest stan **I** (*idle*), który różni się tylko tym, że proces w takim stanie nie jest brany pod uwagę podczas liczenia średniego obciążenia procesora.

##### Stan **T**

Bardzo interesującym stanem jest **T** (*stopped*), który oznacza zatrzymanie procesu. Jest on podobny do stanu **S**, z tym wyjątkiem, że wejście w stan **T** następuje w wyniku otrzymania sygnału **SIGSTOP** lub **SIGTSTP**. Ten drugi może być wygenerowany przez użytkownika, na przykład z użyciem kombinacji **Ctrl+Z** w wierszu poleceń. Proces pozostaje w stanie **T** aż do momentu, kiedy zostanie do niego wysłany sygnał **SIGCONT**, który powoduje przełączenie go w stan **R**. W przypadku procesu zatrzymanego kombinacją klawiszy **Ctrl+Z**, sygnał **SIGCONT** można wysłać do niego używając komendy **fg**.

##### Stan **Z**

Ostatnim stanem procesu, który możemy spotkać pod Linuxem jest stan **Z** (*zombie*). Oznacza on martwy proces, którego status nie został jeszcze pobrany przez jego rodzica. W taki stan proces może wejść poprzez użycie wywołania systemowego **exit()** lub w wyniku otrzymania sygnału wymuszającego jego zakończenie. Proces, który jest w stanie **Z** zostanie całkowicie usunięty gdy jego rodzic użyje wywołania systemowego **waitpid()**.

### Jak obsługiwane są sygnały?

Jedną z głównych różnic między procesem działającym w przestrzeni użytkownika a procesem działającym w jądrze jest sposób obsługi sygnałów. W przypadku przestrzeni użytkownika wystąpienie sygnału natychmiast przerywa wykonanie programu. Niektóre z sygnałów można ignorować lub można zarejestrować własną funkcję obsługi sygnału, ale z częścią z nich nic nie można zrobić. Sygnałów takich jak omawiany wcześniej **SIGSTOP** nie da się w żaden sposób zignorować czy obsłużyć.

W przypadku procesów wykonujących kod jądra jest zupełnie inaczej. Kiedy proces jest w stanie **R** lub **D**, to nie jest on nawet informowany o wystąpieniu sygnału. Informacja ta jest tylko zapisywana w stanie procesu i sygnał jest wyzwalany dopiero w momencie powrotu do przestrzeni użytkownika, kiedy jądro zakończy obsługę wywołania. Natomiast gdy proces jest w stanie **S**, to w momencie wystąpienia sygnału jest on przełączany w stan **R**, a funkcja jądra, która wprowadziła proces w stan uśpienia zwraca natychmiast kod błędu \-ERESTARTSYS.

To co stanie się dalej zależy tylko i wyłącznie od kodu jądra. Może on zakończyć obsługę wywołania systemowego z błędem (i tak się na ogół dzieje), ale może też wykonać dowolną inną operację lub po prostu zignorować to zdarzenie. W każdym wypadku działanie procesu w reakcji na sygnał zostanie przerwane dopiero w momencie powrotu do przestrzeni użytkownika.

### Monitorowanie stanu procesów

Większość dystrybucji Linuxa wyposażona jest w co najmniej kilka narzędzi pozwalających na monitorowanie stanu procesów. Są one przydatne nawet dla niezbyt zaawansowanych użytkowników i wręcz obowiązkowe dla tych, którzy aspirują do roli ekspertów. W tej części wpisu omawiam krótko kilka z nich.

##### ps

Do najbardziej podstawowych należy komenda **ps**. Pozwala ona na wyświetlenie listy aktualnie działających procesów oraz wielu ciekawych informacji na ich temat. Wywołanie tej komendy bez argumentów skutkuje wypisaniem listy procesów powiązanych z daną sesją. Zazwyczaj będzie to wyglądać mniej więcej tak:

```
robert@bezkompilatora:~$ ps
  PID TTY          TIME CMD
 2252 pts/1    00:00:00 bash
21112 pts/1    00:00:00 ps
```

Każda linia odpowiada kolejnemu procesowi, a w poszczególnych kolumnach możemy znaleźć takie informacje jak numer PID procesu, nazwa terminala, zużyty czas procesora oraz nazwa komendy. Jak widać w obecnej sesji działają tylko dwa procesy – program **bash**, odpowiadający za obsługę powłoki oraz **ps**, który właśnie w tej powłoce uruchomiliśmy.

Żeby uzyskać informacje na temat wszystkich procesów danego użytkownika należy wywołać **ps** z flagą **\-u** i nazwą użytkownika, np. ps -u robert. Komenda **ps** pozwala też na zdefiniowanie tego, jakie informacje będą wyświetlane. Służy do tego flaga **\-o** po której możemy podać listę kolumn, które chcemy zobaczyć. Możliwych opcji jest całkiem sporo – poniżej opisuję kilka najciekawszych:

-   **args** – nazwa komendy wraz z argumentami,
-   **comm** – sama nazwa komendy (tak jak w domyślnym formacie),
-   **pid** – numer PID procesu,
-   **state** – stan procesu,
-   **tty** – nazwa terminala,
-   **user** – nazwa użytkownika,
-   **vsz** – rozmiar zaalokowanej wirtualnej pamięci.

Przykładowe wywołanie z wykorzystaniem tych opcji może wyglądać tak:

```
robert@bezkompilatora:~$ ps -u robert -o pid,state,tty,vsz,comm
  PID S TT          VSZ COMMAND
 2019 S ?         76624 systemd
 2032 S ?        193792 (sd-pam)
 2233 R ?        107984 sshd
 2252 S pts/1     21480 bash
21157 R pts/1     36044 ps
```

Komenda wypisuje wszystkie procesy użytkownika *robert*. Szczególnie ciekawa jest druga kolumna, która prezentuje stan procesu. Jak widać procesy o numerach PID 2233 oraz 21157 są w stanie **R**, czyli są aktualnie wykonywane lub czekają w kolejce na wykonanie, natomiast pozostałe są w stanie **S**, czyli czekają na jakieś zdarzenie, zanim przejdą w stan **R**. Dla zainteresowanych, jako pracę domową zostawiam doprowadzenie do sytuacji, w której jeden z procesów będzie w stanie **T**.

##### top

Drugim bardzo użytecznym narzędziem jest komenda **top**. Wyświetla ona informacje o aktualnym obciążeniu systemu oraz listę procesów, które zużywają najwięcej zasobów. Przykładowy wynik działania komendy możesz zobaczyć poniżej:

```
robert@bezkompilatora:~$ top
top -- 19:37:58 up  1:30,  1 user,  load average: 0.00, 0.00, 0.00
Tasks:  92 total,   1 running,  53 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.0 us,  0.2 sy,  0.0 ni, 99.8 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  2041064 total,   545152 free,   100752 used,  1395160 buff/cache
KiB Swap:        0 total,        0 free,        0 used.  1747380 avail Mem
  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
 1684 root      20   0       0      0      0 I   0.3  0.0   0:11.33 kworker/0:7
21175 robert    20   0   42800   3640   3088 R   0.3  0.2   0:00.60 top
    1 root      20   0  159808   9220   6832 S   0.0  0.5   0:03.21 systemd
    2 root      20   0       0      0      0 S   0.0  0.0   0:00.00 kthreadd
    4 root       0 -20       0      0      0 I   0.0  0.0   0:00.00 kworker/0:0H
    6 root       0 -20       0      0      0 I   0.0  0.0   0:00.00 mm_percpu_wq
    7 root      20   0       0      0      0 S   0.0  0.0   0:00.16 ksoftirqd/0
    8 root      20   0       0      0      0 I   0.0  0.0   0:01.00 rcu_sched
    9 root      20   0       0      0      0 I   0.0  0.0   0:00.00 rcu_bh
   10 root      rt   0       0      0      0 S   0.0  0.0   0:00.01 migration/0
   11 root      rt   0       0      0      0 S   0.0  0.0   0:00.03 watchdog/0
   12 root      20   0       0      0      0 S   0.0  0.0   0:00.00 cpuhp/0
   13 root      20   0       0      0      0 S   0.0  0.0   0:00.00 cpuhp/1
   14 root      rt   0       0      0      0 S   0.0  0.0   0:00.03 watchdog/1
   15 root      rt   0       0      0      0 S   0.0  0.0   0:00.00 migration/1
   16 root      20   0       0      0      0 S   0.0  0.0   0:00.09 ksoftirqd/1
   18 root       0 -20       0      0      0 I   0.0  0.0   0:00.00 kworker/1:0H
   19 root      20   0       0      0      0 S   0.0  0.0   0:00.00 kdevtmpfs
```

W górnej części widać ogólne statystyki, takie jak sumaryczna ilość procesów, ilość procesów w kolejce do wykonania, ilość procesów uśpionych, średnie obciążenie procesora oraz ilość zajętej i dostępnej pamięci. Poniżej znajduje się lista procesów, zawierająca szereg informacji na ich temat. Znajdziemy tam między innymi procentowe wartości obciążenia procesora i ilości pamięci używanej przez dany proces, jego priorytet, aktualny stan i sumaryczny zużyty czas procesora. Komenda **top** jest szczególnie użyteczna, kiedy jesteśmy zainteresowani badaniem wpływu poszczególnych procesów na wydajność systemu.

##### strace

Innym ważnym narzędziem jest program **strace**, o którym opowiadałem już nieco w linkowanym wcześniej wpisie na temat programu “Hello World!”. Pozwala on na wyświetlenie w czasie rzeczywistym kompletnej listy wywołań systemowych wykonanych przez dany proces. Ponadto posiada on również opcję śledzenia wszystkich procesów potomnych, filtrowania śledzonych wywołań systemowych oraz pomiaru czasu spędzonego w każdym wywołaniu, a także wiele innych użytecznych opcji.

Jeżeli przykładowo chcielibyśmy sprawdzić ile czasu spędzi w wywołaniu systemowym **nanosleep()** program **sleep** wywołany z argumentem **2**, możemy to zrobić w następujący sposób:

```
robert@bezkompilatora:~$ strace -T -e trace=nanosleep sleep 2
nanosleep({tv_sec=2, tv_nsec=0}, NULL)  = 0 <2.000571>
+++ exited with 0 +++
```

W efekcie widzimy, że wywołanie systemowe **nanosleep()** zajęło w sumie 2.000571s, czyli ponad pół milisekundy dłużej niż żądane dwie sekundy. Takie niedokładności są normalne i wynikają z Linuxowych mechanizmów zarządzania procesami oraz narzutów związanych z obsługą wywołań systemowych.

##### procfs

W przeciwieństwie do poprzednich narzędzi, *procfs* nie jest programem, ale pseudo systemem plików, w którym Linux eksponuje informacje na temat procesów. Jest on zazwyczaj zamontowany w ścieżce */proc* i można w nim znaleźć katalogi o nazwach odpowiadających numerom PID procesów działających w systemie.

W każdym z tych katalogów znajdują się wirtualne pliki, z których możemy wyczytać całą masę informacji na temat procesu. W rzeczywistości także programy **ps** oraz **top** korzystają z informacji zawartych w *procfs*’ie, jednak można w nim znaleźć o wiele więcej niż oferują te programy.

Jedną z ciekawszych opcji jest możliwość sprawdzenia aktualnego stosu wywołań programu. Informację tą znajdziemy w pliku */proc/\<PID>/stack*. Dla przykładu posłużmy się znów komendą **sleep**, tym razem uruchomioną w tle z nieco dłuższym czasem:

```
robert@bezkompilatora:~$ sleep 180 &
[1] 21517
robert@bezkompilatora:~$ sudo cat /proc/21517/stack
[<0>] hrtimer_nanosleep+0xde/0x1e0
[<0>] SyS_nanosleep+0x72/0xa0
[<0>] do_syscall_64+0x73/0x130
[<0>] entry_SYSCALL_64_after_hwframe+0x3d/0xa2
[<0>] 0xffffffffffffffff
```

Podanie znaku **&** na końcu komendy powoduje jej uruchomienie w tle, a w odpowiedzi dostajemy numer PID nowo utworzonego procesu. Po wyświetleniu zawartości pliku */proc/21517/stack* możemy zobaczyć, że proces aktualnie wykonywany jest w przestrzeni jądra, a ostatnią wywołaną funkcją jest **hrtimer\_nanosleep()** – funkcja odpowiedzialna za implementację “spania”. W rzeczywistości prawdziwe kernelowe “spanie” odbywa się kilka funkcji głębiej, ale są one funkcjami inline, więc nie widać ich na wypisywanym stosie.

• • •

To wszystko na dzisiaj. Wyszło tego całkiem sporo i nic w tym dziwnego – temat jest bardzo obszerny. W jednej z posiadanych przeze mnie książek rozdział o zarządzaniu procesami w Linuxie ma 98 stron, więc zmieszczenie choćby podstawowej ale przekrojowej wiedzy na ten temat w jednym w wpisie było dla mnie niemałym wyzwaniem. Mam nadzieję, że się to udało, i że wiedza, którą tu zebrałem będzie Ci dobrze służyć.

Jak zawsze zachęcam do komentowania. Jeżeli masz jakieś uwagi, pytania, wątpliwości lub pomysły – pisz śmiało komentarz pod wpisem. Z góry dzięki! 🙂
