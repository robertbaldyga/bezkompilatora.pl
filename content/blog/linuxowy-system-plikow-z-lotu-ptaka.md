---
title: "Linuxowy system plików z lotu ptaka"
date: 2018-07-02
author: "Robert Bałdyga"
categories: ["Linux"]
tags: ["system plików", "linux", "rootfs", "VFS", "uprawnienia"]
image: "/images/uploads/2018/07/birds-eye-view-city.jpg"
summary: "Używając komputera z zainstalowanym dowolnym systemem operacyjnym nie sposób jest nie korzystać z plików. Trzymamy w nich notatki, zdjęcia, filmy, programy oraz ich kod źródłowy. Jesteśmy do nich przyzwyczajeni i rzadko przychodzi nam do głowy, żeby docenić fakt…"
---

Używając komputera z zainstalowanym dowolnym systemem operacyjnym nie sposób jest nie korzystać z plików. Trzymamy w nich notatki, zdjęcia, filmy, programy oraz ich kod źródłowy. Jesteśmy do nich przyzwyczajeni i rzadko przychodzi nam do głowy, żeby docenić fakt jak wielkim wynalazkiem jest system plików w formie, w jakiej go dzisiaj znamy.

### Krótka historia systemu plików

Od początku istnienia komputerów (a właściwie długo przed nimi) ludziom towarzyszyła potrzeba wymyślenia sposobu organizacji danych, który byłby skalowalny, szybki i łatwy w obsłudze. Na początku były to archiwa dokumentów i systemy biblioteczne, opierające się głównie na sortowaniu alfabetycznym bądź chronologicznym. Później, wraz z nadejściem komputerów i dysków o dużej pojemności pojawiły pierwsze komputerowe systemy baz danych, które ewoluują po dziś dzień, próbując nadążyć za rosnącą w niesamowitym tempie ilością danych.

W międzyczasie pojawiła się potrzeba stworzenia prostej bazy, która byłaby intuicyjna i wygodna dla przeciętnego użytkownika komputera. Ręczne przeszukiwanie tabelowych baz danych z użyciem kwerend nie wszystkim użytkownikom przypadło do gustu. Z tej potrzeby zrodził się pomysł stworzenia systemu organizacji, w którym dane podzielone byłyby na pliki rozmieszczone w drzewiastej strukturze katalogów – systemu plików, który w niemal niezmienionej formie przetrwał do dzisiaj.

Idea takiego systemu plików odcisnęła swoje szczególne piętno w architekturze systemu Linux. Można powiedzieć, że w Linuxie wszystko kręci się wokół systemu plików. Jego dobra znajomość na pewno przyda się więc każdemu zaawansowanemu użytkownikowi Linuxa. Jeśli więc chciałbyś dowiedzieć się, w jaki sposób historia systemu plików wpłynęła na dzisiejszą Linuxową rzeczywistość, to zapraszam Cię do lektury tego wpisu.

### Czym wyróżnia się Linuxowy system plików?

Linuxowy system plików pod wieloma względami różni się od systemów znanych z Windowsa. Inny jest wykorzystywany standardowo format partycji – na systemie Microsoftu jest to **NTFS** oraz **FAT32**, a na Linuxie typowo **ext4**, **xfs** czy **btrfs**. Na tym jednak różnice się nie kończą, ponieważ odmienne jest też podejście z punktu widzenia architektury systemu, a co za tym idzie także interfejsu użytkownika.

Już na pierwszy rzut oka można zauważyć, że odmienna jest notacja zapisu ścieżek – pod Windowsem nazwy katalogów w ścieżce oddzielone są znakiem backslash’a “\\”, podczas gdy pod Linuxem w tej roli występuje znak slash’a “/”.

Nieco mniej widoczna jest inna ważna różnica, która często powoduje zdziwienie podczas przesiadki między systemami – Linux rozróżnia małe i wielkie litery w nazwach plików. Mówimy więc, że jest on *case-sensitive*. Pod Linuxem “plik”, “Plik” oraz “PLIK” to prawidłowe nazwy trzech różnych plików, które mogą istnieć obok siebie w jednym katalogu. Pod Windowsem wszystkie te nazwy odnoszą się do tego samego pliku, ponieważ system ten nie rozróżnia wielkości liter.

