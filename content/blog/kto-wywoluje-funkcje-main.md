---
title: "Kto wywołuje funkcję main()?"
date: 2018-05-13
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["linux", "c", "programowanie", "syscall"]
image: "/images/uploads/2018/05/retro_dressed_detective.jpg"
summary: "Każdy kto choć trochę zna język C lub C++ bardzo dobrze wie od czego zaczyna się wykonanie dowolnego programu. Niezależnie od tego, czy jest to prosta konsolowa aplikacja czy symulator załogowej misji na Marsa, każdy program zaczyna się…"
---

Każdy kto choć trochę zna język C lub C++ bardzo dobrze wie od czego zaczyna się wykonanie dowolnego programu. Niezależnie od tego, czy jest to prosta konsolowa aplikacja czy symulator załogowej misji na Marsa, każdy program zaczyna się od wywołania pierwszej funkcji – funkcji **main()**. Pisząc programy beztrosko przyjmujemy to za pewnik, ale gdy się nad tym głębiej zastanowić, to przecież ktoś tą funkcję **main()** musi zawołać. I właśnie o tym jest dzisiejszy wpis.

### Anatomia funkcji main()

W podstawowym wariancie funkcja **main()** wygląda następująco:

```c
int main() {
    return 0;
}
```

Nie przyjmuje ona żadnych argumentów i zwraca wartość typu **int**. Niektóre kompilatory pozwalają też na stworzenie funkcji zwracającej typ **void**, ale jest to niezgodne ze standardem zarówno C jak i C++, w związku z czym powinieneś unikać tego rozwiązania. Funkcja **main()** występuje jednak również w dwóch innych wariantach:  

```c
int main(int argc, char *argv[]) {
    return 0;
}
```

oraz:  

```c
int main(int argc, char *argv[], char *envp[]) {
    return 0;
}
```

Pierwszy z nich może być znany osobom bardziej doświadczonym w tworzeniu programów dla wiersza poleceń. Argument *argc* określa liczbę parametrów podanych podczas uruchomienia programu, a tablica *argv* zawiera ich wartości.

Drugi wariant jest bardzo rzadko używany i prawdopodobnie większość programistów nie miała z nim nigdy styczności. Jest to jednak pełna wersja funkcji **main()** w programach działających pod Linuxem, więc zgłębiając tematykę programowania systemowego warto się z nią zapoznać – dodatkowy argument *envp* zawiera tablicę zmiennych środowiskowych.

### Co znaczą i skąd pochodzą te argumenty?

Argumenty przekazywane do funkcji main() pozwalają na przekazanie do programu danych podczas jego wywołania. Mechanizm ten jest często wykorzystywany w aplikacjach działających w wierszu poleceń – wszelkie opcje podawane po nazwie programu trafiają właśnie do tablicy *argv* przekazywanej jako argument do funkcji **main()**. Można to łatwo przetestować, pisząc prosty program:

```c
#include <stdio.h>

int main(int argc, char *argv[]) {
        int i;

        printf("argc = %d\n", argc);

        printf("argv =\n");
        for (i = 0; i < argc; ++i)
                printf("    [%d] = %s\n", i, argv[i]);

        return 0;
}
```

Po zapisaniu powyższego kodu w pliku o nazwie main.c, a następnie skompilowaniu i uruchomieniu, powinieneś zobaczyć następujący rezultat:

```
robert@bezkompilatora:~$ gcc -o main main.c
robert@bezkompilatora:~$ ./main
argc = 1
argv =
   [0] = ./main
```

Oznacza to tyle, że w tablicy *argv* znajduje się tylko jeden element, zawierający ścieżkę do uruchomionego programu. Ta ścieżka znajduje się zawsze pod zerowym indeksem tablicy *argv*, i jest obecna nawet wtedy, gdy nie podamy podczas wywołania programu żadnych parametrów. Ciekawsze rzeczy dzieją się w momencie, kiedy parametry zostaną podane. Obrazuje to poniższy przykład:

```
robert@bezkompilatora:~$ ./main jeden dwa trzy
argc = 4
argv =
   [0] = ./main
   [1] = jeden
   [2] = dwa
   [3] = trzy
```

Wyraźnie widać różnicę. Wartość *argc* wskazuje teraz na obecność czterech elementów w tablicy *argv* – pierwszy z nich, tak jak poprzednio zawiera ścieżkę do programu, a w trzech kolejnych znajdują się ciągi znaków podane jako parametry podczas wywołania programu. To właśnie w ten sposób programy uruchamiane w wierszu poleceń interpretują podane do nich opcje.

Na przykład podczas wykonania komendy apt install gcc, zostanie uruchomiony **apt**, a do jego funkcji **main()** zostaną przekazane parametry *argc**\=3* oraz *argv=\[“apt”, “install”, “gcc”\]*. Jeżeli nie wiedziałeś tego wcześniej, to prawdopodobnie w tym momencie działanie komend w wierszu poleceń wydało Ci się przynajmniej o połowę mniej magiczne. 😉

