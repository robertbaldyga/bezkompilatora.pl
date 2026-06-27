---
title: "Przekierowania i potoki okiem programisty"
date: 2018-07-30
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["potoki", "przekierowania", "deskryptory plików", "bash", "Linux"]
image: "/images/uploads/2018/07/stream-waterfall.jpg"
summary: "Programy komputerowe mogą robić najróżniejsze rzeczy. Każdy z nich jest inny i został stworzony w jakimś konkretnym celu. Wszystkie one mają jednak wspólną cechę – w taki lub inny sposób przetwarzają dane. Te dane mogą pochodzić z różnych…"
---

Programy komputerowe mogą robić najróżniejsze rzeczy. Każdy z nich jest inny i został stworzony w jakimś konkretnym celu. Wszystkie one mają jednak wspólną cechę – w taki lub inny sposób przetwarzają dane. Te dane mogą pochodzić z różnych źródeł – mogą być wprowadzane przez użytkownika, odczytywane z dysku lub pobierane z internetu. Istnieje w tej kwestii pełna dowolność.

Z drugiej strony istnieją w tej kwestii pewne konwencje, które mogą dać użytkownikom programów dodatkowe możliwości. Pod Linuxem te możliwości są całkiem spore i przyczyniają się w dużym stopniu do tego, że Linuxowy wiersz poleceń cieszy się opinią bardzo potężnego narzędzia. I właśnie o możliwościach zarządzania wejściem i wyjściem programów pod Linuxem będzie dzisiejszy wpis.

### Deskryptory plików

Pod Linuxem każdy otwarty plik (i nie tylko plik) identyfikowany jest pojedynczym numerem unikalnym w ramach danego procesu. Nazywamy go deskryptorem pliku (ang. file descriptor). Deskryptor pliku przydzielany jest dynamicznie w momencie otwierania pliku i używany podczas każdej operacji na nim, aż do jego zamknięcia. Po zamknięciu pliku, numer deskryptora zostaje zwolniony i może być on użyty ponownie podczas otwarcia innego pliku.

Deskryptor pliku może reprezentować, oprócz zwykłych plików na dysku, także pliki specjalne urządzeń, sockety, potoki, katalogi i wiele innych wirtualnych bytów, takich jak np. *signalfd*, służący do synchronicznej obsługi sygnałów. Znaczna część Linuxowych wywołań systemowych przyjmuje jako argument właśnie deskryptor pliku – daje to pewne wyobrażenie o tym jak istotną rolę pełnią deskryptory plików w tym systemie.

Proces może uzyskać nowy deskryptor pliku na dwa sposoby – może albo utworzyć go samemu, korzystając z wywołań systemowych takich jak **open()**, **creat()**, **socket()**, **pipe()** itd., albo może odziedziczyć go po procesie-rodzicu. Podczas wywołania systemowego **fork()**, tablica deskryptorów plików rodzica jest w całości kopiowana do nowo utworzonego procesu. W efekcie oba procesy mają otwarte te same pliki pod tymi samymi numerami deskryptorów, jednak zamknięcie pliku w jednym z procesów nie oznacza jego zamknięcia w drugim – oba procesy mają otwarte wszystkie pliki niezależnie.

