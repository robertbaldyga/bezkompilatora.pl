---
title: "Jak działa Linuxowy terminal? (część 2)"
date: 2018-12-31
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["terminal", "TTY", "Linux", "dyscyplina linii", "termios"]
image: "/images/uploads/2018/12/data-center-rack-console.jpg"
summary: "W poprzedniej części wpisu pokazywałem na schematach jak wygląda obsługa terminala w Linuxie – od zewnętrznego urządzenia, przez wirtualną konsolę, aż po emulator terminala. Za każdym razem centralną część stanowiła znajdująca się w kernelu warstwa TTY. Łączyła ona…"
---

W [poprzedniej części wpisu](/blog/jak-dziala-linuxowy-terminal-czesc-1/) pokazywałem na schematach jak wygląda obsługa terminala w Linuxie – od zewnętrznego urządzenia, przez wirtualną konsolę, aż po emulator terminala. Za każdym razem centralną część stanowiła znajdująca się w kernelu warstwa TTY. Łączyła ona urządzenie terminala (fizyczne czy też wirtualne) z programami działającymi z sesji powłoki. Dziś opowiem nieco więcej o tym czym jest warstwa TTY i jakie są jej zadania.

### Czym jest warstwa TTY?

Na schematach z poprzedniej części wpisu warstwa TTY nie wygląda dość prosto. Przechodzą przez nią dane wysyłane z terminala do programu i z programu do terminala. Można by się zastanawiać, czy daje ona jakąś szczególną wartość i czy tak naprawdę nie dałoby się jej pominąć. Programy mogłyby się przecież komunikować bezpośrednio z portem szeregowym, a w przypadku wirtualnej konsoli lub emulatora, przejście danych przez jądro wydaje się zupełnie zbyteczne.

W systemie Linux warstwa TTY dostarcza dwie podstawowe funkcjonalności – wstępne przetwarzanie danych wymienianych z terminalem oraz zarządzanie sesją. Pierwsza z nich jest prosta i można byłoby ją z powodzeniem zaimplementować w samych programach lub w bibliotece. Umieszczenie jej w jądrze wynika głównie z założenia, że programy w przestrzeni użytkownika powinny być jak najprostsze. Nie ma więc sensu, żeby każdy z nich zawierał logikę odpowiedzialną za obsługę terminala.

Zarządzanie sesją to temat bardziej skomplikowany, któremu poświęcimy dłuższą chwilę. Mechanizmy za nim stojące są dość mocno powiązane z zarządzaniem procesami i wierzę, że jest to główny powód dla którego cała warstwa TTY znajduje się w jądrze. Wrócimy do tego w dalszej części wpisu. Tymczasem skupmy się na pierwszej funkcjonalności – dyscyplinie linii.

### Dyscyplina linii

Dyscyplina linii odpowiada za wstępną filtrację, przetwarzanie i buforowanie danych wymienianych między programem a terminalem. Dzięki niej możemy na przykład edytować w terminalu wpisywaną komendę. Obsługa klawiszy Backspace, Delete czy strzałek do poruszania kursorem należy właśnie do zadań dyscypliny linii. W domyślnym trybie (kanonicznym) wprowadzone dane są wysyłane do programu dopiero po wciśnięciu klawisza Enter. Bez tego napisanie prostego programu wczytującego kilka liczb z klawiatury byłoby o wiele trudniejsze.

Dyscyplina linii posiada ogromną ilość opcji konfiguracyjnych. Część z nich dotyczy konfiguracji portu szeregowego (np. sterowania liniami RTS/CTS) i nie ma zastosowania w przypadku wirtualnej konsoli lub emulatora terminala. Pozostałe pozwalają na przykład na wyłączenie funkcji echo (użytkownik terminala nie widzi na ekranie wpisywanych znaków) co jest powszechnie używane przy wprowadzaniu haseł. Możliwe jest też zablokowanie wysyłania sygnałów **SIGINT**, **SIGSTP** i **SIGQUIT** lub zmiana odpowiadającej im kombinacji klawiszy na własną.

Edycja linii dostępna jest w tzw. trybie kanonicznym (ang. canonical mode), który jest trybem domyślnym. Istnieje jednak możliwość przełączenia się w tryb niekanoniczny, w którym dane wprowadzane przez użytkownika w terminalu są dostępne od razu do odczytania przez program użytkownika (chyba, że ustawiono wartość **VMIN** większą niż 1 – o tym za chwilę). Tryb niekanoniczny jest wykorzystywany zazwyczaj przez edytory tekstu, które potrzebują większej kontroli nad interakcją z terminalem.

