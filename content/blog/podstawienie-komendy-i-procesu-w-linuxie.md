---
title: "Podstawienie komendy i procesu w Linuxie"
date: 2018-08-13
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["bash", "podstawienie komendy", "podstawienie procesu", "potoki", "Linux"]
image: "/images/uploads/2018/08/math-table-substitution.jpg"
summary: "Po poprzednim wpisie, poświęconym Linuxowym przekierowaniom i potokom, dostałem w komentarzu pytanie na temat programu tee, a konkretnie szczególnej konstrukcji, jaką można stworzyć z jego wykorzystaniem. Umożliwia ona uzyskanie efektu “rozmnożenia” strumieni, czyli przekierowania wyjścia standardowego jednego programu,…"
---

Po poprzednim wpisie, poświęconym Linuxowym przekierowaniom i potokom, dostałem w komentarzu pytanie na temat programu **tee**, a konkretnie szczególnej konstrukcji, jaką można stworzyć z jego wykorzystaniem. Umożliwia ona uzyskanie efektu “rozmnożenia” strumieni, czyli przekierowania wyjścia standardowego jednego programu, na wejście wielu programów, przy użyciu następującej składni: prog1 | tee >(prog2) >(prog3).

Autor pytania był zainteresowany mechanizmami, które odpowiadają za działanie tej komendy. Okazało się, że odpowiedź jest dość złożona, ale na tyle interesująca, żeby stworzyć na ten temat osobny wpis. Konstrukcja wykorzystany w przykładzie nazywana jest podstawieniem procesu (ang. process substitution) i została wprowadzona w powłoce Bash. Jej i jeszcze jednej konstrukcji – podstawieniu komendy – poświęcony jest dzisiejszy wpis.

### Podstawienie komendy

Przekierowania i potoki, o których [pisałem ostatnio](/blog/przekierowania-i-potoki-okiem-programisty/), pozwalają na sterowanie przepływem danych między programami w bardzo elastyczny sposób. Czasem jednak chcemy zrobić coś innego – na przykład zapisać wynik działania komendy w zmiennej lub przekazać go jako argument wywołania innej komendy. Można to zrobić w kilku krokach przy użyciu przekierowań, ale można też wykorzystać mechanizm, który został stworzony specjalnie na takie okazje – podstawienie komendy.

Nazwa “podstawienie komendy” (ang. command substitution) dobrze opisuje działanie tej funkcji – komenda, będąca obiektem podstawienia jest uruchamiana w podpowłoce, jej wyjście standardowe jest zapisywane do bufora, parsowane przez powłokę i wstawiane w miejsce, w którym użyto składni podstawienia. Można więc w skrócie powiedzieć, że w miejscu komendy podstawiany jest rezultat jej działania.

