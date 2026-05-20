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

Dieser Prototyp speichert Daten noch lokal im Browser. Fuer den echten Online-Betrieb braucht die Anwendung eine zentrale Datenbank, damit alle Spieler dieselben aktuellen Ergebnisse sehen. Dafuer eignet sich zum Beispiel Supabase.
