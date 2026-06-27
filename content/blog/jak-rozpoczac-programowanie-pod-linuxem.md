---
title: "Jak rozpocząć programowanie pod Linuxem? – pierwsze kroki"
date: 2018-03-26
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["linux", "programowanie", "ide", "narzędzia"]
image: "/images/uploads/2018/03/first_steps_arrows.jpg"
summary: "Cześć! W poprzednich wpisach obiecywałem, że będę pisał dużo o Linuxie i programowaniu, więc przyszedł czas wywiązać się z obietnicy. Opowiadałem już w poprzednim wpisie o jądrze Linuxa, dystrybucjach czy powłokach, więc jeżeli jeszcze nie czytałeś tego wpisu,…"
---

Cześć! W poprzednich wpisach obiecywałem, że będę pisał dużo o Linuxie i programowaniu, więc przyszedł czas wywiązać się z obietnicy. Opowiadałem już w [poprzednim wpisie](/blog/linux-kilka-rzeczy-ktore-powinienes-wiedziec/) o jądrze Linuxa, dystrybucjach czy powłokach, więc jeżeli jeszcze nie czytałeś tego wpisu, polecam Ci tam zajrzeć. Dziś przekażę Ci trochę informacji, które przydadzą Ci się jako przyszłemu programiście Linuxa.

****Jeśli jeszcze nie zainstalowałeś Linuxa i chciałbyś nadrobić zaległości, to szczegółową instrukcję jak to zrobić znajdziesz w moich poprzednich wpisach:**  
**1\. [Jak zainstalować Linuxa? – cztery sposoby na start (część 1)  
](/blog/jak-zainstalowac-linuxa-czesc-1/)2\. [Jak zainstalować Linuxa? – cztery sposoby na start (część 2)](/blog/jak-zainstalowac-linuxa-czesc-2/)

### Pierwsze spotkanie z Linuxem

Jeżeli zainstalowałeś którąkolwiek z dystrybucji Linuxa w wariancie desktop, to widok, który zobaczysz po zalogowaniu nie powinien Cię zaskoczyć. Interfejs użytkownika jest bardzo zbliżony do tych znanych z innych systemów operacyjnych – możesz otwierać pliki i katalogi, klikając w ikonki myszką, masz też dostęp do rozwijanego menu, z poziomu którego możesz uruchamiać programy i zmieniać ustawienia. Wygląda to bardzo znajomo i łatwo jest się przyzwyczaić.

Większość dystrybucji w trakcie instalacji od razu dostarcza zestaw podstawowych programów – przeglądarkę internetową, klienta poczty, program do przeglądania zdjęć, odtwarzacze muzyki i filmów, czy prosty edytor tekstu. Często w ramach dystrybucji dostarczany jest pakiet narzędzi biurowych Libre Office, będący open-source’owym odpowiednikiem Microsoft Office. Dla przeciętnego użytkownika komputera taki zestaw pokrywa sporą część jego potrzeb, jednak Ty, jako programista będziesz potrzebować nieco więcej.

### Instalacja oprogramowania

Instalacja oprogramowania pod Linuxem wygląda nieco inaczej niż w przypadku innych systemów operacyjnych. Pod Windowsem zazwyczaj jest tak, że pobiera się instalator z internetu, a następnie uruchamia się go na komputerze lub uruchamia się program instalacyjny z płyty CD/DVD. O ile w przypadku oryginalnych płyt z oprogramowaniem jest duża szansa, że instalacja jest bezpieczna, to w przypadku programów pobranych z internetu może być różnie.

Problem nie dotyczy może programów pobieranych z pewnych źródeł, ale w przypadku, gdy nie masz pewności lub co gorsza ściągasz programy z torrentów, to możesz łatwo zainfekować swój komputer różnego rodzaju robactwem (czytaj wirusami). Dlatego dystrybucje Linuxa wykorzystują w tym celu bezpieczniejsze mechanizmy – repozytoria oprogramowania oraz repozytoria z kodem źródłowym.