### Konfiguracja dyscypliny linii

Programista może zmienić ustawienia dyscypliny linii przy pomocy funkcji bibliotecznych **int tcgetattr(int** *fd***, struct termios \****termios\_p***)** i **int tcsetattr(int** *fd***, int** *optional\_actions***, const struct termios \****termios\_p***)** (pod spodem korzystają one z wywołania systemowego **ioctl()**). Pracując w konsoli można w tym celu użyć komendy **stty**. Wszystkie ustawienia aktualnego terminala możemy wyświetlić przy pomocy polecenia stty -a. Przykładowy wynik jego działania przedstawia się następująco:

```
robert@bezkompilatora:~$ stty -a
speed 38400 baud; rows 24; columns 80; line = 0;
intr = ^C; quit = ^\; erase = ^?; kill = ^U; eof = ^D; eol = ;
eol2 = ; swtch = ; start = ^Q; stop = ^S; susp = ^Z; rprnt = ^R;
werase = ^W; lnext = ^V; discard = ^O; min = 1; time = 0;
-parenb -parodd -cmspar cs8 -hupcl -cstopb cread -clocal -crtscts
-ignbrk -brkint -ignpar -parmrk -inpck -istrip -inlcr -igncr icrnl ixon -ixoff
-iuclc -ixany -imaxbel iutf8
opost -olcuc -ocrnl onlcr -onocr -onlret -ofill -ofdel nl0 cr0 tab0 bs0 vt0 ff0
isig icanon iexten echo echoe echok -echonl -noflsh -xcase -tostop -echoprt
echoctl echoke -flusho -extproc
```

Jak widać, jest tego całkiem sporo. Na tyle sporo, że tekst 6-liniowy został w 80-znakowym terminalu połamany na 10 linii, co trochę utrudnia czytanie. Postaram się pokrótce wyjaśnić co oznaczają najważniejsze opcje i jak to wszystko interpretować.

#### Parametry terminala

Pierwsza linia zawiera podstawowe informacje o terminalu:

-   *speed* – Prędkość portu szeregowego. W przypadku wirtualnej konsoli i emulatora ta wartość jest pomijana.
-   *rows* – Liczba linii na wyświetlaczu (w oknie) terminala.
-   *columns* – Liczba kolumn na wyświetlaczu (w oknie) terminala.
-   *line* – Numer dyscypliny linii. Wartość 0 oznacza domyślną dyscyplinę N\_TTY.

#### Znaki specjalne

Druga linia to lista znaków specjalnych interpretowanych przez warstwę TTY. Możemy się z niej dowiedzieć jaki klawisz lub kombinacja klawiszy odpowiada określonej akcji.

Przykładowo oznaczenie **^C** przypisane do akcji *intr* oznacza kombinację klawiszy **Ctrl+C**, czyli kombinację powodującą wysłanie sygnału **SIGINT**. Kombinacja **^Z** (**Ctrl+Z**) przypisana do akcji *susp* spowoduje wysłanie sygnału **SIGTSTP**, **^D** (**Ctrl+D**) odpowiada za wysyłanie znaku końca pliku (*eof*), a **^W** (**Ctrl+W**) powoduje usunięcie ostatniego słowa w linii.

W ten sam sposób możemy zinterpretować wszystkie wartości poza dwiema ostatnimi – *min* oraz *time*. Nie opisują żadnych akcji terminala, ale odpowiadają wartościom **VMIN** oraz **VTIME**, wykorzystywanym w trybie niekakonicznym.

Wartość **VMIN** określa minimalną liczbę znaków jaka musi znajdować się w buforze wejściowym zanim dane zostaną przekazane do programu. **VTIME** to maksymalny czas oczekiwania programu na nadchodzące dane wyrażony w dziesiątych sekundy. Jeżeli czas **VTIME** upłynie zanim w buforze nazbiera się **VMIN** znaków, to do programu zostanie zwrócone tyle znaków ile udało się odczytać, nawet jeśli bufor jest pusty (wówczas funkcja **read()** zwróci wartość 0).

