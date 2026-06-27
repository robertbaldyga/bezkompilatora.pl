---
title: "Linux – kilka rzeczy, które powinieneś wiedzieć"
date: 2018-03-01
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["linux", "open-source", "dystrybucja", "ubuntu"]
image: "/images/uploads/2018/03/penguin_watercolor_600x315.jpg"
summary: "3, 2, 1… Cześć! Trafiłeś (trafiłaś) na pierwszy wpis na blogu “Bez Kompilatora” – programistycznym blogu pełnym historii. Długo zastanawiałem się jak powinien wyglądać ten wpis i doszedłem do wniosku, że skoro mam tu dużo pisać o Linuxie,…"
---

3, 2, 1… Cześć! Trafiłeś (trafiłaś) na pierwszy wpis na blogu “Bez Kompilatora” – programistycznym blogu pełnym historii. Długo zastanawiałem się jak powinien wyglądać ten wpis i doszedłem do wniosku, że skoro mam tu dużo pisać o Linuxie, to dobrym pomysłem będzie krótkie wprowadzenia dla osób, które z Linuxem nie miały wcześniej do czynienia. Jeśli więc chciałbyś się dowiedzieć czym jest Linux, dlaczego warto go używać i jak zacząć swoją przygodę z Linuxem, to ten wpis dedykuję właśnie Tobie.

### Czym jest Linux?

Linux jest jądrem systemu operacyjnego, czyli jego główna częścią, odpowiedzialną za zarządzanie sprzętem –  procesorem, pamięcią, dyskami, kartą graficzną, kartą dźwiękową, myszą, klawiaturą, drukarką i tak dalej – czyli kompletnym zestawem urządzeń wewnętrznych i zewnętrznych komputera. Z perspektywy pozostałej części systemu, jądro zapewnia bezpieczne środowisko uruchomieniowe, w którym mogą działać programy – mają one zapewniony czas procesora, własny obszar pamięci oraz dostęp do zasobów, takich jak pliki na dysku czy sockety sieciowe. Inne systemy operacyjne, takie jak Microsoft Windows czy Mac OS X, również posiadają własne jądra, spełniające podobne zadania.

Pierwszą wersję jądra Linuxa stworzył na początku lat 90-tych fiński student Linus Torvalds. I nie byłoby w tym nic niezwykłego (Linus nie był jedynym studentem, który stworzył jądro systemu operacyjnego), gdyby nie fakt, że postanowił swoją pracę podarować innym, udostępniając kod Linuxa na licencji open source (a konkretnie GNU General Public License, stworzonej przez open source’owego guru Richarda Stallmana).

To pionierskie posunięcie spotkało się z ogromnym entuzjazmem ze strony użytkowników i programistów z całego świata, i wkrótce uformowała się społeczność, która zaczęła aktywnie rozwijać pierwszy darmowy i otwarty system operacyjny. Dziś, po niemal trzydziestu latach, społeczność ta liczy dziesiątki tysięcy osób, i należą do niej już nie tylko entuzjaści, ale też profesjonaliści rozwijający Linuxa na rzecz największych firm technologicznych na świecie.

### Czym Linux różni się od innych systemów?

Linux został stworzony zupełnie od podstaw i chociaż pod pewnymi względami może przypominać inne systemy (szczególnie z rodziny UNIX-owych), to w rzeczywistości jest on zupełnie odrębnym tworem i nie jest nimi kompatybilny. Oznacza to, że pod Linuxem nie zadziała większość programów znanych z Mac OS X czy Windowsa, a nawet te wieloplatformowe muszą być specjalnie pod Linuxa skompilowane. Użytkownicy Linuxa nie mają więc możliwości skorzystania z Microsoft Office’a, Adobe Photoshop’a czy Apple iMovie.

Na szczęście istnieją Linuxowe odpowiedniki tych programów – Libre Office, Gimp czy Lightworks – tak samo jak odpowiedniki wielu innych programów, niedostępnych pod Linuxem. Poza tym spora część aplikacji, takich jak Firefox, Chrome, Thunderbird, Skype, Adobe Reader wydawana jest również w wersji Linuxowej.

Pod tym względem w nieco gorszej sytuacji są gracze – mimo, że z roku na rok gier wydawanych pod Linuxa jest coraz więcej, to wybór dostępnych tytułów wciąż pozostawia wiele do życzenia. Podobnie wygląda sprawa wśród profesjonalistów z niektórych branż – programy takie jak Autocad czy SolidWorks wciąż nie doczekały się wersji Linuxowych ani wystarczająco dobrych alternatyw.

