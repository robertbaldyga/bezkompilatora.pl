---
title: "Jak startuje współczesny Linux?"
date: 2018-09-24
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["boot", "UEFI", "BIOS", "bootloader", "GRUB", "systemd", "initramfs"]
image: "/images/uploads/2018/09/girl-with-laptop-starting-rocket.jpg"
summary: "Zazwyczaj wygląda to tak: Po wciśnięciu przycisku POWER na obudowie komputera, zaczyna się dziać magia, która trwa od kilkunastu do kilkudziesięciu sekund. W tym czasie na ekranie pojawiają się i znikają różne napisy i obrazki, a na koniec ukazuje…"
---

Zazwyczaj wygląda to tak: Po wciśnięciu przycisku POWER na obudowie komputera, zaczyna się dziać magia, która trwa od kilkunastu do kilkudziesięciu sekund. W tym czasie na ekranie pojawiają się i znikają różne napisy i obrazki, a na koniec ukazuje się ekran logowania, dający nam pierwszy raz poczucie, że wiemy, co się dzieje.

No dobra, przesadzam. Większość z nas kojarzy, że jest coś takiego jak BIOS, bootloader, jądro, czy proces init. Część zapewne wie, czym się różni *Legacy BIOS* od *UEFI*, *SysV Init* od *systemd*, oraz jaką funkcję pełni *initramfs*. Niezależnie od tego, właśnie na temat startu systemu będzie dzisiejszy wpis. Dedykuję go zarówno tym, którym proces uruchamiania systemu kojarzy się z magią, jak tym, którzy chcieliby po prostu pogłębić posiadaną wiedzę.

### Start systemu w 7 krokach

Procedura uruchamiania systemu składa się z kilku etapów. Część z nich jest ściśle powiązana ze sprzętem i zupełnie niezależna od tego jaki system operacyjny zamierzamy uruchomić. Pozostałe wynikają z przyjętych konwencji i architektury Linuxa, choć niektóre noszą znamię historycznej zaszłości. Tak czy inaczej, wkrótce przekonamy się, że taki podział na etapy ma sens i pozwala na dużą elastyczność.

Dokładny przebieg procedury startu systemu jest zależny od platformy sprzętowej i na różnych architekturach może wyglądać inaczej. W dzisiejszym wpisie skupiam się na rodzinie x86, czyli popularnych procesorach jakie można spotkać w większości komputerów PC. Jest to architektura utrzymująca względną kompatybilność wsteczną od ponad 40 lat, co skutkuje dużą ilością historycznych zaszłości. Mamy więc w naszych komputerach kawałek żywej historii techniki. 😉

Na współczesnych platformach x86 procedura startu Linuxa wygląda to następująco:

1.  Uruchamiany jest firmware UEFI.
2.  Ładowany jest program rozruchowy (ang. *bootloader*).
3.  Ładowane jest jądro Linuxa.
4.  Montowany jest inicjalny system plików (*initramfs)*.
5.  Uruchamiany jest proces *init*.
6.  Montowany jest *rootfs*.
7.  Uruchamiany jest init-system, przygotowujący przestrzeń użytkownika.

Niektórzy mogą protestować, że to nie do końca prawda, bo zamiast UEFI można włączyć Legacy BIOS, program rozruchowy w UEFI jest opcjonalny, a bez *initramfs*’a też da się żyć. O ile przynajmniej część z tych argumentów jest poprawna, to praktycznie wszystkie mi znane dystrybucje Linuxa startują w opisany sposób. Przejdźmy więc do bardziej szczegółowych opisów, gdzie wyjaśnię dokładniej dlaczego się tak dzieje.

### Firmware UEFI, czyli następca BIOS’a

W ciągu ostatnich kilkunastu lat firmware UEFI prawie całkowicie zastąpił BIOS’a. Przed przyjściem UEFI to właśnie BIOS był pierwszym programem uruchamianym podczas startu komputera. Wczytywany był z pamięci ROM umieszczonej na płycie głównej i odpowiadał za wykonanie wstępnych testów weryfikacyjnych komputera (ang. *Power-On Self-Test*, *POST*) i przygotowanie go do działania. Odpowiedzialny był także za wczytanie i uruchomienie programu rozruchowego – pierwszego etapu startu systemu operacyjnego.

BIOS posiadał szereg ograniczeń, które przyczyniły się do jego porzucenia na rzecz UEFI. Ładowany przez niego program rozruchowy musiał zmieścić się w rozmiarze 446 bajtów, ponieważ właśnie tyle miejsca na *bootloader* miał sektor rozruchowy dysku (tzw. *Master Boot Record*, *MBR*). Szybko okazało się, że to zdecydowanie za mało nawet dla niezbyt rozbudowanych *bootloader*’ów. MBR zawierał więc zazwyczaj prosty program, którego jedynym celem było załadowanie do pamięci właściwego *bootloader*’a.

