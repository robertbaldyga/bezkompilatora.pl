---
title: "Programuj jak hacker! – kodowanie w wierszu poleceń"
date: 2018-04-15
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["linux", "vim", "emacs", "nano", "terminal", "gcc"]
image: "/images/uploads/2018/04/young_man_laptop_happy.jpg"
summary: "Cześć! Pisałem już o podstawach użycia Linuxowego wiersza poleceń i o zarządzaniu programami z jego użyciem, więc dziś przyszedł czas na kolejny etap – programowanie w wierszu poleceń. W dzisiejszym wpisie pokażę Ci kilka przydatnych narzędzi do edycji…"
---

Cześć! Pisałem już o podstawach użycia Linuxowego wiersza poleceń i o zarządzaniu programami z jego użyciem, więc dziś przyszedł czas na kolejny etap – programowanie w wierszu poleceń. W dzisiejszym wpisie pokażę Ci kilka przydatnych narzędzi do edycji kodu oraz opiszę proces kompilacji kodu z użyciem kompilatora GCC.

### Pisanie kodu w konsoli

Edycja kodu z poziomu konsoli tylko nieznacznie różni się od edycji w zintegrowanym środowisku programistycznym. Współczesne terminalowe edytory tekstu oferują nie tylko podstawowe narzędzia ułatwiające edycję czy proste podświetlanie składni, ale także wiele zaawansowanych funkcji, takich jak integracje z systemami budowania i kontroli wersji, czy na przykład makra edytora Vim, umożliwiające automatyzację złożonych zmian w kodzie.

Linux posiada kilka ciekawych edytorów, które można wykorzystać do pisania kodu. Pośród nich warto wymienić dwa najpopularniejsze i najbardziej zaawansowane – Vim’a i Emacs’a. Ich użytkownicy toczą odwieczny spór, o to który z nich jest lepszy. Poza nimi istnieje jeszcze kilka mniejszych edytorów, takich jak nano, pico czy mcedit, ale używa się ich bardzo rzadko, głównie w sytuacjach gdy trzeba coś zrobić w środowisku, gdzie Vim i Emacs nie są dostępne. Przykładem takiego środowiska są systemy embedded, chociaż i tam coraz częściej można już spotkać domyślnie zainstalowanego Vim’a.

Poniżej opisuję krótko trzy spośród wymienionych – Vim’a i Emacs’a z oczywistych względów, oraz nano, z uwagi na jego szeroką dostępność oraz łatwość obsługi.

Domyślnie w Ubuntu zainstalowany jest tylko nano, więc jeśli chcesz skorzystać z Vim’a lub Emacs’a, musisz je najpierw zainstalować. Możesz to zrobić przy użyciu polecenia sudo apt install vim emacs.

Kiedy wszystko masz już przygotowane, możemy przejść do omawiania poszczególnych edytorów. Zacznę od najprostszego z nich – nano.

### Edytor nano

Edytor nano przypomina rozbudowany windowsowy Notatnik – jest bardzo minimalistyczny. Nie jest to na pewno wymarzone narzędzie programisty, ale do prostej edycji kodu lub plików konfiguracyjnych w zupełności wystarcza. Aby go uruchomić, w wierszu poleceń wpisz komendę nano i jako argument podaj nazwę pliku. Poniżej przykład edycji pliku main.c zawierającego program Hello World. Pełna postać komendy to nano main.c.

![edytor-nano](/images/wp-content/gallery/edytory-w-wierszu-polecen/edytor-nano.png)

Nano posiada tylko jeden tryb edycji, w którym wpisywany tekst pojawia się w miejscu kursora, czyli tak jak się to dzieje standardowo w terminalu. Pozycją kursora możesz sterować za pomocą strzałek, jak w większości edytorów. Na dole znajduje się krótka rozpiska najczęściej używanych skrótów klawiszowych. Symbol ^ odpowiada klawiszowi Ctrl, czyli żeby wyświetlić pomoc powinieneś użyć kombinacji Ctrl+g, żeby zapisać plik Ctrl+o, a żeby opuścić program Ctrl+x.