Na szczęście problem ten nie dotyczy programistów – większość środowisk programistycznych znanych z innych systemów, takich jak Eclipse, Netbeans, InteliJ, Code::Block, QtCreator czy nawet Microsoft Visual Studio, działa bez problemów pod Linuxem. Podsumowując, każdy znajdzie coś dla siebie, ale nie wszyscy znajdą wszystko, czego potrzebują.

### Dlaczego warto używać Linuxa?

Kiedy ja zaczynałem używać Linuxa, a było to na początku studiów, bardzo mocno przemawiał do mnie argument, że Linux jest darmowy. I to wcale nie prawda, że kupując komputer dostajemy Windowsa w prezencie. Mój komputer w wersji z Windowsem kosztowałby kilkaset złotych więcej! Więc jeśli, tak jak ja, przy zakupie następnego komputera zdecydujesz, że Windows nie jest Ci już potrzebny, to kilkaset złotych może zostać w Twojej kieszeni.

Jeśli jednak nie chcesz rezygnować z innych systemów operacyjnych (wszakże na Linuxie świat się nie kończy), to do wypróbowania Linuxa może Cię przekonać coś ważniejszego niż pieniądze – bezpieczeństwo. Prawdziwą zmorą użytkowników komputera są wirusy. Pamiętasz ile razy miałeś z nimi problem? Może nawet znasz kogoś, komu randsomware zaszyfrował pliki na dysku, żądając okupu w Bitcoinach. W świecie Linuxa takie rzeczy to niebywała rzadkość. Nic więc dziwnego, że cieszy się on sławą jednego z najbezpieczniejszych systemów operacyjnych na świecie.

Nie mniej ważna jest jego niezawodność. Na pewno nie raz musiałeś uruchomić ponownie swój komputer z Windowsem, żeby zainstalować aktualizację, albo po prostu dlatego, że się zawiesił. Ja miałem kiedyś PC’ta z Linuxem, który chodził non-stop (pełnił u mnie funkcję serwera, routera i pewnie trochę grzejnika) i restartowałem go nie częściej jak kilka razy w roku. Zdarzało się, że działał nieprzerwanie przez ponad 200 dni, a cykl restartów naznaczony był przerwami w dostawie prądu.

Inną ważną cechą, która sprawia, że Linux dosłownie podbija świat jest jego przenośność. Jądro Linuxa można skompilować i uruchomić niemal na wszystkim – na komputerach biurkowych, serwerach, mini-komputerach, routerach, telefonach, telewizorach, samochodach, łodziach podwodnych i Wielkim Zderzaczu Hadronów. Jego elastyczność i możliwości konfiguracyjne sprawiają, że spektrum jego zastosowań jest naprawdę imponujące.

Jest jeszcze jedna cecha, o której wspominałem już wcześniej, a która może być niesamowicie ważna dla Ciebie jako programisty – kod źródłowy Linuxa jest otwarty. Chyba nie muszę tłumaczyć jak bardzo wielu przypadkach to ułatwia pracę. O wiele łatwiej jest zrozumieć działanie poszczególnych komponentów systemu mając możliwość spojrzenia w kod, co w przypadku systemów o zamkniętych źródłach jest praktycznie niemożliwe. Między innymi dlatego Linux jest przez wiele osób uważany za najlepszy system operacyjny dla programistów.

### Od czego zacząć?

Przygodę z Linuxem możesz zacząć na wiele sposobów. Możesz nawet uruchomić go bezpośrednio z płyty lub pendrive’a bez konieczności instalowania go na komputerze, a jeśli zdecydujesz się go zainstalować, możesz go mieć na jednym komputerze obok Windowsa lub w maszynie wirtualnej. Zanim jednak zaczniesz, musisz sobie odpowiedzieć na pierwsze ważne pytanie – jakiej dystrybucji chcesz używać.

### Co to jest dystrybucja Linuxa?

Dystrybucją Linuxa nazywamy kompletny system operacyjny składający się z jądra Linuxa oraz masy innego oprogramowania, zazwyczaj również open source. Potocznie mówiąc “Linux” mamy zazwyczaj na myśli nie samo jądro, ale właśnie jakąś dystrybucję. Dystrybucje dostarczają oprogramowanie systemowe (init system, manager sprzętu, manager paczek itd.), jedną lub więcej powłok (o powłokach powiemy sobie za chwilę), oraz zestaw aplikacji – od emulatora terminala, przez edytor tekstu, po przeglądarkę internetową. Dystrybucje składają się często w dużej części z oprogramowania powstałego w ramach projektu GNU, dlatego w stosunku do dystrybucji Linuxa stosuje się czasem podkreślającą ten fakt nazwę GNU/Linux.

