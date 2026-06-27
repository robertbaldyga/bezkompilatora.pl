---
title: "Bądź jak hacker! – wprowadzenie do wiersza poleceń"
date: 2018-03-29
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["linux", "terminal", "bash", "wiersz poleceń"]
image: "/images/uploads/2018/03/ubuntu_terminal_basic.jpg"
summary: "Czy widziałeś co zwykle robią hackerzy na filmach? Oni nigdy nie używają myszki – zamiast tego otwierają czarną konsolę z zielonym mrugającym kursorkiem i w szalonym tempie wprowadzają skomplikowane komendy. Często realizm tych scen pozostawia wiele do życzenia,…"
---

Czy widziałeś co zwykle robią hackerzy na filmach? Oni nigdy nie używają myszki – zamiast tego otwierają czarną konsolę z zielonym mrugającym kursorkiem i w szalonym tempie wprowadzają skomplikowane komendy. Często realizm tych scen pozostawia wiele do życzenia, a filmowi hackerzy w kilka sekund robią rzeczy, które w rzeczywistym świecie potrafią trwać tygodniami, ale pośród tych wszystkich niewiarygodności jedno jest prawdziwe – czarna konsola z mrugającym kursorkiem to bardzo potężne narzędzie.

W dzisiejszym wpisie postaram się zdradzić Ci sekret hackerów i wyjaśnić o co tak naprawdę chodzi z wierszem poleceń i dlaczego, pomimo dostępności graficznych interfejsów, nadal wiele osób z niego korzysta. Pokażę Ci też kilka przydatnych poleceń, dzięki którym zaczniesz się swobodnie poruszać w terminalowym świecie. Zaczynajmy!

### Krótka historia wiersza poleceń

U schyłku zamierzchłych czasów, kiedy do komunikacji z komputerem używało się papierowych kart perforowanych i dziurkarki, zaczęły się pojawiać pierwsze komputery wyposażone w interfejs terminala, pozwalający na bardziej interaktywną komunikację z komputerem. Użytkownik mógł przy użyciu klawiatury wprowadzać polecenia, na które komputer od razu odpowiadał wypisując tekst – początkowo na papierowej taśmie terminala TTY, będącego czymś w rodzaju połączenia maszyny do pisania z drukarką wierszową, a w późniejszym czasie na ekranie monitora. Jeżeli jesteś ciekaw jak wyglądała komunikacja z komputerem przy użyciu urządzenia TTY, to możesz to zobaczyć na poniższym filmie.

Tego typu interfejs był dość specyficzny i wymagał opracowania prostego i wygodnego w użyciu zestawu komend, które byłyby jednocześnie na tyle uniwersalne, że pozwalałyby na wykonanie dowolnej operacji. W ten sposób powstały pierwsze interfejsy wiersza poleceń, a wśród nich Unix shell, będący pierwowzorem dla Bourne shell’a (znanego jako sh) oraz jego ulepszonej wersji – Bash’a, będącego po dziś dzień najpopularniejszą powłoką Linuxa.

### Interfejs tekstowy kontra graficzny

Czasy, w których komputery zajmowały pół pokoju, a do komunikacji z nimi wykorzystywano urządzenia wyglądające jak przerobiona maszyna do pisania minęły bezpowrotnie. Dziś królują interfejsy graficzne, które za sprawą dotykowych ekranów nie potrzebują już nawet myszy i klawiatury. Mimo to wciąż spora grupa osób preferuje komunikację z komputerem w trybie tekstowym i, co ważniejsze, uważają oni ten sposób za wygodniejszy i bardziej wydajny. Są to programiści, administratorzy i inni “power userzy”, czyli osoby używające komputera w sposób bardziej zaawansowany niż przeciętny użytkownik.

Co ciekawe jest to dokładnie ta sama grupa użytkowników, którzy korzystali z wiersza poleceń zanim powstały powłoki graficzne – nie zmienili oni swoich przyzwyczajeń, mimo, że interfejsy graficzne są dostępne od wielu lat. Można by doszukiwać się różnych powodów takiego stanu rzeczy, ale w rzeczywistości przyczyna jest bardzo prosta – dla zaawansowanych użytkowników komputera, interfejs graficzny jest niewystarczający.

