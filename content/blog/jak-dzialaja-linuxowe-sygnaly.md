---
title: "Licencja na zabijanie, czyli jak działają Linuxowe sygnały?"
date: 2018-09-10
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["sygnały", "procesy", "IPC", "Linux", "kill"]
image: "/images/uploads/2018/09/secret-agent-with-gun.jpg"
summary: "Dla większości początkujących (i sporej części zaawansowanych) użytkowników Linuxa sygnały są dość enigmatycznym tworem. Najczęściej kojarzone są z mechanizmem służącym do zabijania niechcianych procesów – w mniej lub bardziej uprzejmy sposób, w zależności od tego, po który sygnał…"
---

Dla większości początkujących (i sporej części zaawansowanych) użytkowników Linuxa sygnały są dość enigmatycznym tworem. Najczęściej kojarzone są z mechanizmem służącym do zabijania niechcianych procesów – w mniej lub bardziej uprzejmy sposób, w zależności od tego, po który sygnał przyjdzie nam sięgnąć. Takie postrzeganie sygnałów może wynikać z faktu, że ponad 20 z 31 Linuxowych sygnałów powoduje domyślnie zakończenie procesu. Albo z tego, że Linuxowe polecenie służące do wysyłania sygnałów nosi wdzięczną nazwę **kill**.

Sygnały są jednak czymś wiele więcej i zajmują one szczególne miejsce w Linuxowej filozofii zarządzania procesami. Warto w związku z tym dobrze zrozumieć ich działanie. Pisałem już o nich nieco wcześniej we [wpisie](/blog/zarzadzanie-procesami-w-linuxie/) poświęconym zarządzaniu procesami pod Linuxem, ale tym razem postanowiłem przyjrzeć się im bardziej szczegółowo. Jeżeli więc chcecie wiedzieć więcej na temat Linuxowych sygnałów, to zapraszam Was do lektury.

### Czym jest sygnał?

W Linuxie sygnał (ang. signal) to jeden z mechanizmów komunikacji międzyprocesowej, w skrócie nazywanych IPC (od ang. Inter-Process Communication). Znaczy to mniej więcej tyle, że może on służyć do przesyłania wiadomości pomiędzy procesami. W rzeczywistości spora część sygnałów jest wygenerowana przez samo jądro w odpowiedzi na różne wyjątkowe sytuacje, istotny jest jednak fakt, że informacja niesiona przez sygnał może pochodzić spoza procesu.

Na pierwszy rzut oka może się wydawać, że sygnały nie są niczym specjalnym – do przesyłania danych między procesami mogą przecież równie dobrze służyć potoki, sockety sieciowe, współdzielona pamięć czy nawet pliki na dysku. Często zresztą okazuje się, że sygnały wcale nie są najlepszym wyborem, jeżeli chodzi o mechanizmy komunikacji między procesami. Wyróżnia je jednak jedna bardzo istotna cecha – mogą one działać asynchronicznie.

W momencie wystąpienia sygnału, jeżeli nie jest on blokowany lub ignorowany, działanie programu jest natychmiast przerywane i wykonywana jest procedura obsługi sygnału lub domyślna akcja związana z sygnałem (nazywana dyspozycją). W przypadku większości sygnałów programista może dostarczyć swoją własną funkcję (nazywaną procedurą obsługi sygnału), która będzie wykonywana za każdym razem gdy wystąpi sygnał. Po jej zakończeniu wykonanie programu jest kontynuowane od miejsca, w którym zostało przerwane.

### Jak działają sygnały?

Sygnały są dostarczane za pośrednictwem jądra. Posiada ono informacje, jaka akcja powinna być podjęta w momencie wystąpienia danego sygnału. W przypadku, gdy chcemy zablokować sygnał lub zarejestrować jego procedurę obsługi, musimy to zrobić używając wywołania systemowego, które odpowiednio zaktualizuje informacje w jądrze (istnieje kilka wywołań służących do zarządzania sygnałami).

Tak jak pisałem wcześniej, sygnały powodują natychmiastowe zatrzymanie wykonania programu. Zachowanie to kojarzone zazwyczaj z przerwaniami i w istocie w wielu przypadkach obsługa sygnału zaczyna się właśnie od wystąpienia przerwania. Niektóre sygnały są generowane bezpośrednio w odpowiedzi na wystąpienie określonych wyjątków procesora, np. nieprawidłowej operacji arytmetycznej lub błędu dostępu do pamięci.

Sygnały mogą być też wysyłane przez warstwę TTY (odpowiedzialną obsługę terminala), np. w momencie wciśnięcia kombinacji klawiszy **Ctrl+C** lub **Ctrl+Z**. Sygnał może pochodzić też z innego procesu lub nawet z tego samego procesu (proces może wysłać sygnał sam do siebie). Jeżeli proces będący adresatem sygnału wykonuje się aktualnie na innym procesorze niż ten, z którego pochodzi sygnał, to obsługa sygnału wyzwalana jest z użyciem komunikacji między-procesorowej.