Powłoka Bash oferuje dwie alternatywne składnie podstawienia komendy – pierwszy, wykorzystujący znak **\`** (grawis), np. prog1 \`prog2\` oraz drugi, zaczerpnięty z powłoki ksh, np. prog1 $(prog2). Ich działanie jest identyczne i jedynym powodem wprowadzenia drugiej składni były problemy z zagnieżdżaniem podstawień z użyciem pierwszej. Praktyczny przykład wykorzystania podstawienia komendy może wyglądać następująco:

```
robert@bezkompilatora:~$ cat $(find kat/ -type f)
CCC
DDD
BBB
EEE
AAA
```

Powyższe polecenie wyszukuje wszystkie zwykłe pliki wewnątrz poddrzewa katalogów zaczynającego się od katalogu *kat/* (odpowiada za to program **find**), a następnie wypisuje ich zawartość na ekran z użyciem programu **cat**. Lista ścieżek do plików wypisywana na wyjście standardowe programu **find** umieszczana jest w miejscu podstawienia i stanowi listę argumentów programu **cat**.

Podstawienie komendy realizowane jest przez powłokę z użyciem potoku, do którego przekierowywane jest wyjście standardowe komendy będącej obiektem podstawienia. Jeżeli komenda jest bardziej złożona (np. zawiera kilka programów połączonych potokiem lub wykorzystuje zmienne powłoki) uruchamiana jest w podpowłoce, której wyjście standardowe przekierowywane jest do potoku otwartego na potrzeby podstawienia.

Powłoka realizująca podstawienie odczytuje dane z potoku i zapisuje je w buforze – jego rozmiar zależy od konfiguracji systemu i zazwyczaj mieści się w zakresie od kilkuset kilobajtów do kilkunastu megabajtów. Bufor ten jest następnie wykorzystywany podczas wykonywania komendy, której częścią było podstawienie.

Warto zauważyć, że podczas odczytywania danych z potoku przez powłokę odbywa się ich parsowanie – ciąg znaków podstawiony w miejscu komendy nie jest więc taki sam, jak ciąg znaków wypisany na wyjście standardowe programu będącego obiektem podstawienia. Przekształcenie jest dosyć proste i polega na zastąpieniu każdego podciągu białych znaków pojedynczą spacją – w większości przypadków poszczególne słowa i tak będą argumentami innej komendy, więc białe znaki zostałyby tak czy inaczej pominięte.

### Podstawienie procesu

Ciekawszym i bardziej zaawansowanym mechanizmem jest podstawienie procesu (ang. process substitution). Idea jest podobna jak w przypadku podstawienia komendy, z tą różnicą, że nie jest podstawiany rezultat działania komendy, ale ścieżka do pliku reprezentującego potok. Połączony jest on z wejściem lub wyjściem standardowym podpowłoki, w której uruchamiana jest komenda będąca obiektem podstawienia.

Składnia podstawienia procesu jest następująca:

-   prog1 >(prog2) – dla podstawienia wejścia standardowego,
-   prog1 \<(prog2) – dla podstawienia wyjścia standardowego.

Ze względu na fakt, że w miejsce komendy podstawiana jest ścieżka do pliku potoku, podstawienie procesu może być użyte z programami, które jako argument przyjmują ścieżkę do pliku. Przykładem takiego programu jest **cat**, wypisujący zawartość pliku na wyjście standardowe. Możemy więc skonstruować następującą komendę:

```
robert@bezkompilatora:~$ cat <(echo "ABC")
ABC
```

Wynikiem jej działania jest wypisanie w konsoli ciągu znaków *ABC*, jednak sposób w jaki ten efekt jest osiągany jest bardzo interesujący. W momencie uruchomienia komendy, powłoka tworzy potok, którego piszący koniec ustawiany jest jako wyjście standardowe podpowłoki, w której uruchamiana jest następnie komenda echo “ABC”. Dzieje się to w bardzo podobny sposób jak w przypadku potoków tworzonych z użyciem operatora **|**.

Drugi koniec potoku dziedziczony jest przez proces programu **cat**, który uruchamiany jest współbieżnie zaraz po wystartowaniu podstawianej komendy. Nie jest on jednak ustawiany na wejście standardowe, tak jak w przypadku zwykłych potoków, ale pozostaje dostępny pod numerem deskryptora, pod którym został otwarty przez proces powłoki.

Z technicznego punktu widzenia powinno to wystarczyć, żeby umożliwić programowi **cat** czytanie z potoku. Program ten nie jest jednak (podobnie jak większość innych programów) dostosowany do działania w takim modelu – oczekuje on ścieżki do pliku na liście argumentów komendy. Żeby rozwiązać ten problem, powłoka stosuje sprytną sztuczkę – przekazuje jako argument programu ścieżkę do jego własnego deskryptora pliku!

Możemy to łatwo zobaczyć analizując działanie komendy z użyciem programu **strace**:

```
robert@bezkompilatora:~$ strace cat <(echo "ABC")
execve("/bin/cat", ["cat", "/dev/fd/63"], 0x7ffcc644c478 /* 63 vars */) = 0
...
openat(AT_FDCWD, "/dev/fd/63", O_RDONLY) = 3
read(3, "ABC\n", 131072)                = 4
write(1, "ABC\n", 4)                    = 4
close(3)                                = 0
...
```

Powyższy listing jest nieco okrojony – dla uproszczenia zostawiłem w nim tylko najbardziej istotne linie. Drugi argument wywołania **execve()** zawiera tablicę **argv** procesu. Możemy tam łatwo zauważyć, że program **cat** został uruchomiony z jednym argumentem – jest nim ścieżka do pliku */dev/fd/63*. Katalog */dev/fd/* jest linkiem symbolicznym na */dev/self/fd*, czyli katalog w *procfs* zawierający pliki reprezentujące deskryptory plików danego procesu. Program **cat** otwierając plik */dev/fd/63* w rzeczywistości tworzy duplikat deskryptora o numerze 63, wskazującego na potok łączący go z podpowłoką podstawienia.

Podstawienie procesu można w ciekawy sposób wykorzystać w połączeniu z programem **tee**, który potrafi zapisywać duplikaty danych otrzymywanych na wejście standardowe na bieżąco do wielu plików. Zadanie to realizowane jest poprzez cykliczne odczytywanie danych z wejścia standardowego w 8192-bajtowych paczkach i zapisywanie ich kolejno do wszystkich otwartych plików. Jeśli jako argumenty programu **tee** podamy kilka instancji podstawienia procesu, uzyskamy efekt “rozmnożenia” strumienia wejściowego. Prezentuje to poniższy przykład:

```
robert@bezkompilatora:~$ echo "ABC" | tee >(cat) >(cat)
ABC
ABC
ABC
```

Powyższa metoda umożliwia tworzenie rozgałęzień podczas modelowania przepływu danych między programami. Jednocześnie wyjaśnienie mechanizmów odpowiedzialnych za jej działanie stanowi odpowiedź na oryginalne pytanie wspomniane we wstępie.

### Podsumowanie

Zarówno podstawienie komendy jak i podstawienie procesu może być bardzo przydatne w skryptach, w przypadku gdy potrzebujemy sterować przepływem danych lub warunkować działanie kolejnych komend na podstawie wyników z poprzednich. Pozwalają one na łatwe wykonanie operacji, które przy użyciu zwykłych przekierowań i potoków byłyby o wiele bardziej pracochłonne.

Podstawienie komendy jest bardziej uniwersalne, ponieważ nie potrzebuje żadnego specjalnego wsparcia ze strony programów – nie muszą one umieć czytać lub pisać do pliku, którego ścieżkę otrzymają jako argument w linii poleceń. Z drugiej strony w przypadku podstawienia komendy poważnym ograniczeniem jest wielkość bufora, do którego zapisywane są dane.

Podstawienie komendy nie umożliwia też skorzystanie ze współbieżności – kolejne programy uruchamiane są dopiero po zebraniu kompletnego wyjścia z podstawianej komendy. Powoduje to zarówno problemy wydajnościowe jak i ogranicza możliwość wykorzystania tego mechanizmu do pracy z relatywnie małymi ilościami danych. Ograniczenia te nie występują w przypadku podstawienia procesu.

• • •

Dziękuję Ci za przeczytanie tego wpisu! Jeśli masz jakieś pytania, uwagi lub chciałbyś coś dodać od siebie, to koniecznie napisz komentarz pod wpisem! Możesz mnie też znaleźć na [Facebooku](https://www.facebook.com/BezKompilatora/), a jeśli chcesz, żebym od czasu do czasu napisał do Ciebie maila, to zapisz się na mój [newsletter](/newsletter/). Dziękuję i do zobaczenia! 🙂
