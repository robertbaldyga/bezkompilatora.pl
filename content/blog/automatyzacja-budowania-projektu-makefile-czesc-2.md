---
title: "Automatyzacja budowania projektu z użyciem Makefile (część 2)"
date: 2018-06-03
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["makefile", "make", "linux", "programowanie"]
image: "/images/uploads/2018/06/project-construction-process.png"
summary: "Po ostatnim wpisie, gdzie pokazywałem podstawy tworzenia plików Makefile, dziś przyszedł czas na wprowadzenie kolejnych ciekawych elementów, które pozwolą stworzyć plik Makefile dopasowany do każdego projektu. Opowiemy sobie dzisiaj trochę o konwencjach w plikach Makefile i związanych z…"
---

Po [ostatnim wpisie](/blog/automatyzacja-budowania-makefile-czesc-1/), gdzie pokazywałem podstawy tworzenia plików Makefile, dziś przyszedł czas na wprowadzenie kolejnych ciekawych elementów, które pozwolą stworzyć plik Makefile dopasowany do każdego projektu. Opowiemy sobie dzisiaj trochę o konwencjach w plikach Makefile i związanych z nimi kwestiach technicznych, a następnie przejdziemy do wykorzystania zmiennych i funkcji wbudowanych Makefile. Jeśli więc masz ochotę na wprowadzenie automatyzacji budowania Twojego projektu na nowy poziom, to zapraszam Cię do lektury tego wpisu.

### Konwencje w pliku Makefile – cele *all* i *clean*

Do tej pory tworząc plik Makefile skupialiśmy się na jednym celu głównym, którego nazwa była taka sama jak nazwa programu wynikowego. Jest to praktyczne, ponieważ Makefile sprawdza w katalogu obecność pliku o nazwie takiej jak cel, żeby sprawdzić, czy jest potrzeba jego zbudowania – jeśli taki plik nie istnieje lub jest starszy niż jego zależności, to wykonywana jest jego receptura, w wyniku czego jest on budowany na nowo.

Ten mechanizm jest bardzo wygodny, ale zazwyczaj w plikach Makefile, oprócz celów w wyniku których powstają nowe pliki, stosuje się również cele niepowiązane z żadnym nowym plikiem. Najczęstszym przykładem są tutaj cele o nazwach *all* oraz *clean*. Ich znaczenia nietrudno się domyślić i na pewno słyszeli o nich wszyscy choć trochę zaznajomieni z konwencjami w plikach Makefile. Pracując z gotowym projektem zazwyczaj spodziewamy się, że wołając komendę make all zbudujemy wszystkie cele, czyli kompletny projekt, a przy użyciu komendy make clean usuniemy wszystkie produkty budowania, czyli cele główne oraz wszystkie cele pośrednie.

Przestrzeganie tej konwencji pozwoli nam uniknąć kłopotów, kiedy postanowimy przekazać nasz projekt do budowania innym osobom. Będą się one na ogół spodziewać obecności celów *all* oraz *clean* i będą umiały z nich skorzystać. Jest to niewątpliwie korzystne, jednak stosowanie celów niepowiązanych bezpośrednio z nazwami konkretnych plików rodzi pewne problemy. Przeanalizujmy sytuację na przykładzie poniższego pliku Makefile:

```makefile
all: program

clean:
        rm program file1.o file2.o file3.o

program: file1.o file2.o file3.o
        gcc -o $@ $^

%.o: %.c
        gcc -c -o $@ $^
```

Jest to plik Makefile z poprzedniej części wpisu rozbudowany o cele *all* i *clean*. Jak widać, dodanie celu *clean* spowodowało zduplikowanie listy obiektów pośrednich – rozwiązaniem tego problemu zajmiemy się za chwilę. Zanim jednak do tego przejdziemy, chciałem zwrócić uwagę na niepożądane zjawisko, które na pierwszy rzut oka może być niewidoczne i może objawić się w najmniej spodziewanym momencie.

### Cel specjalny .PHONY

