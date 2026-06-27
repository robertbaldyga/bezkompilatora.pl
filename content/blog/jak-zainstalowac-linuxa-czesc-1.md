---
title: "Jak zainstalować Linuxa? – cztery sposoby na start (część 1)"
date: 2018-03-06
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["linux", "instalacja", "ubuntu", "virtualbox"]
image: "/images/uploads/2018/03/penguin_4_way_600x315.jpg"
summary: "Cześć! W poprzednim wpisie opowiadałem o Linuxie dość ogólnie, więc dziś przyszła pora na konkrety. W dzisiejszym wpisie pokażę Ci kilka sposobów na to, jak możesz zainstalować i uruchomić Linuxa na swoim komputerze. Opisuję tu cztery różne sposoby…"
---

Cześć! W [poprzednim wpisie](/blog/linux-kilka-rzeczy-ktore-powinienes-wiedziec/) opowiadałem o Linuxie dość ogólnie, więc dziś przyszła pora na konkrety. W dzisiejszym wpisie pokażę Ci kilka sposobów na to, jak możesz zainstalować i uruchomić Linuxa na swoim komputerze. Opisuję tu cztery różne sposoby oraz porównuję ich wady i zalety. Jeśli więc chciałbyś już dziś zostać użytkownikiem Linuxa, to zapraszam Cię do dalszej lektury.

Ze względu na fakt, że materiał jest bardzo obszerny, postanowiłem podzielić go na dwa osobne wpisy. W dzisiejszym wpisie pokażę etap przygotowań, oraz pierwsze dwa sposoby – uruchomienie z LiveCD oraz instalację w maszynie wirtualnej – a następnym razem opowiem o użyciu instalatora Wubi oraz opiszę tradycyjną, pełną instalację.

### Przygotowania

Zanim przejdziemy do rzeczy, upewnijmy się, czy na pewno masz pod ręką wszystko co będzie Ci potrzebne do instalacji i uruchomienia Linuxa. Oto lista rzeczy, które powinieneś przygotować:

###### **1\. Komputer wyposażony w stację dysków CD/DVD lub port USB z opcją bootowania.**

To dosyć oczywisty punkt – to na tym komputerze będziesz instalował oraz uruchamiał Linuxa. Obecnie praktycznie wszystkie komputery mają port USB z opcją bootowania, więc na tym wariancie skupię się bardziej.

###### **2\. Obraz instalacyjny wybranej dystrybucji Linuxa.**