Istotą dystrybucji jest dostarczenie oprogramowania umożliwiającego wygodne korzystanie z jądra Linuxa, ponieważ samo jądro, jako takie, nie udostępnia żadnego interfejsu użytkownika. Oprogramowanie dostarczające ten interfejs nazywamy właśnie powłoką (ang. shell). Linux posiada wiele powłok, zarówno w formie wiersza poleceń, jak i interfejsów graficznych, zapewniających okienkowe środowisko pracy znane z innych systemów operacyjnych.

Dystrybucje dzielą się na serwerowe i desktopowe. Dystrybucje serwerowe zoptymalizowane są pod kątem dostarczania usług sieciowych i nieprzerwanej pracy przez wiele miesięcy, natomiast dystrybucje desktopowe są dedykowane dla komputerów osobistych. Różnią się też tym, że dystrybucje serwerowe nie posiadają zazwyczaj środowiska graficznego. Powód jest prosty – serwery i tak nie miałyby na czym takiego środowiska wyświetlać.

Istnieje wiele dystrybucji Linuxa, które są tworzone przez różne grupy i organizacje rozsiane po całym świecie. Może Ci się to wydawać dziwne, jeśli do tej pory korzystałeś systemu operacyjnego takiego jak Microsoft Windows, gdzie wszystko dostarczane jest jako całość w jednym wariancie i nie trzeba wybierać spośród kilkudziesięciu czy nawet kilkuset (sic!) dystrybucji. W świecie Linuxa to jednak codzienność i na tym polega jego piękno – setki dystrybucji, zbierających tysiące projektów, tworzonych przez dziesiątki tysięcy ludzi z całego świata, którzy podpisali się na wirtualnych kartach historii, choćby kilkoma linijkami kodu.

### Jaką dystrybucję wybrać?

Przeglądanie listy dystrybucji Linuxa może przyprawić o ból głowy. Istnieje cała masa niszowych lub mocno specjalistycznych dystrybucji, takich jak Clonezilla Live, stworzona jako narzędzie do backupu i odzyskiwania danych (jest darmową alternatywą dla komercyjnego oprogramowania Norton Ghost), czy Kali Linux naszpikowany narzędziami do testów penetracyjnych sieci. Dystrybucje te są świetne w swoich wąskich specjalizacjach, jednak nie będą one najlepszym wyborem, jeśli szukamy systemu operacyjnego ogólnego przeznaczenia.

Na szczęście istnieje też kilka głównych dystrybucji Linuxa, które są najaktywniej rozwijane i mają największą grupę użytkowników. Należą do nich Ubuntu, Debian, Fedora, openSUSE, Gentoo czy Arch i to od nich najlepiej zacząć swoją przygodę z Linuxem.

Jeśli miałbym polecić jedną konkretną dystrybucję, to było by to Ubuntu, które promuje się z resztą jako przyjazne dla początkujących. Moim zdaniem jest w tym dużo prawdy, przy czym warto zauważyć, że przyjazność ta nie została okupiona ograniczeniem funkcjonalności. Ubuntu jest pełnoprawną dystrybucją Linuxa, przygotowaną z myślą o Linuxowych nowicjuszach, ale sprawdzającą się także w przypadku profesjonalistów. Właśnie z Ubuntu korzystam przygotowując przykłady i tutoriale tworzone na potrzeby tego bloga.

### Podsumowanie

To tyle na dzisiaj. Mam nadzieję, że rozjaśniłem Ci nieco całą sprawę związaną z Linuxem, i że teraz masz już podstawową wiedzę, którą wykorzystasz stawiając pierwsze kroki w Linuxowym świecie. Liczę na to, że wiesz już co możesz zyskać, zarówno jako użytkownik jak i programista, dołączając do społeczności skupionej wokół Linuxa – małego wielkiego projektu, który stał się ikoną ideologii open source.

Przez niemal trzy dekady swojego istnienia, Linux nie tylko zdobył serca milionów użytkowników, ale też udowodnił swoją prawdziwą wartość, przekonując największe firmy technologiczne na świecie do zainwestowania milionów dolarów w jego rozwój. Dziś Linux podbija świat i możemy go spotkać wszędzie – od superkomputerów i centrów danych, przez autobusy i telebimy, statki kosmiczne i automaty, po smartfony, smartwatche i urządzenia IoT. Zagościł w naszym świecie na dobre, i choć często nie widać go na pierwszy rzut oka, jest tuż obok i warto go poznać.

To już koniec. Dziękuję Ci za czas poświęcony na przeczytanie tego wpisu. Jeśli masz na jego temat jakieś przemyślenia – proszę, opisz je w komentarzu. Jeśli Ci się nie spodobał – to również podziel się swoimi uwagami. Z góry dzięki i do zobaczenia!
