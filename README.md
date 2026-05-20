# Bodenseerunde Tennis

Frontend-Prototyp fuer Spielplan, Ergebnismeldung, Spielbericht-Upload, Freigabe und Live-Tabelle der internationalen 3-Laender-Tennisrunde 60+.

## Gewuenschte Vercel-Adresse

Wenn der Projektname im Vercel-Konto noch frei ist, entsteht beim Deployment diese Adresse:

`https://bodenseerunde.vercel.app`

Falls `bodenseerunde` bei Vercel bereits belegt ist, muss ein anderer Projektname verwendet werden, zum Beispiel:

`https://bodenseerunde-tennis.vercel.app`

## Deployment

1. Bei Vercel anmelden oder ein kostenloses Konto erstellen.
2. Dieses Projekt als neues Vercel-Projekt importieren.
3. Als Projektname `bodenseerunde` verwenden.
4. Framework-Preset: `Other`.
5. Build Command leer lassen.
6. Output Directory leer lassen oder `.` verwenden.
7. Deploy ausfuehren.

## Naechster technischer Schritt

Die Anwendung kann mit Supabase als zentraler Datenbank laufen. Ohne Supabase-Konfiguration speichert sie weiter nur lokal im Browser.

## Supabase einrichten

1. Kostenloses Konto bei Supabase erstellen.
2. Neues Projekt anlegen.
3. Im Supabase-Projekt links `SQL Editor` oeffnen.
4. Den Inhalt aus `supabase-schema.sql` ausfuehren.
5. Links `Project Settings` -> `API` oeffnen.
6. `Project URL` und `anon public` Key kopieren.
7. In `app-config.js` eintragen:

```js
window.BODENSEERUNDE_CONFIG = {
  supabaseUrl: "https://DEIN-PROJEKT.supabase.co",
  supabaseAnonKey: "DEIN-ANON-PUBLIC-KEY",
  seasonId: "2026"
};
```

8. Die geaenderten Dateien wieder bei GitHub hochladen. Vercel veroeffentlicht danach automatisch neu.

## Hinweis zur ersten Online-Version

Die aktuelle Supabase-Variante speichert den Saisonstand zentral in einer Tabelle. Das ist fuer den Prototypen gut geeignet. Fuer den spaeteren echten Betrieb sollten danach noch Rollen, Login, sicherere Meldelinks, Freigabeprotokoll und Dateispeicher fuer Spielberichte sauber getrennt werden.
