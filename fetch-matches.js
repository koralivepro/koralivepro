// fetch-matches.js
// Fetches today's important football matches from API-Football and saves to public/matches.json

// Enhanced with detailed error logging for debugging

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// 1. Load API key from environment variable
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error('Error: API_KEY environment variable not set.');
  process.exit(1);
}

// 2. Define important league IDs (Arab + major international leagues)
const IMPORTANT_LEAGUE_IDS = [
  // Arab leagues
  307, // Saudi Pro League
  235, // Egyptian Premier League
  200, // Moroccan Botola Pro
  301, // UAE Pro League
  302, // Qatar Stars League
  303, // Algerian Ligue 1
  // Major international leagues
  39,  // Premier League (England)
  140, // La Liga (Spain)
  135, // Serie A (Italy)
  78,  // Bundesliga (Germany)
  61,  // Ligue 1 (France)
  2,   // Champions League
  3,   // Europa League
  13,  // CAF Champions League
  160, // AFC Champions League
];

// 3. Build API-Football request for today's matches
const today = new Date().toISOString().slice(0, 10);
const API_URL = `https://v3.football.api-sports.io/fixtures?date=${today}`;

// 4. Fetch matches from API-Football
async function fetchMatches() {
  try {
    console.log('Requesting:', API_URL);
    const response = await fetch(API_URL, {
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': API_KEY,
      },
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    const data = await response.json();
    if (!data.response || !Array.isArray(data.response) || data.response.length === 0) {
      console.error('API response missing or empty:', data);
      throw new Error('No matches from API');
    }

    // 5. Filter matches by important leagues
    const filtered = data.response.filter(match =>
      IMPORTANT_LEAGUE_IDS.includes(match.league.id)
    );

    // 6. Map to required fields and limit to 100 matches
    const matches = filtered.slice(0, 100).map(match => ({
      id: match.fixture.id,
      home: match.teams.home.name,
      away: match.teams.away.name,
      date: match.fixture.date,
      league: match.league.name,
    }));

    // 7. Save to public/matches.json
    const outPath = path.join(__dirname, 'public', 'matches.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(matches, null, 2), 'utf8');
    console.log(`Saved ${matches.length} matches from API to ${outPath}`);
  } catch (err) {
    console.error('Failed to fetch matches from API, using mock data:', err);
    // Optionally, you can load mock data here if you want a fallback
    // fs.writeFileSync(outPath, JSON.stringify([], null, 2), 'utf8');
  }
}

fetchMatches();