Na pewno zwrócił Twoją uwagę nietypowy wybór skrótów klawiszowych – prawie wszystkie z nich różnią się od ogólnie przyjętych konwencji, co sprawia, że na początku korzystania z programu konieczne jest częste zaglądanie do pomocy. Trzeba jednak pamiętać, że pierwsze wersje programu nano (a właściwie pico – jego pierwowzoru) powstały kilka lat przed utworzeniem obecnych konwencji, więc trzeba mu to wybaczyć.

### Edytor Emacs

Emacs to narzędzie zupełnie innej klasy. Został on od początku stworzony jako edytor dla programistów i od ponad 40 lat jest ciągle rozwijany i wzbogacany o nowe funkcjonalności. Poza podstawowymi usprawnieniami, takimi jak kolorowanie składni i automatyczne formatowanie kodu, oferuje on między innymi automatyczne podpowiedzi, możliwość szybkiego poruszania się po kodzie, integrację z systemem kontroli wersji, czy z narzędziami automatyzacji budowania projektów.

Z poziomu wiersza poleceń program Emacs możesz uruchomić przy pomocy polecenia emacs. Jeśli jednak pracujesz w emulatorze terminala działającym w środowisku graficznym, to domyślnie zostanie uruchomiona okienkowa wersja Emacs’a. Aby uruchomić go w trybie konsolowym, musisz podać dodatkowo parametr \-nw, więc komenda otwierająca plik o nazwie main.c będzie miała postać emacs -nw main.c. Poniżej obrazek prezentujący wygląd edytora.

![edytor-emacs](/images/wp-content/gallery/edytory-w-wierszu-polecen/edytor-emacs.png)

Na pierwszy rzut oka nie różni się wiele od nano – zmieniły się kolory, na górze pojawiło się menu, a na dole pasek statusu. Jednak wystarczy zajrzeć do menu (szczególnie do zakładki Tools), żeby przekonać się, że ma się czynienia z czymś więcej niż tylko zwykłym edytorem. Poza wspomnianymi wcześniej funkcjami, znajdziesz tam m.in. kalkulator, kalendarz, klienta poczty, przeglądarkę internetową (sic!), a nawet gry.

Ten ogromny kombajn, łączy w sobie wszystkie funkcje potrzebne programiście podczas normalnej pracy. Jeżeli jednak będziesz potrzebować czegoś więcej, to jest spora szansa, że znajdziesz to wśród tysięcy gotowych do instalacji wtyczek. Emacs posiada nawet własny język skryptowy Emacs Lisp, pozwalający programistom na tworzenie własnych rozszerzeń.

Nauczenie się podstaw obsługi tego programu jest łatwe, ale opanowanie go w stopniu mistrzowskim zajmuje bardzo długo. Tryb edycji wygląda standardowo – tekst wprowadzany z klawiatury pojawia się w miejscu kursora, a do poruszania którym możesz użyć strzałek. Aby skorzystać w menu naciśnij F10, wybierz strzałkami jedną z opcji, a następnie potwierdź klikając Enter. Jeżeli chcesz opuścić menu, trzykrotnie naciśnij klawisz Esc.

Podczas przeglądania menu na pewno zauważysz, że przy wielu opcjach znajdują się złożone skróty klawiszowe – to jedna z rzeczy, z których słynie Emacs. Wiele rzeczy da się w nim zrobić używając skrótów, ale spora część z nich składa się z dwóch lub trzech kombinacji klawiszy występujących po sobie. Opanowanie tych skrótów to klucz do produktywności podczas pracy z Emacs’em. Dwa najbardziej podstawowe to zapisanie pliku Ctrl+x Ctrl+s, oraz zamknięcie programu Ctrl+x Ctrl+c.

### Edytor Vim