Taki obraz możesz pobrać z oficjalnej strony dystrybucji. Jeśli zastanawiasz się, którą dystrybucję powinieneś wybrać, to na początek polecam Ci Ubuntu, które możesz pobrać [tutaj](https://www.ubuntu.com/download). Zwróć uwagę na to, żeby wybrać wersję desktop oraz obraz w formacie iso. Obrazy instalacyjne są zwykle sporych rozmiarów (rzędu kilku gigabajtów), więc pobieranie może trwać od kilku do kilkudziesięciu minut w zależności o szybkości łącza.

###### **3\. Bootowalny dysk instalacyjny.**

Dysk instalacyjny zawiera obraz instalacyjny Linuxa przygotowany tak, że można go uruchomić w momencie startu komputera. Jeśli chcesz użyć płyty CD/DVD, to po prostu wypal obraz na płycie. Jeśli zdecydujesz się na instalację z pendrive’a, to musisz go odpowiednio przygotować. Najpierw sformatuj pendrive’a na system plików FAT32, a następnie wgraj na niego obraz instalacyjny z użyciem programu UNetbootin. Możesz go pobrać za darmo z [tej strony](https://unetbootin.github.io/).

Cały proces opisany jest szczegółowo w komentarzach do poniższych zrzutów ekranu:

[![Formatowanie pendrive'a 1](/images/wp-content/gallery/tworzenie-dysku-instalacyjnego/thumbs/thumbs_format_01.jpg "Formatowanie pendrive'a 1")](/images/wp-content/gallery/tworzenie-dysku-instalacyjnego/format_01.jpg)

[![Formatowanie pendrive'a 2](/images/wp-content/gallery/tworzenie-dysku-instalacyjnego/thumbs/thumbs_format_02.jpg "Formatowanie pendrive'a 2")](/images/wp-content/gallery/tworzenie-dysku-instalacyjnego/format_02.jpg)

[![Użycie programu UNetbootin](/images/wp-content/gallery/tworzenie-dysku-instalacyjnego/thumbs/thumbs_unetbootin.jpg "Użycie programu UNetbootin")](/images/wp-content/gallery/tworzenie-dysku-instalacyjnego/unetbootin.jpg)

  

Kiedy przygotowania masz już za sobą, to możemy przejść do właściwej części dzisiejszego wpisu – instalacji i uruchamiania Linuxa na Twoim komputerze. Poniżej znajdziesz opis poszczególnych sposobów, w kolejności od najprostszego (i najbezpieczniejszego) do najbardziej zaawansowanego.

### Sposób 1: Bez instalacji – LiveCD

Ten sposób jest świetny, jeśli nie chcesz instalować Linuxa na stałe na swoim komputerze, ale chciałbyś go przetestować. Polega on na uruchomieniu systemu w tzw. trybie LiveCD.

Jak sugeruje sama nazwa, w trybie tym Linux odpalany jest “na żywo” prosto z płyty instalacyjnej lub z pendrive’a. Wystarczy zbootować komputer z dysku instalacyjnego –  w trakcie uruchamiania komputera wybrać bootowanie z dysku USB lub z płyty CD/DVD – a następnie w menu instalatora wybrać odpowiednią opcję włączającą tryb LiveCD. W Ubuntu opcja ta nazywa się “Try Ubuntu”, a w wersji polskiej “Wypróbuj Ubuntu”.

Szczegółowy opis z obrazkami poniżej:

[![1. Boot menu](/images/wp-content/gallery/ubuntu-livecd/thumbs/thumbs_try_01.jpg "1. Boot menu")](/images/wp-content/gallery/ubuntu-livecd/try_01.jpg)

[![2. UNetbootin menu](/images/wp-content/gallery/ubuntu-livecd/thumbs/thumbs_try_02-1.jpg "2. UNetbootin menu")](/images/wp-content/gallery/ubuntu-livecd/try_02-1.jpg)

[![3. Działająca instalacja](/images/wp-content/gallery/ubuntu-livecd/thumbs/thumbs_try_03.jpg "3. Działająca instalacja")](/images/wp-content/gallery/ubuntu-livecd/try_03.jpg)

  

Tryb LiveCD pozwala na uruchomienie w pełni funkcjonalnego Linuxa. Minus tego rozwiązania jest taki, że wszystkie zmiany jakich dokonamy zostaną utracone w momencie restartu komputera. Może być też widoczne spowolnienie działania systemu – wynika to z faktu, że dane ładowane są z pendrive’a lub płyty CD/DVD, które są zazwyczaj wolniejsze niż dysk twardy komputera.

Podsumowując, ta metoda jest dobra jeśli chcesz po prostu sprawdzić jak wygląda dana dystrybucja Linuxa zanim zdecydujesz się ją zainstalować. Kiedy już podejmiesz ostateczną decyzję, będziesz potrzebować jednego z trzech pozostałych sposobów.

### Sposób 2: Maszyna wirtualna

Kolejna metoda, to instalacja Linuxa w maszynie wirtualnej działającej pod kontrolą innego systemu operacyjnego (np. Windowsa). Jest to świetne rozwiązanie dla osób, które nie potrzebują bardzo dużej wydajności systemu (np. używają Linuxa głównie do nauki), albo muszą często przełączać się między Linuxem i innym systemem operacyjnym.

Jeśli zastanawiasz się czym jest maszyna wirtualna, to jest to specjalne oprogramowanie potrafiące “udawać” sprzęt komputerowy, i umożliwiające na tym wirtualnym sprzęcie uruchamianie programów, a nawet całych systemów operacyjnych. Program, który działa wewnątrz takiej maszyny “myśli”, że działa na rzeczywistym sprzęcie, ale w rzeczywistości wszystko odbywa się w całkowicie wirtualnym środowisku.

Zaletą takiego rozwiązania jest możliwość uruchomienia Linuxa “wewnątrz” Windowsa, co pozwala na używanie obu systemów jednocześnie. Minus jest taki, że zasoby komputera (czas procesora, pamięć, sieć itd.) dzielone są pomiędzy dwa działające obok siebie systemy operacyjne, co ma negatywny wpływ na wydajność. Na szczęście współczesne komputery mają spory zapas mocy, więc jeżeli nie potrzebujesz robić nic bardzo wymagającego (np. grać w gry, które są zazwyczaj bardzo zasobożerne), to prawdopodobnie nie odczujesz różnicy. Poza tym, kiedy najdzie Cię ochota, żeby pograć, to taką maszynę wirtualną możesz w każdej chwili wyłączyć, odzyskując zużywane przez nią zasoby.

Maszynę wirtualną możesz stworzyć na przykład przy pomocy programu VirtualBox. Jest on dostępny do pobrania za darmo do zastosowań niekomercyjnych i mogę go śmiało polecić. Pobierzesz go z [tej strony](https://www.virtualbox.org/wiki/Downloads).

Cały proces instalacji wymaga odrobiny doświadczenia, dlatego przygotowałem szczegółowy opis w postaci zrzutów z ekranu z komentarzem:

[![1. Tworzenie maszyny wirtualnej](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_01.jpg "1. Tworzenie maszyny wirtualnej")](/images/wp-content/gallery/ubuntu-vm/vm_01.jpg)

[![2. Ustawianie rozmiaru pamięci RAM](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_02.jpg "2. Ustawianie rozmiaru pamięci RAM")](/images/wp-content/gallery/ubuntu-vm/vm_02.jpg)

[![3. Tworzenie wirtualnego dysku twardego](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_03.jpg "3. Tworzenie wirtualnego dysku twardego")](/images/wp-content/gallery/ubuntu-vm/vm_03.jpg)

[![4. Tworzenie wirtualnego dysku twardego](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_04.jpg "4. Tworzenie wirtualnego dysku twardego")](/images/wp-content/gallery/ubuntu-vm/vm_04.jpg)

[![5. Tworzenie wirtualnego dysku twardego](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_05.jpg "5. Tworzenie wirtualnego dysku twardego")](/images/wp-content/gallery/ubuntu-vm/vm_05.jpg)

[![6. Tworzenie wirtualnego dysku twardego](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_06.jpg "6. Tworzenie wirtualnego dysku twardego")](/images/wp-content/gallery/ubuntu-vm/vm_06.jpg)

  

[![7. Dostosowywanie ustawień maszyny wirtualnej](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_07.jpg "7. Dostosowywanie ustawień maszyny wirtualnej")](/images/wp-content/gallery/ubuntu-vm/vm_07.jpg)

[![8. Ustawienia procesora](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_08.jpg "8. Ustawienia procesora")](/images/wp-content/gallery/ubuntu-vm/vm_08.jpg)

[![9. Wsparcie IO APIC](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_09.jpg "9. Wsparcie IO APIC")](/images/wp-content/gallery/ubuntu-vm/vm_09.jpg)

[![10. Uruchomienie maszyny wirtualne](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_10.jpg "10. Uruchomienie maszyny wirtualne")](/images/wp-content/gallery/ubuntu-vm/vm_10.jpg)

[![11. Informacja o przechwytywaniu klawiatury](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_11.jpg "11. Informacja o przechwytywaniu klawiatury")](/images/wp-content/gallery/ubuntu-vm/vm_11.jpg)

[![12. Wybór obrazu instalacyjnego](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_12.jpg "12. Wybór obrazu instalacyjnego")](/images/wp-content/gallery/ubuntu-vm/vm_12.jpg)

  

[![13. Informacja o ustawieniach grafiki](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_13.jpg "13. Informacja o ustawieniach grafiki")](/images/wp-content/gallery/ubuntu-vm/vm_13.jpg)

[![14. Rozpoczęcie instalacji](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_14.jpg "14. Rozpoczęcie instalacji")](/images/wp-content/gallery/ubuntu-vm/vm_14.jpg)

[![15. Aktualizacje w trakcie instalacji](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_15.jpg "15. Aktualizacje w trakcie instalacji")](/images/wp-content/gallery/ubuntu-vm/vm_15.jpg)

[![16. Wybór instalacji na całym dysku](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_16.jpg "16. Wybór instalacji na całym dysku")](/images/wp-content/gallery/ubuntu-vm/vm_16.jpg)

[![17. Potwierdzenie instalacji na dysku](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_17.jpg "17. Potwierdzenie instalacji na dysku")](/images/wp-content/gallery/ubuntu-vm/vm_17.jpg)

[![18. Wybór lokalizacji użytkownika](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_18.jpg "18. Wybór lokalizacji użytkownika")](/images/wp-content/gallery/ubuntu-vm/vm_18.jpg)

  

[![19. Wybór języka klawiatury](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_19.jpg "19. Wybór języka klawiatury")](/images/wp-content/gallery/ubuntu-vm/vm_19.jpg)

[![20. Tworzenie konta użytkownika](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_20.jpg "20. Tworzenie konta użytkownika")](/images/wp-content/gallery/ubuntu-vm/vm_20.jpg)

[![21. Instalacja](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_21.jpg "21. Instalacja")](/images/wp-content/gallery/ubuntu-vm/vm_21.jpg)

[![22. Ponowne uruchomienie po instalacji](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_22.jpg "22. Ponowne uruchomienie po instalacji")](/images/wp-content/gallery/ubuntu-vm/vm_22.jpg)

[![23. Ekran logowania](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_23.jpg "23. Ekran logowania")](/images/wp-content/gallery/ubuntu-vm/vm_23.jpg)

[![24. Działająca instalacja](/images/wp-content/gallery/ubuntu-vm/thumbs/thumbs_vm_24.jpg "24. Działająca instalacja")](/images/wp-content/gallery/ubuntu-vm/vm_24.jpg)

  

Po zakończeniu instalacji możesz w dowolnej chwili włączać i wyłączać maszynę wirtualną, otrzymując za każdym razem dostęp do Linuxa w ostatnim zapisanym stanie.

Na dysku maszyny wirtualnej możesz instalować programy i przechowywać dane – wszystko jest tak samo trwałe jak zwykłe dane na Twoim dysku. Dzieje się tak dlatego, że VirtualBox przechowuje wirtualny obraz dysku jako zwykły plik na Twoim komputerze. Można dzięki temu np. łatwo zrobić kopię zapasową maszyny wirtualnej. Można też kopiować dane między Twoim dyskiem a dyskiem maszyny wirtualnej, ale to już temat na zupełnie osobny wpis.

### Podsumowanie

To tyle na dzisiaj. Mam nadzieję, że dzisiejszy wpis przybliżył Ci nieco jak wygląda instalacja Linuxa. Jak miałeś okazję się przekonać, nie jest to proces bardzo skomplikowany – odrobina chęci wystarczy, żeby zostać użytkownikiem Linuxa. W kolejnej części omówię pozostałe dwa sposoby instalacji – z użyciem instalatora Wubi oraz pełną instalację.

Dziękuję Ci za przeczytanie tego wpisu. Jeśli Ci się spodobał, to koniecznie podziel się swoimi wrażeniami w komentarzu. Jeśli masz jakieś przemyślenia lub uwagi, to również zachęcam Cię do komentowania. Dzięki i do zobaczenia!

Drugą część wpisu znajdziesz tutaj:  
[Jak zainstalować Linuxa? – cztery sposoby na start (część 2)](/blog/jak-zainstalowac-linuxa-czesc-2/)