W momencie wystąpienia sygnału jądro decyduje, jaka akcja powinna być podjęta. Jeżeli sygnał jest blokowany, to jego obsługa zostaje odroczona, a jego wystąpienie jest oznaczane w strukturach opisujących proces. Podobnie dzieje się gdy proces, do którego ma trafić sygnał, wykonuje się aktualnie w przestrzeni jądra – obsługa sygnału jest w takim przypadku wykonywana dopiero w momencie powrotu do przestrzeni użytkownika. Jeżeli jednak taki proces czeka na jakieś zdarzenie z możliwością przerwania (w stanie **S**), to czekanie to jest przerywane z kodem błędu -ERESTARTSYS.

Jeżeli natomiast proces wykonuje się w przestrzeni użytkownika, to sygnał dostarczany jest bezzwłocznie. Aktualny kontekst wykonania jest zapisywany i uruchamiana jest procedura obsługi sygnału lub wykonywana jest domyślna dyspozycja. Po zakończeniu obsługi, zapisany wcześniej kontekst jest przywracany i wykonanie programu jest kontynuowane.

### Wywołanie systemowe **sys\_kill**

Sygnały mogą być generowane przez jądro w przypadku wystąpienia wyjątkowych sytuacji, ale istnieje też sposób wysyłania sygnałów, który może być wykorzystany w dowolnym momencie przez programistę. Pozwala on na wysłanie sygnału do dowolnego procesu – służy do tego funkcja **long kill(pid\_t** *pid***, int** *sig***)** wykorzystująca wywołanie systemowe **sys\_kill**. Przyjmuje ona dwa argumenty – numer PID procesu, do którego ma być wysłany sygnał oraz numer sygnału. Jej użycie pozwala na zaimplementowanie asynchronicznej komunikacji międzyprocesowej.

Sygnały umożliwiają manipulowanie stanem procesów, w tym ich natychmiastowe zabijanie, więc istnieje ryzyko, że zachowanie to mogło by być wykorzystane przez złośliwe oprogramowanie. Dlatego użycie wywołania **sys\_kill** jest dość mocno ograniczone. Przed wysłaniem sygnału zawsze sprawdzane są uprawnienia – jeżeli próbujemy wysłać sygnał do procesu innego użytkownika i nie mamy uprawnień administratora (a konkretnie CAP\_KILL), to dostaniemy informację o błędzie. Domyślnie możemy więc wysyłać sygnały tylko do procesów tego samego użytkownika.

Sygnały możemy też wysyłać z poziomu wiersza poleceń, używając wspomnianej na początku komendy **kill** (również opartej jest na wywołaniu **sys\_kill**). Używana jest ona zwykle do zabijania niedziałających procesów, ale umożliwia ona wysłanie dowolnego sygnału. Jest więc przydatna przy debugowaniu i przeprowadzaniu eksperymentów z użyciem sygnałów.

### Jakie są sygnały i co oznaczają?

Podstawowych sygnałów z Linuxie jest 31. Ich kompletny opis byłby bardzo obszerny, dlatego ograniczę się do opisania tylko najciekawszych z nich. Niektóre z pozostałych omówię bardziej szczegółowo we wpisach na temat poszczególnych podsystemów Linuxowych, z którymi są powiązane.

Kompletną listę dostępnych sygnałów możemy wyświetlić używając komendy kill -L:

```
robert@bezkompilatora:~$ kill -L
 1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL       5) SIGTRAP
 6) SIGABRT      7) SIGBUS       8) SIGFPE       9) SIGKILL     10) SIGUSR1
11) SIGSEGV     12) SIGUSR2     13) SIGPIPE     14) SIGALRM     15) SIGTERM
16) SIGSTKFLT   17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP
21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU     25) SIGXFSZ
26) SIGVTALRM   27) SIGPROF     28) SIGWINCH    29) SIGIO       30) SIGPWR
31) SIGSYS      34) SIGRTMIN    35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3
38) SIGRTMIN+4  39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12 47) SIGRTMIN+13
48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14 51) SIGRTMAX-13 52) SIGRTMAX-12
53) SIGRTMAX-11 54) SIGRTMAX-10 55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7
58) SIGRTMAX-6  59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
63) SIGRTMAX-1  64) SIGRTMAX
```

Gdy ją wywołamy, poza wspomnianymi 31 sygnałami zobaczymy też całą grupę sygnałów RT. Różnią się one od podstawowych sygnałów tym, że nie posiadają przypisanego żadnego znaczenia i służą wyłącznie do komunikacji między procesami. Mają też kilka unikalnych cech –  dostarczane są z zachowaniem kolejności zdarzeń, a w przypadku wystąpienia danego sygnału kilkukrotnie podczas gdy jest on zablokowany, po jego odblokowaniu jego procedura obsługi wywoływana jest określoną liczbę razy.

