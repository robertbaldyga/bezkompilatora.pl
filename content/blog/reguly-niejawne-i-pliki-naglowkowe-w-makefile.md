---
title: "Reguły niejawne i pliki nagłówkowe w Makefile"
date: 2018-06-25
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["makefile", "make", "kompilacja", "C", "nagłówki"]
image: "/images/uploads/2018/06/construction-plans-and-helmet.jpg"
summary: "W dwóch poprzednich częściach wpisu o automatyzacji budowania z użyciem Makefile opisałem całkiem solidne podstawy korzystania z tego narzędzia. Jednak jeśli czujesz, że Ci to nie wystarcza i chciałbyś poznać jeszcze kilka technik przydatnych podczas tworzenia systemu budowania…"
---

W dwóch poprzednich częściach wpisu o automatyzacji budowania z użyciem Makefile opisałem całkiem solidne podstawy korzystania z tego narzędzia. Jednak jeśli czujesz, że Ci to nie wystarcza i chciałbyś poznać jeszcze kilka technik przydatnych podczas tworzenia systemu budowania dla Twojego projektu, to świetnie trafiłeś – znajdziesz je właśnie w tym wpisie.

**Linki do poprzednich części wpisu na temat Makefile znajdziesz tutaj:**  
1\. [Automatyzacja budowania projektu z użyciem Makefile (część 1)](/blog/automatyzacja-budowania-makefile-czesc-1/)  
2\. [Automatyzacja budowania projektu z użyciem Makefile (część 2)](/blog/automatyzacja-budowania-projektu-makefile-czesc-2/)  

### Reguły niejawne

Reguły niejawne (ang. implicit rules) to zestaw reguł, który jest domyślnie dołączany do każdego pliku Makefile w trakcie wykonania programu **make**. Znajdują się w nim najczęściej wykorzystywane reguły, dzięki czemu nie trzeba ich powtarzać w każdym nowo tworzonym pliku. Należą do nich między innymi reguły służące do kompilacji i linkowania programów napisanych w językach C i C++.

Kiedy spojrzymy na poniższy przykładowy plik nietrudno jest zauważyć, że znajdują się w nim reguły, które można znaleźć w większości plików Makefile:

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

Dotyczy to szczególnie ostatniej reguły, która opisuje proces kompilacji plików “.c” do obiektów “.o”, ale także reguła linkująca obiekty w program wynikowy wygląda bardzo uniwersalnie. Twórcy programu **make** zauważyli tą zależność już dawno temu i wprowadzili pokaźny zestaw reguł niejawnych, pokrywających znaczną część najbardziej typowych przypadków.

Powyższy przykład możemy zmodyfikować w taki sposób, że ostatnią regułę usuniemy całkowicie (w zbiorze reguł niejawnych znajduje się ona w niemal takiej samej postaci), natomiast z reguły linkującej możemy pozbyć się receptury, ponieważ ta też występuje wśród dostępnych domyślnie reguł. W tym drugim przypadku istnieje jednak pewien wymóg, o którym musimy pamiętać – na liście zależności musi wystąpić obiekt o takiej samej nazwie jak program wynikowy (z wyjątkiem rozszerzenia “.o”).

W powyższym przykładzie w katalogu ze źródłami musi więc znaleźć się plik o nazwie *program.c*, z którego powstanie obiekt *program.o*, a następnie całość zostanie zlinkowana do programu wykonywalnego o nazwie *program*. Nie jest to szczególnie trudne wymaganie, ale warto o nim pamiętać – w przeciwnym wypadku reguła nie zostanie wykonana i program się nie zlinkuje.