#### Flagi

Kolejne cztery linie zawierają flagi binarne. Jeżeli nazwa poprzedzona jest minusem, oznacza to, że dana flaga jest wyłączona. Poszczególne linie reprezentują kolejno:

-   parametry portu szeregowego (control settings),
-   parametry wejściowe (input settings),
-   parametry wyjściowe (output settings),
-   parametry lokalne (local settings).

##### Parametry kontrolne

Parametry portu szeregowego w przypadku wirtualnej konsoli i emulatora terminala są całkowicie ignorowane, więc nie będę im poświęcał uwagi. Może kiedyś napiszę osobny wpis na temat obsługi portu szeregowego w Linuxie. Dajcie znać w komentarzu, jeśli taki chcecie.

##### Parametry wejściowe

Parametry wejściowe służą do filtracji i przetwarzania danych wysyłanych z terminala do programu. Niektóre z nich powiązane są z działaniem portu szeregowego (jak na przykład *inpck*, włączający sprawdzanie bitu parzystości), a inne pozwalają na przykład na ignorowanie znaku **CR** (*igncr)* lub zamianę każdego znaku **NL** na **CR** (*icrnl*).

##### Parametry wyjściowe

Parametry wyjściowe opisują w jaki sposób przetwarzane są dane wysyłane z programu do terminala. Na przykład włączenie flagi *olcuc* spowoduje, że wszystkie małe litery wysyłane do terminala zostaną przetłumaczone na wielkie. Na szczególną uwagę zasługuje flaga *onlcr*, która sprawia, że znaki **NL** tłumaczone są na sekwencję **NL** **CR**. W Linuxie jest ona domyślnie włączona i to właśnie z tego powodu wypisanie na konsolę ciągu znaków zakończonego znakiem ‘\\n’ (bez ‘\\r’) linii powoduje automatycznie przeskoczenie na początek nowej linii.

**NL** to znak nowej linii (ASCII 10, ‘\\n’), a **CR** to znak powrotu karetki (ASCII 13, ‘\\r’). Pierwszy z nich powoduje przeniesienie kursora do kolejnej linii z zachowaniem pozycji, a drugi przenosi kursor na początek linii. Wysłanie obu powoduje przeniesienie kursora na początek następnej linii.

##### Patrametry lokalne

Ostatnia linia flag to parametry lokalne określające zachowanie samej dyscypliny linii. Parametry te pozwalają na przykład włączyć lub wyłączyć wysyłanie sygnałów kombinacją klawiszy (*isig*), albo zablokować wypisywanie w konsoli wprowadzanych znaków (*echo*). Pozwalają też zdecydować, czy programy działające w tle powinny mieć możliwość pisania na konsolę (*tostop*) – opowiem o tym więcej w części poświęconej zarządzaniu sesją.

To tylko część z dostępnych opcji, ale mam nadzieję, że ten opis daje dobre wyobrażenie na temat tego, jaką rolę pełni dyscyplina linii. Z perspektywy użytkownika wiersza poleceń zmienianie większości z tych opcji spowoduje raczej trudności w używaniu konsoli i na ogół praktycznie nikt nie ma potrzeby tego robić. Jednak z punktu widzenia programisty możliwość kontrolowania zachowania terminala może być bardzo użyteczna. Postaram się to pokazać na kilku prostych przykładach.  

### Sterowanie dyscypliną linii

Wyobraźmy sobie program, który umożliwia użytkownikowi logowanie z użyciem loginu i hasła. W najprostszym wariancie można go zaimplementować na przykład tak:

```c
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

int main(int argc, char *argv[])
{
        const char u[] = "admin", p[] = "1234";
        char user[64], pass[64];
        int ret;

        printf("Uzytkownik: ");
        gets(user);
        printf("Haslo: ");
        gets(pass);

        if (strcmp(user, u) || strcmp(pass, p)) {
                printf("Niepoprawny login lub haslo!\n");
                exit(1);
        }

        printf("Zalogowano!\n");

        return 0;
}
```

A oto efekt jego działania:

```
robert@bezkompilatora:~$ ./program
Uzytkownik: admin
Haslo: 1234
Zalogowano!
```