Vim’a można kochać albo nienawidzić. Edytor ten opiera się na zupełnie innej filozofii niż poprzednio omawiane. Jego interfejs jest zaprojektowany jest w taki sposób, że można go używać nie odrywając rąk od klawiatury – dosłownie, nawet bez potrzeby przesuwania się do strzałek. Trzymając dłonie w podstawowej pozycji do pisania na klawiaturze (palce wskazujące na klawiszach F i J), masz w zasięgu palców wszystkie potężne funkcje Vim’a.

W kwestii funkcjonalności Vim oferuje tyle samo co Emacs – również znajdziesz w nim podświetlanie składni, automatyczne formatowanie, wsparcie dla wygodnego skakania po kodzie, automatyczne uzupełnianie składni, integrację z systemami budowania i kontroli wersji, oraz wiele innych udogodnień. Vim, podobnie jak Emacs, posiada też wsparcie dla wtyczek oraz własny język skryptowy – Vimscript.

To co wyróżnia Vim’a spośród innych edytorów, to fenomenalne możliwości w zakresie edycji kodu. Poza całą gamą użytecznych skrótów, pozwalających na wykonanie większości najczęstszych operacji przy pomocy kilku kliknięć, posiada on wbudowany parser wyrażeń regularnych, umożliwiający szybki refaktoring kodu, oraz wsparcie dla nagrywania i odtwarzania makr, składających się z nieograniczonej ilości dowolnych operacji. Taki zestaw funkcji daje możliwości niespotykane w żadnym innym edytorze.

Główną wadą Vim’a jest to, że nauczenie się jego podstawowej obsługi zabiera sporo czasu. Trybów edycji jest kilka, a każdy klawisz ma swoje znaczenie. Chyba najlepiej obrazuje to poniższa ściągawka, prezentująca skróty klawiszowe Vim’a.

[![vim_cheat_sheet_for_programmers_print](/images/wp-content/gallery/edytory-w-wierszu-polecen/cache/vim_cheat_sheet_for_programmers_print.png-nggid0272-ngg0dyn-0x0x100-00f0w010c010r110f110r010t010.png "vim_cheat_sheet_for_programmers_print")](/images/wp-content/gallery/edytory-w-wierszu-polecen/vim_cheat_sheet_for_programmers_print.png)

Uruchomić Vim’a możesz przy pomocy polecenia vim, jako argument podając nazwę pliku. Poniżej przykład edycji pliku o nazwie main.c, zawierającego program Hello World – pełna postać komendy to vim main.c.

![edytor-vim](/images/wp-content/gallery/edytory-w-wierszu-polecen/edytor-vim.png)

Od razu rzuca się w oczy dość minimalistyczny wygląd. Poza skromnym paskiem statusu umieszczonym na dole, widoczny jest tylko kod. Z perspektywy programisty jest to zaleta, ponieważ każda dodatkowa linia kodu mieszcząca się na ekranie redukuje konieczność ciągłego przewijania. Niektórzy programiści używają nawet monitorów obróconych o 90 stopni, żeby zmieścić na ekranie jak najwięcej kodu.

Jeżeli chodzi o podstawy korzystania z edytora, to już na samym początku zaczynają się schody. Kursorem można co prawda poruszać przy pomocy strzałek, ale próba wprowadzania tekstu może się skończyć niemałym zaskoczeniem. Vim domyślnie uruchamia się w trybie *normal*, w którym poszczególne klawisze mają przypisane specjalne funkcje. Na przykład **h**, **j**, **k** i **l** robią dokładnie to samo co strzałki, czyli pozwalają na poruszanie kursorem – tak jak pisałem wcześniej, jest to możliwe bez konieczności sięgania do strzałek. Podwójnie wciśnięty **d** usuwa bieżącą linię, **Y** zapamiętuje aktualną linię, a **p** wkleja ją w wybranym miejscu. Więcej tego typu skrótów znajdziesz na ściądze, którą umieściłem wyżej.

Aby rozpocząć wpisywanie tekstu, potrzebujesz z trybu *normal* przejść do trybu *insert*. Można to zrobić na kilka sposobów, ale najprostszy z nich to wciśnięcie klawisza **i** – pozwala on rozpocząć edycję w miejscu, gdzie aktualnie znajduje się kursor. Żeby powrócić do trybu *normal*, wciśnij klawisz Esc. Wiele osób korzystających w Vim’a uważa, że lokalizacja tego klawisza jest niewygodna i przemapowuje go na rzadko używany, za to znacznie lepiej zlokalizowany klawisz Caps Lock.

