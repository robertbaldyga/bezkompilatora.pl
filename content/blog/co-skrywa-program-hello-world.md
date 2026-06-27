---
title: 'Co skrywa przed Tobą program „Hello World!"? Poznaj jego tajemnice.'
date: 2018-04-29
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["linux", "syscall", "strace", "c", "programowanie"]
image: "/images/uploads/2018/04/surprised_with_laptop_glasses_up.jpg"
summary: "Ten tytuł to nie click-bait. Może to zabrzmi nieco dziwnie, ale w dzisiejszym wpisie będziemy analizować działanie programu “Hello World!”. Nie będziemy jednak tego robić na poziomie kodu źródłowego – z pewnością znasz i rozumiesz go bardzo dobrze…."
---

Ten tytuł to nie click-bait. Może to zabrzmi nieco dziwnie, ale w dzisiejszym wpisie będziemy analizować działanie programu “Hello World!”. Nie będziemy jednak tego robić na poziomie kodu źródłowego – z pewnością znasz i rozumiesz go bardzo dobrze. Skupimy się za to na analizie działania programu w środowisku systemu operacyjnego. Z dzisiejszego wpisu dowiesz się  w jaki sposób programy komunikują się z jądrem Linuxa.

### Przygotowania

Do przeprowadzenia eksperymentów opisanych w tym wpisie, potrzebna będzie Ci dowolna dystrybucja Linux’a, ulubiony edytor kodu, kompilator GCC oraz program Strace. Jeżeli używasz Ubuntu, to dwa ostatnie możesz zainstalować komendą sudo apt install gcc strace.

Kompilator GCC powinieneś już znać z [poprzedniego wpisu](/blog/programuj-jak-hacker-kodowanie-w-wierszu-polecen/), natomiast w sprawie programu Strace należy Ci się krótkie wyjaśnienie. Służy on do analizy innych programów pod kątem interakcji z jądrem systemu – pozwala on podejrzeć wszystkie wywołania systemowe, które wykonuje dany program. Jak się wkrótce przekonasz, nawet bardzo prosty program może ich wykonać całkiem sporo. Jeśli zastanawiasz się teraz, czym są wywołania systemowe, to już spieszę z odpowiedzią. 🙂

### Wywołania systemowe

Żeby zrozumieć czym są wywołania systemowe (ang. *syscall*), musisz najpierw zrozumieć relację pomiędzy jądrem a resztą systemu. Cały kod jądra oraz wszystkie jego dane znajdują się w obszarze pamięci niedostępnym bezpośrednio dla programów użytkownika. Obszar ten nazywa się *przestrzenią jądra* (ang. *kernel space*), natomiast przestrzeń przeznaczona dla zwykłych użytkowników, nazywana jest *przestrzenią użytkownika* (ang. *user space*).

Przestrzeń użytkownika to miejsce, w którym występuje separacja na jeszcze mniejsze przestrzenie – każdy program posiada własną *przestrzeń adresową* (ang. *address space*) niedostępną dla innych programów, przez co programy nie mogą na siebie wzajemnie wpływać. W jądrze sytuacja jest inna. Ma ono dostęp do własnej przestrzeni adresowej oraz do przestrzeni adresowych wszystkich działających programów – jądro ma kontrolę nad wszystkim.

Dlatego bardzo niebezpieczne byłoby dawanie programom użytkownika bezpośredniego dostępu do przestrzeni jądra – jeżeli by tak było, każdy program mógłby dowolnie wpływać na inne programy oraz na samo jądro. Kod w JavaScripcie załadowany z dowolnej strony internetowej mógłby wykraść lub uszkodzić wszystkie dane z Twojego komputera!

Jądro Linuxa jest na szczęście zabezpieczone przed takimi sytuacjami. Powoduje to jednak, że nie można bezpośrednio wysłać mu żadnych danych ani wywołać żadnej jego funkcji. Dlatego potrzebny jest inny mechanizm, umożliwiający korzystanie z jego usług – wywołania systemowe.

Wywołania systemowe korzystają ze specjalnej instrukcji procesora, informującej jądro o tym, że nastąpiło wywołanie. Z perspektywy programów w przestrzeni użytkownika, jest to praktycznie jedyny sposób na porozumiewanie się z jądrem. Użycie wywołania systemowego powoduje uruchomienie w jądrze procedury, która sprawdza najpierw, czy podane argumenty są poprawne oraz czy program, który je wywołał, ma odpowiednie uprawnienia, a następnie wykonuje zlecone działanie.

