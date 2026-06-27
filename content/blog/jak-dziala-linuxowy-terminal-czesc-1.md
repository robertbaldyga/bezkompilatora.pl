---
title: "Jak działa Linuxowy terminal? (część 1)"
date: 2018-12-10
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["terminal", "TTY", "Linux", "emulator terminala"]
image: "/images/uploads/2018/12/girl-how-it-works-question-marks.jpg"
summary: "Umiejętność korzystania z konsoli to dla użytkowników Linuxa zupełna podstawa, choć poziom znajomości tego narzędzia może być różny w zależności od naszych potrzeb. Na jednym końcu skali znajdują się hobbyści, którym wystarcza podstawowy zestaw komend, a na drugim…"
---

Umiejętność korzystania z konsoli to dla użytkowników Linuxa zupełna podstawa, choć poziom znajomości tego narzędzia może być różny w zależności od naszych potrzeb. Na jednym końcu skali znajdują się hobbyści, którym wystarcza podstawowy zestaw komend, a na drugim administratorzy, piszący skrypty i używający szerokiego zestawu poleceń.

Gdzieś po środku znajdują się programiści. Konsola jest dla nich jednym z podstawowych narzędzi pracy, ale wykorzystują ją w ograniczonym stopniu. Często wystarcza im **git**, **vim**, **make**, **gcc**, **gdb** oraz mały zestaw narzędzi służących do testowania tworzonego przez nich oprogramowania. Mogłoby się wydawać, że praca programisty nie wymaga zbyt wiele konsolowej wiedzy. Z perspektywy programisty przydatna jest jednak nie tylko umiejętność używania konsoli, ale też zrozumienie mechanizmów stojących za jej działaniem.

Jeżeli więc interesuje Cię programowanie pod Linuxem, ale nie do końca czujesz co się dzieje po drugiej stronie okienka z mrugającym kursorkiem, to zdecydowanie zapraszam Cię do lektury, bo właśnie o tym będzie dzisiejszy wpis.

### Anatomia terminala

Gdyby zapytać przeciętnego użytkownika Linuxa czym jest terminal, to zapewne odpowiedziałby, że jest to okienkowy program dający dostęp do powłoki. Czyli taki trochę okienkowy Bash. Intuicja podpowiada nam, że da się to zrobić tak łatwo, więc często kończymy rozważania na tym etapie. Rzeczywistość jest jednak bardziej skomplikowana.

Jak zwykle za wszystkim stoi historia. Dawno dawno temu, kiedy jeszcze nie istniały graficzne emulatory terminala, a Linuxa nie było nawet w planach, terminale służące do komunikacji z komputerem były… osobnymi urządzeniami. W początkowym okresie nie miały one nawet monitora i wyglądały jak przerobione maszyny do pisania. Pokazywałem je już kiedyś w [tym wpisie](/blog/badz-jak-hacker-wprowadzenie-do-wiersza-polecen/). W ogólności możemy je sobie jednak wyobrazić jako urządzenia składające się z monitora i klawiatury podłączone do komputera za pośrednictwem portu szeregowego.

Rozwiązanie to miało tą zaletę, że pozwalało używać jednego terminala do obsługi wielu komputerów. Przy ówczesnych cenach sprzętu komputerowego i ograniczonych zasobach sprzętowych miało to spore uzasadnienie. Dodatkowo zarówno terminal jak i komputer można było podłączyć do modemu, co dawało możliwość pracy zdalnej. Wszystko to w czasach, kiedy nie istniało jeszcze nawet słowo *internet*.

W takich warunkach powstawał system Unix. Jak łatwo się domyślić, rozwiązania zastosowane w tym systemie bardzo mocno odzwierciedlają koncepcję ówczesnego, zewnętrznego terminala. Później te rozwiązania zostały zaimplementowane w systemie Linux i w taki oto sposób mamy w naszych komputerach historyczną spuściznę po czasach, kiedy komputery zajmowały pół pokoju.

Z biegiem lat zastosowane rozwiązania były modyfikowane, ale ogólny zamysł pozostał niezmieniony. Przejdziemy więc krótko przez kilka etapów rozwoju interfejsu terminala, żeby zrozumieć w jaki sposób powstała architektura jaką możemy spotkać w dzisiejszym Linuxie.  

### Terminal jako osobne urządzenie

Jak pisałem wcześniej, na początku terminal był osobnym urządzeniem. Poniższy schemat przedstawia najważniejsze komponenty biorące udział w komunikacji pomiędzy użytkownikiem korzystającym z zewnętrznego terminala a programem działającym w sesji:

![](https://lh4.googleusercontent.com/_CQMCD2JTiuzqVUoqhLSeOKcQ8WiF5fUu9j8AATR86aaY4JVQxKgXtbEl60XwWP3-fhKc8SCh0IaxP3FHMOgYJoF5BfsH5L0zJDU9c7oRWsIQ7BphUl7F_mGxaFMq_m-eCp0npOc)

Po lewej stronie znajduje się komputer, a po prawej urządzenie terminala. Połączone są interfejsem RS232, który jest chyba najpopularniejszą implementacją interfejsu portu szeregowego i jeszcze kilka lat temu można go było znaleźć w większości komputerów PC (oznaczany był jako COM). Dziś można go spotkać głównie w sprzęcie specjalistycznym i na płytach głównych serwerów.

Zarówno w komputerze jak i w terminalu znajdziemy kontroler portu szeregowego, który odpowiada za sprzętową część komunikacji. W przypadku Linuxa nad działaniem sprzętowego kontrolera portu czuwa sterownik działający w przestrzeni jądra. Dostarcza on abstrakcyjny interfejs dostępu do portu szeregowego, dzięki czemu niezależnie od tego, jaki konkretnie kontroler znajduje się na płycie głównej, pozostałe komponenty jądra mogą z niego korzystać w jednakowy sposób.

Nad sterownikiem portu szeregowego znajduje się blok opisany jako *Sterownik TTY*, który odpowiada części jądra odpowiedzialnej za dostarczenie do przestrzeni użytkownika urządzenia terminala wraz z całą jego funkcjonalnością. Jak się wkrótce przekonamy, funkcjonalność ta jest dosyć rozbudowana.

Plik urządzenia terminala dostępny w przestrzeni użytkownika służy jako wejście i wyjście standardowe programów działających w sesji terminala (o ile nie użyto przekierowań). Komendy wprowadzone przez użytkownika na klawiaturze terminala są odczytywane przez program użytkownika właśnie z tego pliku. Natomiast wpisanie do niego danych skutkuje ich wypisaniem na ekranie terminala.

Zewnętrzne terminale są w większości już historią, ale z perspektywy powłoki i programów niewiele się nie zmieniło. Nadal komunikują się one z terminalem za pośrednictwem pliku urządzenia dostarczanego przez jądro. Wynika to po części z kompatybilności wstecznej, a po części z Linuxowej filozofii zarządzania sesją, o której powiemy sobie później. Tymczasem przenieśmy się krok dalej w ewolucji interfejsu terminala i przeanalizujmy działanie obecnej w naszych komputerach do dziś wirtualnej konsoli.

### Wirtualna konsola

Kiedy pojawiły się pierwsze komputery osobiste, a interfejs użytkownika przyjął postać monitora i klawiatury podłączonych bezpośrednio do komputera, zewnętrzny sprzętowy terminal został zastąpiony wirtualnym terminalem (ang. virtual terminal, VT) lub wirtualną konsolą (ang. virtual console, VC) emulowaną wewnętrznie przez jądro. Obie te nazwy oznaczają to samo i mogą być używane zamiennie. Nową sytuację obrazuje poniższy schemat:  

![](https://lh4.googleusercontent.com/KC7Qn8vS8x6HioRkbmpStFb60vs-_66f-pcZKJNfWzFwKXF4q5OQbNTrNkZk5P2w00758U4z2rTXrLB3GzdD5_js-YR9w23UTni4udFdFPHIQ7vSo6Wyze0qiVIzLYKi8J5QJcZw)

W tym wypadku wygląda to zdecydowanie prościej, ale warto zauważyć, że różnica polega głównie na usunięciu kilku elementów pomiędzy programem a interfejsem użytkownika. Kontroler terminala, z którym warstwa TTY komunikowała się za pośrednictwem portu szeregowego został teraz zastąpiony emulatorem terminala, który korzysta z peryferiów podłączonych bezpośrednio do komputera.

Nie zmienił się zbytnio ani interfejs użytkownika, który nadal składa się z klawiatury i monitora pracującego w trybie znakowym, ani sposób w jaki programy wchodzą w interakcję z terminalem. Tryb wirtualnej konsoli jest nadal dostępny w Linuxie i możemy do niego przejść korzystając z kombinacji klawiszy **Ctrl + Alt +** jeden z klawiszy od **F1** do **F6**. Nie każdy wirtualny terminal otworzy się w trybie tekstowym, ponieważ we współczesnych dystrybucjach desktopowych jeden lub kilka z nich wykorzystywanych jest przez powłokę graficzną.

Mając już wgląd w rys historyczny przejdźmy teraz do najświeższego stadium rozwoju tekstowego interfejsu użytkownika – emulatora terminala działającego w przestrzeni użytkownika.

### Emulator terminala

Przeniesienie emulacji terminala do przestrzeni użytkownika umożliwiło stworzenie aplikacji takich jak **xterm**, umożliwiając otwieranie sesji terminala z poziomu powłoki graficznej. Sprawiło to, że terminal został być postrzegany jako jedna z wielu aplikacji jakie można uruchomić w systemie, ale jedna rzecz się nie zmieniła – interfejs między terminalem a programami działającymi w jego sesji. Nadal komunikują się one z terminalem za pośrednictwem pliku urządzenia dostarczanego przez jądro.

Zachowanie tej architektury przy jednoczesnym przeniesieniu emulacji terminala do przestrzeni użytkownika wymagało stworzenie specyficznego tworu – pseudo-terminala. Wprowadzono interfejs dostarczany przez jądro, który przechodzi przez nie “na wylot”. Można to sobie wyobrazić jako potok, tylko bardziej skomplikowany i dostarczający pełną funkcjonalność terminala.

Po jednej stronie pseudo-terminala znajduje się emulator terminala, komunikujący się z warstwą TTY za pośrednictwem pliku urządzenia */dev/ptmx*, a po drugiej stronie jest użytkownik pseudo-terminala (np. Bash) korzystający z pliku urządzenia znajdującego się w katalogu */dev/pts/*, np. */dev/pts/0*. Otwarcie pliku */dev/ptmx* powoduje utworzenie nowego pseudo-terminala. Każdy pseudo-terminal otrzymuje unikalny numer, który jest również nazwą pliku urządzenia terminala w katalogu */dev/pts/*.

Sytuację tą obrazuje poniższy schemat:

![](https://lh6.googleusercontent.com/qVXCLzHJ7yOkV1LKo_ClXwHlbdqIATKCkaZ0PYHhQNQsqIVYu3CIZCqCnDD1R2BHK_5wA-3bLFTnKh1MdQ9fwWb40FApShmAs7CZh48KFzmLxDD6YrNqfnQsOlce3bgjG4YN4cbI)

Tym razem rysunek wydaje się nieco bardziej skomplikowany, ale taki jest koszt elastyczności. W gruncie rzeczy najważniejsza zmiana to dodatkowe przejście przez przestrzeń użytkownika, ponieważ to właśnie tam znajduje się teraz emulator terminala. Reszta powinna wyglądać znajomo.

### Więcej niż emulacja

Wyniesienie obsługi terminala do przestrzeni użytkownika otworzyło nowe możliwości, znacznie wykraczające poza tworzenie okienkowych emulatorów terminala. Stało się możliwe na przykład uruchamianie wielu sesji pseudo-terminala na potrzeby takich narzędzi jak **screen** czy **tmux**. Dzięki temu na wprowadzeniu pseudo-terminala zyskali nie tylko użytkownicy środowisk graficznych, ale też entuzjaści wirtualnej konsoli (czyli głownie administratorzy, ale też programiści).

Ważnym użytkownikiem pseudo-terminali jest też **sshd**, czyli serwer usługi SSH. Dla osób które jej jeszcze nie znają – jest to usługa umożliwiająca łatwe i bezpieczne logowanie się na zdalne maszyny za pośrednictwem sieci. Gdyby nie możliwość tworzenia pseudo-terminala w przestrzeni użytkownika, cały serwer SSH musiałby być zaimplementowany w jądrze.

Lista narzędzi, których stworzenie bez pseudo-terminala byłoby niemożliwe lub co najmniej znacznie utrudnione na tym się nie kończy. Warto tu wymienić jeszcze choćby serwer **telnet** lub program **expect**, dający możliwość oskryptowania programów dostarczających interaktywny interfejs użytkownika.

### Podsumowanie

Tyle części wprowadzającej. Mam nadzieję, że rozjaśniłem trochę ogólną koncepcję stojącą za działaniem Linuxowego terminala. Jeżeli nasuwają Ci się jakieś pytania, to dobrze, bo to zaledwie wierzchołek góry lodowej. W kolejnych częściach wpisu zagłębię się bardziej w szczegóły techniczne i pokażę kilka ciekawych eksperymentów związanych z terminalem.

**• • •**

Jeżeli masz jakieś pytania lub uwagi, proszę, podziel się nimi w komentarzu. Pozwoli mi to lepiej przygotować kolejne części wpisu. A jeśli jeszcze nie subskrybujesz mojego newslettera, możesz to zrobić [tutaj](/newsletter/) – dzięki temu będę mógł Cię poinformować o kolejnych wpisach. Zachęcam Cię też do polubienia mojej [strony na Facebooku](https://www.facebook.com/BezKompilatora/).

Z góry dzięki i do zobaczenia! 🙂

[Przejdź do drugiej części wpisu >>](/blog/jak-dziala-linuxowy-terminal-czesc-2/)