Po usunięciu niepotrzebnego kodu, nasz plik Makefile przyjmie następującą postać:

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
```

Wygląda to nieco prościej, ale od razu nasuwa się jedno pytanie – czy w trakcie kompilacji i linkowania zostaną wykorzystane opcje, które przypisaliśmy do zmiennych **CFLAGS** i **LDFLAGS**? Okazuje się, że tak, ponieważ reguły niejawne w swoich recepturach odwołują się do zmiennych o właśnie takich nazwach. Jest to kolejna rzecz, na którą warto zwrócić uwagę – przypisując wartości zmiennych **CC**, **CFLAGS** i **LDFLAGS** wpływamy na działanie reguł niejawnych.

Poza nimi istnieje wiele innych zmiennych, które są wykorzystywane przez reguły niejawne. Ich pełną listę możemy sprawdzić wywołując komendę make -p – wypisuje ona kompletną listę reguł niejawnych oraz wykorzystywanych przez nie zmiennych wraz z domyślnymi wartościami i komentarzami, które pomagają łatwiej zorientować się w działaniu poszczególnych reguł.

Komenda ta generuje wynik dość pokaźnych rozmiarów (ok. 1500 linii), dlatego najlepiej go przeglądać z użyciem programu **less** make -p | less lub przekierowując wyjście do pliku, np. make -p > implicit\_rules.txt.

### Problem zależności od nagłówków

W kwestii minimalizacji pliku Makefile doszliśmy już do poziomu expert, pozostała nam jednak jeszcze jedna nierozwiązana kwestia. Jest to jeden z najczęściej pomijanych podczas pisania pliku Makefile problemów, który jednak niejednemu programiście spędził sen z powiek – obsługa zależności od nagłówków.

Zazwyczaj w plikach Makefile hierarchia zależności jest bardzo prosta – wynikowy plik wykonywalny zależy od plików “.o”, a te z kolei zależą od plików “.c” i na tym sprawa się kończy. Niestety programistyczna rzeczywistość jest nieco bardziej złożona – pliki “.c” załączają zazwyczaj nagłówki “.h“, zawierające różnego rodzaju deklaracje, makrodefinicje i funkcje inline. W trakcie kompilacji o załączenie odpowiednich plików nagłówkowych troszczy się kompilator, dlatego są one często pomijane podczas tworzenia pliku Makefile. Przez długi czas to zaniedbanie może zostać niezauważone, ponieważ wszystko będzie działać jak należy, jednak problem może w końcu pojawić się w najmniej oczekiwanym momencie.

Taki moment ma zazwyczaj miejsce kiedy dokonamy modyfikacji dotykającej wyłącznie plik nagłówkowy – np. zmienimy makrodefinicję lub zmodyfikujemy funkcję inline. W takiej sytuacji wywołanie komendy make all zakończy się komunikatem, że nie ma nic do wybudowania, bo cel jest nowszy niż wszystkie jego zależności. Pierwszą reakcją jest wtedy zazwyczaj zaskoczenie – przecież przed chwilą zmieniliśmy kod! Po krótszych lub dłuższych poszukiwaniach prawda wychodzi jednak w końcu na jaw – pliku, który zmodyfikowaliśmy nie ma na żadnej liście zależności.

Naiwnie proste rozwiązanie problemu poprzez dopisanie plików nagłówkowych jako zależności głównego celu bardzo szybko okazuje się nieskuteczne. Wymusi to co prawda ponowne zliknowanie programu wynikowego, jednak nie spowoduje przebudowania obiektów stworzonych z plików z kodem wykorzystujących zmieniony nagłówek. Potrzebujemy więc dodania plików nagłówkowych jako zależności przy kompilacji poszczególnych obiektów.

Rodzi to jednak pewien problem – musimy wiedzieć, które pliki nagłówkowe załączane są przez poszczególne pliki “.c” i musimy tą wiedzę zapisać w postaci reguł w pliku Makefile. Generuje to potrzebę wytworzenia dużej ilości trudnych w utrzymaniu reguł – za każdym razem gdy dodajemy lub usuwamy załączany nagłówek w pliku “.c” musimy także uaktualnić plik Makefile. Dodatkowo sprawa komplikuje się jeszcze bardziej, gdy uwzględnimy fakt, że jedne pliki nagłówkowe mogą także includować inne pliki nagłówkowe. Nasz system budowania przeradza się nagle z krótkiej listy prostych reguł w istne nagłówkowe piekło.

### Zależności od nagłówków – rozwiązanie

Na szczęście istnieje prosty sposób na automatyczne wygenerowanie listy zależności od nagłówków, którą można następnie dołączyć do pliku Makefile. Potrafi to dla nas zrobić sam kompilator. Wystarczy do opcji kompilatora dodać flagi **\-MMD** oraz **\-MP** – pierwsza z nich mówi, że podczas kompilacji oprócz pliku “.o” powinien być także wygenerowany plik “.d” zawierający zależności do plików nagłówkowych (z pominięciem nagłówków systemowych). Druga z podanych opcji powoduje, że dla każdego pliku nagłówkowego zostaną utworzone reguły zapobiegające błędom w przypadku celowego usunięcia jednego z plików – naprawia to znaną przypadłość programu **make**, który domyślnie próbuje w takiej sytuacji znaleźć regułę tworzącą brakujący plik nagłówkowy, co na ogół skutkuje pojawieniem się niespodziewanych błędów.

Po dodaniu powyższych flag kompilacji wystarczy w pliku Makefile załączyć wygenerowane zależności używając polecenia –**include**. Nasz plik Makefile po dokonaniu zmian wyglądać będzie następująco:

```makefile
PROGRAM = program

