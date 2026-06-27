---
title: "Jak zainstalować Linuxa? – cztery sposoby na start (część 2)"
date: 2018-03-13
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["linux", "instalacja", "ubuntu", "wubi"]
image: "/images/uploads/2018/03/installation_methods_600x315.jpg"
summary: "Cześć! Dziś nadszedł czas na kontynuację wpisu, będącego kompletną instrukcją instalacji Linuxa. Poprzednim razem opisywałem uruchamianie Ubuntu w trybie LiveCD oraz instalację w maszynie wirtualnej, natomiast dziś pokażę Ci dwie kolejne metody – wykorzystanie instalatora Wubi oraz pełną…"
---

Cześć! Dziś nadszedł czas na kontynuację wpisu, będącego kompletną instrukcją instalacji Linuxa. Poprzednim razem opisywałem uruchamianie Ubuntu w trybie LiveCD oraz instalację w maszynie wirtualnej, natomiast dziś pokażę Ci dwie kolejne metody – wykorzystanie instalatora Wubi oraz pełną instalację Linuxa na dysku.

Jeżeli nie czytałeś [pierwszej części tego wpisu](/blog/jak-zainstalowac-linuxa-czesc-1/), to zdecydowanie polecam Ci wrócić do niej i przeczytać przynajmniej sekcję zatytułowaną *“Przygotowania”* – zawiera ona listę rzeczy, które powinieneś zrobić zanim przejdziesz do instalacji Linuxa. Jeśli przygotowania masz już za sobą, to zapraszam Cię do dalszej części wpisu.

### Sposób 3: Instalator Wubi

Użycie instalatora Wubi pozwala na uzyskanie czegoś pomiędzy instalacją w maszynie wirtualnej a pełną instalacją na dysku. Z jednej strony Linux instalowany jest na wirtualnym dysku przechowywanym jako plik na dysku Windowsa, z drugiej strony system uruchamiany jest na rzeczywistym sprzęcie, czyli zupełnie inaczej niż w przypadku maszyny wirtualnej (z wyjątkiem wirtualnego dysku systemowego). Rozwiązanie to ma sporo zalet:

-   Linux ma procesor, pamięć oraz pozostałe zasoby komputera na wyłączność, może więc działać z dużo lepszą wydajnością niż w przypadku maszyny wirtualnej.
-   Instalacja z Wubi jest bezpieczniejsza niż zwykła instalacja na dysku, ponieważ w przypadku błędu nie ryzykujesz utraty swoich danych.
-   Wydajność jest wyraźnie lepsza niż w przypadku uruchomienia z LiveCD, a zmiany w ustawieniach i pliki na dysku są zachowywane pomiędzy uruchomieniami.

Posiada też jednak pewne wady:

-   Wubi domyślnie wspiera tylko Ubuntu. Instalacja innej dystrybucji tą metodą wymaga sporo kombinowania.
-   Dostęp do wirtualnego dysku jest wolniejszy niż do rzeczywistego, więc pod względem wydajnościowym rozwiązanie wypada gorzej niż zwykła instalacja.
-   Użycie Wubi wymaga wyłączenia w systemie Windows funkcji Fast Startup, co może wydłużyć czas uruchamiania tego systemu.

Kiedyś instalator Wubi był częścią obrazu instalacyjnego Ubuntu i mówiąc szczerze dopiero przygotowując ten wpis zorientowałem się, że już tak nie jest. Po szybkim przewertowaniu internetu okazało się, że ostatnią wersją Ubuntu zawierającą Wubi było 12.04 wydane w 2012 roku. Osobiście nigdy nie używałem Wubi, ale kiedyś zainstalowałem w ten sposób Linuxa młodszemu bratu – okazało się, że było to Ubuntu 9.04 wydane w 2009 roku. Jak ten czas szybko leci 🙂

W pewnym momencie pomyślałem już, że zrezygnuję z opisywania tego sposobu instalacji, skoro od paru dobrych lat jest on nieaktualny. Dalsze badanie losów Wubi przywróciło mi jednak nadzieję. Okazało się, że stała się jedna z tych rzeczy, za które najbardziej lubię open source. Po tym jak w 2012 roku oryginalni twórcy Wubi zrezygnowali z prac nad nowszymi wersjami oprogramowania, członkowie społeczności, mając dostęp do kodu źródłowego, kontynuowali niezależnie dalszy rozwój projektu. Dzięki temu dziś nadal pojawiają się kolejne wydania Wubi, pozwalające na instalację najświeższych wersji Ubuntu.

