# Lista Zakupów

Prosta aplikacja do zarządzania listą zakupów zbudowana w React z możliwością synchronizacji danych.

## Funkcje

### Podstawowe
- Dodawanie produktów
- Oznaczanie produktów jako kupione
- Usuwanie produktów
- Zapis listy w localStorage

### Rozszerzone (nowe)
- Synchronizacja danych między urządzeniami przez Firebase
- Tworzenie kont użytkowników i logowanie (e-mail, Google)
- Kompleksowe testy jednostkowe i integracyjne
- Grupowanie produktów według sklepów i kategorii
- Zarządzanie kategoriami i szablonami

## Instalacja

1. Sklonuj repozytorium
2. Zainstaluj zależności: `npm install`
3. Skonfiguruj Firebase (zobacz [DOCUMENTATION.md](DOCUMENTATION.md))
4. Uruchom aplikację: `npm start`

## Rozwiązane problemy

Wprowadzone usprawnienia rozwiązują następujące problemy:

1. **Brak testów** - dodano kompleksowe testy jednostkowe i integracyjne
2. **Za duży plik App.js** - zrefaktoryzowano App.js, dzieląc go na mniejsze komponenty i hooki
3. **Lokalne przechowywanie danych** - dodano synchronizację z Firebase
4. **Słaba dokumentacja** - dodano szczegółową dokumentację JSDoc oraz oddzielny plik dokumentacji

## Więcej informacji

Szczegółowa dokumentacja wprowadzonych usprawnień znajduje się w pliku [DOCUMENTATION.md](DOCUMENTATION.md).