Listę deskryptorów plików otwartych przez dany proces możemy znaleźć w *procfs*. Standardowo informacje te znajdują się w katalogu */proc/\_PID\_/fd/*, gdzie \_PID\_ to numer PID danego procesu. Katalog ten zawiera pliki o nazwach takich jak numery deskryptorów, będące linkami symbolicznymi do właściwych plików. Aby to lepiej zobrazować przeprowadźmy eksperyment.

Najpierw utwórzmy nowy plik poleceniem **touch** i otwórzmy go z użyciem programu **less**:

```
robert@bezkompilatora:~$ touch plik
robert@bezkompilatora:~$ less plik
```

Program **less** wyświetli zawartość pliku (pustą treść) i będzie czekał na reakcję ze strony użytkownika – np. zamknięcie go przy użyciu klawisza **q**. W tym momencie przenieśmy program w tło używając kombinacji **Ctrl+Z**, znajdźmy jego PID i wyświetlmy zawartość wspomnianego katalogu w *procfs*:

```
robert@bezkompilatora:~$ ps
 PID TTY          TIME CMD
1873 pts/1    00:00:00 bash
1988 pts/1    00:00:00 less
2045 pts/1    00:00:00 ps
robert@bezkompilatora:~$ ls -l /proc/1988/fd/
total 0
lrwx------ 1 robert robert 64 Jul 25 18:27 0 -> /dev/pts/1
lrwx------ 1 robert robert 64 Jul 25 18:27 1 -> /dev/pts/1
lrwx------ 1 robert robert 64 Jul 25 18:27 2 -> /dev/pts/1
lr-x------ 1 robert robert 64 Jul 25 18:27 3 -> /dev/tty
lr-x------ 1 robert robert 64 Jul 25 18:27 4 -> /home/robert/plik
```

Jak widzimy program **less** posiada aż pięć otwartych deskryptorów plików. Wśród nich znajduje się jeden wskazujący na nasz plik – zgodnie z oczekiwaniami. Nieco zagadkowo mogą wyglądać deskryptory 0, 1 i 2, które wskazują na dokładnie ten sam plik. Deskryptory te pełnią szczególną rolę i za chwilę przyjrzymy się im bliżej.

### Wejście i wyjście standardowe

Deskryptory plików używane są podczas typowej komunikacji z programem i nawet tak prosty program jak “Hello World!” z nich korzysta, chociaż na pierwszy rzut oka tego nie widać. Wszystko za sprawą tego, że użycie deskryptorów zaszyte jest w bibliotece standardowej języka C. Czasem więc nawet nie zdajemy sobie sprawy z tego, że wywołując daną funkcję robimy tak naprawdę zapis lub odczyt z pliku. Mamy wtedy jednak na ogół do czynienia ze szczególnym rodzajem deskryptorów plików – wejściem i wyjściem standardowym programu.

Każdy program już w momencie startu ma otwarte trzy deskryptory – wejście standardowe (ang. standard input), wyjście standardowe (ang. standard output) oraz wyjście błędów (ang. standard error). Nazywane są one skrótowo **stdin**, **stdout** i **stderr** i mają zawsze te same numery – 0, 1 i 2. To właśnie na nie zwróciliśmy uwagę podczas poprzedniego eksperymentu.

Zazwyczaj gdy uruchamiamy program z poziomu powłoki tekstowej, to zarówno wejście jak i wyjście tego programu jest “przypięte” do tej powłoki i w efekcie możemy się z tym programem komunikować wpisując dane z klawiatury i odczytując komunikaty wypisywane na ekran. Tłumaczy to dlaczego wszystkie trzy deskryptory wskazują na ten sam plik – jest to plik specjalny urządzenia terminala, w którym uruchomiona jest powłoka.

Z deskryptorów plików wejścia i wyjścia standardowego możemy korzystać tak samo jak z każdego innego pliku. Możemy na przykład napisać następujący program, wpisujący ciąg znaków do pliku wyjścia standardowego:

```c
#include <unistd.h>

int main(int argc, char *argv[])
{
    write(1, "Hello world!\n", 13);
    return 0;
}
```

Funkcja **write()** służy do zapisywania danych do pliku. Przyjmuje ona trzy argumenty: deskryptor pliku (w naszym wypadku jest to 1, czyli wyjście standardowe), wskaźnik na bufor i liczba bajtów do zapisania. Po skompilowaniu i uruchomieniu na ekranie zobaczymy komunikat “Hello world!”. Jak widać zapisanie danych do deskryptora pliku wyjścia standardowego spowodowało ich wypisanie w konsoli.

Tak jak pisałem wcześniej, wejście i wyjście standardowe programu uruchamianego w powłoce jest standardowo przekierowywane urządzenie terminala, w którym działa ta powłoka. W przypadku emulatora terminala będzie to plik specjalny urządzenia pseudo-terminala znajdujący się w katalogu */dev/pts/*. Jednak nie zawsze musi tak być – Linux pozwala na przekierowywanie zarówno wejścia jaki i wyjścia programu do innych plików. I to na wiele sposobów.

### Przekierowanie z i do pliku

Najprostszym sposobem na “podmianę” pliku pełniącego rolę standardowego wejścia lub wyjścia programu jest przekierowanie (ang. redirection). Użycie przekierowania powoduje, że uruchomiony program będzie miał pod wybranym deskryptorem pliku otwarty nie plik specjalny urządzenia terminala, ale dowolny inny plik. Może to być nawet plik specjalny urządzenia innego terminala, ale zazwyczaj będzie to po prostu zwykły plik na dysku.

Do przekierowania wyjścia standardowego programu do pliku służy operator  **\>**, np. program > plik. Ponieważ wyjścia standardowe są dwa (stdout i stderr) potrzebujemy mieć możliwość określenia, które z nich powinno być przekierowane. Możemy to zrobić podając numer deskryptora wyjścia przed symbolem **\>**. Na przykład żeby przekierować wyjście błędów programu, możemy użyć składni program 2> plik. Jeżeli nie podamy numeru wyjścia, to domyślnie przekierowywany jest stdout, czyli wyjście numer 1.

Aby przekierować oba wyjścia do osobnych plików możemy użyć polecenia program > plik1 2> plik2. W podobny sposób możemy zrealizować przekierowanie obu wyjść do tego samego pliku, ale możemy to też zrobić w skróconej postaci program &> plik.

Tego typu przekierowania nadpisują zawartość pliku. Jeżeli jednak chcemy, żeby wyjście z programu było dopisane na końcu istniejącego pliku bez kasowania jego zawartości, możemy zamiast **\>** użyć przekierowania **\>>**, np. program >> plik. Ten sposób jest często używany do tworzenia logów z poziomu skryptu.

Aby przekierować plik na wejście programu, możemy użyć operatora **\<**. Przykładowo może to wyglądać tak program < plik. W takim wypadku użycie w programie takich funkcji jak **scanf()**, będzie powodowało odczytaniem danych z pliku wskazanego podczas przekierowania.

### Jak działają przekierowania?

Zasada działania przekierowań jest dość prosta. Jeżeli w uruchamianej komendzie występują przekierowania, to powłoka po wykonaniu wywołania systemowego **clone()**, tworzącego nowy proces, nie ładuje od razu nowego programu wywołaniem **exec()**. Zamiast tego otwiera najpierw pliki wskazywane przez przekierowania, ustawia je jako wejście lub wyjście standardowe nowego procesu wywołaniem **dup2()**, a dopiero potem ładuje nowy program. Dzięki temu deskryptory wejścia i wyjścia standardowego uruchamianego programu od razu wskazują na pliki, do których mają być przekierowane.

Zachowanie to możemy przetestować w praktyce przeprowadzając prosty eksperyment, składający się z następujących kroków:

1.  Uruchamiamy program przekierowując jego wyjścia i wejścia standardowe do plików.
2.  Przełączymy go w tło kombinacją klawiszy **Ctrl+Z**.
3.  Listujemy deskryptory plików otwartych przez proces w *procfs*.

Dla zachowania prostoty posłużymy się programem **sleep**:

```
robert@bezkompilatora:~$ sleep 10 < plik1 > plik2 2> plik3
^Z
[1]+  Stopped                 sleep 10 < plik1 > plik2 2> plik3
robert@bezkompilatora:~$ ps
 PID TTY          TIME CMD
3250 pts/0    00:00:00 bash
3270 pts/0    00:00:00 sleep
3282 pts/0    00:00:00 ps
robert@bezkompilatora:~$ ls -l /proc/3270/fd/
total 0
lr-x------ 1 robert robert 64 Jul 26 21:24 0 -> /home/robert/plik1
l-wx------ 1 robert robert 64 Jul 26 21:24 1 -> /home/robert/plik2
l-wx------ 1 robert robert 64 Jul 26 21:24 2 -> /home/robert/plik3
```

Program **sleep** nie wykonuje żadnych operacji wejścia i wyjścia, jednak tak jak każdy program posiada wejście i wyjście standardowe, które możemy przekierować. Jak widać na przykładzie, deskryptory 0, 1 i 2 wskazują na pliki, których użyliśmy do przekierowań – czyli wszystko poszło zgodnie z planem.

Przekierowania są bardzo przydatne, kiedy chcemy zapisać do pliku komunikaty wypisywane przez program lub zautomatyzować wprowadzanie danych do programu oczekującego ich na standardowym wejściu. Ich zaletą jest prostota, jednak posiadają one ograniczenia – mogą pisać dane wyłącznie do pliku. W Linuxie, systemie w którym *wszystko jest plikiem*, oznacza to całkiem duże możliwości. Nie daje nam jednak prostego sposobu na zrobienie jednej rzeczy – połączenia ze sobą wyjścia i wejścia standardowego dwóch procesów. Na szczęście w Linuxie istnieje narzędzie, który to umożliwia – są to tzw. potoki.

### Potok – interfejs między programami

Potok (ang. pipe) to mechanizm pozwalający na połączenie ze sobą stdout jednego programu z stdin innego. Przydaje się on, kiedy chcemy przetwarzać dane w taki sposób, że wynik działania jednego programu jest później podawany jako wejście kolejnego. Możemy co prawda przekierowywać ich wyjścia i wejścia do i z kolejnych plików, ale jest to po pierwsze niewygodne, a po drugie może być niewydajne. Takie działanie wymusza kilkukrotny zapis i odczyt plików z dysku, co może być problematyczne w przypadku dużych ilości danych.

Osobom, które nie pracowały wcześniej zbyt dużo z Linuxowym wierszem poleceń, może się wydawać, że takie potokowe przetwarzanie danych dotyczy jakichś bardzo rzadkich i osobliwych przypadków. Przychodzą na myśl takie zastosowania jak przetwarzanie dźwięku czy obrazów. Linuxowa rzeczywistość jest jednak inna – tego typu technik używa się podczas codziennej pracy z systemem. Przekonamy się o tym za chwilę.

Utworzenie potoku jest bardzo łatwe – służy do tego operator **|**. Używamy go w następujący sposób: prog1 | prog2. Efektem działania takiej komendy będzie uruchomienie obu programów jednocześnie i przekierowanie wyjścia standardowego **prog1** na wejście standardowe **prog2**. W podobny sposób możemy połączyć większą ilość programów, tworząc układ procesów o wyjściach i wejściach połączonych potokami, np. prog1 | prog2 | prog3. Cały “łańcuszek” programów połączonych w ten sposób również nazywa się potokiem, jednak z technicznego punktu widzenia każde użycie operatora **|** tworzy osobny potok.

Potoków w wierszu poleceń używa się często do przetwarzania plików tekstowych. Linux dostarcza bardzo dużą ilość programów przystosowanych do pracy z potokiem. Programy takie jak **cat** – służący do wyświetlana plików, **grep** – służący do wyszukiwania wzorców, czy **sed** – umożliwiający dynamiczne przetwarzanie ich zawartości, są bardzo często wykorzystywane w potokach.

Żeby nie zostawać przy samej teorii, posłużę się przykładem przykładem. Wyobraź sobie, że mamy plik o takiej zawartości:

```
robert@bezkompilatora:~$ cat plik
baa
aac
ddd
bbd
dab
aaa
```

Załóżmy, że chcemy posortować poszczególne linie w porządku alfabetycznym. Służy do tego program **sort**, który oczekuje danych do sortowania na jego wejściu standardowym. Możemy mu je przekazać przy użyciu przekierowania:

```
robert@bezkompilatora:~$ sort < plik
aaa
aac
baa
bbd
dab
ddd
```

Ale możemy też posłużyć się potokiem, przekierowując na wejście standardowe programu **sort** wyjście standardowe programu **cat**:

```
robert@bezkompilatora:~$ cat plik | sort
aaa
aac
baa
bbd
dab
ddd
```

Czym to się różni od przekierowania? Na przykład tym, że możemy łatwo dołożyć do potoku kolejny program i w posortowanej treści wyszukać tylko te linie, które spełniają określone kryterium. Na przykład takie, które zawierają ciąg znaków “aa”:

```
robert@bezkompilatora:~$ cat plik | sort | grep aa
aaa
aac
baa
```

Programów, które możemy użyć w potoku jest cała masa, a dodatkowo bardzo łatwo możemy stworzyć swój własny, stworzony do pracy z potokiem. O tym jak to zrobić napiszę w dalszej części wpisu. Tymczasem przyjrzyjmy się jeszcze przez chwilę mechanizmom, jakie stoją za działaniem potoku.

### Jak działa potok?

Zasada działania potoków jest bardzo interesująca. Podobnie jak w przypadku przekierowania, powłoka najpierw przygotowuje deskryptory plików, które następnie ustawia jako wyjścia i wejścia standardowe uruchamianych programów. Deskryptory te tworzone są jednak nie przez otwarcie plików wywołaniem systemowym **open()**, ale z użyciem specjalnego wywołania **pipe()**. Powoduje ono otwarcie jednocześnie dwóch deskryptorów plików, które stanowią dwa końce potoku – dane zapisane do jednego z nich mogą być odczytane z drugiego.

Pliki wskazywane przez te deskryptory tworzone są dynamicznie w *pipefs* – wirtualnym systemie plików, który różni się od pozostałych. Nie może on być zamontowany w głównym drzewie katalogów, z związku z czym nie ma możliwości podejrzenia jego zawartości. Jest on jednak dostępny przez cały czas działania systemu, więc technicznie rzecz biorąc stanowi on drugi, niejawny korzeń drzewa plików (roofs).

Aby przetestować działanie potoku przeprowadźmy eksperyment. Połączmy w potok dwie instancje programu **sleep**, przełączmy je w tło i zobaczmy listę otwartych przez nie deskryptorów plików:

```
robert@bezkompilatora:~$ sleep 10 | sleep 10
^Z
[1]+  Stopped                 sleep 10 | sleep 10
robert@bezkompilatora:~$ ps
 PID TTY          TIME CMD
3250 pts/0    00:00:00 bash
3291 pts/0    00:00:00 sleep
3292 pts/0    00:00:00 sleep
3293 pts/0    00:00:00 ps
robert@bezkompilatora:~$ ls -l /proc/3291/fd/
total 0
lrwx------ 1 robert robert 64 Jul 26 21:32 0 -> /dev/pts/0
l-wx------ 1 robert robert 64 Jul 26 21:32 1 -> 'pipe:[34968]'
lrwx------ 1 robert robert 64 Jul 26 21:32 2 -> /dev/pts/0
robert@bezkompilatora:~$ ls -l /proc/3292/fd/
total 0
lr-x------ 1 robert robert 64 Jul 26 21:32 0 -> 'pipe:[34968]'
lrwx------ 1 robert robert 64 Jul 26 21:32 1 -> /dev/pts/0
lrwx------ 1 robert robert 64 Jul 26 21:32 2 -> /dev/pts/0
```

Od razu możemy zauważyć dwie rzeczy. Po pierwsze, obie instancje programu **sleep** zostały uruchomione jednocześnie. Podobną rzecz możemy zaobserwować również w przypadku dłuższego “łańcuszka” programów połączonych potokiem. Po drugie, stdout pierwszego programu i stdin drugiego wskazują na tą samą ścieżkę – *’pipe:\[34968\]’* – która wygląda dość osobliwie. W rzeczywistości nie jest to zwykła ścieżka – w taki sposób oznaczane są właśnie pliki znajdujące się w *pipefs*.

Para plików potoku działa na podobnej zasadzie jak kolejka FIFO – dane można odczytać tylko w takiej kolejności, w jakiej były one zapisane. Sam potok jest w rzeczywistości buforem w pamięci, a jego rozmiar wynosi dokładnie 64kB. Oznacza to, że jeżeli proces piszący do potoku chce zapisać więcej danych i zrobi zanim proces czytający zdąży je odebrać, to operacja zapisu zostanie zablokowana aż do momentu, kiedy dane zostaną odczytane. Ma to często miejsce w przypadku, gdy proces piszący do potoku wysyła dane szybciej, niż proces odbierający jest w stanie je przetworzyć.

### Przekierowania i potoki z perspektywy programisty

Przekierowania i potoki nie potrzebują specjalnego wsparcia ze strony programu. Korzystają one z mechanizmów systemu operacyjnego i da się ich użyć z każdym programem. Nie zawsze ma to sens, ponieważ niektóre programy praktycznie nie korzystają z wejścia i wyjścia standardowego, używając zamiast nich innych interfejsów – na przykład sieciowych. Niemniej jednak specjalna obsługa tych mechanizmów nie jest wymagana.

Z drugiej strony programista, chociaż nie musi, ma możliwość zareagowania na sytuację kiedy wejścia i wyjścia programu zostają przekierowane do pliku bądź włączone w potok. Może wtedy, na przykład, w inny sposób formatować wyjście programu lub w niestandardowy sposób zareagować na zamknięcie potoku..

Podstawowym sposobem na sprawdzenie, czy wyjścia programu zostały przekierowane, jest użycie wywołania systemowego **fstat()**. Przyjmuje ono dwa argumenty – deskryptor pliku oraz wskaźnik na strukturę **struct stat**, do której zostanie wpisana całkiem pokaźna ilość informacji na temat pliku wskazywanego przez deskryptor. Najbardziej interesujące będzie dla nas pole **st\_mode** zawierające informacje na temat uprawnień do pliku, a także – typu pliku.

Korzystając z informacji o typie pliku możemy łatwo zorientować się w sytuacji. Kiedy program jest uruchomiony bez przekierowań, deskryptory wejścia i wyjścia standardowego wskazują na plik specjalny urządzenia terminala – typem pliku jest wtedy urządzenie znakowe (ang. character device). W przypadku przekierowania do zwykłego pliku, typem będzie zwykły plik (ang. regular file), a w przypadku potoku – plik potoku (ang. pipe).

Bogaci w tą wiedzę możemy teraz napisać program, który wypisze na standardowe wyjście komunikat uzależniony od tego, gdzie przekierowany jest jego stdout:

```c
#include <stdio.h>
#include <sys/stat.h>
#include <sys/sysmacros.h>

int main(int argc, char *argv[])
{
        struct stat sb; 

        fstat(1, &sb);

        if (S_ISREG(sb.st_mode)) {
                printf("Zwykly plik\n");
        } else if (S_ISFIFO(sb.st_mode)) {
                printf("Potok\n");
        } else if (S_ISCHR(sb.st_mode)) {
                printf("Urzadzenie znakowe\n");
        }

        return 0;
}
```

Po zapisanie w pliku *program.c* i skompilowaniu uzyskamy następujący efekt:

```
robert@bezkompilatora:~$ gcc -o program program.c
robert@bezkompilatora:~$ ./program
Urzadzenie znakowe
robert@bezkompilatora:~$ ./program > plik
robert@bezkompilatora:~$ cat plik
Zwykly plik
robert@bezkompilatora:~$ ./program | cat
Potok
```

Wszystko zgodnie z oczekiwaniami.

W większości przypadków taka obsługa będzie zupełnie wystarczająca, ale warto zauważyć, że nie zawsze zadziała ona poprawnie. W przekierowaniu można wskazać nie tylko zwykły plik, ale także plik specjalny urządzenia znakowego innego niż terminal. Aby to wykryć, możemy posłużyć się funkcją **isatty()**:

```c
#include <stdio.h>
#include <sys/stat.h>
#include <sys/sysmacros.h>
#include <unistd.h>

int main(int argc, char *argv[])
{
        struct stat sb; 

        fstat(0, &sb);

        if (S_ISCHR(sb.st_mode)) {
                if (isatty(0)) {
                        printf("Terminal\n");
                } else {
                        printf("Inne urzadzenie znakowe\n");
                }   
        }   

        return 0;
}
```

Powyższy program sprawdza, czy stdin programu jest przekierowany na terminal, czy na inne urządzenie znakowe. Przykładowym innym urządzeniem znakowym może być */dev/zero* – plik specjalny urządzenia znakowego, który podczas odczytu zwraca zawsze bufor wypełniony zerami. Możemy więc zapisać nasz program w pliku *program2.c* i przeprowadzić eksperyment:

```
robert@bezkompilatora:~$ gcc -o program2 program2.c
robert@bezkompilatora:~$ ./program2
Terminal
robert@bezkompilatora:~$ ./program2 < /dev/zero
Inne urzadzenie znakowe
```

W przypadku przekierowań taki sposób obsługi powinien z powodzeniem wystarczyć. Nieco bardziej skomplikowana jest sytuacja w przypadku potoków – ma to związek z ich specyficznym działaniem.

##### Potoki

Dane w potoku są buforowane. Istnieje więc prawdopodobieństwo, że proces piszący do potoku zakończy swoje działanie zanim proces czytający zdąży odczytać dane. W takiej sytuacji potok będzie nadal działał poprawnie, aż do momentu odczytania z niego wszystkich danych. Później na próbie odczytu będzie zwracał EOF (End Of File) – znak kontrolny informujący o dotarciu do końca pliku. To zachowanie w większości przypadków nie powinno stwarzać problemów.

Problematyczna jest jednak sytuacja odwrotna, kiedy jako pierwszy zamykany jest proces czytający z potoku. Jeżeli drugi proces będzie nadal próbował pisać do potoku dane, otrzyma on sygnał SIGPIPE, a funkcja pisząca zwróci kod błędu -EPIPE. Jeżeli więc chcemy być gotowi na taką sytuację, powinniśmy zablokować sygnał SIGPIPE lub ustawić dla niego procedurę obsługi sygnału oraz poprawnie obsłużyć kod błędu -EPIPE.