Repozytoria oprogramowania to zbiory dziesiątek tysięcy paczek z oprogramowaniem przygotowane przez twórców dystrybucji i udostępniane na ich serwerach. Stamtąd są one automatycznie pobierane w trakcie instalacji. Zaletą repozytoriów jest to, że całe dostępne oprogramowanie znajduje się w jednym miejscu oraz to, że pochodzi ono z pewnego źródła, ponieważ wszystkie paczki z oprogramowaniem są sprawdzone i podpisane przez twórców dystrybucji.

Programy w repozytoriach są regularnie aktualizowane, istnieje więc możliwość automatycznej instalacji najświeższej dostępnej wersji oprogramowania. Ponadto repozytoria rozwiązują problem zależności pomiędzy poszczególnymi paczkami oprogramowania – jeżeli instalowany program korzysta z bibliotek, które nie są obecne w systemie, to zostaną one również automatycznie zainstalowane razem z programem.

Korzystanie z repozytoriów oprogramowania w większości dystrybucji Linuxa jest bardzo proste – zazwyczaj dostępny jest domyślnie zainstalowany program do zarządzania oprogramowaniem, np. Centrum Oprogramowania w Ubuntu, w którym możesz jednym kliknięciem myszki zainstalować wybrany program.

Repozytoria z kodem źródłowym nie są aż tak wygodne, ale zapewniają inną ważną rzecz – dostęp do źródeł programu. Kompilacja programów ze źródeł jest tradycyjną metodą instalacji programów pod Linuxem i oryginalnie właśnie w ten sposób dostarczane było oprogramowanie. Dziś większość popularnych programów można zainstalować wygodnie z repozytoriów dystrybucyjnych, jednak możliwość samodzielnej kompilacji ze źródeł nadal jest bardzo przydatna w kilku przypadkach:

###### **1\. Programu nie ma w repozytorium**

Może się zdarzyć, że będziesz potrzebować programu, którego nie będzie w repozytorium dystrybucji. Dotyczy to najczęściej programów niszowych lub bardzo nowych, albo przypadku gdy korzystasz ze starszego wydania dystrybucji, w którym nie ma jeszcze danego programu.

###### **2\. Potrzebujesz nowszej wersji programu**

Programy w repozytoriach dystrybucyjnych są z czasem aktualizowane, ale często dzieje się to z opóźnieniem. W niektórych przypadkach instalowane są tylko poprawki bezpieczeństwa, a nie nowe funkcje. Jeśli więc potrzebujesz najnowszej wersji oprogramowania, to możesz ją pobrać w postaci kodu źródłowego i skompilować samodzielnie. Zyskujesz w ten sposób również możliwość testowania bieżących wersji eksperymentalnych, a nie tylko ostatniego stabilnego wydania.

###### **3\. Potrzebujesz zmodyfikować program**

To najciekawszy punkt dla programistów. Jeżeli potrzebujesz w jakiś sposób zmodyfikować program – poprawić błąd, dodać nową funkcjonalność, czy zrobić jakąkolwiek inną zmianę – to masz taką możliwość dzięki dostępowi do repozytoriów z kodem.

Kod źródłowy programów dostarczany może być na różne sposoby. Zwyczajowo pakowany jest w archiwa w formacie \*.tar.gz, które wystarczy rozpakować i skompilować przy pomocy polecenia make (w dalszych częściach opiszę ten proces dokładniej). Paczki z kodem są wygodnym rozwiązaniem, jeżeli potrzebujesz tylko skompilować dany program bez modyfikacji.

W przypadku, kiedy chcesz pracować z kodem, dużo lepszą opcją są repozytoria systemów kontroli wersji, takich jak Git, Mercurial czy SVN. Systemy kontroli wersji wykorzystywane są przez programistów podczas tworzenia oprogramowania i zawierają kompletną historię kodu źródłowego. Dzięki temu można dużo łatwiej zrozumieć kod, przez co łatwiej jest go zmodyfikować lub poprawić. Obecnie największą popularnością cieszy się Git i to właśnie z jego użyciem rozwijane jest samo jądro Linuxa oraz ogromna część projektów open source.

### Środowisko programistyczne