Od razu widać podstawowy problem – podczas wpisywania hasła znaki wyświetlają się na ekranie. Biblioteki do tworzenia GUI dostarczają często specjalny rodzaj pola, w którym podczas wpisywania tekstu wyświetlane są gwiazdki. W terminalu nie mamy do dyspozycji niczego takiego. Na szczęście możemy skorzystać ze sztuczki.

#### Wyłączanie funkcji echo

Sam fakt, że na ekranie terminala natychmiast wyświetlane są wprowadzane znaki wynika z konkretnych ustawień dyscypliny linii. Warstwa TTY automatycznie odsyła do urządzenia terminala te same znaki, które od niego otrzymała, kiedy włączona jest funkcja echo. Możemy zmienić to zachowanie modyfikując odpowiednie flagi.

##### Funkcje **tcgetattr()** i **tcsetattr()**

Jak wspominałem wcześniej, do zmiany ustawień dyscypliny linii służą dwie funkcje – **int tcgetattr(int** *fd***, struct termios \****termios\_p***)** i **int tcsetattr(int** *fd***, int** *optional\_actions***, const struct termios \****termios\_p***)**. Pierwsza z nich pobiera aktualne ustawienia terminala, natomiast druga pozwala na zmianę tych ustawień.

Obie jako pierwszy argument przyjmują deskryptor pliku urządzenia terminala, a jako ostatni wskaźnik do struktury **struct termios** zawierającej opis ustawień. Funkcja **tcsetattr()** przyjmuje jeszcze argument *optional\_actions*, który w tym momencie nas nie interesuje. Możemy tam bezpiecznie użyć wartości 0.

Plik urządzenia terminala mamy zazwyczaj dostępny pod deskryptorami wejścia i wyjścia standardowego, więc do parametru *fd* możemy również podać wartość 0 (o ile wejście standardowe nie zostało przekierowane).

Typowy scenariusz zmiany konfiguracji wymaga użycia obu tych funkcji i wygląda następująco:

1.  Odczytanie konfiguracji z użyciem funkcji **tcgetattr()**.
2.  Zmiana wartości wybranych parametrów.
3.  Zapisanie konfiguracji z użyciem funkcji **tcsetattr()**.

##### Struktura **struct termios**

Zawartość struktury **struct termios** przedstawia się tak:

```c
struct termios {
        tcflag_t c_iflag; // parametry wejściowe
        tcflag_t c_oflag; // parametry wyjściowe
        tcflag_t c_cflag; // parametry kontrolne (portu szeregowego)
        tcflag_t c_lflag; // parametry lokalne
        cc_t c_cc[NCCS];  // tablica znaków specjalnych
        speed_t c_ispeed; // prędkość odbierania danych
        speed_t c_ospeed; // prędkość wysyłania danych
};
```

Do złudzenia przypomina to wynik działania komendy stty -a. Nic w tym dziwnego, ponieważ wypisywane z niej wartości pochodzą właśnie z tej struktury. Interesować nas będzie przede wszystkim pole **c\_lflag** opisujące parametry lokalne. Zawiera ono flagę **ECHO** odpowiadającą za włączanie funkcji echo. Kiedy ją wyłączymy, wpisywane znaki przestaną pojawiać się na ekranie.

##### Przykładowy program

Mając tą wiedzę możemy zmodyfikować nasz program:

```c
#include <termios.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <stdbool.h>

void toggle_echo(bool enable)
{
        struct termios t;

        if (tcgetattr(0, &amp;t))
                exit(1);

        if (enable)
                t.c_lflag |= ECHO;
        else
                t.c_lflag &amp;= ~ECHO;

        if (tcsetattr(0, 0, &amp;t))
                exit(1);
}

int main(int argc, char *argv[])
{
        const char u[] = "admin", p[] = "1234";
        char user[64], pass[64];
        int ret;

        printf("Uzytkownik: ");
        gets(user);

        printf("Haslo: ");
        toggle_echo(false);
        gets(pass);
        toggle_echo(true);

        if (strcmp(user, u) || strcmp(pass, p)) {
                printf("Niepoprawny login lub haslo!\n");
                exit(1);
        }

        printf("Zalogowano!\n");

        return 0;
}
```

Funkcja **toggle\_echo()** odpowiedzialna jest za włączanie i wyłączanie echa. Wykonuje ona prostą operację bitową – ustawia lub zeruje flagę **ECHO** w zależności od wartości parametru *enable*. Funkcja użyta jest w kodzie dwa razy – do wyłączenia echa przed odczytaniem hasła i do jego późniejszego przywrócenia. Myślę, że nie wymaga to większych wyjaśnień.

