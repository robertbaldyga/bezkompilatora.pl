---
title: "Chcesz zrobić własną dystrybucję Linuxa? Poznaj Buildroota!"
date: 2018-10-06
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["buildroot", "linux", "dystrybucja", "qemu", "maszyna wirtualna"]
image: "/images/uploads/2018/10/keep-calm-make-linux-distro.jpg"
summary: "Nadszedł w końcu czas na wpis, który planowałem już od dłuższego czasu. Dziś pokażę, jak w prosty sposób stworzyć własną mini-dystrybucję Linuxa i uruchomić ją w maszynie wirtualnej. Po co to właściwie robić? Bo, po pierwsze, to fajna…"
---

Nadszedł w końcu czas na wpis, który planowałem już od dłuższego czasu. Dziś pokażę, jak w prosty sposób stworzyć własną mini-dystrybucję Linuxa i uruchomić ją w maszynie wirtualnej. Po co to właściwie robić? Bo, po pierwsze, to fajna zabawa, przy której można się dużo nauczyć. Po drugie, takie małe, wirtualne, Linuxowe środowisko może posłużyć do różnych eksperymentów, które postaram się pokazać w kolejnych wpisach.

Umiejętność obsługi Buildroota przyda się też osobom, które interesują się systemami wbudowanymi. Stworzona z jego użyciem mini-dystrybucja z powodzeniem sprawdzi się tam, gdzie ilość dostępnej pamięci i mocy obliczeniowej jest mocno ograniczona. Użytkownicy mikrokomputerów takich jak Raspberry Pi czy Orange Pi często korzystają z obrazów wygenerowanych właśnie z użyciem Buildroota.

Dziś jednak skupimy się na stworzeniu i uruchomieniu prostego środowiska do testów. Zbudujemy mały system plików, który posłuży nam za *rootfs*, skompilujemy ze źródeł jądro Linuxa i uruchomimy całość wewnątrz maszyny wirtualnej. We wpisie pokażę zarówno podstawy obsługi Buildroota jak i tworzenia maszyn wirtualnych z użyciem KVM/QEMU. Zaczynajmy. 🙂

### Anatomia dystrybucji Linuxa

Zanim przejdziemy do rzeczy, zastanówmy się najpierw co właściwie chcemy osiągnąć – czym jest i z czego składa się dystrybucja Linuxa. Sama potrzeba istnienia dystrybucji wynika z faktu, że to co potocznie nazywamy “Linuxem” nie jest jednorodnym tworem. Typowa dystrybucja składa się z jądra Linuxa (tego właściwego Linuxa, stworzonego przez Linusa Torvaldsa) oraz całej masy oprogramowania stworzonego przez różne osoby w ramach niezliczonej ilości projektów.

Część z tego oprogramowania wcale nie musi być darmowa ani nie musi mieć otwartych źródeł. Możemy z powodzeniem stworzyć dystrybucję w oparciu o jądro Linuxa oraz zestaw własnego oprogramowania wydanego na dowolnej licencji. Możemy też użyć częściowo oprogramowania open source, a częściowo własnego, chociaż w przypadku większości licencji musimy się w takim wypadku liczyć z pewnymi ograniczeniami.

Zdecydowana większość istniejących dystrybucji Linuxa bazuje jednak na oprogramowaniu open source. Ich zadanie polega więc na zebraniu zestawu programów i bibliotek, tworzonych w ramach różnych projektów i połączeniu ich w spójne, funkcjonalne środowisko. Mogą przy tym wybierać spośród wielu alternatyw, ponieważ część projektów konkuruje ze sobą, wytwarzając oprogramowanie o zbliżonej funkcjonalności. Dzięki temu możemy się cieszyć mnogością różnorodnych dystrybucji, zbudowanych na bazie różnych komponentów.

#### Budowanie własnej dystrybucji

Zbudowanie własnej dystrybucji Linuxa to jednak zadanie o wiele trudniejsze, niż mogłoby się wydawać. Kilka różnych programów może wykorzystywać tą samą bibliotekę w różnych wersjach, a dodatkowo biblioteka ta może zależeć od innej biblioteki, wykorzystywanej przez jeszcze inny program… w jeszcze innej wersji. W efekcie twórcy dystrybucji muszą utrzymywać własne wersje oprogramowania, aby osiągnąć spójność tworzonego systemu. Wymaga to często sporego kombinowania i niemałych zmian w samym kodzie. Dlatego też stworzenie własnej dystrybucji Linuxa nie jest prostym zadaniem. I to pomimo ogromnej liczby gotowych komponentów.