Linuxa wyróżnia też fakt, że w przeciwieństwie do Windowsa nie używa on rozszerzeń do rozpoznawania typu pliku. Zamiast tego wykorzystuje on system detekcji oparty na analizie zawartości – przeszukuje nagłówek pliku pod kątem obecności metadanych oraz tzw. *magic number*’ów charakterystycznych dla danego typu plików. Aby samodzielnie sprawdzić typ wybranego pliku wystarczy wywołać polecenie **file**, podając jako argument ścieżkę do pliku, np. file Plik.

### Rootfs – korzeń systemu plików

Wszyscy użytkownicy Windowsa wiedzą, że u samej podstawy drzewa katalogów znajduje się dysk oznaczony jakąś literą alfabetu – dysk C:, dysk D:, dysk E: i tak dalej. Każdy dysk (a właściwie każda partycja), posiada własny system plików mający swój korzeń w urządzeniu o określonej literze.

W przypadku Linuxa sytuacja wygląda nieco inaczej. Posiada on jeden główny system plików noszący nazwę *root filesystem* lub w skrócie *rootfs*, który znajduje się zawsze w tej samej lokalizacji – w ścieżce */*. Podczas startu systemu jest pod tą ścieżką montowana partycja systemowa i to właśnie jej pliki i katalogi stanowią główną strukturę *rootfs*’a. Pozostałe dyski lub partycje mogą być zamontowane wewnątrz katalogów *rootfs*’a, rozszerzając tym samym jego strukturę. Stanowią one zawsze poddrzewa drzewa głównego, mającego swój korzeń w ścieżce */*.

Jeżeli zastanawiasz się czym jest montowanie systemu plików, to już spieszę z wyjaśnieniem. Montowanie jest to operacja polegająca na “przypięciu” jakiegoś systemu plików do wybranego katalogu obecnego drzewa (*rootfs*’a). Od momentu montowania zawartość takiego katalogu reprezentuje pliki i katalogi znajdujące się w zamontowanym systemie plików.

Tak jak wspominałem wcześniej, partycja systemowa zawierająca system plików *rootfs* montowana jest zawsze na starcie systemu. Za montowanie *rootfs*’a odpowiedzialne jest jądro systemu lub *initramfs* – specjalny system plików montowany tymczasowo w ścieżce */* na potrzeby przygotowywania właściwego *rootfs*’a. Więcej na ten temat opowiem we wpisie na temat procedury startowania systemu.

### Właściciele, grupy i uprawnienia

Pod Linuxem każdy plik i katalog na swojego właściciela. Właścicielem może być dowolny użytkownik i tylko on może zarządzać uprawnieniami do danego pliku. Domyślnie właścicielem pliku jest użytkownik, który go stworzył, ale można go w dowolnym momencie zmienić przy użyciu polecenia **chown** – jego nazwa to skrót od angielskiego *change owner*. Poza właścicielem do każdego pliku przypisana jest też grupa właścicielska, której członkowie mogą mieć dodatkowe uprawnienia. Grupę przypisaną do danego pliku również można zmienić przy użyciu polecenia **chgrp** (*change group)*.

Każdy plik i katalog pod Linuxem ma przypisane uprawnienia, decydujące o tym jakie operacje można na nim przeprowadzić. Istnieją trzy rodzaje uprawnień:

-   Uprawnienia do odczytu (oznaczane literą **r**) – określają, czy dany użytkownik może czytać zawartość pliku.
-   Uprawnienia do zapisu (oznaczane literą **w**) – określają, czy dany użytkownik może zapisać dane do pliku.
-   Uprawnienia do wykonania (oznaczane literą **x**) – określają, czy dany użytkownik może uruchomić dany plik jako program wykonywalny lub uczynić z katalogu swój katalog roboczy, np. przechodząc do niego z użyciem komendy **cd**.

Każdy plik posiada trzy zestawy takich uprawnień – osobny zestaw dla właściciela, dla grupy właścicielskiej i dla pozostałych użytkowników. Uprawnienia zapisywane są w następującym formacie:

![uprawnienia](/images/wp-content/gallery/2018-07-02-linuxowy-system-plikow/uprawnienia.jpg)

Zapis **\-rwxrwxrwx** oznacza, że zarówno właściciel, grupa jak i pozostali użytkownicy mają wszystkie uprawnienia do pliku. Natomiast **\-rw-r–r–** oznacza, że właściciel pliku ma prawo do odczytu i zapisu, a członkowie grupy i pozostali użytkownicy tylko do odczytu. Uprawnienia pliku może zmienić jego właściciel przy użyciu polecenia **chmod**.

Bardziej spostrzegawczy czytelnicy na pewno zauważyli, że w zapisie uprawnień pojawia się na początku jeszcze jeden dodatkowy znak, określający typ pliku. Dla zwykłych plików jest to **–**, dla katalogów **d**, a dla linków symbolicznych **l**. Istnieją jeszcze inne typy plików, ale o tych powiemy sobie w dalszej części wpisu.

Komplet informacji o właścicielach, grupach i uprawnieniach plików w danym katalogu możemy sprawdzić przy użyciu polecenia ls -l. Przykładowy wynik działania tej komendy wygląda następująco (wycinek z katalogu */etc*):