### Potoki nazwane

Linux poza potokami nienazwanymi pozwala również na stworzenie potoków nazwanych (ang. named pipe), czyli takich, dla których istnieje plik reprezentujący potok. Do ich tworzenia służy komenda **mkfifo**. Przyjmuje ona jako argument nazwę, pod jaką ma być stworzony plik potoku. Jeśli, na przykład, przy pomocy komendy mkfifo potok1 stworzymy potok o nazwie *potok1*, a następnie wylistujemy zawartość katalogu komendą ls -l, zobaczymy coś takiego:

```
robert@bezkompilatora:~$ mkfifo potok1
robert@bezkompilatora:~$ ls -l
total 0
prw-rw-r-- 1 robert robert 0 Jul 28 11:19 potok1
```

Utworzony plik wygląda całkiem normalnie, z tą różnicą, że jego rozmiar wynosi zawsze 0 bajtów (nawet kiedy w potoku znajdują się nieodczytane dane), a jego typ oznaczony jest literą **p**. Jest to skrót od słowa pipe – możemy po tym poznać plik reprezentujący potok nazwany.

Używając potoku nazwanego w połączeniu z przekierowaniami możemy uzyskać efekt podobny jak w przypadku potoków nienazwanych – połączyć wyjście standardowe jednego programu z wejściem drugiego. Możemy jednak również otworzyć potok nazwany tak jak zwykły plik i użyć go do komunikacji między programami bez konieczności przekierowywania wejść i wyjść standardowych. Dzięki temu możemy zamodelować bardziej złożoną komunikację między programami niż tylko strumieniowy przepływ danych – na przykład komunikację dwukierunkową.