Jądro Linuxa posiada ponad trzysta wywołań systemowych. Służą one do zarządzania procesami, pamięcią, komunikacji sieciowej, przeprowadzania operacji wejścia/wyjścia oraz wielu innych rzeczy. Korzystają z nich wszystkie praktycznie programy – nawet te najprostsze.

Kiedy już wiesz czym są i do czego służą wywołania systemowe, pora przyjrzeć się, w jaki sposób korzysta z nich program “Hello World!”.

### Użycie programu Strace

Zanim rozpoczniesz eksperyment, potrzebujesz napisać oraz skompilować badany program. Kod programu załączam poniżej:

```c
#include <stdio.h>

int main() {
    printf(“Hello World!\n”);
    return 0;
}
```

Po zapisaniu kodu w pliku o nazwie hello.c i skompilowaniu go przy użyciu komendy gcc hello.c -o program, jesteś gotowy do użycia programu Strace. W najprostszym wariancie przyjmuje on jeden argument – ścieżkę do analizowanego programu. W opisywanym przykładzie, pełna postać komendy to strace ./program. Podczas działania, Strace uruchamia analizowany program, a wszystkie jego wywołania systemowe są wypisywane na konsolę. W przypadku programu “Hello World!” rezultat jest następujący:

```
robert@bezkompilatora:~$ strace ./program
execve("./program", ["./program"], [/* 74 vars */]) = 0
brk(NULL)                               = 0x1f05000
access("/etc/ld.so.nohwcap", F_OK)      = -1 ENOENT (No such file or directory)
mmap(NULL, 8192, 3, 0x22, -1, 0) = 0x7fd36a39a000
access("/etc/ld.so.preload", R_OK)      = -1 ENOENT (No such file or directory)
open("/etc/ld.so.cache", O_RDONLY|O_CLOEXEC) = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=89641, ...}) = 0
mmap(NULL, 89641, 1, 0x2, 3, 0) = 0x7fd36a384000
close(3)                                = 0
access("/etc/ld.so.nohwcap", F_OK)      = -1 ENOENT (No such file or directory)
open("/lib/x86_64-linux-gnu/libc.so.6", O_RDONLY|O_CLOEXEC) = 3
read(3, "\177ELF\2\1\1\3\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0P\t\2\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=1868984, ...}) = 0
mmap(NULL, 3971488, 5, 0x802, 3, 0) = 0x7fd369dad000
mprotect(0x7fd369f6d000, 2097152, PROT_NONE) = 0
mmap(0x7fd36a16d000, 24576, 3, 0x812, 3, 0x1c0000) = 0x7fd36a16d000
mmap(0x7fd36a173000, 14752, 3, 0x32, -1, 0) = 0x7fd36a173000
close(3)                                = 0
mmap(NULL, 4096, 3, 0x22, -1, 0) = 0x7fd36a383000
mmap(NULL, 4096, 3, 0x22, -1, 0) = 0x7fd36a382000
mmap(NULL, 4096, 3, 0x22, -1, 0) = 0x7fd36a381000
arch_prctl(ARCH_SET_FS, 0x7fd36a382700) = 0
mprotect(0x7fd36a16d000, 16384, PROT_READ) = 0
mprotect(0x600000, 4096, PROT_READ)     = 0
mprotect(0x7fd36a39c000, 4096, PROT_READ) = 0
munmap(0x7fd36a384000, 89641)           = 0
fstat(1, {st_mode=S_IFCHR|0620, st_rdev=makedev(136, 0), ...}) = 0
brk(NULL)                               = 0x1f05000
brk(0x1f26000)                          = 0x1f26000
write(1, "Hello World!\n", 13)          = 13
exit_group(0)                           = ?
+++ exited with 0 +++
```

Każda linia to osobne wywołanie systemowe. Program, którego jedynym zadaniem jest wypisanie prostego komunikatu na konsolę, wywołał ich aż trzydzieści dwa! Nie będziemy tu analizować ich wszystkich, ale przyjrzymy się kilku najciekawszym z nich, żeby zorientować się o co w tym wszystkim chodzi.

### Analiza wyników