Pierwsze 31 sygnałów nie posiada tych cech, ale za to każdy z nich niesie informację o jakimś szczególnym zdarzeniu. Poniżej przygotowałem krótką listę z opisami kilku najczęściej spotykanych:

-   **SIGINT** – Żądanie przerwania procesu. Wysyłany jest przez warstwę TTY w momencie wciśnięcia kombinacji klawiszy **Ctrl+C**.
-   **SIGTERM** – Zakończenie procesu. Jest to sygnał wysyłany domyślnie przez komendę **kill**, jeśli nie został do niej podany żaden argument.
-   **SIGQUIT** – Zakończenie procesu ze zrzutem rdzenia (ang. core dump). Zrzut rdzenia to zapis stanu procesu w momencie jego zakończenia – zawiera informacje przydatne podczas debugowania. Sygnał ten możemy wysłać używając kombinacji klawiszy **Ctrl+\\**.
-   **SIGKILL** – Zakończenie procesu bez możliwości zablokowania i obsługi. Jest to jeden z dwóch (obok **SIGSTOP**) sygnałów, na które programista nie ma możliwości w żaden sposób zareagować. Otrzymanie tego sygnału powoduje bezwarunkowe zakończenie procesu.
-   **SIGABRT** – Zakończenie procesu ze zrzutem rdzenia. Ten sygnał jest bardzo podobny do **SIGQUIT**, z tą różnicą, że jest on zazwyczaj wysyłany przez proces do samego siebie w momencie wystąpienia krytycznego błędu. Służy do tego funkcja **abort()**.
-   **SIGFPE** – Błąd operacji arytmetycznej. Wysyłany jest w na przykład podczas próby wykonania dzielenia przez zero. Domyślnie powoduje zakończenie procesu ze zrzutem rdzenia.
-   **SIGSEGV** – Błąd naruszenia ochrony pamięci. Wysyłany jest w momencie, gdy proces dokonuje nieprawidłowego dostępu do pamięci – na przykład próbuje pisać do niezaalokowanego obszaru. Domyślnie powoduje zakończenie procesu ze zrzutem rdzenia.
-   **SIGPIPE** – Błąd zapisu do potoku. Wysyłany jest w momencie, gdy proces próbuje pisać do potoku, którego “czytający” koniec został już zamknięty.
-   **SIGCHLD** – Zmiana stanu procesu-dziecka. Wysyłany jest do procesu-rodzica w momencie, gdy proces-dziecko zostanie zatrzymany, kontynuowany lub zakończony (przejście do/ze stanu T lub Z).
-   **SIGSYS** – Błąd wywołania systemowego. Wysyłany jest w momencie, gdy proces próbuje użyć wywołania systemowego z nieprawidłowym argumentem.

Dodatkowo działanie sygnałów **SIGSTOP** i **SIGCONT**, odpowiedzialnych za zatrzymywanie i kontynuowanie procesu, opisywałem już wcześniej we wpisie poświęconym zarządzaniu procesami. Dla zainteresowanych polecam lekturę tego wpisu.

Z wypunktowanych przeze mnie sygnałów, prawie wszystkie domyślnie powodują zakończenie procesu. Wyjątkiem jest **SIGCHLD**, który standardowo jest ignorowany. W większości przypadków można jednak zapobiec zabiciu procesu, ignorując sygnał lub dostarczając procedurę jego obsługi. Nie dotyczy to tylko sygnału **SIGKILL**, który działa bezwarunkowo.

Po tym krótkim wprowadzeniu przejdźmy teraz do części najbardziej interesującej dla programistów, czyli opisu metod obsługi sygnałów. Przygotowałem kilka przykładów z wyjaśnieniami – znajdziecie tam prawie wszystko, co potrzebne programiście do zaimplementowania obsługi sygnałów w programie. Zaczynajmy. 🙂

### Jak obsługiwać sygnały?

Zanim przejdziemy do kodu, chciałbym zaznaczyć jedną istotną rzecz dotyczącą sygnałów, na którą często łapią się początkujący programiści. Intuicyjnie mogłoby się wydawać, że w procedurze obsługi sygnału powinniśmy dążyć do naprawienia sytuacji, z powodu której został wygenerowany sygnał. W rzeczywistości jednak obsługa sygnałów ma na celu coś innego – umożliwienie programiście posprzątanie po procesie przed jego zakończeniem.

Wynika to z faktu, że w większości przypadków sygnały generowane są albo przez użytkownika, który intencjonalnie chce spowodować zakończenie procesu, albo z powodu wystąpienia krytycznych błędów, które są z natury trudne do przywidzenia i ich naprawa w procedurze obsługi sygnału jest po prostu niemożliwa. Domyślnie sygnały te powodują zakończenie procesu i procedura ich obsługi powinna na ogół robić to samo. Różnica jest taka, że w tym drugim przypadku mamy możliwość, na przykład, uprzedniego zapisania informacji do loga lub usunięcia tymczasowych plików.

#### Blokowanie sygnałów