Ponieważ potok jest kanałem jednokierunkowym, do zaimplementowania komunikacji dwukierunkowej potrzebujemy stworzyć dwa osobne potoki. Dla zobrazowania sytuacji stwórzmy dwa proste programy, które będą będą wysyłać do siebie wzajemnie czterobajtowe komunikaty:

```c
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>

const char *msg[] = { "A_1", "A_2", "A_3" };

/* argv[] = { [program], [potok wejściowy], [potok wyjściowy] } */
int main(int argc, char *argv[])
{
        int pipe_in, pipe_out;
        char buf[4];
        int i;

        pipe_in = open(argv[1], O_RDONLY);
        pipe_out = open(argv[2], O_WRONLY);

        for (i = 0; i < 3; i++) {
                write(pipe_out, msg[i], 4);
                read(pipe_in, buf, 4);
                printf("%s: %s\n", argv[0], buf);
        }

        close(pipe_in);
        close(pipe_out);

        return 0;
}
```

```c
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>

const char *msg[] = { "B_1", "B_2", "B_3" };

/* argv[] = { [program], [potok wejściowy], [potok wyjściowy] } */
int main(int argc, char *argv[])
{
        int pipe_in, pipe_out;
        char buf[4];
        int i;

        pipe_out = open(argv[2], O_WRONLY);
        pipe_in = open(argv[1], O_RDONLY);

        for (i = 0; i < 3; i++) {
                write(pipe_out, msg[i], 4);
                read(pipe_in, buf, 4);
                printf("%s: %s\n", argv[0], buf);
        }

        close(pipe_in);
        close(pipe_out);

        return 0;
}
```