Jednym z pierwszych programów, które jako programista będziesz potrzebował zainstalować pod Linuxem, będzie środowisko programistyczne. Na szczęście wybór jest całkiem spory i w dystrybucyjnych repozytoriach można w zasadzie znaleźć wszystkie liczące się IDE. Może poza Visual Studio – istnieje co prawda otwarta wersja Visual Studio Code, ale nie cieszy się zbyt dużą popularnością wśród użytkowników Linuxa. Jeżeli używałeś wcześniej takich środowisk jak Code::Blocks, Eclipse, QT Creator, Netbeans czy CLion, to z powodzeniem możesz ich używać nadal pod Linuxem.

Jeśli programujesz w innych językach niż C/C++, to najprawdopodobniej też znajdziesz swoje ulubione środowisko w repozytorium dowolnej dystrybucji. Linux może być też dobrym wyborem dla osób, które nie są stricte zainteresowane programowaniem systemowym czy aplikacyjnym pod Linuxem, ale chcą np. tworzyć backend dla serwisów internetowych. Tworząc swoje aplikacje pod Linuxem mają możliwość testowania ich w środowisku, w którym będą one działać docelowo – znaczna większość serwerów działa przecież pod kontrolą systemu Linux.

### Biblioteki programistyczne

W przypadku bibliotek programistycznych możesz już odczuć większą różnicę w stosunku do innych systemów operacyjnych – i jest duża szansa, że będzie to różnica pozytywna. Co prawda, jeśli chciałbyś używać bibliotek typowo Windowsowych, takich jak np. DirectX, to pod Linuxem ich nie znajdziesz, ale większość użytecznych wieloplatformowych bibliotek jest dostępna. W istocie znaczna część tych wieloplatformowych bibliotek została stworzona właśnie pod Linuxem, a dopiero potem została przeportowana na inne systemy operacyjne. Poza tym istnieje również cała masa typowo Linuxowych bibliotek ułatwiających tworzenie programów pod tym systemem.

Bardzo wygodny jest też Linuxowy system zarządzania bibliotekami – możesz je instalować z repozytorium podobnie jak programy. Oznacza to, że nie masz potrzeby statycznego linkowania lub dostarczania plików \*.dll razem z Twoim programem, żeby mieć pewność, że zadziała on na innych komputerach. Wystarczy, że stworzysz paczkę instalacyjną, która w trakcie instalacji automatycznie pobierze wszystkie potrzebne biblioteki. Takie rozwiązanie pomaga też uniknąć sytuacji, gdzie wiele programów zainstalowanych w systemie dostarcza tą samą bibliotekę, tak jak ma to miejsce np. w przypadku systemu Windows.

Dzięki temu, że zarządzanie bibliotekami pod Linuxem jest bardzo dobrze zorganizowane, sam proces linkowania również jest bardzo prosty. Biblioteki instalowane są w standardowych katalogach systemowych, do których lokalizacja jest znana kompilatorowi, więc w większości przypadków wystarcza samo podanie nazwy biblioteki i linkowanie odbywa się “automagicznie”.

### Podsumowanie

Jak widzisz Linux jest systemem bardzo przyjaznym dla programistów. Dostępność wielu narzędzi programistycznych i bibliotek, oraz dostęp do kodu źródłowego niemal wszystkich dostępnych programów, sprawiają, że programiści mają bardzo duże możliwości rozwijania i dostosowywania systemu do swoich potrzeb.

W kolejnych wpisach z tej serii postaram się pokazać Ci co ciekawego możesz zrobić jako programista systemowy Linuxa oraz jak działają Linuxowe narzędzia programistyczne od środka. Pokażę Ci w jaki sposób możesz zautomatyzować sobie pracę korzystając ze skryptów powłoki i przedstawię kilka narzędzi, z których korzystam na co dzień podczas pracy z Linuxem.

Jeśli podobał Ci się ten wpis lub masz jakieś pytania, proszę, napisz komentarz. Jeśli nie chcesz przegapić kolejnych wpisów, zapisz się na mój [newsletter](/newsletter/) i polub moją [stronę na Facebooku](https://www.facebook.com/BezKompilatora/).

Dziękuję i do zobaczenia 🙂