Tradycyjny BIOS nie potrafił też zrobić wielu innych rzeczy, które stały się możliwe dzięki UEFI. Zapewnienie bezpieczeństwa poprzez technologię Secure Boot, obsługa wielu bootloaderów, systemów plików, a nawet połączeń sieciowych, to tylko niektóre z nich. Dlatego już od kilkunastu lat producenci sprzętu rezygnują z tradycyjnego BIOS’a, przechodząc w stronę UEFI. Obecnie praktycznie wszystkie nowe komputery PC wyposażone są właśnie w UEFI.

#### Jak działa UEFI?

Firmware UEFI pełni te same funkcje co BIOS, a dodatkowo standaryzuje procedurę startu systemu operacyjnego, dostarczając rozbudowane środowisko uruchomieniowe. W przeciwieństwie do BIOS’a, UEFI potrafi działać w trybie wirtualnego adresowania pamięci, umożliwiając bezpośrednie załadowanie jądra systemu do pamięci z pominięciem *bootloader*’a. Pomimo tego, prawie wszystkie dystrybucje Linuxa dostarczają program rozruchowy, o czym opowiem więcej za chwilę.

UEFI nie wykorzystuje MBR’a. Zamiast tego znajduje na dysku specjalnie oznaczoną partycję (ang. *EFI System Partition, ESP*) i z niej ładuje program rozruchowy lub jądro systemu. Dzięki takiemu rozwiązaniu możliwe jest bezpośrednie ładowanie programów o rozmiarze rzędu wielu megabajtów. Dodatkowo ESP może zawierać wiele programów rozruchowych, których wybór dokonywany jest z menu UEFI podczas uruchamiania komputera.

Warto wspomnieć jeszcze o trybie *Legacy BIOS*, czyli warstwie kompatybilności UEFI ze starym BIOS’em. Firmware UEFI pozwala na wybranie opcji, która spowoduje, że program rozruchowy nie będzie ładowany z partycji ESP, ale z MBR’a. Nie należy jednak mylić trybu kompatybilności z możliwością wyłączenia UEFI. Firmware UEFI jest ciągle uruchamiany podczas startu komputera i tylko w procedurze bootowania imituje zachowanie BIOS’a. Początkowo miało to zapewnić wsparcie dla systemów operacyjnych niedostosowanych do pracy z UEFI. Obecnie, dzięki powszechnemu wsparciu UEFI, opcja ta jest coraz rzadziej wykorzystywana.

### Program rozruchowy

O sposobie ładowania programu rozruchowego opowiedziałem już przy okazji porównywania UEFI do BIOS’a, więc pozostało dopowiedzieć tylko kilka szczegółów. W platformach z BIOS’em, bootloader pełnił ważną rolę, ponieważ musiał przygotować komputer do uruchomienia właściwego systemu operacyjnego. Program rozruchowy wykonywany był wówczas w trybie *rzeczywistym* (ang. real), odziedziczonym po przodkach z rodziny x86. W trybie tym programy mają do dyspozycji 1MB pamięci, bez możliwości wykorzystania wirtualnych przestrzeni adresowych. Jest to drugi (zaraz po rozmiarze MBR’a) powód, dla którego systemy operacyjne ładowały się z użyciem programu rozruchowego.

W systemach z UEFI te problemy nie występują, więc bootloader stał się *de facto* opcją. Nadal jest on jednak wykorzystywany ze względu na dodatkowe możliwości, jakie oferuje. Umożliwia on, na przykład, wybór jednej z kilku zainstalowanych wersji jądra oraz jednego z kilku obrazów inicjalnego systemu plików. Pozwala też na przekazanie parametrów jądra (ang. *kernel command-line* lub *kernel cmdline*), co umożliwia uzyskanie większej elastyczności. W menu programu rozruchowego znajdziemy też najczęściej tryb *recovery*, który jest przydatny w sytuacji, gdy potrzebujemy dokonać naprawy uszkodzonego systemu.

Najbardziej popularnym programem rozruchowym, wykorzystywanym przez większość dystrybucji Linuxa jest GRUB 2. Posiada on rozbudowaną funkcjonalność, składającą się m.in. z interaktywnej powłoki, obsługi systemu plików, wsparcia dla logicznych wolumenów i szyfrowania. Część z tych rzeczy obecnie pokrywa się z funkcjonalnością oferowaną przez firmware UEFI. Mimo to większość dystrybucji wciąż wykorzystuje GRUB’a, ze względu na dużą elastyczność zarządzania procesem startu Linux’a.