SRC = $(shell ls *.c)
OBJS = $(patsubst %.c, %.o, $(SRC))
DEP = $(patsubst %.c, %.d, $(SRC))

CC = gcc 
CFLAGS = -g -Wall -MMD -MP
LDFLAGS = -lm 

all: $(PROGRAM)

clean:
        rm $(PROGRAM) $(OBJS)

.PHONY: all clean

$(PROGRAM): $(OBJS)

-include $(DEP)
```

Jak widać nie potrzeba było zbyt wielu zmian. Pojawiła się nowa zmienna **DEP**, przechowująca listę plików zawierających zależności dla poszczególnych obiektów. Wygenerowana została ona w taki sam sposób jak lista obiektów – z użyciem funkcji **patsubst**. Nieco niżej na liście opcji w zmiennej **CFLAGS** pojawiły się dwie wspomniane wcześniej flagi **\-MMD** i **\-MP**, a na samym końcu, przy pomocy komendy **\-include,** do pliku Makefile dołączane są wszystkie wygenerowane pliki z zależnościami.

Warto zwrócić uwagę na znak minusa poprzedzający komendę **include**. Oznacza on tyle, że jeżeli któregoś z plików z zależnościami zabraknie, to kompilacja i tak nie powinna zakończyć się błędem – jest to istotne podczas pierwszej kompilacji projektu, kiedy pliki z zależnościami nie są jeszcze wygenerowane.

W taki oto łatwy sposób udało nam się poradzić sobie z powszechnie występującym problemem zależności od plików nagłówkowych. Liczę na to, że prostota tego rozwiązania skłoni Cię do jego użycia w Twoich projektach – widziałem już zdecydowanie zbyt wiele plików Makefile, w których tego brakowało.

• • •

Na tym zakończę dzisiejszy wpis. Liczę na to, że wiedza, którą w nim zawarłem okaże się dla Ciebie przydatna. Jeżeli masz jakieś pomysły, w jaki sposób można by jeszcze ulepszyć nasz przykładowy plik Makefile lub znasz jakieś inne ciekawe kwestie, na które warto zwrócić uwagę podczas projektowania systemu budowania – liczę na Twój komentarz.

A jeśli nie chcesz przegapić kolejnych wpisów, zapisz się na mój [newsletter](/newsletter/) i polub moją [stronę na Facebooku](https://www.facebook.com/BezKompilatora/). Dziękuję i do zobaczenia! 🙂