Chyba najbardziej podstawową operacją, jaką możemy wykonać w ramach obsługi sygnału, jest jego zablokowanie. Zablokowane sygnały nie są dostarczane, ale fakt ich wystąpienia jest odnotowywany i ich właściwa obsługa następuje zaraz po odblokowaniu. Dzięki temu nie tracimy informacji o sygnale, a jednocześnie nie musimy na niego reagować w niewygodnym dla nas momencie.

Blokowanie sygnałów jest przydatne, kiedy potrzebujemy w programie zmieniać stan, do którego może chcieć się również dostać procedura obsługi sygnału. Jeżeli taki stan nie jest atomowy z perspektywy sygnału, a wystąpi on w trakcie jego zmiany, to dane odczytane przez procedurę obsługi sygnału mogą być niekompletne. Dlatego przed modyfikacją tego typu danych należy zablokować sygnały, których obsługa wykorzystuje te dane, a następnie zaraz po zakończeniu zmian odblokować sygnały.

Do blokowania i odblokowywania sygnałów służy funkcja **int sigprocmask(int** *how***, const sigset\_t** *\*set***, sigset\_t** *\*oldset***)**, wykorzystująca wywołanie systemowe **sys\_rt\_sigprocmask**. Przyjmuje ona trzy argumenty – numer operacji, oraz dwa wskaźniki typu sigset\_t, opisujące dwa zbiory sygnałów. Pierwszy z nich opisujące zbiór sygnałów, które mają być zablokowane lub odblokowane, a drugi to argument wyjściowy, w którym oznaczane są aktualnie zablokowane sygnały. W takim modelu możliwe jest blokowanie i odblokowywanie wielu sygnałów jednocześnie oraz łatwe przywracanie poprzedniego stanu.

Istnieją trzy dozwolone wartości numeru operacji, dla których zdefiniowane są następujące makra:

-   **SIG\_BLOCK** – zablokowanie wszystkich sygnałów w zbiorze,
-   **SIG\_UNBLOCK** – odblokowanie wszystkich sygnałów w zbiorze,
-   **SIG\_SETMASK** – zablokowanie tylko sygnałów ze zbioru i odblokowanie pozostałych.

Do zarządzania zawartością zbiorów służą dedykowane funkcje, takie jak **int sigaddset(sigset\_t** **\****set***,** **int** *sig***)** ustawiająca w zbiorze dany sygnał, **int** **sigdelset(sigset\_t** **\****set***,** **int** *sig***)** usuwająca sygnał ze zbioru, czy **int** **sigemptyset(sigset\_t** **\****set***)** ustawiająca zbiór na pusty. Znaczenia parametrów przyjmowanych przez te funkcje łatwo się domyślić – *set* to wskaźnik do zbioru, a *sig* to numer sygnału.

Bogaci w tą wiedzę, możemy napisać prosty program, w którym przetestujemy blokowanie sygnałów. Oto kod:

```c
#include <stdio.h>
#include <signal.h>
#include <unistd.h>
#include <stdlib.h>

int main()
{
        sigset_t ss;

        sigemptyset(&ss);
        sigaddset(&ss, SIGINT);

        printf("Blokuje sygnal\n");
        if (sigprocmask(SIG_BLOCK, &ss, NULL) < 0) {
                fprintf(stderr, "Nie mozna zablokowac sygnalu\n");
                exit(1);
        }

        sleep(5);

        printf("Odblokowuje sygnal\n");
        if (sigprocmask(SIG_UNBLOCK, &ss, NULL) < 0) {
                fprintf(stderr, "Nie mozna odblokowac sygnalu\n");
                exit(1);
        }

        printf("Koniec\n");

        return 0;
}
```

Program blokuje przerwanie **SIGINT** i zasypia na 5 sekund, po czym odblokowuje sygnał i wypisuje krótki komunikat. Jeżeli sygnał przyjdzie w trakcie pierwszych pięciu sekund, to program nie zostanie przerwany od razu, ale dopiero w momencie odblokowania sygnału. W takim wypadku komunikat o odblokowywaniu sygnału pojawi się na ekranie (ponieważ wypisywany jest przed odblokowaniem sygnału), ale komunikat o końcu już nie.

Sygnał **SIGINT** możemy wysłać wciskając kombinację klawiszy **Ctrl+C**. Jeżeli więc uruchomimy ten program i w ciągu pięciu sekund wciśniemy kombinację klawiszy **Ctrl+C**, to zobaczymy następujący wynik:

```
robert@bezkompilatora:~/signals$ ./block_sigint
Blokuje sygnal
^COdblokowuje sygnal
```

Zablokować można każdy sygnał poza **SIGKILL** i **SIGSTOP**, chociaż nie zawsze przyniesie to pożądany skutek. W przypadku blokowania sygnałów generowanych przez błąd w programie, takich jak **SIGFPE** czy **SIGSEGV**, zaraz po wysłaniu sygnału program wraca do tej samej instrukcji, która wygenerowała sygnał. W efekcie jest on wysyłany kolejny raz, a kiedy jądro wykryje taką sytuację automatycznie odblokowuje sygnał i wykonuje domyślną dyspozycję. W takim wypadku blokowanie jest więc nieskuteczne.