Z drugiej strony istnieje zapotrzebowanie na mechanizmy ułatwiające ten proces. Dystrybucje ogólnego przeznaczenia nie sprawdzają się tam, gdzie potrzebne jest rozwiązanie szyte na miarę. Nawet te bardzo mocno wyspecjalizowane tworzone są z myślą o najbardziej typowych zastosowaniach w swojej dziedzinie.

W odpowiedzi na to zapotrzebowanie powstały projekty umożliwiające łatwe zbudowanie własnej dystrybucji od podstaw, dostarczając zestaw gotowych komponentów oraz rozbudowany system do zarządzania nimi. Jednym z tych projektów jest właśnie Buildroot. Przyjrzyjmy się więc mu nieco bliżej.

### Wprowadzenie do Buildroota

Buildroot jest narzędziem służącym do generowania obrazów głównego systemu plików (*rootfs*), czyli zawartości partycji systemowej Linuxa. W skład obrazu generowanego przez Buildroota wchodzi wszystko, co potrzebne do uruchomienia w pełni funkcjonalnej przestrzeni użytkownika. Obraz taki może też zawierać dowolną liczbę programów i bibliotek wspieranych przez Buildroot’a oraz nasze własne oprogramowanie. Domyślnie wszystko jest kompilowane ze źródeł, dzięki czemu możliwe jest generowanie obrazów przeznaczonych na różne architektury.

Buildroot potrafi także skompilować jądro Linuxa oraz jeden z kilku wspieranych bootloaderów. Dzięki temu możemy z jego użyciem stworzyć kompletną dystrybucję, gotową do uruchomienia na dowolnej maszynie. W przypadku QEMU dostarczenie własnego bootloadera nie jest konieczne, dlatego we wpisie skupiam się na stworzeniu obrazu głównego systemu plików oraz jądra systemu.

#### Jak działa Buildroot?

Buildroot zbudowany jest w oparciu o zaawansowany zestaw plików Makefile, odpowiadających za pobieranie paczek z kodem źródłowym, ich budowanie oraz tworzenie z ich użyciem obrazu systemu plików. Buildroot posiada bazę wspieranego oprogramowania i potrafi w razie potrzeby automatycznie pobierać źródła brakujących paczek. Budowanie obrazu odbywa się na podstawie pliku konfiguracyjnego, którego zawartością możemy łatwo zarządzać dzięki wykorzystaniu mechanizmu *kconfig* – tego samego, który używany jest przez jądro Linuxa.

*Kconfig* posiada informacje na temat zależności między poszczególnymi paczkami, dzięki czemu możemy mieć pewność, że wybrany przez nas zestaw oprogramowania będzie działać poprawnie. Pozwala on na edytowanie aktualnej konfiguracji z poziomu interaktywnego menu, co sprawia, że jego wykorzystanie jest bardzo wygodne. Aktualna konfiguracja jest zapisywana w pojedynczym pliku o nazwie *.config* – możemy ją dzięki temu łatwo skopiować i w razie potrzeby przywrócić. Buildroot dostarcza zresztą bogaty zestaw predefiniowanych konfiguracji, gotowych do użycia. Jedną z takich konfiguracji weźmiemy jako punkt wyjściowy podczas budowania naszej dystrybucji.

#### Skąd wziąć Buildroota?