Sporą zagadką dla nowych użytkowników Vim’a jest sposób zamykania programu. Można to zrobić przechodząc do jeszcze innego trybu o nazwie *command-line*.Tryb ten uruchamiany jest poprzez wciśnięcie klawisza **:** (znak dwukropka) i pozwala on na wprowadzanie poleceń z klawiatury. Najbardziej podstawowe z nich to w pozwalające na zapisanie aktualnie edytowanego pliku oraz q umożliwiające zamknięcie programu. Można je też wywołać oba na raz, wprowadzając sekwencję wq, co oznacza “zapisz i wyjdź” i jest często wykorzystywanym przez użytkowników Vim’a skrótem.

### Kompilacja programu

Po zapoznaniu się z narzędziami służącymi do edycji kodu, pozostała nam jeszcze kwestia kompilacji stworzonego programu. Najpopularniejszym kompilatorem dostępnym pod Linuxem jest GCC. Używany jest on do kompilowania samego jądra Linuxa oraz wielu innych komponentów systemu. W Ubuntu domyślnie nie jest on zainstalowany, więc na początek potrzebujesz go zainstalować – możesz to zrobić przy użyciu komendy sudo apt install gcc.

Użycie kompilatora jest bardzo proste – do komendy gcc jako parametr należy podać nazwę pliku z kodem źródłowym, a następnie flagę \-o z nazwą pliku wynikowego. Na przykład jeśli Twój plik z kodem nazywa się main.c, a plik z wynikowym programem ma nazywać się “hello”, to pełna komenda będzie miała postać gcc main.c -o hello.

Po udanej kompilacji, możesz uruchomić swój program poleceniem ./hello. Przedrostek ./ oznacza tyle, że powinien zostać uruchomiony program z bieżącego katalogu. Efekt działania powyższych komend możesz zobaczyć na poniższym przykładzie:

```
robert@bezkompilatora:~$ gcc main.c -o hello
robert@bezkompilatora:~$ ./hello
Hello World!
robert@bezkompilatora:~$ ▉
```

### Podsumowanie

W taki oto sposób dotarliśmy do końca dzisiejszego wpisu. Mam nadzieję, że rozjaśniłem Ci trochę sprawę edycji i kompilacji programów w wierszu poleceń, i że teraz to czarne okienko z mrugającym kursorkiem wydaje Ci się nieco bardziej użyteczne.

Opisałem tu kilka edytorów, więc możesz zastanawiać się, który powinieneś wybrać. Na początek możesz wybrać nano, bo jest prosty w obsłudze, ale musisz wiedzieć, że prędzej czy później i tak zostaniesz użytkownikiem Vim’a lub Emacs’a, więc jeżeli chcesz poświęcić trochę więcej czasu na naukę zaawansowanego edytora, wybierz któryś z nich. Ja używam Vim’a i jestem z niego bardzo zadowolony, ale Ciebie zachęcam do wypróbowania obu – może Emacs’owe skróty przypadną Ci bardziej do gustu.

Dziękuję Ci za przeczytanie tego wpisu. Jeżeli Ci się spodobał, to proszę, zostaw komentarz na dole – bardzo chciałbym wiedzieć co o tym myślisz. (Mam nadzieję, że postawienie Vim’a i Emacs’a w jednej linii nie zostanie poczytane za profanację przez użytkowników żadnego z tych programów 😉 ).

Zapraszam Cię też do dołączenia do Facebookowej grupy [Programowanie Linux](https://www.facebook.com/groups/programowanie.linux/), gdzie możesz spotkać inne osoby zainteresowane tą tematyką (w tym mnie i Anetę) i porozmawiać o Linuxie w luźnej atmosferze.

To tyle na dzisiaj. Życzę miłego dnia i do zobaczenia! 🙂