#### Procedura obsługi sygnału

O wiele bardziej zaawansowane możliwości niż blokowanie daje rejestracja własnej procedury obsługi sygnału. Można to zrobić na dwa sposoby – używając funkcji **signal()** lub bardziej rozbudowanej funkcji **sigaction()**. Kiedyś ta pierwsza wykorzystywała wywołanie systemowe **sys\_signal**, ale obecnie obie oparte są o nowsze i bardziej zaawansowane wywołanie systemowe **sys\_rt\_sigaction**.

##### Funkcja **signal()**

Funkcja **sighandler\_t** **signal(int** *signum***, sighandler\_t** *handler***)** pozwala na zarejestrowanie podstawowego wariantu procedury obsługi sygnału. Przyjmuje ona dwa argumenty – numer sygnału oraz wskaźnik na funkcję. Funkcja ta, pełniąca funkcję procedury obsługi sygnału, przyjmuje jeden argument – numer sygnału. Dzięki temu możliwe jest użycie tej samej procedury dla kilku sygnałów i rozróżnianie ich dopiero w trakcie jej działania.

Funkcja **signal()** zwraca wskaźnik do poprzednio ustawionej procedury lub specjalny znacznik opisujący jedną z domyślny dyspozycji. Znaczniki te są zdefiniowane w postaci makr, które można też podawać zamiast zamiast wskaźnika na procedurę obsługi sygnału. Dzięki temu możemy łatwo przywrócić domyślną dyspozycję (makro **SIG\_DFL**) lub ustawić dyspozycję ignorowania sygnału (makro **SIG\_IGN**).

Przykładowy program rejestrujący procedurę obsługi sygnału **SIGINT** z użyciem funkcji **signal()** może wyglądać tak:

```c
#include <stdio.h>
#include <signal.h>
#include <unistd.h>

void handler(int sig)
{
        printf("Sygnal!\n");
        return;
}

int main()
{
        int i;

        signal(SIGINT, handler);

        for (i = 0; i < 10; i++)
                sleep(2);

        return 0;
}
```

Jeżeli uruchomimy ten program i wciśniemy kombinację klawiszy **Ctrl+C** to na ekranie zostanie wypisany komunikat o sygnale, po czym wykonanie programu zostanie wznowione. Warto jednak pamiętać, że jeżeli sygnał nadejdzie w trakcie działania funkcji **sleep()**, to spanie zostanie przerwane przed czasem. Wysyłając sygnały **SIGINT** jeden po drugim możemy więc szybko przerwać wszystkie dziesięć wywołań funkcji **sleep()** i w efekcie spowodować, że program zakończy się szybciej.

##### Ignorowanie sygnałów

Jeżeli nie chcemy obsługiwać danego sygnału, to możemy złożyć dyspozycję jego ignorowania podając **SIG\_IGN** jako drugi argument funkcji **signal()**. Sygnał taki, podobnie jak w przypadku jego zablokowania, nie będzie dostarczany. Różnica pomiędzy blokowaniem a ignorowaniem jest taka, że w przypadku ignorowania informacja o wystąpieniu sygnału jest tracona – jeżeli w jakimś momencie zdecydujemy, że nie chcemy już ignorować danego sygnału i ustawimy dla niego procedurę obsługi lub domyślną dyspozycję, to sygnały, które dotarły w czasie ignorowania, nie zostaną obsłużone. Dlatego jeżeli chcemy zachować informację o wystąpieniu sygnału, to nie powinniśmy go ignorować, tylko zablokować.

##### Funkcja **sigaction()**

Funkcja **int sigaction(int** *signum***, const struct sigaction \****act***, struct sigaction \****oldact***)** to młodsza siostra funkcji **signal()** wzbogacona o dodatkowe możliwości. Przyjmuje ona trzy argumenty – numer sygnału oraz dwa wskaźniki na strukturę ****struct sigaction**** opisującą sposób obsługi sygnału. Pierwszy z nich powinien wskazywać na strukturę z opisem nowej dyspozycji, a drugi to argument wyjściowy, w którym zapisywany jest poprzedni stan.

Sama struktura **struct sigaction** zdefiniowana jest następująco:

```c
struct sigaction {
        void     (*sa_handler)(int sig);
        void     (*sa_sigaction)(int sig, siginfo_t *, void *ucontext);
        sigset_t   sa_mask;
        int        sa_flags;
        void     (*sa_restorer)(void);
};
```

Pole *sa\_handler* to wskaźnik na taką samą funkcję obsługi sygnału, jaką przyjmuje **signal()**. Jeżeli chcemy użyć bardziej zaawansowanego wariantu procedury, to powinniśmy użyć pola *sa\_sigaction*  – funkcja, którą tam podamy, poza numerem przerwania otrzyma ona również wskaźnik do struktury **siginfo\_t**, zawierającej masę informacji na temat sygnału. Dostanie też wskaźnik na strukturę kontekstu, zawierającą niskopoziomowe dane, które jednak zazwyczaj nie są używane przez aplikacje.