Tym razem wynik działania programu będzie wyglądał tak:

```
robert@bezkompilatora:~$ ./program
Uzytkownik: admin
Haslo:
Zalogowano!
```

Hasło nie zostało wyświetlone, a więc osiągnęliśmy zamierzony efekt. Nie jest to jednak najlepsze możliwe rozwiązanie. Implementacja ta posiada jednak przynajmniej dwie wady.

Po pierwsze nie jesteśmy pewni, czy wciśnięcie klawisza **Enter** po wpisaniu hasła spowoduje wysłanie do terminala znaku nowej linii. Zależy to od ustawień flagi **ECHONL**. Jeżeli jest wyłączona, efekt działania programu będzie wyglądał nieco mniej estetycznie:

```
robert@bezkompilatora:~$ ./program
Uzytkownik: admin
Haslo: Zalogowano!
```

Po drugie nie wiemy jakie dokładnie flagi były ustawione zanim dokonaliśmy zmian. W związku z tym założenie, że powinniśmy przywrócić ustawianą przez nas flagę po odczytaniu hasła nie zawsze będzie poprawne. Mogła mieć ona wartość zero przed naszymi zmianami.

O ile w przypadku ustawienia flagi **ECHO** możemy być prawie pewni, to z flagą **ECHONL** bywa już różnie. Dlatego powinniśmy starać się przywrócić dokładnie ustawienia sprzed naszych zmian. Możemy to łatwo zrobić zapamiętując stare ustawienia.

Oto nowa wersja programu rozwiązująca oba powyższe problemy:

```c
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <stdbool.h>

void disable_echo(struct termios *old)
{
        struct termios new;

        if (tcgetattr(0, old))
                exit(1);

        memcpy(&amp;new, old, sizeof(struct termios));

        new.c_lflag &amp;= ~ECHO;
        new.c_lflag |= ECHONL;

        if (tcsetattr(0, 0, &amp;new))
                exit(1);
}

void restore_echo(struct termios *old)
{
        if (tcsetattr(0, 0, old))
                exit(1);
}

int main(int argc, char *argv[])
{
        const char u[] = "admin", p[] = "1234";
        char user[64], pass[64];
        struct termios old;
        int ret;

        printf("Uzytkownik: ");
        gets(user);

        printf("Haslo: ");
        disable_echo(&amp;old);
        gets(pass);
        restore_echo(&amp;old);

        if (strcmp(user, u) || strcmp(pass, p)) {
                printf("Niepoprawny login lub haslo!\n");
                exit(1);
        }

        printf("Zalogowano!\n");

        return 0;
}
```

Funkcja **disable\_echo()** odpowiada za zmianę ustawień oraz zapamiętanie poprzedniej konfiguracji. Oprócz zerowania flagi **ECHO** ustawia teraz też flagę **ECHONL**, żeby uniknąć problemu z brakiem nowej linii. Funkcja **restore\_echo()** przywraca poprzednio zapamiętany stan. Z takiej implementacji możemy już być zadowoleni.

#### Tryb niekanoniczny

Wiedząc w jaki sposób zmieniać i przywracać ustawienia dyscypliny linii możemy się pokusić o zrobienie czegoś ciekawszego – obsługę terminala w trybie niekanonicznym. W tym trybie obsługa wejścia jest nieco bardziej skomplikowana, ale za to możemy uzyskać większą kontrolę nad interakcją z terminalem.

W trybie niekanonicznym możemy odczytać każdy znak wpisany przez użytkownika zaraz po jego wprowadzeniu. Musimy za to o niektóre sprawy zadbać samodzielnie. Należy do nich na przykład obsługa klawisza **Backspace**.

Wykorzystamy możliwości tego trybu do zaimplementowania własnego mechanizmu wczytywania hasła – z wypisywaniem gwiazdek w miejscu wprowadzanych znaków.  

Na początek stwórzmy funkcje wyłączające i przywracające tryb kanoniczny:

```c
void disable_icanon(struct termios *old)
{
        struct termios new;

        if (tcgetattr(0, old))
                exit(1);

        memcpy(&amp;new, old, sizeof(struct termios));

        new.c_lflag &amp;= ~(ICANON | ECHO | ECHONL);
        new.c_cc[VTIME] = 0;
        new.c_cc[VMIN] = 1;

        if (tcsetattr(0, 0, &amp;new))
                exit(1);
}

void restore_icanon(struct termios *old)
{
        if (tcsetattr(0, 0, old))
                exit(1);
}
```

Funkcja wygląda znajomo, zmieniły się tylko ustawiane parametry. W polu **c\_lflag** zerujemy tym razem trzy flagi: poznane wcześniej **ECHO** i **ECHONL** odpowiedzialne za funkcję echo, oraz **ICANON** włączającą tryb kanoniczny.

Dodatkowo ustawiamy zmienną **VTIME** na wartość zero, co oznacza nieograniczony czas oczekiwania na nowe znaki oraz **VMIN** na wartość 1. Dzięki temu funkcja **read()** będzie wracać za każdym razem, gdy w buforze wejściowym znajdzie się przynajmniej jeden znak.

Spróbujmy więc napisać prostą funkcję pobierającą wpisywane hasło. Będziemy je wczytywać znak po znaku do bufora. Wczytywanie powinno zakończyć się w momencie nadejścia znaku nowej linii lub zapełnienia bufora. Oto przykładowy kod:

```c
void get_pass(char *pass)
{
        struct termios old;
        int ret, i;
        char c;

        disable_icanon(&amp;old);

        for (i = 0; i &lt; 63;) {
                ret = read(0, &amp;c, 1);
                if (ret &lt; 0)
                        break;
                if (c == '\n')
                        break;
                pass[i++] = c;
        }

        pass[i] = '\0'; 

        restore_icanon(&amp;old);
}
```

Wygląda to dosyć prosto. Jedyne o czym musimy pamiętać, to umieszczenie null-terminatora na końcu ciągu znaków. Implementacja ta zadziała w prostym scenariuszu, jednak ma ona jeszcze kilka istotnych braków.

Po pierwsze nie mamy zaimplementowanej obsługi klawisza **Backspace**, więc użytkownik nie może poprawić błędu. Co gorsza wszystkie znaki **Backspace** (**DEL**, ASCII 127) trafią do bufora z hasłem, co zdecydowanie nie jest pożądanym zachowaniem.

Po drugie ze względu na wyzerowanie flagi **ECHONL** musimy sami zadbać o wysłanie do terminala znaku nowej linii po zakończeniu wczytywania hasła.

Oba problemy możemy naprawić w następujący sposób:

```c
void get_pass(char *pass)
{
        struct termios old;
        int ret, i;
        char c;

        disable_icanon(&amp;old);

        for (i = 0; i &lt; 63;) {
                ret = read(0, &amp;c, 1);
                if (ret &lt; 0)
                        break;
                if (c == '\n') {
                        write(1, "\n", 1);
                        break;
                }
                if (c == 127) {
                        if (i &gt; 0)
                                i--;
                        continue;
                }
                pass[i++] = c;
        }

        pass[i] = '\0'; 

        restore_icanon(&amp;old);
}
```

Tym razem w odpowiedzi na otrzymanie znaku nowej linii wypisujemy go na wyjście standardowe. Obsługa klawisza **Backspace**, któremu odpowiada znak specjalny **DEL** o kodzie 127, ogranicza się do cofnięcia się o jedną pozycję w buforze, do którego wczytujemy znaki. Brakuje nam już tylko wypisywania gwiazdek.

Samo wypisywanie gwiazdek jest bardzo proste, jednak żeby poprawnie obsłużyć usunięcie gwiazdki podczas wciśnięcia klawisza **Backspace** trzeba będzie poznać jeszcze odrobinę terminalowej magii. Usuwanie znaków jakie znamy trybu kanonicznego, wchodzi w interakcję z terminalem z dosyć nieintuicyjny sposób.

Cały sekret tkwi w tym, że wysłanie znaku **Backspace** (ASCII 8, ‘\\b’) do terminala nie powoduje automatycznie usunięcia znaku. Oznacza to jedynie przesunięcie kursora o jedną pozycję w lewo. Aby skutecznie “usunąć” znak możemy jednak posłużyć się pewną sztuczką.

