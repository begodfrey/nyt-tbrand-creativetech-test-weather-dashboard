# Weather Mood Dashboard

A small React + TypeScript + Vite app that shows current weather conditions using Open-Meteo, with optional ZIP search via Zippopotam.us. The app infers a color theme from the weather and time of day to drive animated SVG icons and theme colors, and it caches the last successful result in local storage, refreshing it once on load.

## Loom walkthrough
View my 5 minute demo and code walkthrough at https://www.loom.com/share/2793217b312749deb6b8a3045c170549

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open the printed localhost URL in your browser, allow location access if prompted, or enter a ZIP code to see the weather.