Bardzo użyteczne może być pole *sa\_mask*, zawierające opis zbioru sygnałów, dokładnie taki jak ten przyjmowany przez funkcję **sigprocmask()**. Sygnały zaznaczone w tym zbiorze będą blokowane na czas wywołania procedury obsługi sygnału, dzięki czemu możemy ustrzec się przed wywołaniem innej procedury w trakcie działania obecnej.

Pole *sa\_flags* służy do ustawiania flag, które modyfikują zachowanie obsługi sygnału w różny sposób. Często używana jest flaga **SA\_SIGINFO**, powodująca, że podczas wystąpienia sygnału wywoływana jest funkcja z pola *sa\_sigaction*, a nie domyślna *sa\_handler*. Z kolei stawienie flagi **SA\_RESETHAND** spowoduje, że ustawiona procedura zostanie wywołana tylko dla pierwszego wystąpienia sygnału, a dla kolejnych zostanie wykonana domyślna dyspozycja.

Ostatnie pole *sa\_restorer*  zostało one wprowadzone tylko na potrzeby niskopoziomowych bibliotek. Podobnie jak skojarzona z nim flaga **SA\_RESTORER**, nie jest ono zbyt użyteczne z punktu widzenia programisty aplikacji.

### Co możemy zrobić z sygnałem?

Tak jak pisałem wcześniej, w większości przypadków wystąpienie sygnału będzie się wiązało z koniecznością zamknięcia aplikacji. W przypadku sygnałów generowanych z powodu błędów aplikacji jest to niemal konieczne. Natomiast w przypadku sygnałów otrzymanych od użytkownika, nawet jeśli postanowimy je zignorować, to w niedługim czasie możemy się spodziewać nadejścia sygnału **SIGKILL**. A z takim argumentem trudno jest dyskutować. 😉

Skoro tak jest, to dlaczego w ogóle powinniśmy przejmować się obsługą sygnałów? Przynajmniej z kilku powodów. Po pierwsze, obsługa sygnałów daje nam możliwość zapisania aktualnego stanu programu. Jeżeli na przykład nasza aplikacja to edytor tekstu, to mamy możliwość zapisania do tymczasowego pliku ostatnich zmian dokonanych przez użytkownika.

Po drugie, mamy możliwość przywrócenia domyślnego stanu terminala. Jeżeli nasza aplikacja wykorzystuje terminal w jakiś specyficzny sposób – np. zmienia dyscyplinę linii bądź wypisuje tekst w różnych kolorach – to nadejście nieobsługiwanego sygnału spowoduje, że terminal zachowa nasze ustawienia po zakończeniu naszej aplikacji. Dostarczając własną procedurę obsługi sygnału możemy temu zapobiec.

Po trzecie, jeżeli nasz program komunikuje się bezpośrednio z zewnętrznymi urządzeniami, to przed zakończeniem swojego działania powinien przywrócić je do jakiegoś rozsądnego stanu. Tutaj również przychodzą z pomocą procedury obsługi przerwania.

Dla kontrastu przygotowałem jednak również przykład, w którym pokazuję w jaki sposób można obsłużyć sygnał spowodowany błędem w programie – po części po to, żeby udowodnić, że jest to możliwe, a po części po to, żeby pokazać, że da się to zrobić tylko w bardzo specyficznych przypadkach.

#### Naprawa programu po SIGFPE

Wyobraźmy sobie następującą sytuację. Tworzymy program, który ma za zadanie uruchomić kolejno szereg funkcji, wykonujących obliczenia na określonych danych. Dane pochodzą od nas, natomiast funkcje dokonujące obliczeń są dostarczane przez innych programistów w postaci pluginów, które nasz program ładuje dynamicznie. Nie mamy kontroli nad tym, co się dzieje w pluginach, więc może się okazać, że któryś z nich spowoduje błąd  generujący sygnał. Nie chcemy jednak, żeby spowodowało to zakończenie działania naszego programu – w takiej sytuacji najlepiej byłoby pominąć niedziałającą funkcję i przejść do wykonywania kolejnych.

Przykładowy program rozwiązujący ten problem poprzez obsługę sygnałów znajdziecie poniżej. Jest on nieco uproszczony – zamiast dynamicznego ładowania pluginów wywołuje zdefiniowane wcześniej funkcje. Zasada działania jest jednak dokładnie taka sama – jedna z funkcji może spowodować wygenerowanie sygnału i chcemy tą sytuację obsłużyć. Oto kod:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>
#include <setjmp.h>

int calc1(int a, int b) { return a + b; }
int calc2(int a, int b) { return a - b; }
int calc3(int a, int b) { return a / b; }
int calc4(int a, int b) { return a * b; }

int (*calc_tab[])(int a, int b) = {
        calc1,
        calc2,
        calc3,
        calc4,
};