Polega ona na wysłaniu do terminala sekwencji znaków “\\b \\b”. Pierwszy **Backspace** przesuwa kursor o jedną pozycję wstecz, następnie wypisywana jest spacja, która wymazuje znajdujący się na danej pozycji znak jednocześnie przesuwając kursor o jedną pozycję do przodu, a na koniec drugi **Backspace** znów cofa kursor o jedną pozycję.

Nasza funkcja będzie więc teraz wyglądać następująco:

```c
void get_pass(char *pass)
{
        struct termios old;
        int ret, i;
        char c;

        disable_icanon(&amp;old);

        for (i = 0; i &lt; 63;) {
                ret = read(0, &amp;c, 1);
                if (ret &lt; 0)
                        break;
                if (c == '\n') {
                        write(1, "\n", 1);
                        break;
                }
                if (c == 127) {
                        if (i &gt; 0) {
                                write(1, "\b \b", 3);
                                i--;
                        }
                        continue;
                }
                pass[i++] = c;
                write(1, "*", 1);
        }

        pass[i] = '\0'; 

        restore_icanon(&amp;old);
}
```

Pozostało tylko odpowiednio zmodyfikować funkcję **main()**. Wiąże się to z użyciem jeszcze jednej funkcji, o której opowiem za chwilę. Spójrzmy na kod:

```c
int main(int argc, char *argv[])
{
        const char u[] = "admin", p[] = "1234";
        char user[64], pass[64];
        int ret;

        printf("Uzytkownik: ");
        gets(user);

        printf("Haslo: ");
        fflush(stdout);
        get_pass(pass);

        if (strcmp(user, u) || strcmp(pass, p)) {
                printf("Niepoprawny login lub haslo!\n");
                exit(1);
        }

        printf("Zalogowano!\n");

        return 0;
}
```

Do wczytywania hasła używamy teraz stworzonej przez nas funkcji **get\_pass()**. Oprócz tego pojawiło się jeszcze wywołanie funkcji **fflush()** z parametrem **stdout**. Powoduje ono wysłanie do terminala znaków znajdujących się w buforze wyjściowym.

Standardowo znaki wysyłane są w momencie wypisania znaku nowej linii lub podczas wywołania niektórych funkcji, na przykład **gets()**. Ciąg znaków Haslo: “ nie zawiera znaku nowej linii, a zaraz po nim nie występuje żadne wywołanie wysyłające bufor wyjściowy, musimy więc ręcznie wymusić wysłanie znaków do terminala z użyciem funkcji **fflush()**, zanim zaczniemy odczytywać wprowadzane hasło.

W zasadzie ciąg znaków “Uzytkownik: ” również nie jest wysyłany do terminala od razu po wywołaniu funkcji **printf()**, ale zaraz po niej występuje wywołanie funkcji **gets()**, które przed odczytaniem znaków wysyła bufor wyjściowy. W ramach ćwiczeń proponuję dodać wywołanie **sleep(2);** pomiędzy wywołaniami **printf()** i **gets()** i obserwować efekty. 🙂

### Podsumowanie

Mam nadzieję, że udało mi się dziś w miarę prosto wyjaśnić działanie dyscypliny linii. Jak mogliśmy się przekonać, część jej funkcjonalności da się z powodzeniem zaimplementować w samym programie. Są jednak dobre powody, dla których znajduje się ona w jądrze.

Obsługa dyscypliny linii w jądrze pozwala między innymi na obsługę specjalnych kombinacji klawiszy, służących do wysyłania sygnałów. Są one dostarczane do procesu niezależnie od tego, czy aktualnie oczekuje on na dane z terminala, czy też nie. Wysyłanie sygnałów ma jednak miejsce jedynie wtedy, gdy sesja posiada terminal kontrolujący (co nie zawsze musi być prawdą). Więcej na ten temat opowiem w kolejnej części wpisu.

• • •

Dziękuję Ci za bycie czytelnikiem bloga Bez Kompilatora! Jeżeli masz jakieś pytania lub uwagi – proszę napisz komentarz. Jeżeli chcesz dostawać informacje o nowych wpisach, polub moją [stronę na Facebooku](https://www.facebook.com/BezKompilatora/) i/lub zapisz się na [newsletter](/newsletter/). Bez obaw, nie używam tych kanałów do rozsyłania SPAMu. U mnie są tylko ciekawe i wartościowe treści.

Dziękuję za wszelką aktywność i do zobaczenia! 🙂