Powłoki graficzne powstały z myślą o umożliwieniu zwykłym użytkownikom korzystania z komputera w prosty sposób. Istnieje nawet powiedzenie, które bardzo dobrze podsumowuje różnice między interfejsem graficznym a tekstowym – brzmi ono mniej więcej tak:

> Interfejs graficzny czyni proste rzeczy prostszymi. Wiersz poleceń sprawia, że rzeczy skomplikowane są możliwe.

Przeciętny użytkownik nie potrzebuje zwykle robić rzeczy skomplikowanych, więc nie ma potrzeby uczenia się zaawansowanych narzędzi. Ty natomiast, jako programista, robisz rzeczy skomplikowane na co dzień, a wiersz poleceń pomoże Ci wykonywać Twoją pracę szybciej i sprawniej – tak jak to robią filmowi hackerzy. 🙂

### Uruchamianie powłoki tekstowej

Pod Linuxem do wiersza poleceń można dostać się na kilka sposobów. W dystrybucjach serwerowych powłoka tekstowa jest uruchamiana domyślnie, więc w przypadku takiej dystrybucji interfejs ten zobaczysz od razu po uruchomieniu komputera. Jeśli jednak korzystasz dystrybucji desktopowej, która domyślnie uruchamia się w trybie graficznym, to masz dwa wyjścia – możesz przełączyć się w jedną z domyślnie uruchomionych powłok tekstowych używając kombinacji klawiszy Ctrl+Alt+klawisz funkcyjny od F1 do F6 (np. Ctrl+Alt+F1), albo możesz uruchomić emulator terminala, czyli okienkowy program, który udaje terminal wiersza poleceń.

Jeżeli chodzi o sposób pierwszy, to możesz być nieco zdziwiony, że na Twoim komputerze są w tym momencie uruchomione jakieś powłoki tekstowe, ale w gruncie rzeczy tak właśnie jest. Jest to domyślne zachowanie w Linuxie. W trakcie startu systemu uruchamianych jest siedem powłok – te z numerami od 1 do 6 uruchamiane działają w trybie tekstowym, a powłoka numer 7 w trybie graficznym i to właśnie ta powłoka prezentowana jest domyślnie zaraz po starcie. Jeśli więc przełączysz się w którąś z powłok o numerach od 1 do 6, a nasßpnie chcesz wrócić do powłoki graficznej, to możesz to zrobić używając kombinacji klawiszy Ctrl+Alt+F7. Minusem domyślnie dostępnych powłok jest to, że nie mogą być one uruchomione jednocześnie z trybem graficznym, więc możliwości ich praktycznego wykorzystania są bardzo ograniczone. W praktyce używane są one prawie wyłącznie w sytuacjach awaryjnych.

W przypadku emulatora terminala jest zupełnie inaczej – jest on o wiele wygodniejszy, ponieważ można go uruchomić w oknie powłoki graficznej i dzięki temu można z niego korzystać równolegle z innymi programami, np. środowiskiem programistycznym i przeglądarką internetową. Wielu programistów stosuje właśnie taki zestaw, mając te programy umieszczone na osobnych monitorach, dzięki czemu mogą widzieć całe swoje środowisko pracy na raz.

Emulatorów terminala dla Linuxa jest całkiem sporo i wiele z nich udostępnia bardzo przydatne funkcje, jak na przykład obsługa kilku sesji terminala na raz, jednak na potrzeby nauki w zupełności wystarczy domyślny emulator dostępny w dystrybucji. Aby go uruchomić poszukaj w menu programu o nazwie Terminal. Po chwili powinieneś zobaczyć charakterystycznie wyglądające okienko.

### Podstawy obsługi wiersza poleceń

Zanim przejdziemy do wpisywania komend, omówmy krótko podstawy korzystania z wiersza poleceń. Po uruchomieniu emulatora terminala zobaczysz mniej więcej coś takiego:

```
robert@bezkompilatora:~$ ▉
```

W tej linijce opisany jest aktualny stan terminala. Zawiera on następujące informacje:

###### **Nazwa użytkownika**

Na początku wiersza znajduje się nazwa użytkownika zalogowanego do obecnej sesji terminala. Domyślnie jest to Twoja nazwa użytkownika, ale możesz też zalogować się jako inny użytkownik.

