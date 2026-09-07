export const CHANGELOG = `# Historia zmian

## [1.0.16] - 2026-08-29
### Dodano
- Odświeżanie danych przez przeciągnięcie w dół na ekranach finansowych
- Wybór zakresu dat w podsumowaniu
- Kartę łącznej sumy wydatków i nowy widok eksploracji podsumowania

### Zmieniono
- Przeprojektowano dolną nawigację
- Uporządkowano filtry podsumowania i sortowanie filtrów według nazwy
- Przeniesiono wykres udziału kategorii do nowego widoku eksploracji i usunięto zbędne wykresy trendów
- Ujednolicono sposób formatowania kwot, także w widoku długów
- Rozszerzono ciepłą paletę kolorów na pozostałe elementy aplikacji i wykresy
- Usunięto cytaty finansowe z pulpitu

### Naprawiono
- Wyświetlanie cen w kartach podsumowania w jednym wierszu
- Zaokrąglanie wyświetlanych kwot

## [1.0.15] - 2026-08-22
### Zmieniono
- Wprowadzono nowy, cieplejszy wygląd ekranów logowania, rejestracji i resetowania hasła
- Odświeżono pulpit, podsumowanie oraz widok dodawania transakcji
- Odświeżono listę transakcji i sposób grupowania wpisów
- Ujednolicono wygląd ustawień, historii zmian i widoku nieudanych synchronizacji

## [1.0.14] - 2026-06-26
### Naprawiono
- Dodawanie nowych wydatków, które błędnie było rozpoznawane jako edycja istniejącego wpisu

## [1.0.13] - 2026-06-23
### Dodano
- Łatwiejszy powrót z listy transakcji i edycji wpisu
- Możliwość otwierania szczegółów transakcji bezpośrednio z podsumowania
- Usuwanie trwale nieudanych operacji z kolejki synchronizacji w widoku deweloperskim

### Naprawiono
- Przewijanie listy transakcji otwartej z wykresów
- Skakanie przycisków akcji w spiżarni podczas ładowania ekranu

## [1.0.12] - 2026-06-19
### Dodano
- Kilka widoków testowych do analizy wykresów

### Zmieniono
- Zaktualizowano style widoków

## [1.0.10] - 2025-12-21
### Zmieniono
- Poprawa wydajności listy rekordów i podsumowań

### Dodano
- Śledzenie błędów w aplikacji (Crashlytics)
- Ponowne próby synchronizacji nieudanych transakcji z informacją dla użytkownika

## [1.0.9] - 2025-12-20
### Dodano
- Zarządzanie długami (dodawanie, edytowanie, usuwanie długów i płatności)
- Przycisk CTA na karcie budżetu gdy brak budżetu
- Paginacja cytatów

### Zmieniono
- Historia zmian - żeby zobaczyć trzeba kliknąć na wersję
- Zmieniono kolor tła na biały
- Zaktualizowano pakiety

## [1.0.8] - 2025-11-16

### Dodano
- Historia zmian w ustawieniach

### Naprawiono
- Nakładanie się paska wyszukiwania i przycisku filtra
- Błąd worklet przy zmianie koloru kategorii
- Problem z podwójnym # w kolorach kategorii
- Wyświetlanie kolorów kategorii z nieprawidłową saturacją
- Synchronizacja kategorii z serwerem - naprawiono błąd dodawania podkategorii

## [1.0.7] - 2025-10-26

### Dodano
- Wybór kursu EUR/PLN kupno/sprzedaż
- Synchronizacja wersji aplikacji z package.json

## [1.0.6] - 2025-10-14

### Naprawiono
- Poprawki stabilności aplikacji

## [1.0.5] - 2025-10-14

### Dodano
- Przyciski kalkulatora do szybkiego wprowadzania kwot
- Obsługa filtrowania dat częściowych

### Naprawiono
- Problem z pozostałą ceną
- Automatyczne zamykanie szuflady nawigacyjnej
- Otwieranie tylko gdy wymagane

## [1.0.4] - 2025-10-14

### Naprawiono
- Usunięcie starej wersji
- Ogólne poprawki i ulepszenia
`;