Tak jak pisałem wcześniej, program **make** za każdym razem stara się skojarzyć nazwę celu z nazwą pliku. W związku z tym także podczas budowania celu *all* sprawdzi on, czy w katalogu nie istnieje już plik o takiej nazwie. Na ogół plik o nazwie *all* nie będzie istniał ani też nie będzie tworzony przez recepturę celu *all*, więc będzie on przebudowywany za każdym wywołaniem komendy make all. Sytuacja jednak zmieni się, jeśli w którymś momencie w katalogu ze źródłami pojawi się plik o nazwie *all*. Dla wielu niedoświadczonych użytkowników zachowanie to może być zaskakujące, a szukanie źródła problemu może zająć sporo czasu.

Na szczęście istnieje metoda pozwalająca zapobiec takim sytuacjom, poprzez oznaczenie wybranych celów jako “fałszywe”. Służy do tego cel specjalny **.PHONY**. Jest on traktowany przez program **make** w szczególny sposób, ponieważ nie odpowiada on za wytworzenie żadnego produktu, a jego jedyną rolą jest możliwość określenia listy celów, które nie powinny być kojarzone z nazwami plików. Przykład jego użycia możesz zobaczyć poniżej:

```makefile
all: program

clean:
        rm program file1.o file2.o file3.o

.PHONY: all clean

program: file1.o file2.o file3.o
        gcc -o $@ $^

%.o: %.c
        gcc -c -o $@ $^
```

Jako zależności celu **.PHONY** można podać listę celów, które powinny być traktowane jako “fałszywe” (czyli niepowiązane z plikami), co raz na zawsze rozwiązuje problem. Cel **.PHONY**, ze względu na powszechność użycia celów *all* i *clean*, można znaleźć w plikach Makefile większości projektów.

### Zmienne w Makefile, czyli większa elastyczność

Obiecałem wcześniej, że w tym wpisie pokażę, jak rozwiązać problem zduplikowanej listy tymczasowych obiektów w recepturze celu *clean*, więc zajmijmy się teraz tym tematem. Posłużą nam do tego zmienne – ich koncepcja nie powinna być obca żadnemu programiście, więc zakładam, że nie muszę ich tu zbytnio przedstawiać.

Zmienne w plikach Makefile zaczynają się zawsze od znaku **$** – można się było o tym przekonać już na przykładzie zmiennych specjalnych, o których pisałem w poprzedniej części wpisu. Ważne jest to, że znakiem **$** nie poprzedzamy nazwy zmiennej podczas jej przypisywania (czyli podobnie jak w Bash’u) oraz to, że nazwy zmiennych dłuższe niż jednoliterowe muszą być objęte nawiasami. Czyli np. do zmiennej **X** możemy się odnieść zarówno poprzez zapis **$X** jak i **$(X)**, ale już do zmiennej **ABC** możemy się odwoływać tylko poprzez **$(ABC)**. W drugim przypadku napisanie **$ABC** spowoduje odwołanie do zmiennej **A** oraz doklejenie do jej zawartości napisu *“BC”*. Warto o tym pamiętać, ponieważ to zachowanie prowadzi często do trudnych do wykrycia błędów.

Używając zmiennych możemy zmodyfikować nasz przykładowy Makefile w następujący sposób:

```makefile
PROGRAM = program
OBJS = file1.o file2.o file3.o

all: $(PROGRAM)

clean:
        rm $(PROGRAM) $(OBJS)

.PHONY: all clean

$(PROGRAM): $(OBJS)
        gcc -o $@ $^

%.o: %.c 
        gcc -c -o $@ $^
```

Dzięki temu osiągnęliśmy sporą elastyczność – wszelkich modyfikacji, łącznie ze zmianą nazwy programu wynikowego, można dokonać zmieniając plik tylko w jednym miejscu. Często stosowaną praktyką jest też zapisywanie w zmiennych nazw narzędzi używanych w procesie budowania oraz parametrów kompilatora i linkera. Po takich zmianach nasz plik Makefile mógłby wyglądać na przykład tak:

```makefile
PROGRAM = program

OBJS = file1.o file2.o file3.o

CC = gcc 
CFLAGS = -g -Wall
LDFLAGS = -lm 

all: $(PROGRAM)

clean:
        rm $(PROGRAM) $(OBJS)

.PHONY: all clean

$(PROGRAM): $(OBJS)
        $(CC) $(LDFLAGS) -o $@ $^

%.o: %.c 
        $(CC) $(CFLAGS) -c -o $@ $^
```

Zapisanie nazwy kompilatora **gcc** pod zmienną **$(CC)** powinno być jasne, natomiast kwestia zmiennych **$(CFLAGS)** i **$(LDFLAGS)** może rodzić pytania, dlatego od razu spieszę z wyjaśnieniami.

W zmiennej o nazwie **$(CFLAGS)** są typowo przechowywane parametry kompilacji. Mogą to być na przykład flagi dotyczące dołączenia symboli debugowych (do tego służy **\-g**), rodzaju wypisywanych ostrzeżeń (użycie **\-Wall** oznacza włączenie wszystkich ostrzeżeń), albo poziomu optymalizacji wynikowego kodu. Do naszego przykładowego Makefile dodałem właśnie najczęściej używane flagi **\-g** i **\-Wall**. Flagi te wykorzystywane są w procesie kompilacji, a więc na etapie tworzenia obiektów pośrednich.

Zmienna **$(LDFLAGS)** służy zazwyczaj do ustawiania flag linkera, czyli najczęściej do podawania zewnętrznych bibliotek, z którymi chcemy zlinkować nasz program. Na powyższym przykładzie użyłem flagi **\-lm**, czyli dodałem do projektu bibliotekę matematyczną (znajdują się w niej funkcje z nagłówka *math.h*). Zmienna **$(LDFLAGS)** używana jest podczas linkowania programu wynikowego.

Wyposażeni w tą wiedzę możemy przejść do kolejnego kroku, czyli dodania do naszego pliku Makefile kolejnego poziomu automatyki.

### Funkcje w Makefile, czyli automatyka v3.0

Doszliśmy do momentu, w którym pokażę Ci bardzo potężne narzędzie, dzięki któremu będziesz w stanie zbudować plik Makefile gotowy do działania nawet z bardzo dużym projektem. Sama idea funkcji w Makefile nie jest może szczególnie innowacyjna – przypominają one w dużym stopniu funkcje znane z większości języków programowania – ale efekty osiągane poprzez połączenie funkcji z pozostałymi mechanizmami Makefile mogą robić wrażenie.