###### **Nazwa hosta**

Po znaku małpy znajduje się nazwa hosta, którą wybrałeś podczas instalacji systemu. Informacja ta przydaje się podczas zdalnego logowania na inne maszyny, na maszynie lokalnej zawsze będzie taka sama.

###### **Bieżący katalog**

Po znaku dwukropka znajduje się ścieżka do katalogu, w którym się aktualnie znajdujesz. Domyślnie jest to katalog domowy użytkownika, oznaczany skrótowo znakiem ~.

Po nazwie bieżącego katalogu znajduje się tak zwany *znak zachęty*, który dla zwykłych użytkowników ma postać **$**, a dla użytkownika root jest to **#**. Znak zachęty jest symbolem oznaczającym gotowość do wprowadzania komend.

Ogólna zasada jest taka, że w danej sesji terminala zawsze jesteś zalogowany jako określony użytkownik na określonym hoście i zawsze znajdujesz się w jakimś katalogu, z poziomu którego wykonywane są polecenia. Jest to bardzo istotne szczególnie podczas wykonywania operacji na plikach. Te trzy parametry określają w pełni stan danej sesji terminala i zależy od nich wiele rzeczy, jak na przykład możliwość wykonywania określonych komend, czy uprawnienia do odczytywania i modyfikacji plików na dysku.

Zasady dotyczące wprowadzania komend są dosyć proste. Po znaku zachęty wpisz nazwę komendy, po spacji wpisz jej parametry oddzielone od siebie znakiem spacji, a następnie zatwierdź klikając Enter. To wszystko. Mając tą wiedzę możesz śmiało zaczynać naukę poszczególnych komend. Poniżej znajdziesz krótką listę przydatnych komend, które pomogą Ci postawić pierwsze kroki w pracy z wierszem poleceń.

### Operacje na plikach

Jedną z najbardziej podstawowych, ale też najczęściej wykorzystywanych funkcji wiersza poleceń jest wykonywanie operacji na plikach. Jak już wiesz, w sesji terminala zawsze znajdujesz się w jakimś katalogu i to z jego poziomu wykonywane są komendy.

#### **ls** – listowanie zawartości katalogu

Komenda **ls** pozwala na wypisanie zawartości bieżącego katalogu.

Przykład działania komendy:

```
robert@bezkompilatora:~$ ls
Desktop    Downloads         Music     Public     Videos
Documents  examples.desktop  Pictures  Templates
robert@bezkompilatora:~$ ▉
```

#### **cd** – przejście do innego katalogu

Komenda **cd** pozwala zmienić bieżący katalog na inny. Komenda przyjmuje jako parametr ścieżkę do nowego katalogu.

Przykład działania komendy:

```
robert@bezkompilatora:~$ cd Documents
robert@bezkompilatora:~/Documents$ ▉
```

Jeżeli chcesz cofnąć się o jeden katalog wyżej, użyj komendy **cd** z parametrem “**..**” **:**

```
robert@bezkompilatora:~/Documents$ cd ..
robert@bezkompilatora:~$ ▉
```

Dwie kropki oznaczają katalog nadrzędny, a jedna kropka obecny. Oznacza to, że wykonanie komendy **cd .** przeniesie Cię do katalogu w którym aktualnie jesteś, czyli nie zrobi nic.

#### **mkdir** – utworzenie nowego katalogu

Komenda **mkdir** tworzy nowy katalog o podanej nazwie.

Na przykładzie utworzenie nowego katalogu, wylistowanie zawartości obecnego, a następnie przejście do nowego katalogu:

```
robert@bezkompilatora:~$ mkdir przyklad
robert@bezkompilatora:~$ ls
Desktop    Downloads         Music     przyklad  Templates
Documents  examples.desktop  Pictures  Public    Videos
robert@bezkompilatora:~$ cd przyklad
robert@bezkompilatora:~/przyklad$ ▉
```

#### **cat** – wylistowanie zawartości pliku

Komenda **cat** służy do wypisywania zawartości plików tekstowych. Jako parametr przyjmuje nazwę pliku do wypisania.

Zakładając, że w bieżącym katalogu znajduje się plik o nazwie **foo**, zawierający trzy linie tekstu, przykład użycia komendy wygląda następująco:

```
robert@bezkompilatora:~/przyklad$ ls
foo
robert@bezkompilatora:~/przyklad$ cat foo
To jest
przykładowy
plik tekstowy.
robert@bezkompilatora:~/przyklad$ ▉
```

#### **rm** – usunięcie pliku

Komenda **rm** służy do usuwania plików. Jako argument przyjmuje nazwę pliku do usunięcia. Możesz też podać listę plików oddzielonych spacją. Używając tej komendy musisz być ostrożny, ponieważ usuniętych w ten sposób plików nie da się odzyskać. Nie trafiają one do kosza, ale od razu są usuwane z dysku.

Przykład użycia komendy:

```
robert@bezkompilatora:~/przyklad$ ls
plik1  plik2  plik3
robert@bezkompilatora:~/przyklad$ rm plik1 plik2
robert@bezkompilatora:~/przyklad$ ls
plik3
robert@bezkompilatora:~/przyklad$ ▉
```

### Komendy przydatne na start

Poza komendami służącymi do zwiedzania struktury katalogów istnieje jeszcze cała masa innych komend, o których napiszę więcej w kolejnych częściach tego wpisu. Zanim jednak skończę na dzisiaj, chciałbym Ci pokazać jeszcze dwie komendy, które mogą się okazać bardzo pomocne w trakcie nauki. Są to komendy **help** i **man**.

#### **help** – wyświetlenie listy wbudowanych poleceń

Komenda **help** wyświetla całkiem pokaźną listę wbudowanych komend powłoki. Opis komend jest raczej skromny, więc jeżeli chciałbyś dowiedzieć się co dana komenda robi, to musisz to sprawdzić w innym miejscu (o tym za chwilę), ale przydaje się ona jeśli chcesz zobaczyć jakie komendy są dostępne lub szybko przypomnieć sobie składnię którejś z komend.

Warto zauważyć, że lista zawiera jedynie wbudowane komendy powłoki, czyli te, które nie są osobnymi programami, a poleceniami wykonywanymi przez samą powłokę. Nie jest to więc lista wszystkich komend dostępnych w Linuxie – brakuje tam na przykład, komendy **cat**, która jest osobnym programem. Uzyskanie kompletnej listy jest możliwe, ale mało praktyczne, ponieważ liczba programów dostępnych domyślnie w typowej dystrybucji Linuxa jest ogromna, a dodatkowo można ją rozszerzać instalując kolejne programy.

#### **man** – wyświetlenie pomocy dla wybranej komendy

W celu wyświetlenia dokumentacji wybranej komendy, możesz użyć instrukcji **man**. Przyjmuje ona jako parametr nazwę komendy, do której ma być wyświetlona pomoc. Wyświetlana dokumentacja nawet dla prostych poleceń jest dość obszerna i można się z niej dużo dowiedzieć. Archiwum man to prawdziwa skarbnica wiedzy o Linuxowych komendach.

Warto wspomnieć o poruszaniu się po wyświetlanej pomocy, bo o ile sama nawigacja przy pomocy strzałek jest dość intuicyjna, to już sposób opuszczania menu pomocy nie jest oczywisty dla osób nieznających jeszcze Linuxowych zwyczajów. Otóż aby opuścić widok dokumentacji wyświetlanej przez komendę **man**, należy nacisnąć klawisz **q**, będący skrótem od angielskiego słowa “quit”.

### Podsumowanie

Uff, dziś wyszedł bardzo długi wpis, więc jeśli dobrnąłeś/dobrnęłaś do tego momentu, to chciałbym Ci serdecznie pogratulować. 🙂 Mam nadzieję, że wiedza, którą tu zgromadziłem, będzie dla Ciebie przydatna, i że już niedługo będziesz korzystać z Linuxowej konsoli niemal tak sprawnie, jak hackerzy z filmów akcji… albo przynajmniej wykorzystasz ją jako narzędzie do rozwinięcia swoich programistyczno-linuxowych możliwości.

Dziękuję Ci za przeczytanie tego wpisu. Jeżeli masz na ten temat jakieś przemyślenia, pytania, albo chcesz podzielić się swoimi doświadczeniami, to proszę, napisz komentarz pod wpisem.

Z góry dzięki i do zobaczenia! 🙂