Skupmy się jednak teraz na najbardziej rozbudowanym wariancie funkcji **main()**. Dodatkowy parametr *envp* jest w pewnym sensie podobny do *argv*, ponieważ również zawiera tablicę ciągów znaków, jednak różni się tym, że do funkcji nie jest przekazywany rozmiar tej tablicy. Zamiast tego mamy zagwarantowane, że ostatni element tej tablicy ma wartość NULL, dzięki czemu możemy łatwo sprawdzić, czy dotarliśmy już do końca. Zawartość tej tablicy możemy sprawdzić modyfikując nieco poprzedni program:

```c
#include <stdio.h>

int main(int argc, char *argv[], char *envp[]) {
        int i;

        printf("argc = %d\n", argc);

        printf("argv =\n");
        for (i = 0; i < argc; ++i)
                printf("    [%d] = %s\n", i, argv[i]);

        printf("envp =\n");
        for (i = 0; envp[i] != NULL; ++i)
                printf("    [%d] = %s\n", i, envp[i]);

        return 0;
}
```

Kompilacja i wykonanie tego programu daje następujący rezultat:

```
robert@bezkompilatora:~$ gcc -o main main.c
robert@bezkompilatora:~$ ./main
argc = 1
argv =
   [0] = ./main
envp =
   [0] = LS_COLORS=
   [1] = LESSCLOSE=/usr/bin/lesspipe %s %s
   [2] = LANG=pl_PL.UTF-8
   [3] = INVOCATION_ID=a63ab2e6a6cf4e4888d43819c0209f52
   [4] = XDG_SESSION_ID=1
   [5] = HUSHLOGIN=FALSE
   [6] = USER=robert
   [7] = PWD=/home/robert
   [8] = HOME=/home/robert
   [9] = JOURNAL_STREAM=9:22102
   [10] = XDG_DATA_DIRS=/usr/local/share:/usr/share:/var/lib/snapd/desktop
   [11] = MAIL=/var/mail/robert
   [12] = SHELL=/bin/bash
   [13] = TERM=vt220
   [14] = SHLVL=1
   [15] = LOGNAME=robert
   [16] = XDG_RUNTIME_DIR=/run/user/1000
   [17] = PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
   [18] = LESSOPEN=| /usr/bin/lesspipe %s
   [19] = _=./main
```

Jak widać w tablicy *envp* znajduje się znacznie więcej informacji niż w *argv*, a jej zawartość jest niezależna od parametrów wywołania programu. Zawiera ona zmienne środowiskowe, czyli wszystkie zmienne wyeksportowane w powłoce, w której został uruchomiony program. Żeby to zweryfikować możemy wykonać jeszcze jeden eksperyment – stworzyć własną zmienną środowiskową i sprawdzić, czy znajdzie się ona w tablicy *envp*. Przebieg eksperymentu przedstawiony został poniżej:

```
robert@bezkompilatora:~$ export BEZKOMPILATORA=BezKompilatora.pl
robert@bezkompilatora:~$ ./main
argc = 1
argv =
   [0] = ./main
envp =
   [0] = LS_COLORS=
   [1] = LESSCLOSE=/usr/bin/lesspipe %s %s
   [2] = LANG=pl_PL.UTF-8
   [3] = INVOCATION_ID=a63ab2e6a6cf4e4888d43819c0209f52
   [4] = XDG_SESSION_ID=1
   [5] = HUSHLOGIN=FALSE
   [6] = USER=robert
   [7] = PWD=/home/robert
   [8] = HOME=/home/robert
   [9] = JOURNAL_STREAM=9:22102
   [10] = XDG_DATA_DIRS=/usr/local/share:/usr/share:/var/lib/snapd/desktop
   [11] = BEZKOMPILATORA=BezKompilatora.pl
   [12] = MAIL=/var/mail/robert
   [13] = SHELL=/bin/bash
   [14] = TERM=vt220
   [15] = SHLVL=1
   [16] = LOGNAME=robert
   [17] = XDG_RUNTIME_DIR=/run/user/1000
   [18] = PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
   [19] = LESSOPEN=| /usr/bin/lesspipe %s
   [20] = _=./main
```

Jak widać, tym razem pod indeksem 11 tablicy *envp* znalazł się dodatkowy element, w postaci stworzonej uprzednio zmiennej środowiskowej *BEZKOMPILATORA*, przechowującej wartość *BezKompilatora.pl*.

Zmienne środowiskowe pozwalają programowi na uzyskanie podstawowych informacji o środowisku, w którym został uruchomiony, takich jak nazwa użytkownika, lokalizacja katalogu domowego, wybrany język czy rodzaj terminala. Umożliwiają też, podobnie jak parametry wywołania, sterowanie przebiegiem programu poprzez ustawienie własnych zmiennych środowiskowych. Z mechanizmu tego korzystają na przykład przeglądarki internetowe, sprawdzając zawartość zmiennych *HTTP\_PROXY* oraz *HTTPS\_PROXY*, umożliwiających ustawienie wybranego serwera proxy.