Lista dostępnych funkcji jest długa, więc omówię tu tylko kilka najczęściej używanych, które i tak powinny wystarczyć do znacznego usprawnienia naszego przykładowego Makefile. Jeśli masz ochotę poznać pozostałe funkcje, to ich opis możesz znaleźć w [tutaj](https://www.gnu.org/software/make/manual/html_node/Functions.html#Functions) (po angielsku).

Wywołanie funkcji Makefile ma następującą składnię:

```makefile
$(nazwa_funkcji argument1, argument2, ... , argumentN)
```

Zapis ten może nieco przypominać odwołanie do zmiennej. W nawiasach jako pierwsza występuje zawsze nazwa funkcji, a po niej znajduje się lista argumentów oddzielonych przecinkami. Wynik zwracany przez funkcję może być przypisany do zmiennej, przekazany jako argument do innej funkcji, albo użyty jako dowolny element reguły Makefile.

Jako przykład weźmy sobie funkcję **patsubst**, pozwalającą na łatwą zamianę suffixów – jej działanie jest bardzo zbliżone do tego, co można osiągnąć przy użyciu reguły suffixowej. W praktyce funkcja **patsubst** i reguły suffixowe dobrze się uzupełniają i są często używane razem. Przykład wywołania tej funkcji możesz zobaczyć poniżej:

```makefile
$(patsubst %.c, %.o, file1.c file2.c file3.c)
```

W efekcie funkcja zwróci listę plików z rozszerzeniem zmienionym z “.c” na “.o”. Wywołanie to można wykorzystać do wygenerowania listy obiektów pośrednich na podstawie listy plików źródłowych. Można więc zmodyfikować nasz przykładowy plik Makefile w następujący sposób:

```makefile
PROGRAM = program

SRC = file1.c file2.c file3.c
OBJS = $(patsubst %.c, %.o, $(SRC))

CC = gcc 
CFLAGS = -g -Wall
LDFLAGS = -lm 

all: $(PROGRAM)

clean:
        rm $(PROGRAM) $(OBJS)

.PHONY: all clean

$(PROGRAM): $(OBJS)
        $(CC) $(LDFLAGS) -o $@ $^

%.o: %.c 
        $(CC) $(CFLAGS) -c -o $@ $^
```

Jak widać, jako listę plików do zamiany suffixów można też podać zmienną. Póki co niewiele to zmieniło, bo zamiast listy obiektów możemy teraz po prostu podawać listę plików z rozszerzeniem “.c”, co nie wygląda na rozwiązanie szczególnie lepsze od poprzedniego. Wszystko się jednak zmieni, kiedy zapoznamy się z kolejną, o wiele potężniejszą funkcją.

Funkcja **shell**, bo o niej mowa, pozwala na wywołanie z poziomu pliku Makefile dowolnego polecenia powłoki. Może to być prosta komenda, skrypt lub dowolny program. Nie trudno zauważyć, że otwiera to ogromne możliwości.

W jaki sposób możemy usprawnić nasz przykładowy plik Makefile z użyciem tej funkcji? Zapewne na wiele sposobów, ale jednym z najfajniejszych będzie pozbycie się konieczności podawania listy plików z kodem źródłowym. Dzięki temu będzie można rozbudowywać projekt o kolejne pliki bez konieczności modyfikowania pliku Makefile. Do automatycznego wygenerowania listy plików z kodem użyjemy polecenia ls \*.c. Zmodyfikowany plik Makefile możesz zobaczyć poniżej:

```makefile
PROGRAM = program

SRC = $(shell ls *.c)
OBJS = $(patsubst %.c, %.o, $(SRC))

CC = gcc 
CFLAGS = -g -Wall
LDFLAGS = -lm 

all: $(PROGRAM)

clean:
        rm $(PROGRAM) $(OBJS)

.PHONY: all clean

$(PROGRAM): $(OBJS)
        $(CC) $(LDFLAGS) -o $@ $^

%.o: %.c 
        $(CC) $(CFLAGS) -c -o $@ $^
```

Czy tym razem udało nam się osiągnąć Świętego Graala automatyzacji budowania? To zależy. Dla sporej części projektów taki plik Makefile może się okazać zupełnie wystarczający. Z drugiej strony jest też dużo projektów, które stosują o wiele bardziej zaawansowane systemy budowania – część z nich wspiera modułowość lub posiada wiele celów głównych, a ostateczny kształt produktu ich kompilacji zależy od wielu czynników. O tym, co robić, gdy nasz projekt zalicza się do takich przypadków powiemy sobie w kolejnych wpisach.

### Podsumowanie

Wyszedł całkiem długi wpis, ale dzięki temu zrobiliśmy spory postęp w ulepszaniu naszego przykładowego Makefile. Z zasadzie wyewoluował on do postaci, którą niemal bez modyfikacji można użyć dla sporej grupy projektów. Dodatkowo, poprzez dostarczenie standardowych celów *all* i *clean*, ułatwiliśmy budowanie projektu nowym użytkownikom.

Kolejne ciekawe rzeczy w kolejnych wpisach. Jeśli nie chcesz ich przegapić, to koniecznie zapisz się na mój [newsletter](/newsletter/) i polub moją [stronę na Facebooku](https://www.facebook.com/BezKompilatora/). Jeśli masz jakieś pytania lub znasz jakieś ciekawe sztuczki związane z Makefile, to czekam na Twój komentarz!

Dziękuję i do zobaczenia! 🙂