Czytanie wyników działania programu Strace nie jest trudne. Każdej linii pojawia się nazwa wywołania systemowego, następnie w nawiasach podane są jego parametry, a po znaku = zwrócona wartość. Liczba parametrów oraz ich znaczenie mogą być różne dla różnych wywołań. Znaczenie zwracanej wartości również może być różne, ale obowiązuje ogólna zasada, że zero lub liczba dodatnia oznacza sukces, a wartość ujemna oznacza błąd.

Jak widać na powyższym listingu, część wywołań zakończyła się błędem. Nie jest to jednak powód do zmartwień – wykonywane są one “na próbę” i jeżeli się nie powiodą, to program jest w stanie poradzić sobie w inny sposób. Niektóre błędy są nawet całkiem w porządku – na przykład wywołanie access(„/etc/ld.so.nohwcap”, F\_OK) służy sprawdzeniu, czy powinna być załadowana niezoptymalizowana wersja biblioteki *ld.so*. Jeżeli to wywołanie zakończy się błędem, to zostanie z kolei użyta wersja zoptymalizowana pod konkretny procesor, co w większości przypadków jest działaniem pożądanym!

Wywołanie execve(„./program”, \[„./program”\], \[/\* 74 vars \*/\]) nie przez przypadek występuje na liście jako pierwsze. Odpowiedzialne jest ono za utworzenie nowego procesu, w ramach którego będzie wykonywany program. Warto zwrócić uwagę, że pierwszy argument wywołania to ścieżka do uruchamianego programu – to jądro systemu inicjuje jego wykonanie. Pozostałe dwa argumenty to tablica argv oraz tablica zmiennych środowiskowych. Wszystkie kolejne wywołania wykonywane są z procesu utworzonego za pośrednictwem tego wywołania.

Znaczna większość kolejnych wywołań dołożona została do programu w procesie kompilacji i linkowania. Służą one przygotowaniu właściwej części programu do wykonania – wczytują linkowane dynamicznie biblioteki, alokują pamięć i sprawdzają ustawienia terminala, z którego uruchomiony został program.

Dopiero na przedostatniej pozycji znajduje się najbardziej interesujące nas wywołanie write(1, „Hello World!\\n”, 13), wypisujące na ekran pożądany komunikat. Przyjmuje ono trzy argumenty – deskryptor pliku standardowego wyjścia, treść wiadomości do wypisania oraz jej rozmiar. Zagadkowy może tu być występujący na pierwszej pozycji deskryptor pliku – w końcu funkcja printf() nie przyjmuje takiego argumentu. Wynika to jednak z faktu, że standardowe wejście i wyjście programu mają z góry ustalone numery deskryptorów – odpowiednio 0 i 1 – więc funkcje biblioteki standardowej nie muszą przyjmować ich jako argumenty. Wywołanie jako rezultat zwraca liczbę zapisanych bajtów, jako potwierdzenie, że cała długość komunikatu została wypisana.

Ostatnie wywołanie exit\_group(0) kończy działanie programu, przekazując do jądra informację o statusie zakończenia programu – wartość zwróconą z funkcji main().

### Podsumowanie

Jak miałeś okazję się przekonać, nawet tak prosty program jak “Hello World!” wchodzi w całkiem sporą interakcję z jądrem systemu. Daje to pewne wyobrażenie nie tylko o tym, jak ważną rolę pełnią wywołania systemowe, ale jak wydajny musi to być mechanizm – bardziej rozbudowane programy mogą wywoływać ich wiele tysięcy podczas każdej sekundy działania.

W dzisiejszym wpisie potraktowałem wywołania systemowe dość powierzchownie – pisałem o efektach ich działania nie wnikając zbytnio w to, w jaki sposób to działanie jest realizowane. Głównym powodem jest fakt, że obsługa wywołań systemowych jest na ogół bardzo złożona i jej zrozumienie wymaga pewnej wiedzy o funkcjonowaniu samego jądra systemu. Postaram się rozwinąć ten temat w kolejnych wpisach, poświęconych programowaniu pod Linuxem.

To tyle na dzisiaj. Jeżeli masz jakieś pytania związane z wpisem lub po prostu chciałbyś opowiedzieć o swoich przemyśleniach na ten temat, napisz komentarz poniżej. A jeśli nie chcesz przegapić kolejnych wpisów, zapisz się na mój [newsletter](/newsletter/) i polub moją [stronę na Facebooku](https://www.facebook.com/BezKompilatora/). Z góry dzięki i do zobaczenia! 🙂