sigjmp_buf jbuf;
sig_atomic_t i;

void sighandler(int signum, siginfo_t *info, void *ptr)
{
        printf("Wystapil wyjatek!\n");
        siglongjmp(jbuf, i + 1);
}

int main(int argc, char *argv[])
{
        struct sigaction sa;
        int r, a = 4, b = 0;

        memset(&sa, 0, sizeof(sa));
        sa.sa_sigaction = sighandler;
        sa.sa_flags = SA_SIGINFO;
        sigaction(SIGFPE, &sa, NULL);

        for (i = sigsetjmp(jbuf, 1); i < 4; i++) {
                printf("Obliczam %i...\n", i + 1);
                r = calc_tab[i](a, b);
                printf("Wynik: %i\n", r);
        }

        return 0;
}
```

Po jego skompilowaniu i uruchomieniu zobaczymy następujący rezultat:

```
robert@bezkompilatora:~$ ./sigfpe_example
Obliczam 1...
Wynik: 4
Obliczam 2...
Wynik: 4
Obliczam 3...
Wystapil wyjatek!
Obliczam 4...
Wynik: 0
```

Jak widzimy, trzecia funkcja spowodowała wystąpienie sygnału **SIGFPE** – miało to związek z próbą wykonania dzielenia przez zero. Mimo to udało się przywrócić działanie programu i kolejna, czwarta funkcja została poprawnie wykonana. Przyjrzyjmy się teraz bliżej, co tak naprawdę dzieje się w tym programie.

W funkcji **main()** rejestrowana jest najpierw procedura obsługi sygnału. Następnie rozpoczyna się pętla, która iteruje po tablicy wskaźników na funkcje, wywołując każdą z nich. Po wywołaniu funkcji na ekran wypisywana jest zwrócona przez nią wartość i pętla przechodzi do kolejnej iteracji. Wygląda to dosyć standardowo i jedyne co może być zastanawiające, to fakt, że licznik pętli inicjalizowany jest wartością zwracaną przez funkcję **sigsetjmp()**, oraz to, że licznik ten jest zmienną globalną typu *sig\_atomic\_t*.

Funkcja **int sigsetjmp(sigjmp\_buf** *env***, int** *savesigs***)** to odpowiednik funkcji **setjmp()** odporny na wykorzystanie podczas obsługi sygnałów. Funkcja ta przyjmuje dwa argumenty – bufor skoku oraz wartość wskazującą na to, czy powinien zostać zapisany kontekst sygnałów. Wartość 1 oznacza zapisanie tego kontekstu. Podanie wartości 0 wyłącza zapisywanie kontekstu sygnałów i w efekcie sprawia, że funkcja zachowuje się tak samo jak zwykły **setjmp()**. Podczas pierwszego wywołania funkcja zawsze zwraca wartość 0.

Do wykonania skoku służy funkcja **siglongjmp()**, która jest odpowiednikiem **longjmp()** i przyjmuje podobny do niej zestaw parametrów – pierwszy argument to bufor skoku, który powinien być wcześniej zainicjalizowany przez wywołanie **sigsetjmp()**, a drugi to wartość, jaką zwróci **sigsetjmp()** po wykonaniu skoku. W naszym programie funkcja ta wywoływana jest z procedury obsługi przerwania. Jako drugi argument przekazujemy jej wartość licznika pętli zwiększoną o jeden – dzięki temu zaraz po skoku wykonywany jest kolejny obieg pętli. W efekcie funkcja, która spowodowała wygenerowanie sygnału jest pomijana, a program jest kontynuowany.

Wyjaśnienia wymaga jeszcze licznik pętli typu *sig\_atomic\_t*. Jest to typ, którego modyfikacje są atomowe z punktu widzenia procedury obsługi sygnału. Dzięki temu mamy pewność, że wartość odczytana w tej procedurze będzie zawsze poprawna. Gdybyśmy chcieli użyć innego typu, musielibyśmy blokować sygnał na czas modyfikacji wartości licznika (co w przypadku **SIGFPE** mogłoby nie przynieść oczekiwanego rezultatu, o czym pisałem już wcześniej). Nie należy mylić typu *sig\_atomic\_t* ze zmiennymi atomowymi używanymi do współdzielenia danych między wątkami – nie ma gwarancji, że operacje na *sig\_atomic\_t* są atomowe w kontekście wielowątkowości.

### Synchroniczna obsługa sygnałów

Pomimo, że sygnały są z definicji mechanizmem asynchronicznym, istnieje również możliwość ich obsługi w sposób synchroniczny z użyciem *signalfd*. Należy jednak pamiętać, że nie można w ten sposób obsłużyć sygnałów wygenerowanych na skutek wyjątkowych sytuacji w programie, takich jak **SIGSEGV**, czy **SIGFPE**, podobnie jak sygnałów **SIGKILL** i **SIGSTOP**.

Obsługa sygnałów z użyciem *signalfd* opiera się na wykorzystaniu specjalnego deskryptora pliku, z którego możemy odczytać informacje o sygnałach. Do jego otwarcia i modyfikacji służy funkcja **int signalfd(int** *fd***, const sigset\_t \****mask***, int** *flags***)**. Przyjmuje ona trzy argumenty:

-   *fd* – numer deskryptora, który chcemy zmodyfikować lub wartość -1, jeśli chcemy utworzyć nowy,
-   *mask* – wskaźnik na zbiór sygnałów, które chcemy monitorować,
-   *flags* – opcjonalne flagi (w tym użyteczna **SFD\_NONBLOCK**, która powoduje, że operacje na deskryptorze nie są blokujące).

Sygnały, które chcemy obsługiwać przez *signalfd* musimy najpierw zablokować, żeby nie zostały one obsłużone przez wykonanie domyślnej dyspozycji. Następnie możemy monitorować stan deskryptora z użyciem funkcji **poll()** lub **select()**, lub bezpośrednio próbować odczytywać z niego dane. Jeżeli wcześniej wystąpił któryś z monitorowanych sygnałów, to w trakcie odczytu do bufora przekazanego do funkcji **read()** kopiowana jest struktura **struct signalfd\_siginfo**. Zawiera ona szereg informacji o sygnale, w tym pole *ssi\_signo* przechowujące numer sygnału.

Przykładowy program obsługujący sygnał **SIGINT** z użyciem mechanizmu *signalfd* może wyglądać następująco:

```c
#include <sys/signalfd.h>
#include <signal.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char *argv[])
{
        struct signalfd_siginfo fdsi;
        sigset_t ss;
        int sfd, i, ret;
        
        sigemptyset(&ss);
        sigaddset(&ss, SIGINT);
        
        if (sigprocmask(SIG_BLOCK, &ss, NULL) < 0) {
                fprintf(stderr, "Nie mozna zablokowac sygnalu\n");
                exit(1);
        }
        
        sfd = signalfd(-1, &ss, 0);
        if (sfd < 0) {
                fprintf(stderr, "Nie mozna otworzyc deskryptora\n");
                exit(1);
        }
        
        for (i = 0; i < 5; i++) {
                ret = read(sfd, &fdsi, sizeof(fdsi));
                if (ret < sizeof(fdsi)) {
                        fprintf(stderr, "Blad odczytu\n");
                        exit(1);
                }

                switch (fdsi.ssi_signo) {
                case SIGINT:
                        printf("Sygnal SIGINT!\n");
                        break;
                default:
                        fprintf(stderr, "To nie powinno sie zdarzyc!\n");
                        break;
                }
        }

        printf("Koniec!\n");
        return 0;
}
```

Działanie programu jest następujące: W funkcji **main()** tworzony jest najpierw zbiór, do którego dodawany jest sygnał **SIGINT**. Zbiór ten podawany jest do funkcji **sigprocmask()** w celu zablokowania sygnału, a póżniej do funkcji **signalfd()** otwierającej deskryptor służący do jego monitorowania. Później rozpoczyna się pętla. Na samym jej początku następuje odczyt z deskryptora *signalfd* – deskryptor ten został otwarty w trybie blokującym, więc odczyt ten zatrzymuje program aż do momentu wystąpienia sygnału **SIGINT**. Gdy do tego dojdzie, funkcja **read()** kończy się z sukcesem, a odczytana struktura w polu *ssi\_signo* ma ustawiony numer sygnału **SIGINT**. Cała procedura będzie powtórzona pięć razy, a na koniec zostanie wypisany krótki komunikat i program się zakończy.

Po skompilowaniu i uruchomieniu programu musimy użyć kombinacji **Ctrl+C** pięciokrotnie zanim dojdzie do jego zakńczenia. Warto zauważyć, że pomimo otrzymania kilku sygnałów **SIGINT**, zakończenie nie nastąpi z powodu domyślnej dyspozycji tego sygnału. Program zakończy się przez wyjście z funkcji **main()**, o czym świadczy wypisanie końcowego komunikatu. Wygląda to tak:

```
robert@bezkompilatora:~$ ./signal_example
^CSygnal SIGINT!
^CSygnal SIGINT!
^CSygnal SIGINT!
^CSygnal SIGINT!
^CSygnal SIGINT!
Koniec!
```

• • •

Tym terminalowym akcentem zakończę dzisiejszy, znów rekordowo długi wpis. Właśnie wskoczyłem na trzynastą stronę A4 w moim edytorze, więc jeśli doczytałeś/doczytałaś do tego momentu, to chciałbym Ci serdecznie pogratulować. 🙂

Jak zawsze gorąco zachęcam do komentowania i zadawania pytań – jestem do Waszej dyspozycji. A jeśli nie chcecie przegapić kolejnych wpisów, to koniecznie zapiszcie się na mój [newsletter](/newsletter/) i polubcie moją [strony na Facebooku](https://www.facebook.com/BezKompilatora/). Z góry dzięki!
