# współlocate

Studencka aplikacja do szukania pokoju lub osoby do wspólnego wynajmu. Responsywny interfejs Pearl & Ink: jasne szkło, animowane gradienty i płynna nawigacja bez przeładowania.

## Uruchomienie

Na Windows kliknij dwukrotnie `start.bat`. Launcher uruchamia serwer i otwiera stronę w przeglądarce. Zamknięcie okna konsoli lub Ctrl+C zatrzymuje serwer. Zamknięcie samej karty nie zatrzymuje serwera.

Wymagany Python 3 (`py` lub `python` w PATH). Domyślny port: 5173; jeśli jest zajęty, launcher wybiera wolny. Nie trzeba instalować pakietów ani budować aplikacji. Moduły JavaScript wymagają HTTP zamiast otwierania `index.html` bezpośrednio.

Ręcznie, z tego katalogu:

```powershell
py -3 scripts/serve.py --no-browser
```

Otwórz adres wypisany przez serwer. Testy wymagają Node.js:

```powershell
npm test
```

## Gotowy zakres interfejsu

- Start: hero, trzy ilustrowane kroki, przykładowe ogłoszenia.
- Lista: filtry dzielnicy, całkowitego budżetu i daty; pusty wynik; modal filtrów na telefonie.
- Dwa ogłoszenia: osobne galerie po trzy zdjęcia, powiększenie, karta autora, niezależne ujawnianie e-maila i telefonu.
- Formularz: walidacja, wybór/przeciąganie i usuwanie JPG/PNG, maks. 8 zdjęć do 10 MB każde, lokalny podgląd i powrót do edycji.
- Profil własny, autora i osoby zainteresowanej; Facebook jako demo.
- Przelewające się gradienty, płynne przejścia SPA bez przeładowania, ruchomy wskaźnik menu i animowane ikony; pauza tła i respektowanie `prefers-reduced-motion`.

To interaktywny prototyp z danymi demonstracyjnymi. Nie ma logowania, backendu, publikacji ani trwałego zapisu ogłoszeń. Formularz zachowuje dane podczas przechodzenia między ekranami w tej karcie; odświeżenie je usuwa. Zdjęcia formularza pozostają lokalnymi obiektami przeglądarki. Tylko preferencja animacji zapisuje się w localStorage.

## Gdzie zmieniać

- `src/data/site.js` — jedna nazwa aplikacji i wspólna nawigacja.
- `src/data/listings.js`, `profiles.js` — przykładowe dane; docelowe miejsce podłączenia API.
- `src/components/` — wspólne kontrolki, pola, nagłówek, karta ogłoszenia, karta autora i galeria.
- `src/pages/` — kompozycje ekranów.
- `src/styles/base.css` — tokeny, szkło, gradienty, animacja i responsywność.
- `src/lib/` — walidacja, formatowanie/escapowanie treści i przerywalne animacje przejść między ekranami.
- `src/app.js` — router hash i cykl życia ekranów.
- `assets/photos/` — siedem lokalnych zdjęć AI.
- `assets/figma/` — gotowe ikony, ilustracje SVG i portret PNG używane przez stronę; bez źródłowych plików projektu Figma.
- `assets/fonts/` — lokalny Inter i licencja OFL.
- `tests/` — 12 testów filtrów, walidacji, bezpieczeństwa tekstu, plików graficznych i poprawności szybkich przejść między ekranami.

Następny etap: wspólny przegląd wyglądu i podział pozostałej implementacji między członków zespołu. Backend, sposób przechowywania danych i przydział osób nie są jeszcze ustalone.

Repozytorium zawiera aplikację, zasoby potrzebne do jej działania, testy i launcher. Makiety Figma, materiały referencyjne i lokalne notatki projektowe nie są częścią repozytorium.