Oba programy są bardzo podobne. Na początku otwierają dwa pliki potoków nazwanych, których nazwy otrzymują jako argumenty, a następnie w pętli: wpisują komunikat do potoku wyjściowego, odczytują otrzymany komunikat z potoku wejściowego i wypisują go na ekran. Po zakończeniu pracy zamykają oba potoki i kończą działanie.

Programy te różnią się między sobą tylko dwiema rzeczami – zawartością wysyłanych komunikatów oraz kolejnością otwierania potoków. Różnica w zawartości komunikatów jest dość oczywista, natomiast kolejności otwierania plików reprezentujących potoki warto przyjrzeć się bliżej, ponieważ jest to bardzo istotny szczegół.

W przypadku potoków nazwanych możemy natrafić na problem, którego typowo nie spotykamy stosując potoki nienazwane – otwieranie potoku w jednym kierunku (do czytania bądź pisania) blokuje wykonanie programu do momentu otwarcia potoku w drugim kierunku. Jeśli więc oba programy próbowałyby najpierw otworzyć plik potoku, z którego mają zamiar czytać dane, to oba zostałyby zablokowane na tej operacji. W efekcie żaden z nich nie otworzyłby nigdy plików potoku w kierunku do zapisu i obydwa programy zawiesiłyby się na dobre.

