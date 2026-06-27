---
title: "Automatyzacja budowania projektu z użyciem Makefile (część 1)"
date: 2018-05-27
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["makefile", "make", "linux", "programowanie"]
image: "/images/uploads/2018/05/software-under-construction.jpg"
summary: "Dzisiejszy wpis będzie o budowaniu projektów. Temat ten jest nierozłącznym elementem pracy programisty, bo o ile prosty program można skompilować jedną komendą – co pokazywałem już w poprzednim wpisie – to programiści mają zwykle do czynienia z dużymi…"
---

Dzisiejszy wpis będzie o budowaniu projektów. Temat ten jest nierozłącznym elementem pracy programisty, bo o ile prosty program można skompilować jedną komendą – co pokazywałem już w [poprzednim wpisie](/blog/programuj-jak-hacker-kodowanie-w-wierszu-polecen/) – to programiści mają zwykle do czynienia z dużymi projektami. Zawierają one często od kilkuset do kilku tysięcy plików. Nic nie stoi oczywiście na przeszkodzie, żeby próbować je budować z wykorzystaniem samego kompilatora, ale jest to po pierwsze bardzo niewygodne, a po drugie bardzo niewydajne.

Rozwiązaniem problemu może być napisanie skryptu, który będzie kompilował poszczególne pliki, a następnie linkował je w wynikowy program wykonywalny. Taki skrypt można stosunkowo łatwo napisać na przykład w Bash’u. Można w nim dodać funkcjonalność kompilowania tylko tych plików, które zmieniły się od czasu ostatniej kompilacji, wprowadzić system rozpoznawania zależności – np. kiedy zmienia się plik nagłówkowy, przebudować wszystkie pliki, które go includują – oraz dodać możliwość budowy kilku wariantów programu wynikowego w zależności od podanych argumentów.

Można zrobić te i bardzo wiele innych rzeczy, ale można też użyć gotowego narzędzia, które ma te wszystkie funkcje i jest bardzo łatwe w użyciu. Dlatego dzisiejszy wpis jest krótkim wprowadzeniem do użycia programu **make** i plików Makefile.

### Czym jest program **make**?

Program **make** to narzędzie do automatyzacji budowania projektu. Pozwala on na określenie zestawu reguł, opisujących w jaki sposób ma być zbudowany dany cel z uwzględnieniem jego zależności. Celem może być na przykład skompilowany plik obiektu \*.o, a jego zależnością plik z kodem źródłowym \*.c. Zależnością dla jednego celu może być też inny cel, co pozwala na tworzenie złożonego opisu zależności. Na przykład pliki \*.o będące celem jednej z reguł, mogą być zależnością reguły budującej z niej program wynikowy.

Zestaw reguł zapisywany jest w pliku o nazwie Makefile, umieszczonym w katalogu z kodem źródłowym. Jeżeli projekt zawiera kilka katalogów z kodem źródłowym, to możliwe jest stworzenie plików Makefile w każdym takim katalogu, a następnie załączenie ich w pliku Makefile umieszczonym w katalogu nadrzędnym.

Program **make** pozwala na określenie celu domyślnego, a także dowolnej ilości celów nazwanych. Celem domyślnym jest zawsze cel występujący jako pierwszy w pliku Makefile i jest on budowany podczas wywołania komendy make. Inne cele można wybrać poprzez podanie nazwy celu jako argumentu programu **make** – na przykład aby zbudować cel o nazwie *hello* wystarczy wywołać komendę make hello.

### Składnia pliku Makefile

Podstawową konstrukcją występującą w pliku Makefile jest reguła (ang. rule), określająca cel, zależności i tzw. recepturę (ang. recipe), czyli procedurę służącą do wytworzenia celu. Reguły Makefile mają następujący format:

```shell
cel: zaleznosc1 zaleznosc2 ... zaleznoscN
        receptura
```

Przed dwukropkiem podawana jest nazwa celu (może być ona dowolna), po dwukropku występuje lista zależności (mogą to być nazwy plików lub innych celów), a w nowej linii podawana jest receptura. Receptura składa się najczęściej z pojedynczej komendy (np. wywołania kompilatora **gcc**), ale może również zawierać listę komend.

Plik Makefile budujący program składający się z trzech plików z kodem źródłowym może wyglądać na przykład tak:

```shell
program: file1.c file2.c file3.c
         gcc -o program file1.c file2.c file3.c
```

Ten sam efekt można osiągnąć w dużo prostszy sposób i pokażę, jak to zrobić, dalszej części wpisu. Mam jednak nadzieję, że ogólna idea jest zrozumiała.

Oprócz reguł, w plikach Makefile mogą też występować definicje zmiennych, instrukcje warunkowe oraz wywołania funkcji, co pozwala na stworzenie bardzo zaawansowanego zestawu reguł. Przykłady użycia tych elementów również pokażę w dalszej części wpisu.

### Zmienne specjalne, czyli automatyka v1.0

Zmienne specjalne w plikach Makefile wprowadzono po to, aby uprościć pisanie reguł. Umożliwiają one odnoszenie się do nazwy celu oraz zależności z poziomu receptury. Istnieje sześć zmiennych specjalnych:

-   **$@** – nazwa celu,
-   **$^** – lista zależności bez duplikatów,
-   **$+** – lista wszystkich zależności łącznie z duplikatami,
-   **$\<** – nazwa pierwszej zależności,
-   **$?** – lista zależności nowszych niż cel (np. plików, które zmieniły się od czasu ostatniego budowania danego celu),
-   **$\*** – lista zależności pasujących do reguły suffixowej (o regułach suffixowych powiemy sobie w dalszej części wpisu).

Najczęściej wykorzystywanymi zmiennymi są **$@** oraz **$^**. Jeżeli spróbujemy ulepszyć z ich użyciem nasz poprzedni przykład, uzyskamy następujący plik Makefile:

```shell
program: file1.c file2.c file3.c
        gcc -o $@ $^
```

Proces budowania programu będzie taki sam jak poprzednio, ale w przypadku dodania kolejnego pliku z kodem źródłowym nie ma już potrzeby wprowadzania go w dwóch miejscach – receptura wykorzystuje listę plików podanych jako zależności reguły.

### Cele pośrednie, czyli szybsza kompilacja

Zmienne automatyczne usprawniły nieco nasz przykład, ale nadal ma on jeden poważny mankament – nawet w przypadku zmiany kodu tylko w jednym pliku, za każdym razem kompilowane są wszystkie trzy. W przypadku projektu składającego się z trzech plików nie jest to może szczególnie uciążliwe, ale jeśli tych plików byłoby na przykład trzysta, to czas budowania projektu znacznie by się wydłużył.

Intuicyjnie mogłoby się wydawać, że dobrym rozwiązaniem będzie użycie zmiennej specjalnej **$?** zamiast **$^** – w takim wypadku ponownie kompilowane byłyby tylko te pliki, które zostały zmienione. Takie rozwiązanie prowadzi jednak do całkowitego pominięcia niezmienionych plików w procesie kompilacji, co skończy się błędem linkowania. Na szczęście istnieje lepsze rozwiązanie – cele pośrednie.

Cele pośrednie można zdefiniować tak samo, jak cel główny. W naszym przykładzie celami pośrednimi będą pliki \*.o utworzone w wyniku kompilacji poszczególnych plików z kodem źródłowym. Możemy więc stworzyć następujący plik Makefile:

```shell
program: file1.o file2.o file3.o
        gcc -o $@ $^

file1.o: file1.c
        gcc -c -o $@ $^

file2.o: file2.c
        gcc -c -o $@ $^

file3.o: file3.c
        gcc -c -o $@ $^
```

Zależnościami celu *program* nie są teraz pliki z kodem źródłowym, ale pliki obiektów \*.o powstałe podczas ich kompilacji. Jeżeli któryś z tych obiektów jest nowszy niż cel, program zostanie zlinkowany ponownie – jest to proces znacznie szybszy niż kompilacja z plików źródłowych. Z kolei obiekt \*.o zostanie przebudowany tylko wtedy, jeśli plik z kodem źródłowym, z którego został stworzony, ulegnie zmianie. W efekcie kompilowane są więc tylko te pliki, które się zmieniły.

Stworzenie celów pośrednich pozwoliło rozwiązać problem wolnej kompilacji, ale wygenerowało kolejny problem – plik Makefile jest teraz znacznie bardziej złożony. Na szczęście istnieją mechanizmy pozwalające na rozwiązanie i tego problemu.

### Reguły suffixowe, czyli automatyka v2.0

Reguły suffixowe (ang. suffix – przyrostek) opisują sposób wytworzenia dowolnego celu mającego w nazwie określony przyrostek. Takim przyrostkiem jest zazwyczaj rozszerzenie pliku, więc w efekcie reguły takie opisują sposób wytwarzania plików o danym rozszerzeniu.

Użycie reguły suffixowej obrazuje poniższy przykład:

```shell
program: file1.o file2.o file3.o
        gcc -o $@ $^

%.o: %.c
        gcc -c -o $@ $^
```

Zasada działania takiej reguły jest prosta – jeżeli potrzebny jest określony plik z rozszerzeniem “.o”, to jego zależnością staje się taki sam plik z rozszerzeniem “.c”. Do wytworzenia celu zostanie użyta receptura znana z poprzedniego przykładu.

Dzięki regułom suffixowym można łatwo uniknąć wielokrotnego zapisywania reguł różniących się tylko nazwą celu i zależności. Są one w związku z tym bardzo powszechnie używane w plikach Makefile.

### Podsumowanie

W dzisiejszym wpisie poznałeś podstawy tworzenia plików Makefile. Mimo, że jest zaledwie ułamek możliwości tego narzędzia, to powinieneś być już w stanie stworzyć sprawnie działający system budowania dla swojego projektu. W przypadku niektórych projektów, taki plik Makefile może się okazać zupełnie wystarczający.

W kolejnych częściach tego wpisu pokażę Ci więcej funkcji programu **make** oraz przedstawię kilka użytecznych reguł wbudowanych, które pozwolą Ci sprawnie zautomatyzować budowanie nawet bardzo złożonych projektów.

Jeśli nie chcesz przegapić kolejnych wpisów, zachęcam Cię do zapisania się na mój [newsletter](/newsletter/) i polubienia mojej [strony na Facebooku](https://www.facebook.com/BezKompilatora/). I oczywiście zapraszam Cię do uczestnictwa w dyskusji w komentarzach.

Z góry dzięki! 🙂