Program rozruchowy ładuje jądro z dysku do pamięci, a następnie przekazuje mu wykonanie. Dodatkowo ustawia parametry jądra, takie jak lokalizacja *rootfs*’a, lokalizacja obrazu *initfamfs*’a, ścieżka do programu *init*, czy nazwa urządzenia pełniącego funkcję konsoli szeregowej. W tym momencie kończą się kroki przygotowawcze i rozpoczyna się właściwy start Linuxa.

### Jądro Linuxa

Jądro przechowywane jest zazwyczaj w postaci spakowanego obrazu, aby zaoszczędzić miejsce na dysku i skrócić czas ładowania do pamięci. Dlatego jedną z pierwszych rzeczy, jakie mają miejsce po zakończeniu pracy programu rozruchowego jest samo-rozpakowanie jądra. Po wykonaniu minimalnych procedur inicjalizacyjnych, wywoływana jest funkcja rozpakowująca jądro z formatu *bzImage* do natywnej postaci binarnej.

Po rozpakowaniu rozpoczyna się wykonanie kodu, który inicjalizuje tablice stron (część mechanizmu zarządzania pamięcią) i rozpoznaje dokładny rodzaj procesora. Wykrywane są w tym czasie również rozszerzenia procesora, takie jak jednostka obliczeń zmiennoprzecinkowych (ang. *Floating-Point Unit*, *FPU*). Po tym etapie następuje przejście do kodu, który jest wspólny dla wszystkich architektur i stanowią centralną część jądra Linuxa – wywoływana jest funkcja *start\_kernel()*.

W funkcji tej wykonywana jest cała masa procedur inicjalizacyjnych. Konfigurowane są przerwania, uruchamiany jest podsystem zarządzania pamięcią, przygotowywany jest planista (ang. *scheduler*) i ładowany jest obraz inicjalnego systemu plików. Kiedy prace przygotowawcze dobiegają końca, tworzony jest pierwszy proces w przestrzeni użytkownika – proces *init* o numerze PID 1, rodzic wszystkich innych procesów. Od tej pory jądro przechodzi w stan bezczynności (ang. *idle*) i podejmuje działania tylko w odpowiedzi na wywołania systemowe lub przerwania od sprzętu. Inicjatywę przejmują programy w przestrzeni użytkownika.

### Inicjalny system plików

Jądro Linux’a potrafi od razu zamontować docelowy system plików *rootfs*, ale pod warunkiem, że wszystkie niezbędne do tej operacji sterowniki są wkompilowane w jądro. Dotyczy to przede wszystkim sterowników dysku oraz sterowników systemu plików umieszczonego na partycji z *rootfs*’em. Najczęściej jednak sterowniki te są dostępne w formie modułów, co z jednej strony pozwala na zmniejszenie rozmiaru jądra i skrócenie czasu bootowania, ale z drugiej uniemożliwia bezpośrednie zamontowanie docelowego *rootfs*’a. Wtedy z pomocą przychodzi inicjalny system plików.

Ma on postać niedużego, skompresowanego obrazu, który zawiera skrypty i moduły niezbędne do przygotowania właściwego systemu plików. Jest on przygotowywany osobno pod każdą dostępną wersję jądra i ładowany podczas jego startu. Na krótki czas, podczas startu systemu, pełni on funkcję tymczasowego korzenia systemu plików, po czym zastępowany przez właściwy *rootfs.*

Z wykorzystaniem *initramfs*’a związana jest jedna ważna konsekwencja – jako jedyny system plików dostępny podczas startu Linuxa musi on zawierać plik wykonywalny procesu *init*. Pierwszy proces w systemie nie może być uruchomiony z docelowego *rootfs*’a.

### Proces *init*

Pierwszy proces w systemie dostaje w pełni funkcjonalne jądro. Może on używać wywołań systemowych, tworzyć procesy pochodne, ładować moduły jądra i montować systemy plików. Ma on za zadanie przygotować całą przestrzeń użytkownika, a także czuwać nad procesami przez cały czas działania systemu. Jako przodek wszystkich procesów jest on bowiem odpowiedzialny za dziedziczenie i sprzątanie procesów zombie.

W przypadku startu systemu z użyciem *initramfs*’a, plik wykonywalny, z którego uruchamiany jest proces *init*, ma najczęściej postać skryptu powłoki. W efekcie procesem o numerze PID 1 zostaje interpreter skryptu. Nie jest to jednak docelowy *init* systemu – po zamontowaniu *rootfs*’a jest on podmieniany, poprzez bezpośrednie użycie wywołania *sys\_exec*.