Do przetestowanie tych programów potrzebne będą otwarte dwie sesje terminala (np. dwie instancje emulatora terminala). Korzystając z jednej z nich, najpierw skompilujmy nasze programy i stwórzmy dwa potoki nazwane:

```
robert@bezkompilatora:~$ gcc -o programA programA.c
robert@bezkompilatora:~$ gcc -o programB programB.c
robert@bezkompilatora:~$ mkfifo potok1 potok2
robert@bezkompilatora:~$ ls -l
total 32
prw-rw-r-- 1 robert robert    0 Jul 28 17:11 potok1
prw-rw-r-- 1 robert robert    0 Jul 28 17:11 potok2
-rwxrwxr-x 1 robert robert 8568 Jul 28 17:11 programA
-rw-rw-r-- 1 robert robert  432 Jul 28 16:50 programA.c
-rwxrwxr-x 1 robert robert 8568 Jul 28 17:11 programB
-rw-rw-r-- 1 robert robert  432 Jul 28 16:50 programB.c
```

Następnie w jednej sesji terminala uruchommy *programA*, a w drugiej *programB*. Pierwszy uruchomiony program zostanie zablokowany do momentu uruchomienia drugiego. Po wszystkim powinniśmy zobaczyć następujący rezultat:

```
robert@bezkompilatora:~$ ./programA potok1 potok2
./programA: B_1
./programA: B_2
./programA: B_3
```