```
robert@bezkompilatora:/etc-subset$ ls -l
drwxr-xr-x 6 root root       4096 Apr 26 19:08 apt
-rw-r--r-- 1 root root       2319 Apr  4 18:30 bash.bashrc
drwxr-xr-x 3 root root       4096 May 12 09:00 default
-rw-r--r-- 1 root root         96 Apr 26 19:07 environment
-rw-r--r-- 1 root root         15 May 12 09:01 hostname
drwxr-xr-x 2 root root       4096 Jun 30 09:24 init.d
drwxrwxr-x 2 root landscape  4096 Mar 26 20:21 landscape
lrwxrwxrwx 1 root root         21 Apr 24 08:34 mtab -> ../proc/self/mounts
-rw-r----- 1 root shadow      937 May 12 08:43 shadow
drwxr-xr-x 4 root root       4096 Apr 26 19:08 udev
```

Każda linia wyjścia z tego polecenia opisuje pojedynczy plik lub katalog. W poszczególnych kolumnach znajdziemy następujące informacje:

![ls_output](/images/wp-content/gallery/2018-07-02-linuxowy-system-plikow/ls_output.jpg)

Widzimy więc, że właścicielem pliku o nazwie *shadow* jest użytkownik *root*, a przypisana do niego grupa właścicielska nazywa się *shadow*. Właściciel ma prawo do zapisu i odczytu, grupa tylko do odczytu, a pozostali użytkownicy nie mają do pliku żadnych uprawnień. Ponadto widzimy, że plik ma rozmiar 937 bajtów, posiada jeden link twardy (hardlink) i został ostatnio zmodyfikowany 12 maja o godzinie 8:43.

Informacje te są na ogół obiektem zainteresowania administratorów, ale przydają się też programistom oraz zwykłym użytkownikom systemu.

### Wszystko jest plikiem

O ile kwestie organizacyjne i system uprawnień nie są może niczym rewolucyjnym, to Linuxowa filozofia systemów plików się na tym nie kończy. Zarządzanie danymi na dysku to tylko jedno z ich typowych zastosowań. Sporo Linuxowych systemów plików to systemy zupełnie wirtualne, niemające pod sobą żadnych trwałych danych. Za wszystko odpowiedzialna jest jedna z najważniejszych Linuxowych warstw abstrakcji – wirtualny system plików.

Wirtualny system plików (ang. virtual file system, VFS) to obsługiwany przez jądro interfejs dostarczający mechanizmy do operowania na plikach i katalogach w standardowy, jednorodny sposób. Opierają się na nim wszystkie systemy plików przechowujące dane na dysku, ale można go również użyć do tworzenia pseudo systemów plików – wirtualnych tworów, które tylko “udają” prawdziwy system plików. Linux bardzo intensywnie wykorzystuje tą możliwość, eksponując w formie systemu plików większość interfejsów między jądrem systemu a przestrzenią użytkownika. Popularne stwierdzenie, że pod Linuxem *“wszystko jest plikiem”*, wywodzi się właśnie z tego faktu.

