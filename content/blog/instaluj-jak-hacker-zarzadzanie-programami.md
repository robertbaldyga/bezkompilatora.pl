---
title: "Instaluj jak hacker! – zarządzanie programami z wiersza poleceń"
date: 2018-04-08
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["linux", "apt", "ubuntu", "terminal", "pakiety"]
image: "/images/uploads/2018/04/smiling_girl_laptop_books.jpg"
summary: "Dzisiejszy wpis będzie o instalowaniu. Pisałem już o podstawach obsługi Linuxowej konsoli w poprzednim wpisie, a dziś przyszedł czas wykorzystać to narzędzie w konkretnym celu – do zarządzania oprogramowaniem. O instalacji programów pod Linuxem pisałem też trochę tutaj,…"
---

Dzisiejszy wpis będzie o instalowaniu. Pisałem już o podstawach obsługi Linuxowej konsoli w [poprzednim wpisie](/blog/badz-jak-hacker-wprowadzenie-do-wiersza-polecen/), a dziś przyszedł czas wykorzystać to narzędzie w konkretnym celu – do zarządzania oprogramowaniem. O instalacji programów pod Linuxem pisałem też trochę [tutaj](/blog/jak-rozpoczac-programowanie-pod-linuxem/), ale skupiłem się tam bardziej na ogólnej koncepcji. Dziś będzie bardziej konkretnie, a do tego wszystko w wierszu poleceń. Uruchom więc emulator terminala i zaczynajmy.

### Repozytoria

Praktycznie wszystkie większe dystrybucje Linuxa posiadają repozytoria oprogramowania. Oprogramowanie jest w nich przechowywane w postaci paczek w formacie specyficznym dla określonej dystrybucji. Twórcy dystrybucji udostępniają repozytoria na serwerach znajdujących się w kilku różnych lokalizacjach geograficznych, żeby zapewnić użytkownikom z różnych części świata szybki dostęp.

Każdy serwer repozytorium jest bliźniaczą kopią pozostałych – zawierają one kompletny zestaw paczek oprogramowania, w związku z czym nazywa się je czasem mirrorami (ang. mirror – lustro). Program zarządzający paczkami ma świadomość, gdzie znajdują się mirrory, w związku z czym może on określić, skąd najlepiej pobrać paczki w trakcie instalacji. Serwery większych dystrybucji Linuxa znajdują się również w Polsce, dzięki czemu instalacja i aktualizacja oprogramowania przebiega zazwyczaj bardzo szybko.

Przedstawione poniżej przykłady bazują na Ubuntu. Jeżeli używasz innej dystrybucji, będącej pochodną Ubuntu, przykład Kubuntu, Xubuntu lub Linux Mint, to wszystko powinno działać bardzo podobnie. W przypadku Debiana mogą wystąpić pewne różnice – paczki mogą się różnić nazwą lub wersją, a w skrajnych przypadkach mogą być niedostępne. Skupiam się tu jednak na instalacji programów bardzo powszechnie używanych, więc jest duża szansa, że również pod Debianem wszystkie przykłady będą działać bez problemów.

### Aktualizacja oprogramowania

Zanim zaczniesz instalować nowe programy, warto zadbać o to, żeby zaktualizować te obecnie zainstalowane do najnowszej wersji. Ubuntu automatycznie okresowo sprawdza dostępność aktualizacji, po czym informuje użytkownika o możliwości ich zainstalowania wyskakującym okienkiem. Można jednak aktualizację oprogramowania przeprowadzić ręcznie, z użyciem wiersza poleceń.

Do zarządzania oprogramowaniem pod Ubuntu służy program **apt**. Aby uzyskać listę jego najczęściej używanych komend, wpisz w konsoli polecenie **apt help**. W odpowiedzi zobaczysz następujący komunikat:

```
robert@bezkompilatora:~$ apt help
apt 1.5.1 (amd64)
Usage: apt [options] command
apt is a commandline package manager and provides commands for
searching and managing as well as querying information about packages.
It provides the same functionality as the specialized APT tools,
like apt-get and apt-cache, but enables options more suitable for
interactive use by default.
Most used commands:
 list -- list packages based on package names
 search -- search in package descriptions
 show -- show package details
 install -- install packages
 remove -- remove packages
 autoremove -- Remove automatically all unused packages
 update -- update list of available packages
 upgrade -- upgrade the system by installing/upgrading packages
 full-upgrade -- upgrade the system by removing/installing/upgrading packages
 edit-sources -- edit the source information file
See apt(8) for more information about the available commands.
Configuration options and syntax is detailed in apt.conf(5).
Information about how to configure sources can be found in sources.list(5).
Package and version choices can be expressed via apt_preferences(5).
Security details are available in apt-secure(8).
                                       Ten APT ma moce Super Krowy.
robert@bezkompilatora:~$ ▉
```

Jak widzisz, APT ma moce Super Krowy – jest to jeden z wielu Linuxowych żartów, jakie można spotkać w dystrybucyjnym oprogramowaniu. Pokażę Ci później sztuczkę z Super Krową, tymczasem skupmy się na dostępnych komendach.

Aktualizacja oprogramowania z użyciem apt’a przebiega dwuetapowo – najpierw należy zaktualizować informacje na temat najnowszych wersji paczek przy pomocy komendy **apt update**, a następnie można dokonać właściwej aktualizacji oprogramowania przy pomocy polecenia **apt upgrade**. Wygląda to dosyć prosto, ale jest jeszcze jedna rzecz, o której musisz wiedzieć – tych komend nie można wykonać z poziomu zwykłego użytkownika. Jeżeli spróbujesz to zrobić, zostaniesz poinformowany o błędzie:

```
robert@bezkompilatora:~$ apt update
Czytanie list pakietów... Gotowe
W: chmod 0700 of directory /var/lib/apt/lists/partial failed -- SetupAPTPartialDirectory (1: Operacja niedozwolona)
E: Nie udało się otworzyć pliku blokady /var/lib/apt/lists/lock -- open (13: Brak dostępu)
E: Nie udało się zablokować katalogu /var/lib/apt/lists/
W: Problem przy odlinkowywaniu pliku /var/cache/apt/pkgcache.bin -- RemoveCaches (13: Brak dostępu)
W: Problem przy odlinkowywaniu pliku /var/cache/apt/srcpkgcache.bin -- RemoveCaches (13: Brak dostępu)
robert@bezkompilatora:~$ ▉
```

Wygląda to może dosyć enigmatycznie, ale przekaz jest prosty – nie masz uprawnień do wykonania tej operacji. Jest to jeden z Linuxowych mechanizmów bezpieczeństwa – tylko jeden użytkownik ma uprawnienia do zarządzania oprogramowaniem – nazywa się **root**.

Użytkownik **root** to administrator systemu. Ma uprawnienia do zrobienia dosłownie wszystkiego – łącznie z usunięciem wszystkich danych z dysku lub nieodwracalnym uszkodzeniem systemu. Musisz więc używać go bardzo ostrożnie. Istnieje możliwość zalogowania się jako **root**, ale na potrzeby prostych operacji istnieje też wygodniejsza opcja – polecenie **sudo**.

Polecenie **sudo** pozwala na wykonanie pojedynczej komendy z uprawnieniami root’a – wystarczy, że poprzedzisz ją słowem **sudo**. Kiedy to zrobisz, zostaniesz poproszony o podanie hasła – jest to kolejny mechanizm bezpieczeństwa. Jeżeli na przykład odejdziesz na chwilę od komputera i ktoś w tym czasie będzie próbował na nim wykonać jakieś polecenie z uprawnieniami root’a, to nie będzie mógł tego zrobić bez znajomości Twojego hasła. Aktualizacja informacji o wersjach paczek z użyciem polecenia **sudo** wygląda następująco:

```
robert@bezkompilatora:~$ sudo apt update
[sudo] hasło użytkownika robert:
Stary:1 http://pl.archive.ubuntu.com/ubuntu artful InRelease
Stary:2 http://pl.archive.ubuntu.com/ubuntu artful-updates InRelease
Stary:3 http://pl.archive.ubuntu.com/ubuntu artful-backports InRelease
Pobieranie:4 http://security.ubuntu.com/ubuntu artful-security InRelease [78,6 kB]
Pobieranie:5 http://security.ubuntu.com/ubuntu artful-security/main amd64 DEP-11 Metadata [17,2 kB]
Pobieranie:6 http://security.ubuntu.com/ubuntu artful-security/main DEP-11 64×64 Icons [23,2 kB]
Pobieranie:7 http://security.ubuntu.com/ubuntu artful-security/universe amd64 DEP-11 Metadata [21,6 kB]
Pobieranie:8 http://security.ubuntu.com/ubuntu artful-security/universe DEP-11 64×64 Icons [24,1 kB]
Pobrano 165 kB w 1s (97,3 kB/s)
Czytanie list pakietów... Gotowe
Budowanie drzewa zależności
Odczyt informacji o stanie... Gotowe
Wszystkie pakiety są aktualne.
robert@bezkompilatora:~$ ▉
```

Tym razem operacja zakończyła się powodzeniem. Podobnie wygląda sytuacja z właściwą aktualizacją – wystarczy wywołać komendę **sudo apt upgrade**. Jeżeli jakiekolwiek aktualizacje będą dostępne, to dostaniesz w odpowiedzi listę paczek do zaktualizowania, oraz pytanie, czy chcesz kontynuować. Jeżeli odpowiesz twierdząco, rozpocznie się aktualizacja, która może potrwać od kilkunastu sekund do maksymalnie kilku minut.

### Instalacja oprogramowania

Po zaktualizowaniu obecnie zainstalowanych paczek do najnowszej wersji, możesz przejść do instalowania nowych. Służy do tego komenda **apt install**, która jako argument przyjmuje nazwę paczki do zainstalowania lub listę nazw kilku paczek oddzielonych spacją. Poniższy przykład prezentuje instalację programu **moc** – konsolowego odtwarzacza muzyki. Tak jak poprzednio, polecenie należy wykonać z uprawnieniami root’a, więc pełna postać komendy, której powinieneś użyć to **sudo apt install moc**.

```
robert@bezkompilatora:~$ sudo apt install moc
[sudo] hasło użytkownika robert:
Czytanie list pakietów... Gotowe
Budowanie drzewa zależności
Odczyt informacji o stanie... Gotowe
The following additional packages will be installed:
 libmad0
Sugerowane pakiety:
 moc-ffmpeg-plugin
Zostaną zainstalowane następujące NOWE pakiety:
 libmad0 moc
0 aktualizowanych, 2 nowo instalowanych, 0 usuwanych i 0 nieaktualizowanych.
Konieczne pobranie 316 kB archiwów.
Po tej operacji zostanie dodatkowo użyte 984 kB miejsca na dysku.
Kontynuować? [T/n]
```

Powyższy przykład prezentuje ciekawą sytuację, ponieważ APT wykrył, że program **moc** jest zależny od innej niezainstalowanej paczki o nazwie **libmad0** – zawiera ona bibliotekę do obsługi formatu MP3, co jest dość podstawową funkcjonalnością odtwarzacza muzyki. W takiej sytuacji APT wyświetla informację o potrzebie zainstalowania dodatkowych paczek i pyta o potwierdzenie. Domyślna odpowiedź jest twierdząca, więc jeśli po prostu klikniesz Enter, to instalacja będzie kontynuowana.

Zainstalowany program możesz uruchomić wydając polecenie **mocp** – możesz z jego poziomu przeglądać katalogi w poszukiwaniu plików z muzyką i odtwarzać wybrane utwory. W celu wyświetlenia pomocy użyj klawisza **h**, a jeśli chcesz opuścić program kliknij **q**.