```
robert@bezkompilatora:~$ ./programB potok2 potok1
./programB: A_1
./programB: A_2
./programB: A_3
```

Jak widać dane zostały przekazane między programami bez konieczności przekierowywania wyjść i wejść standardowych. Istnieje też oczywiście możliwość stosowania podejścia mieszanego, czyli np. otwarcia potoku do odczytu wywołaniem **open()** w jednym programie i przekierowania do tego potoku wyjścia standardowego z innego programu. Potoki nazwane pozwalają więc na uzyskanie większej elastyczności, ale kosztem bardziej złożonej konfiguracji i konieczności zadbania o to, żeby pliki potoków zostały otwarte w obu kierunkach w odpowiedniej kolejności. W przeciwnym wypadku grozi nam tzw. *deadlock*, czyli zawieszenie dwóch procesów wynikające z wzajemnego oczekiwania na jakiś zasób lub zdarzenie.

### Podsumowanie

Po tym dość długim wpisie przyszedł czas na krótkie podsumowanie. Poniżej zbieram najważniejsze informacje z tego wpisu w skondensowanej formie – możesz je potraktować jako krótką ściągawkę z przekierowań i potoków.

Każdy program posiada jedno wejście standardowe (stdin) oraz dwa wyjścia standardowe (stdout i stderr). Używając wiersza poleceń można każde z nich przekierować z lub do pliku. Służą do tego następujące operatory:

-   program > plik lub program 1> plik – przekierowanie stdout do pliku
-   **program 2> plik – przekierowanie stderr do pliku**
-   program &> plik – przekierowanie zarówno stdout i stderr do pliku
-   **program < plik – przekierowanie pliku na wejście standardowe**

Przekierowania te domyślnie nadpisują zawartość pliku. Jeżeli chcemy, żeby wyjście programu było dopisane na końcu pliku powinniśmy użyć operatorów w wersji *append*, czyli odpowiednio program >> plik, program 1>> plik, program 2>> plik i program &>> plik.

Aby połączyć wyjście standardowe jednego programu z wejściem innego należy użyć potoku. Do tworzenia potoków służy operator **|**, np. prog1 | prog2. Dane zapisywane do potoku są buforowane, więc możliwe jest, że program piszący do potoku zakończy swoją pracę zanim program czytający zdąży je odczytać. Jednak w przeciwnym wypadku, jeśli program czytający zakończy się szybciej, program piszący otrzyma sygnał **SIGPIPE**.

Potok nazwany to rodzaj potoku, który jest skojarzony ze specjalnym plikiem. Można go utworzyć przy pomocy komendy **mkfifo**. Otwarcie potoku nazwanego przez program jest blokujące dopóki nie zostanie on otwarty przez inny program z przeciwnym kierunkiem.

• • •

To tyle na dzisiaj. Jeśli masz jakieś uwagi lub pytania – czekam na Twój komentarz! A jeśli nie chcesz przegapić kolejnych wpisów, to koniecznie zapisz się na mój [newsletter](/newsletter/) i polub moją [stronę na Facebooku](https://www.facebook.com/BezKompilatora/). Dziękuję i do zobaczenia! 🙂