W efekcie mamy do czynienia z dwoma osobnymi programami, jakie są wykonywane jako proces o numerze PID 1. Najpierw jest to skrypt będący częścią *initramfs*’a, który ładuje sterowniki i montuje *rootfs*’a, a następnie ustawia go jako korzeń systemu plików z użyciem wywołania systemowego *sys\_pivot\_root*. Później rolę przejmuje docelowy *init*, będący częścią danej dystrybucji Linux’a.

### Przygotowanie przestrzeni użytkownika

Końcowym etapem startu systemu jest uruchomienie wszystkich serwisów wchodzących w skład w pełni funkcjonalnego systemu. Przez wiele lat w większości dystrybucji Linuxa odpowiadał za to *SysV Init*. Jego działanie polegało na uruchamianiu w odpowiedniej kolejności dużej ilości skryptów startowych. Było to proste rozwiązanie, ale dawało bardzo ograniczone możliwości zrównoleglania startu niezależnych serwisów. Przekładało się to na dłuższy czas uruchomienia systemu.

*SysV Init* cierpiał dodatkowo na kilka innych problemów, takich jak brak obsługi dynamicznie pojawiających się urządzeń i brak możliwości dynamicznego budowania sekwencji startowej, przez co niektóre konfiguracje były niemożliwe do osiągnięcia. W efekcie niektóre dystrybucje wypracowały swoje własne rozwiązania, takie jak np. *Upstart* stworzony dla Ubuntu. Działania te spowodowały jednak rozbieżności pomiędzy dystrybucjami, przez co twórcy oprogramowania musieli dostarczać skrypty startowe dla wielu różnych init-systemów.

Rozwiązaniem tych problemów okazał się *systemd*. Wiele osób stwierdzi pewnie, że przyniósł on w zamian swoje nowe problemy (wprowadzenie *systemd* do dziś budzi pewne kontrowersje), ale okazał się on na tyle lepszy od używanych wcześniej rozwiązań, że został w ciągu kilku lat zaadaptowany przez prawie wszystkie główne dystrybucje Linuxa. Na dzień dzisiejszy możemy więc mieć sporą pewność, że używana przez nas dystrybucja wykorzystuje właśnie *systemd*.

#### Jak działa *systemd*?

Sukces *systemd* wynika w dużej mierze z jego dynamicznej natury. Zamiast utrzymywać stałą listę zdefiniowanych kroków, *systemd* operuje na zadaniach (serwisach) i relacjach między nimi. Jeżeli serwis B zależy od serwisu A, to B wystartuje dopiero, kiedy A będzie gotowy. Jeżeli jednak pomiędzy nimi a serwisem C nie ma żadnej zależności, to serwis C wystartuje równolegle. Takie rozwiązanie znacznie przyspiesza uruchamianie systemu.

Dodatkowo *systemd* dobrze integruje się z pozostałymi podsystemami, takimi jak *udev* (podsystem odpowiedzialny za zarządzanie urządzeniami). Dzięki temu rola *systemd* nie ogranicza się tylko do obsługi sekwencji startowej, ale jego mechanizmy mogą być wykorzystane do reagowania na dynamicznie zmieniającą się sytuację w systemie.

Podczas procedury startowej *systemd* inicjalizuje połączenia sieciowe, montuje wirtualne wolumeny, uruchamia środowisko graficzne i wyświetla ekran logowania. W międzyczasie startuje masę innych serwisów, takich jak serwer ssh, http, mysql, czy serwis uruchamiający maszyny wirtualne. I jest przy tym w pełni konfigurowalny.

Wszystkie te rzeczy dzieją się w ostatnim stadium startu systemu i po ich zakończeniu Linux jest gotowy do użytku. Magia dobiega końca.

• • •

Dziękuję Ci za przeczytanie tego wpisu! Mam nadzieję, że udało mi się przedstawić proces uruchamiania systemu wraz z całą towarzyszącą mu historią w przystępny sposób. Wiem, że ten wpis obiecałem już dawno i niektóre osoby musiały na niego czekać. Tym bardziej więc mam nadzieję, że nie zawiodłem ich oczekiwań. 🙂

Jeżeli czytasz mojego bloga i nie chciałbyś przegapić nowego wpisu lub od czasu do czasu chciałbyś się dowiedzieć co u mnie słychać, to zapraszam Cię do zapisania się na mój [newsletter](/newsletter/) i do polubienia mojej [strony na Facebooku](https://www.facebook.com/BezKompilatora/). Z góry dzięki! 🙂