### Usuwanie oprogramowania

Jeżeli jakiś program nie jest Ci już potrzebny i chcesz go odinstalować, to możesz to zrobić przy pomocy komendy **apt remove**. Podobnie jak **apt install** przyjmuje ona nazwę paczki lub listę nazw oddzielonych spacją i również powinna być uruchomiona z uprawnieniami root’a. Poniżej przykład usuwania zainstalowanego przed chwilą programu **moc** – pełna postać komendy to **sudo apt remove moc**.

```
robert@bezkompilatora:~$ sudo apt remove moc
[sudo] hasło użytkownika robert:
Czytanie list pakietów... Gotowe
Budowanie drzewa zależności
Odczyt informacji o stanie... Gotowe
Następujące pakiety zostały zainstalowane automatycznie i nie są już więcej wymagane:
 libenca0 libfaad2 libid3tag0 libmad0 libmodplug1 libmpcdec6 libopusfile0 librcc0 librcd0 libresid-builder0c2a libsidplay2 libsidutils0 libtagc0
Aby je usunąć należy użyć "sudo apt autoremove".
Następujące pakiety zostaną USUNIĘTE:
 moc
0 aktualizowanych, 0 nowo instalowanych, 1 usuwanych i 0 nieaktualizowanych.
Po tej operacji zostanie zwolnione 809 kB miejsca na dysku.
Kontynuować? [T/n]
```

Podobnie jak poprzednio APT zapyta Cię, czy na pewno chcesz kontynuować operację i jeżeli odpowiesz twierdząco, oprogramowanie zostanie usunięte.

Warto zauważyć, że podczas usuwania poszczególnych paczek oprogramowania nie są automatycznie usuwane ich zależności. APT wyświetla jednak informację o obecności nieużywanych pakietów i jeżeli chcesz je usunąć – co jest na ogół dobrym pomysłem – to możesz to zrobić przy użyciu polecenia **apt autoremove**. Tak samo jak poprzednie, powinno być ono wywołane z uprawnieniami root’a, jednak tym razem nie jest wymagane podawanie nazw paczek – APT automatycznie wykrywa, które pakiety są nieużywane i kwalifikuje je do usunięcia.

### Moce Super Krowy

Obiecałem wcześniej, że pokażę Ci sztuczkę z Super Krową, więc przyszedł czas wywiązać się z obietnicy. Jeśli chcesz zobaczyć Super Krowę, użyj komendy **apt moo** – polecenie jest zupełnie bezpieczne i można je wykonać bez uprawnień root’a. Miłej zabawy.

### Podsumowanie

Instalacja programów z poziomu wiersza poleceń nie jest trudna – wymaga jedynie znajomości nazw paczek, co też nie jest zbyt skomplikowane, ponieważ większość z nich nazywa się dość intuicyjnie. Paczka z programem moc nazywa się **moc**, paczka z kompilatorem gcc ma nazwę **gcc**, a przeglądarkę Firefox znajdziesz w paczce **firefox**. W przypadku mniej oczywistych nazw paczek, pomocą służy znana i lubiana wyszukiwarka Google, która jest dziś zresztą jednym z podstawowych narzędzi programisty.

Dziękuję Ci za przeczytanie tego wpisu. Mam nadzieję, że pomógł Ci on lepiej zrozumieć w jaki sposób działa zarządzanie oprogramowaniem w typowej dystrybucji Linuxa oraz w jaki sposób możesz łatwo instalować nowe programy oraz usuwać stare.

Jeżeli podobał Ci się ten wpis, koniecznie daj mi o tym znać – na przykład zostawiając komentarz pod wpisem. Jeżeli nie chcesz przegapić kolejnych wpisów i innych ciekawych materiałów, zapisz się na mój [newsletter](/newsletter/) i polub moją [stronę na Facebooku](https://www.facebook.com/BezKompilatora/).

Dziękuję i do zobaczenia! 🙂