Plik może reprezentować urządzenie, parametr konfiguracyjny lub dowolny inny wirtualny obiekt eksponowany przez jądro systemu. Czytanie czy pisanie do pliku wcale nie musi być związane z zapisem danych na dysku. Powoduje ono jedynie wywołanie odpowiedniej funkcji jądra, odpowiedzialnej za obsługę danej operacji na takim wirtualnym pliku. W rzeczywistości także operacje na “zwykłych” plikach powodują wywołanie odpowiednich funkcji jądra, odpowiedzialnych za dostęp do danych na dysku. Wszystko to dzieje się pod płaszczem wirtualnego systemu plików.

### Systemy plików specjalnego przeznaczenia

Linux wykorzystuje wiele rodzajów czysto wirtualnych systemów plików, mających swoje specjalne przeznaczenie. Do najbardziej podstawowych należą *sysfs*, *procfs* i *devtmpfs*, ale na większości współczesnych dystrybucji znajdziemy też *debugfs*, *configfs*, *securityfs*, *autofs* i wiele innych. Poniżej omawiam pokrótce najważniejsze z nich.

###### **sysfs**

System ten jest zazwyczaj montowany w ścieżce */sys* i zawiera informacje na temat różnych subsystemów jądra. Można w nim znaleźć między innymi informacje na temat załadowanych modułów jądra, urządzeń oraz sterowników. Poza możliwością podejrzenia obecnego stanu jądra, *sysfs* pozwala też na zmianę wielu parametrów konfiguracyjnych – od jasności matrycy laptopa, przez parametry kolejki urządzeń blokowych, po sterowanie pinami GPIO.

###### **procfs**

W *procfs* znajdziemy przede wszystkim informacje o działających aktualnie procesach, ale poza tym zawiera on też masę użytecznych informacji na temat jądra, pamięci i procesora. Zazwyczaj montowany jest w ścieżce */proc*. Stan procesów podglądać możemy na bieżąco odczytując go z wirtualnych plików o nazwach odpowiadających numerom PID procesów – mamy dostęp do informacji takich jak lista argumentów i zmiennych środowiskowych przekazanych podczas tworzenia procesu, lista procesów dzieci, lista otwartych deskryptorów plików oraz aktualny stos wykonania programu.

###### **devtmpfs**

Jest to system plików zawierający pliki specjalne urządzeń. Montowany jest on w ścieżce */dev* i znajdziemy tam pliki, których typ oznaczany jest literą **c** oraz **b** – są to pliki reprezentujące urządzenia znakowe (ang. character device) oraz blokowe (ang. block device). Za pośrednictwem tych plików możemy uzyskać dostęp do różnego rodzaju urządzeń obsługiwanych przez sterowniki działające w jądrze systemu – dysków twardych, urządzeń HID, portów szeregowych itd. Pliki reprezentujące dyski w *devtmpfs* używane są na przykład podczas operacji montowania.

###### **debugfs**

Zawiera on interfejsy debugowe jądra i montowany jest w ścieżce */sys/kernel/debug*. Z *debugfs*’a korzystają różne subsystemy jądra w celu wyeksponowania do przestrzeni użytkownika różnego rodzaju interfejsów używanych przez programistów podczas rozwijania jądra i pomocnych w trakcie szukania błędów. W przeciwieństwie do poprzednio wymienionych, system ten jest rzadko używany podczas normalnej pracy systemu – służy on przede wszystkim programistom pracującym nad rozbudową jądra.

### Podsumowanie

Na dzisiaj ode mnie tyle, ale do Linuxowego systemu plików na pewno będę jeszcze wracał w kolejnych wpisach, ponieważ jest o niego opartych wiele systemowych mechanizmów. Korzystanie z zawartości *devtmpfs*’a czy *sysfs*’a to chleb powszedni każdego Linuxowego programisty – przekonamy się o tym szczególnie próbując dobrać się do jądra systemu. Tymczasem zachęcam Cię do “pozwiedzania” systemu plików na Twoim komputerze – oswojenie się z jego zawartością na pewno przyda Ci się jako przyszłemu programiście Linuxa.

• • •

Masz jakieś przemyślenia, pytania, uwagi? Pisz śmiało komentarz pod wpisem! A jeśli nie chcesz przegapić kolejnych wpisów, to koniecznie zapisz się na mój [newsletter](/newsletter/) i polub moją [stronę na Facebooku](https://www.facebook.com/BezKompilatora/). Z góry dzięki! 🙂