Najnowszą wersję Buildroota można pobrać z [tej strony](https://buildroot.org/download.html). Mamy do wyboru dwie wersje – najnowszą stabilną (*latest stable*) oraz z długoterminowym wsparciem (*latest long term support*). W większości przypadków możemy śmiało pobrać tą pierwszą – będzie ona zawierała w swojej bazie nowsze wersje paczek z oprogramowaniem. Wersją z długoterminowym wsparciem powinniśmy się zainteresować, jeżeli planujemy wykorzystać tworzony *rootfs* w systemie produkcyjnym. Dzięki temu przez dłuższy czas będziemy mieli dostęp do ewentualnych poprawek, bez konieczności zmiany wersji używanych paczek.

Każdą z wersji możemy pobrać w postaci archiwum *\*.tar.gz* lub *\*.tar.bz2*. W większości przypadków nie ma znaczenia, który format wybierzemy. Po pobraniu możemy je rozpakować z użyciem okienkowego managera archiwów dostępnego naszej dystrybucji lub z wiersza poleceń używając programu **tar**. W przypadku najnowszej dostępnej w momencie pisania tego wpisu wersji 2018.08 i archiwum w formacie *\*.tar.gz* komenda rozpakowująca będzie wyglądać następująco: tar -xf buildroot-2018.08.tar.gz. Po rozpakowaniu archiwum możemy przejść do katalogu Buildroota (nazywa się tak samo jak archiwum, tylko bez rozszerzenia) i rozpocząć pracę nad tworzeniem własnej dystrybucji.

### Własny Linux w kilku krokach

Pracę z Buildrootem powinniśmy zacząć od stworzenia konfiguracji. Robienie tego od podstaw jest jednak bardzo pracochłonne i wymaga sporej wiedzy, dlatego warto wykorzystać jako bazę jedną domyślnie dostępnych konfiguracji, przygotowanych przez twórców Buildroota. Wszystkie one znajdują się w katalogu *configs/,* a jedna z nich idealnie wpisuje się w nasze potrzeby. Nazywa się *qemu\_x86\_64\_defconfig* i zawiera wszystko, co potrzebne do uruchomienia prostego systemu w maszynie wirtualnej – minimalny *rootfs* wyposażony w powłokę tekstową oraz jądro systemu. Bez grafiki, bez bajerów, tylko niezbędne minimum.

Do wykonania poniższych czynności będzie potrzebny domyślny toolchain (zestaw narzędzi do kompilacji) oraz biblioteka ncurses. Jeżeli korzystasz z Ubuntu, zainstalujesz je poniższą komendą:  
\[bk-cmd\]sudo apt install build-essential libncurses5-dev\[/bk-cmd\]

Aby stworzyć aktualną konfigurację na bazie jednej z domyślnych, wystarczy wywołać polecenie **make** podając jako argument nazwę konfiguracji. W naszym przypadku będzie to make qemu\_x86\_64\_defconfig. Polecenie to skopiuje podaną konfigurację do pliku *.config*, w którym przechowywana jest aktualna konfiguracja. Jeżeli nie chcielibyśmy wprowadzać w niej żadnych modyfikacji, to w tym momencie można by z powodzeniem rozpocząć proces budowania. Zanim jednak to zrobimy, spróbujmy wykonać prostą zmianę, żeby zobaczyć jak wygląda ten proces.

#### Menuconfig

Do edycji konfiguracji wykorzystamy narzędzie Menuconfig. Aby je uruchomić, należy użyć komendy make menuconfig. W efekcie powinniśmy zobaczyć graficzny interfejs, taki jak na poniższym obrazku:

[![buildroot-menu](/images/wp-content/gallery/2018-10-08-jak-zrobic-wlasna-dystrybucje-linuxa/cache/buildroot-menu.jpg-nggid0278-ngg0dyn-0x0x100-00f0w010c010r110f110r010t010.jpg "buildroot-menu")](/images/wp-content/gallery/2018-10-08-jak-zrobic-wlasna-dystrybucje-linuxa/buildroot-menu.jpg)

Nawigowanie po nim jest bardzo intuicyjne. Poziome menu na dole określa jaka akcja zostanie wykonana po wciśnięciu klawisza **Enter**. Możemy się po nim poruszać używając strzałek w prawo i w lewo. Opcja **Select** powoduje wybranie pozycji spod kursora w pionowym menu powyżej, **Exit** służy do wyjścia z programu, a **Save** zapisuje konfigurację.

W dużym menu powyżej poruszamy się używając strzałek w górę i w dół. Jeżeli zaznaczona pozycja zakończona jest znakami **—>**, to jej wybranie spowoduje wejście do submenu. Jeżeli wejdziemy do submenu, to możemy cofnąć się poziom wyżej, dwukrotnie naciskając klawisz **Esc** lub wybierając opcję **Exit** z poziomego menu.

Pionowe menu służy do edytowania konfiguracji. Poszczególne pozycje reprezentują opcje konfiguracyjne. Te poprzedzone znakami **\[ \]** są typu prawda-fałsz (symbol **\[\*\]** oznacza, że pozycja została wybrana), natomiast te poprzedzone znakami **( )** pozwalają na wprowadzenie własnej wartości. Jeżeli jakaś wartość jest już wprowadzona, to zostanie ona wyświetlona wewnątrz nawiasów.

W razie potrzeby możemy wyświetlić bardziej zaawansowaną pomoc wybierając opcję **Help** z menu poziomego lub wciskając klawisz **H**. W zdecydowanej większości przypadków nie będziemy jednak mieli takiej potrzeby.

#### Wprowadzanie zmian

Jedną z najprostszych zmian, jakich możemy dokonać, jest zmiana komunikatu wyświetlanego nad ekranem logowania. Aby go edytować, wchodzimy do submenu **System configuration**, a następnie wybieramy opcję **System banner**. Możemy tam ustawić dowolny napis, na przykład taki jak na poniższym obrazku:

[![buildroot-system-banner](/images/wp-content/gallery/2018-10-08-jak-zrobic-wlasna-dystrybucje-linuxa/cache/buildroot-system-banner.jpg-nggid0279-ngg0dyn-0x0x100-00f0w010c010r110f110r010t010.jpg "buildroot-system-banner")](/images/wp-content/gallery/2018-10-08-jak-zrobic-wlasna-dystrybucje-linuxa/buildroot-system-banner.jpg)

Po dokonaniu zmian wybieramy opcję **Exit** i zatwierdzamy zapisanie zmian. Powinny być one zapisane do pliku *.config*, który będzie następnie użyty jako podczas budowania systemu. W tym momencie możemy przejść do ostatniego kroku, jakim jest rozpoczęcie procesu budowania.

#### Budowanie systemu

Aby rozpocząć budowanie wystarczy użyć polecenia make. Cała operacja może trwać około kilkunastu minut – głównie ze względu na czas trwania kompilacji jądra Linuxa, ale też czas pobierania brakujących paczek z internetu. Przed rozpoczęciem budowania możemy jednak zrobić jeszcze jedną sztuczkę – zlecić Buildrootowi aby od razu pobrał wszystkie niezbędne paczki, dzięki czemu cały proces budowania będzie mógł odbyć się offline. Służy do tego polecenie make source.

Po wywołaniu komendy make możemy zrobić sobie przerwę na kawę, albo cierpliwie obserwować cały proces i próbować wyobrazić sobie, ile może trwać budowanie kompletnej, dużej dystrybucji Linuxa. Na szczęście dzięki wykorzystaniu mechanizmów **make** tylko pierwsze budowanie trwa długo. Jeżeli później naniesiemy jakieś zmiany, to zostaną przebudowane tylko te komponenty, które się zmieniły. Dzięki temu będziemy mogli sprawnie wprowadzać zmiany w naszej nowo utworzonej dystrybucji.

#### Obrazy wynikowe

Kiedy wszystkie paczki oprogramowania zostaną zbudowane, Buildroot generuje obraz głównego systemu plików i jądra systemu. Umieszczane są one w katalogu *output/images/*. W naszej konfiguracji obraz jądra będzie miał nazwę *bzImage*, a obraz systemu plików *rootfs.ext2*. Warto zauważyć, że nazwy tych plików mogą być inne, jeżeli w konfiguracji Buildroota wybierzemy inny rodzaj systemu plików (domyślnie jest to **ext2**) lub inny format i metodę kompresji jądra.

Obraz *rootfs.ext2* ma domyślny rozmiar 60MB. Może się to wydawać niewiele, jednak warto wziąć pod uwagę, że wszystkie pliki składające się na naszą partycję systemową zajmują tylko 2.7MB! Zostawia nam to sporo miejsca do zabawy na naszym minimalistycznym systemie. W razie potrzeby możemy zmienić rozmiar obrazu *rootfs*a z poziomu Menuconfiga. Odpowiednią opcję znajdziemy w submenu **Filesystem images**, w polu o nazwie **exact size**.

W tym momencie jesteśmy gotowi do uruchomienia naszego systemu. Przejdźmy więc do części poświęconej maszynie wirtualnej.

### Start w maszynie wirtualnej

QEMU jest oprogramowaniem bogatym w funkcje, ale uruchomienie z jego użyciem minimalnej maszyny wirtualnej jest bardzo proste. Posiada ono własny bootloader, dzięki czemu możemy podać do niego bezpośrednio obraz jądra systemu. Dostarczenie obrazu systemu plików wymaga dodania wirtualnego dysku, ale jak się za chwilę przekonamy, również nie jest to trudne. Ostatnią rzeczą, jaką będziemy musieli zrobić, będzie dostarczenie zawartości linii poleceń jądra – w najprostszym wariancie musimy w niej jedynie wskazać urządzenie blokowe, na którym znajduje się *rootfs*. W przypadku QEMU to zadanie również jest proste.

Do wykonania poniższych czynności będzie potrzebna maszyna wirtualna QEMU. Jeżeli pracujesz na Ubuntu, zainstalujesz ją poniższą komendą komendą:  
\[bk-cmd\]sudo apt install qemu-system-x86\[/bk-cmd\]

Maszynę wirtualną możemy uruchomić przy pomocy komendy qemu-system-x86\_64. Komenda powiedzie się, nawet jeśli nie podamy do niej żadnych argumentów. Zobaczymy w efekcie okno, pełniące funkcję monitora nowo utworzonej maszyny wirtualnej, a wewnątrz niego będziemy mogli obserwować próbę bootowania systemu. Z racji braku bootowalnych urządzeń próba ta zakończy się niepowodzeniem, o czym poinformuje nas komunikat “No bootable device.”.

#### Bootowanie jądra

Aby bootowanie doszło do skutku, musimy dodać do maszyny wirtualny dysk zawierający poprawny bootloader (domyślnie QEMU bootuje w trybie tradycyjnego BIOSa z sektora MBR) lub podać własny obraz jądra używając opcji **\-kernel**. W naszym przypadku będzie to wyglądało tak:

```shell
qemu-system-x86_64 \
   -kernel output/images/bzImage
```

Po uruchomieniu tej komendy, zobaczymy w monitorze następujący log:

```
VFS: Cannot open root device "(null)" or unknown-block(0,0): error -6
Please append a correct "root=" boot option; here are the available partitions:
Kernel panic -- not syncing: VFS: Unable to mount root fs on unknown-block(0,0)
CPU: 0 PID: 1 Comm: swapper/0 Not tainted 4.16.7 #1
Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.10.2-1ubuntu1 04/01/2014
Call Trace:
dump_stack+0x63/0x8e
panic+0xd0/0x216
? printk+0x3e/0x46
mount_block_root+0x1e4/0x287
? set_debug_rodata+0x12/0x12
mount_root+0x65/0x68
prepare_namespace+0x126/0x15e
kernel_init_freeable+0x197/0x1ab
? rest_init+0xb0/0xb0
kernel_init+0x9/0xf0
ret_from_fork+0x35/0x40
Kernel Offset: 0x24e00000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)
---[ end Kernel panic -- not syncing: VFS: Unable to mount root fs on unknown-block(0,0)
```

Komunikat na dole mówi z grubsza tyle, że podczas startu jądra nie udało się zamontować *rootfs*a, w związku z czym operacja skończyła się krytycznym błędem jądra (kernel panic). W zasadzie należało się tego spodziewać, ponieważ nie dostarczyliśmy do maszyny wirtualnej obrazu *rootfs*a, ale teraz przynajmniej wiemy, że samo jądro startuje. Jesteśmy więc krok bliżej celu.

#### Wirtualne urządzenia

QEMU domyślnie startuje z podstawowym zestawem emulowanych urządzeń, dzięki czemu możliwe jest szybkie uruchomienie wirtualnej maszyny bez konieczności specyfikowania sprzętu. W skład domyślnego zestawu wchodzi m.in. pojedynczy procesor, 512MB pamięci RAM, kontroler VGA (obsługiwany przez wirtualny monitor) oraz mysz i klawiatura PS/2. Wśród domyślnych urządzeń znajdziemy też kartę sieciową, kontrolery portów szeregowych oraz kontrolery dysków twardych.

Mamy możliwość rozszerzania tego zestawu o własne urządzenia. QEMU dostarcza całkiem spory zestaw gotowych urządzeń, zarówno parawirtualizowanych (takich, które maszyna widzi jako “wirtualne” i musi mieć dla nich specjalne wsparcie) jak i faktycznie emulowanego sprzętu. W przypadku urządzeń emulowanych, z perspektywy maszyny wirtualnej wyglądają one prawie identycznie jak prawdziwy sprzęt. Jest to szczególnie istotne w przypadku systemów, które nie wspierają parawirtualizacji.

Nas najbardziej będzie interesowała możliwość dodania dysku twardego. Taki wirtualny dysk potrzebuje pokrycia w postaci fizycznego dysku, partycji lub pliku z obrazem dysku. W naszym przypadku dysponujemy gotowym obrazem, więc skorzystamy z tej trzeciej opcji.

Urządzenie wirtualnego dysku twardego możemy utworzyć na wiele sposobów, ale najprostszym będzie wykorzystanie istniejącego kontrolera IDE. Aby to zrobić, wystarczy podczas uruchamiania QEMU dodać opcję **\-hda** z argumentem w postaci ścieżki do pliku z obrazem dysku. Możemy w ten sposób dodać do czterech dysków, wykorzystując kolejno opcje **\-hda**, **\-hdb**, **\-hdc** i **\-hdd**. Linux wewnątrz maszyny wirtualnej będzie widział te urządzenia jako */dev/sda*, */dev/sdb*, */dev/sdc* i */dev/sdd*.

Nasza komenda po wprowadzeniu zmian przyjmie więc następującą postać:

```shell
qemu-system-x86_64 \
   -hda output/images/rootfs.ext2 \
   -kernel output/images/bzImage
```

Wirtualny dysk powinien być w tym momencie już dodany do maszyny, jednak start systemu nadal nie dojdzie jeszcze do skutku. Przy próbie uruchomienia komendy dostaniemy dokładnie taki sam komunikat jak poprzednio. Dzieje się tak, ponieważ nasz dysk z *rootfs*em musimy jawnie wyspecyfikować w linii poleceń jądra.

#### Linia poleceń jądra

Przekazywaniem zawartości linii poleceń do jądra zajmuje się zazwyczaj bootloader, jednak w przypadku QEMU możemy ją podać w momencie startowania maszyny wirtualnej. Służy do tego opcja **\-append**. Przy pomocy linii poleceń jądra możemy skonfigurować wiele ciekawych rzeczy i na pewno będziemy jeszcze do niej wracać w kolejnych wpisach, jednak na ten moment potrzebujemy ustawić tylko jeden konkretny parametr. Nazywa się on *root* i powinien zawierać ścieżkę do urządzenia blokowego zawierającego *rootfs*.

W naszym przypadku urządzeniem tym będzie */dev/sda*, ponieważ do stworzenia dysku użyliśmy opcji **\-hda**. Nasza linia poleceń jądra przyjmie więc postać *“root=/dev/sda”*. Tyle powinno wystarczyć, żeby uruchomić nasz system. Ostateczna komenda uruchamiająca maszynę wirtualną z naszym własnym jądrem i *rootfs*em będzie więc wyglądać tak:

```shell
qemu-system-x86_64 \
   -hda output/images/rootfs.ext2 \
   -kernel output/images/bzImage \
   -append “root=/dev/sda”
```

#### Uruchomienie systemu

Kiedy wykonany powyższą komendę, uruchomienie naszego systemu powinno wreszcie dojść do skutku. Po chwili na monitorze maszyny wirtualnej zobaczymy następujący komunikat:

```
Linux Bez Kompilatora
buildroot login: ▉
```

Nad linią proszącą nas o podanie loginu widzimy ustawiony przez nas wcześniej komunikat. Nasza minimalistyczna dystrybucja Linux jest gotowa do pracy. Możemy się zalogować jako *root* (bez hasła) i uzyskać dostęp do w pełni funkcjonalnego wiersza poleceń. Jeżeli chcemy, aby logowanie na konto *root*a wymagało hasła, możemy je ustawić komendą **passwd** przy pierwszym uruchomieniu lub wybrać odpowiednią opcję konfiguracji Buildroota.

Warto zauważyć, że uruchomiona maszyna wirtualna wykorzystuje obraz *rootfs*a z lokalizacji, w której został on wygenerowany przez Buildroota. W przypadku przebudowania systemu zostanie więc on nadpisany przez nowy obraz. Może to być pożądane zachowanie, jeżeli po prostu chcemy poeksperymentować, ale jeśli chcemy, zachować zawartość obrazu, to najbezpieczniej będzie go skopiować do innej lokalizacji.

To tyle na dzisiaj. Zachęcam do eksperymentów i życzę miłej zabawy. 🙂

• • •

Podobał Ci się ten wpis? Nie chcesz przegapić kolejnych? Jest na to świetny sposób! Zapisz się na mój [newsletter](/newsletter/) i/lub polub moją [stronę na Facebooku](https://www.facebook.com/BezKompilatora/), a ja dam Ci znać o każdym nowym wpisie sekundę po publikacji. Nie czekaj, bądź pierwszy na blogu Bez Kompilatora!

Z góry dzięki! 🙂

P.S. Jeżeli chcesz mi zadać jakieś pytanie lub dodać cokolwiek od siebie, to czekam na Twój komentarz pod wpisem! 🙂
