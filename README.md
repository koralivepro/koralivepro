# Football Matches Fetcher

This project fetches a daily list of important football matches (Arab leagues and major international leagues) from API-Football and saves them to `public/matches.json` for your website to display.

## Features
- Uses only one API request per day (max 100 matches)
- Filters for Arab and top international leagues
- Outputs simple JSON for easy website integration

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your API-Football key as an environment variable:
   - Windows PowerShell:
     ```powershell
     $env:API_KEY="your_api_key_here"
     npm run fetch
     ```
   - Linux/macOS:
     ```bash
     export API_KEY="your_api_key_here"
     npm run fetch
     ```

## Automate Daily Fetch
- Use a cron job (Linux/macOS) or Task Scheduler (Windows) to run `npm run fetch` once per day.

## Website Integration
- Serve `public/matches.json` from your web server.
- Use JavaScript `fetch` to load and display matches:
  ```js
  fetch('public/matches.json')
    .then(res => res.json())
    .then(matches => {
      // Render matches on your site
    });
  ```

## License
MIT