### Kto wywołuje funkcję main() ?

Znając parametry funkcji **main()** oraz ich znaczenie, możemy przejść do sedna dzisiejszego wpisu i zastanowić się, kto tak naprawdę wywołuje tą funkcję. Wydawać by się mogło, że odpowiedzialna jest powłoka, ponieważ to od niej zależą wartości parametrów, z którymi ta funkcja jest wywoływana. Z drugiej strony każdy program uruchamiany jest w osobnym procesie, a procesy są od siebie całkowicie odseparowane, więc program powłoki (w tym wypadku Bash) nie ma możliwości wywołania funkcji w naszym przykładowym programie. Wychodzi więc na to, że jedynym bytem uprawnionym do takiego działania jest samo jądro systemu.

W praktyce prawda jest gdzieś po środku. Co prawda nowy proces jest faktycznie tworzony i uruchamiany przez jądro systemu, ale dzieje się to na żądanie programu powłoki (przy użyciu wywołania systemowego **execve()**), który razem z tym żądaniem przekazuje do jądra komplet argumentów, podawanych podczas wywołania funkcji **main()**. Sama funkcja wywoływana jest przez fragment kodu **crt0** dodawany do programu podczas linkowania (gdzie “crt” jest skrótem od “C runtime”, a liczba 0 ma podkreślić, że jest to kod wykonywany na samym początku) – uruchamiany jest on zaraz po utworzeniu procesu i ma na celu przygotowanie programu do działania, a następnie wywołanie samej funkcji **main()**.

Aby przetestować działanie tego mechanizmu napiszmy prosty program, który będzie uruchamiał program **./main** z poprzedniego przykładu, z własnymi parametrami i zmiennymi środowiskowymi. Może on wyglądać na przykład tak:

```c
#include <unistd.h>

int main()
{
        char *my_argv[] = { "./main", "trzy", "dwa", "jeden", NULL };
        char *my_envp[] = { "Bez", "Kompilatora", NULL };

        execve("./main", my_argv, my_envp);

        return 0;
}
```

W wyniku jego kompilacji i uruchomienia powinieneś zobaczyć poniższy rezultat:

```
robert@bezkompilatora:~$ gcc -o test test.c
robert@bezkompilatora:~$ ./test
argc = 4
argv =
   [0] = ./main
   [1] = trzy
   [2] = dwa
   [3] = jeden
envp =
   [0] = Bez
   [1] = Kompilatora
```

Jak widać tym razem do programu **./main** zostały przekazane dokładnie takie tablice *argv* i *envp*, jakie podaliśmy do wywołania systemowego **execve()**. Przykład ten pokazuje dokładnie w jaki sposób proces uruchamiający dany program decyduje o argumentach funkcji **main()** tego programu. Warto zauważyć, że program ten uruchamiany jest w ramach tego samego procesu, co oznacza, że żaden kod znajdujący się za wywołaniem funkcji **execve()** nie zostanie wykonany. W praktyce funkcję tą wywołuje się najczęściej w nowym procesie utworzonym przy pomocy wywołania systemowego **fork()**, ale o tym i o wielu innych ciekawych rzeczach – w kolejnych wpisach.

### Podsumowanie

Mam nadzieję, że dzisiejszym wpisem udało mi się trochę odmagicznić kulisy działania programów. Zauważ, że w tej krótkiej analizie sięgneliśmy aż do mechanizmów systemowych, które działają zawsze tak samo, niezależnie od tego w jakim języku został napisany program. Nie ważne czy masz do czynienia z C, C++, Javą, Pythonem czy PHP – na poziomie wywołań systemowych wszystko sprowadza się do tych samych zachowań. W językach wyższego poziomu funkcja **main()** jest często schowana pod jakąś warstwą abstrakcji i na pierwszy rzut oka może nie być jej widać, ale warto pamiętać, że na ogół gdzieś tam jest, wołana w taki sam sposób i przyjmując takie same argumenty.

To tyle na dzisiaj. Jeżeli podobał Ci się wpis i chciałbyś zobaczyć takich więcej na moim blogu, koniecznie daj mi o tym znać! Zachęcam Cię też do zapisania się na mój [newsletter](/newsletter/) i polubienia mojej [strony na Facebooku](https://www.facebook.com/BezKompilatora/). Jeżeli interesuje Cię temat programowania pod Linuxem, to zapraszam Cię też do dołączenia do Facebookowej grupy łączącej osoby zainteresowane tą tematyką – link do grupy znajdziesz [tutaj](https://www.facebook.com/groups/programowanie.linux/).

Z góry dzięki i do zobaczenia! 😉

EDIT: Doprecyzowałem nieco w jaki sposób wołana jest funkcja **main()**, bo część osób zwróciła mi uwagę, że odpowiedź na tytułowe pytanie nie jest satysfakcjonująca. 🙂