Instalator Wubi możesz pobrać z [tej strony](https://github.com/hakuna-m/wubiuefi/releases). Znajdziesz tam listę wszystkich wersji Wubi, więc musisz wybrać tą, która odpowiada wersji Ubuntu, jaką zamierzasz zainstalować. Autorzy chwalą się, że Wubi potrafi automatycznie pobrać obraz instalacyjny Ubuntu w trakcie instalacji, ale istnieje też możliwość pobrania go samodzielnie, i ta opcja, mimo wszystko, wydaje mi się bezpieczniejsza, więc polecam ją również Tobie.

Poniżej znajdziesz kompletną instrukcję instalacji w postaci zrzutów ekranu z komentarzem:

[![1. Pobieranie Wubi](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi01.png "1. Pobieranie Wubi")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi01.png)

[![2. Przygotowanie Wubi i obrazu instalacyjnego](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi02.png "2. Przygotowanie Wubi i obrazu instalacyjnego")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi02.png)

[![3. Uruchomienie wiersza poleceń jako administrator](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi03.png "3. Uruchomienie wiersza poleceń jako administrator")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi03.png)

[![4. Wyłączenie funkcji Fast Startup](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi04.png "4. Wyłączenie funkcji Fast Startup")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi04.png)

[![5. Uruchomienie instalatora Wubi](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi05.png "5. Uruchomienie instalatora Wubi")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi05.png)

[![6. Konfiguracja instalacji](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi06.png "6. Konfiguracja instalacji")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi06.png)

  

[![7. Prośba o ponowne uruchomienie](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi07.png "7. Prośba o ponowne uruchomienie")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi07.png)

[![8. Ponowne uruchomienie](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi08.png "8. Ponowne uruchomienie")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi08.png)

[![9. Instalator Ubuntu](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi09.png "9. Instalator Ubuntu")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi09.png)

[![10. Boot Menu](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi10.png "10. Boot Menu")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi10.png)

[![11. Menu GRUB](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi11.png "11. Menu GRUB")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi11.png)

[![12. Uruchomienie Ubuntu](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi12.png "12. Uruchomienie Ubuntu")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi12.png)

  

Ekran Boot Managera może wyglądać u Ciebie nieco inaczej. Mogą też wystąpić niewielkie różnice w zależności od tego czy używasz UEFI czy tradycyjnego BIOSu, ale niezależnie od tego, bez trudu powinieneś znaleźć odpowiednią opcję.

Obraz instalacyjny Ubuntu możesz usunąć z dysku zaraz po instalacji, żeby nie zajmował niepotrzebnie miejsca. Natomiast instalator Wubi warto zachować, na wypadek, gdybyś chciał kiedyś usunąć instalację. Aby to zrobić, po prostu uruchom Wubi i wybierz odpowiednią opcję:

[![Odinstalowywanie Wubi](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/thumbs/thumbs_wubi13.png "Odinstalowywanie Wubi")](/images/wp-content/gallery/instalacja-ubuntu-z-wubi/wubi13.png)

### Sposób 4: Pełna instalacja na dysku

Ostatnia metoda to klasyczna, pełna instalacja na dysku. Ten sposób jest najlepszy pod względem wydajności systemu, dlatego stosują go niemal wszyscy bardziej zaawansowani użytkownicy Linuxa. Jest też jednak najbardziej niebezpieczny – podczas jego stosowania istnieje ryzyko uszkodzenia lub utraty danych na dysku.

Niebezpieczeństwo to wynika z tego, że podczas instalacji partycja systemu Windows jest zmniejszana o określony rozmiar, a powstałe w ten sposób wolne miejsce przekształcane jest na nową partycję, która posłuży następnie do instalacji Linuxa. Jeśli w trakcie tej operacji coś pójdzie nie tak (na przykład rozładuje się bateria w laptopie), to istnieje ryzyko, że dane na partycji Windowsa zostaną uszkodzone.

Jeśli zastanawiasz się czym jest partycja, jest to po prostu wydzielony obszar dysku, który może być używany jako osobny dysk. Dzięki temu nie musisz mieć w komputerze wielu osobnych dysków, żeby móc zainstalować kilka systemów operacyjnych lub korzystać z różnych systemów plików.

Ryzyko utraty danych nie dotyczy przypadków, kiedy instalujesz Linuxa jako jedyny system na komputerze, albo kiedy masz osobny dysk, przeznaczony na ten cel. Z moich doświadczeń wynika jednak, że konfiguracja Linux + Windows na jednym dysku zdarza się najczęściej, więc na tym przypadku skupię się najbardziej.

Na potrzeby tego wpisu zainstalowałem na moim komputerze Ubuntu 17.10 obok Windowsa i muszę przyznać, że na przestrzeni ostatnich kilku lat sytuacja znacznie się poprawiła. Proces instalacji dla typowych przypadków jest teraz bardzo uproszczony i nie wymaga zaawansowanej wiedzy na temat zarządzania partycjami czy instalacji programu rozruchowego. Wbrew temu co mówią Linuxowi puryści, uważam, że to bardzo dobrze, bo próg wejścia dla osób początkujących jest znacznie niższy niż jeszcze kilka lat temu.

Jeżeli instalujesz Linuxa na laptopie, upewnij się że jest podłączony do ładowarki – zminimalizujesz w ten sposób ryzyko utraty danych. Podczas instalacji przyda Ci się dysk instalacyjny przygotowany wcześniej. Po włożeniu pendrive’a do portu USB lub płyty CD/DVD do stacji dysków, uruchom ponownie komputer, i w trakcie startu wciśnij klawisz wyboru Boot Menu (zwykle F12). Poniżej znajdziesz szczegółową instrukcję w postaci zrzutów ekranu z komentarzem:

[![1. Boot menu](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install01.png "1. Boot menu")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install01.png)

[![2. UNetbootin menu](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install02.png "2. UNetbootin menu")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install02.png)

[![3. Menu wyboru języka](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install03.png "3. Menu wyboru języka")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install03.png)

[![4. Aktualizacje w trakcie instalacji](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install04.png "4. Aktualizacje w trakcie instalacji")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install04.png)

[![5. Wybór rodzaju instalacji](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install05.png "5. Wybór rodzaju instalacji")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install05.png)

[![6. Wybór dysku](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install06.png "6. Wybór dysku")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install06.png)

  

[![7. Potwierdzenie utworzenia partycji](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install07.png "7. Potwierdzenie utworzenia partycji")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install07.png)

[![8. Potwierdzenie wyboru dysku](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install08.png "8. Potwierdzenie wyboru dysku")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install08.png)

[![9. Wybór lokalizacji użytkownika](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install09.png "9. Wybór lokalizacji użytkownika")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install09.png)

[![10. Wybór języka klawiatury](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install10.png "10. Wybór języka klawiatury")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install10.png)

[![11. Tworzenie konta użytkownika](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install11.png "11. Tworzenie konta użytkownika")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install11.png)

[![12. Instalacja](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install12.png "12. Instalacja")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install12.png)

  

[![13. Ponowne uruchomienie po instalacji](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install13.png "13. Ponowne uruchomienie po instalacji")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install13.png)

[![14. Menu GRUB](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install14.png "14. Menu GRUB")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install14.png)

[![15. Ekran logowania](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install15.png "15. Ekran logowania")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install15.png)

[![16. Pierwsze uruchomienie](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install16.png "16. Pierwsze uruchomienie")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install16.png)

[![17. Aktualizacje](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/thumbs/thumbs_install17.png "17. Aktualizacje")](/images/wp-content/gallery/instalacja-ubuntu-na-partycji/install17.png)

Jeżeli zamierzasz częściej korzystać z Windowsa niż z Linuxa, uznasz pewnie za niewygodne, że to właśnie Linux uruchamiany jest domyślnie w trakcie startu komputera, a Windowsa trzeba za każdym razem ręcznie wybierać z menu. Na szczęście da się to skonfigurować i na pewno napiszę o tym we wpisie przedstawiającym różne sztuczki ułatwiające życie z Linuxem.

### Podsumowanie

Dziękuję Ci za przeczytanie tego wpisu. Jeżeli doczytałeś do tego momentu, to znaczy, że udało mi się ugryźć temat w ludzki sposób. Przymierzając się do wpisu o instalacji Linuxa nie podejrzewałem, że wyjdzie z tego tyle materiału – w obu wpisach wyszło łącznie 60 zrzutów ekranu i ponad 15 stron podaniowych tekstu. Liczę na to, że ta wiedza będzie Ci dobrze służyć.

Jeżeli chcesz się ze mną podzielić swoimi przemyśleniami lub uwagami, to napisz, proszę, komentarz pod wpisem. Jeśli nie chcesz przegapić kolejnych wpisów, zapisz się na [newsletter Bez Kompilatora](/newsletter/) i zalajkuj moją [stronę na Facebooku](https://www.facebook.com/BezKompilatora/).

Dziękuję i do zobaczenia! 🙂
