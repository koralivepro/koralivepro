// /assets/js/main.js

// --- Mock Data (بيانات وهمية للتجربة) ---
const MOCK_FIXTURES = [
	{
		"fixture": { "id": 1, "status": { "short": "NS", "long": "Not Started" }, "date": "2025-09-29T19:00:00+00:00" },
		"league": { "id": 39, "name": "Premier League", "logo": "https://media.api-sports.io/football/leagues/39.png" },
		"teams": {
			"home": { "id": 40, "name": "Liverpool", "logo": "https://media.api-sports.io/football/teams/40.png" },
			"away": { "id": 42, "name": "Arsenal", "logo": "https://media.api-sports.io/football/teams/42.png" }
		},
		"goals": { "home": null, "away": null }
	},
	{
		"fixture": { "id": 2, "status": { "short": "1H", "long": "First Half", "elapsed": 30 }, "date": "2025-09-29T17:00:00+00:00" },
		"league": { "id": 2, "name": "Champions League", "logo": "https://media.api-sports.io/football/leagues/2.png" },
		"teams": {
			"home": { "id": 541, "name": "Real Madrid", "logo": "https://media.api-sports.io/football/teams/541.png" },
			"away": { "id": 529, "name": "Barcelona", "logo": "https://media.api-sports.io/football/teams/529.png" }
		},
		"goals": { "home": 1, "away": 0 }
	},
	{
		"fixture": { "id": 3, "status": { "short": "FT", "long": "Match Finished" }, "date": "2025-09-29T15:00:00+00:00" },
		"league": { "id": 13, "name": "CAF Champions League", "logo": "https://media.api-sports.io/football/leagues/13.png" },
		"teams": {
			"home": { "id": 623, "name": "Al Ahly", "logo": "https://media.api-sports.io/football/teams/623.png" },
			"away": { "id": 630, "name": "Zamalek", "logo": "https://media.api-sports.io/football/teams/630.png" }
		},
		"goals": { "home": 2, "away": 1 }
	}
];

// --- API Fetching Logic ---
async function mockFetchFixtures() {
	return new Promise(resolve => setTimeout(() => resolve(MOCK_FIXTURES), 500));
}

async function fetchFixturesFromAPI(dateStr) {
	// If no API key is configured, skip network call.
	if (!CONFIG || !CONFIG.apiKey) return [];
	const API_URL = `https://v3.football.api-sports.io/fixtures?date=${dateStr}`;
	const headers = {
		'x-rapidapi-host': 'v3.football.api-sports.io',
		'x-rapidapi-key': CONFIG.apiKey
	};
	try {
		const response = await fetch(API_URL, { headers });
		const data = await response.json();
		if (data && Array.isArray(data.response)) return data.response;
		return [];
	} catch (error) {
		console.warn('API fetch failed, falling back to mock data:', error);
		return [];
	}
}

// --- UI Rendering Logic ---
function getMatchStatus(status) {
	const s = (status && status.short) ? String(status.short).toUpperCase() : '';
	const liveStates = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE"];
	const finishedStates = ["FT", "AET", "PEN"];
	if (liveStates.includes(s)) return { text: 'مباشر', className: 'live' };
	if (finishedStates.includes(s)) return { text: 'انتهت', className: 'finished' };
	return { text: 'لم تبدأ بعد', className: 'upcoming' };
}

function createMatchRow(fixtureData) {
  const { fixture, league, teams, goals } = fixtureData;
  const status = getMatchStatus(fixture.status);
  // Arabic names
  function getArabicTeamName(team) {
    if (typeof ARABIC_NAMES !== 'undefined') {
      if (ARABIC_NAMES.teams[team.id]) return ARABIC_NAMES.teams[team.id];
      const nameEn = team.name.trim().toLowerCase();
      for (const key in ARABIC_NAMES.teams) {
        if (ARABIC_NAMES.teams.hasOwnProperty(key)) {
          const arName = ARABIC_NAMES.teams[key];
          if (nameEn === arName.trim().toLowerCase()) return arName;
        }
      }
      if (nameEn === 'al ahly') return 'الأهلي';
      if (nameEn === 'zamalek') return 'الزمالك';
      if (nameEn === 'al hilal') return 'الهلال';
      if (nameEn === 'al nassr') return 'النصر';
      if (nameEn === 'al ittihad') return 'الاتحاد';
      if (nameEn === 'al ahli saudi') return 'الأهلي السعودي';
      if (nameEn === 'al ahli') return 'الأهلي';
      if (nameEn === 'al ain') return 'العين';
      if (nameEn === 'raja casablanca') return 'الرجاء';
      if (nameEn === 'wydad casablanca') return 'الوداد';
      if (nameEn === 'esperance tunis') return 'الترجي';
      if (nameEn === 'etoile du sahel') return 'النجم الساحلي';
      if (nameEn === 'nasaf qarshi') return 'ناساف كارشي';
    }
    return team.name;
  }
  function getArabicLeagueName(league) {
    if (typeof ARABIC_NAMES !== 'undefined' && ARABIC_NAMES.leagues[league.id]) return ARABIC_NAMES.leagues[league.id];
    return league.name;
  }
  const leagueNameAr = getArabicLeagueName(league);
  const homeNameAr = getArabicTeamName(teams.home);
  const awayNameAr = getArabicTeamName(teams.away);
  const localTime = fixture && fixture.date ? new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const hasScore = goals && Number.isInteger(goals.home) && Number.isInteger(goals.away);
  const score = (status.className !== 'upcoming' && hasScore) ? `${goals.home} - ${goals.away}` : localTime;

  const row = document.createElement('div');
  row.className = 'match-card';
  row.setAttribute('data-fixture-id', fixture.id);
  row.onclick = () => {
    window.location.href = `/match.html?id=${fixture.id}`;
  };

  row.innerHTML = `
    <div class="team home">
      <img src="${teams.home.logo}" alt="${homeNameAr}">
      <span class="team-name">${homeNameAr}</span>
    </div>
    <div class="center">
      <div class="score">${score}</div>
      <span class="status-btn ${status.className}">${status.text}</span>
      <div class="league-name">${leagueNameAr}</div>
    </div>
    <div class="team away">
      <span class="team-name">${awayNameAr}</span>
      <img src="${teams.away.logo}" alt="${awayNameAr}">
    </div>
  `;
  return row;
}

function createAdSpace() {
	const ad = document.createElement('div');
	ad.className = 'ad-space';
	ad.innerHTML = `<img src="assets/images/ad-placeholder.png" alt="Advertisement">`;
	return ad;
}

async function loadMatches(options = { importantOnly: false, adInterval: 0, date: null, boardId: null }) {
	let container = null;
	if (options.boardId) {
		container = document.getElementById(options.boardId);
	} else {
		container = document.getElementById('matches-board');
	}
	if (!container) return;

	let dateStr = options.date;
	let arabicDateStr = '';
	if (!dateStr) {
		const d = new Date();
		dateStr = d.toISOString().slice(0, 10);
	}
	try {
		const dateObj = new Date(dateStr);
		arabicDateStr = dateObj.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	} catch (e) {
		arabicDateStr = dateStr;
	}

	// Try to fetch from API, but fall back to mock data if API key missing or request fails
	let allFixtures = [];
	try {
		allFixtures = await fetchFixturesFromAPI(dateStr);
		if (!Array.isArray(allFixtures) || allFixtures.length === 0) {
			console.info('No fixtures from API; falling back to mock fixtures.');
			allFixtures = await mockFetchFixtures();
		}
	} catch (err) {
		console.warn('Error fetching fixtures from API; using mock fixtures.', err);
		allFixtures = await mockFetchFixtures();
	}
	container.innerHTML = '';
	const dateHeader = document.createElement('h2');
	dateHeader.className = 'matches-date-header';
	dateHeader.textContent = arabicDateStr;
	container.appendChild(dateHeader);

	let fixturesToDisplay = allFixtures;
	if (options.importantOnly) {
		fixturesToDisplay = allFixtures.filter(f =>
			CONFIG.importantLeagueIds.includes(f.league.id) ||
			CONFIG.importantTeamIds.includes(f.teams.home.id) ||
			CONFIG.importantTeamIds.includes(f.teams.away.id)
		);
	}

	if (fixturesToDisplay.length === 0) {
		container.innerHTML = '<p>لا توجد مباريات لعرضها.</p>';
	}

	fixturesToDisplay.forEach((fixture, index) => {
		container.appendChild(createMatchRow(fixture));
		if (options.adInterval > 0 && (index + 1) % options.adInterval === 0) {
			container.appendChild(createAdSpace());
		}
	});

	if (options.date === null || options.date === new Date().toISOString().slice(0, 10)) {
		const manualMatch = {
			fixture: {
				id: 'manual-nasaf-hilal',
				status: { short: 'LIVE', long: 'مباشر' },
				date: new Date().toISOString()
			},
			league: {
				id: 160,
				name: 'دوري أبطال آسيا للنخبة',
				logo: 'https://media.api-sports.io/football/leagues/160.png'
			},
			teams: {
				home: { id: 12345, name: 'ناساف كارشي', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Nasaf_Qarshi_logo.png' },
				away: { id: 151, name: 'الهلال', logo: 'https://media.api-sports.io/football/teams/151.png' }
			},
			goals: { home: null, away: null }
		};
		const row = createMatchRow(manualMatch);
		row.setAttribute('id', 'manual-nasaf-hilal-row');
		container.prepend(row);
		setTimeout(() => {
			const el = document.getElementById('manual-nasaf-hilal-row');
			if (el) el.remove();
		}, 20 * 60 * 1000);
	}
}

function loadMatchDetails() {
	const urlParams = new URLSearchParams(window.location.search);
	const fixtureId = urlParams.get('id');
	if (!fixtureId) return;

	const videoPlayer = document.getElementById('video-player');
	const serverButtonsContainer = document.getElementById('server-buttons');

	if (fixtureId === 'manual-nasaf-hilal') {
		videoPlayer.src = "https://yggyyh.koooooralive.com/albaplayer/sports-1/";
		serverButtonsContainer.innerHTML = '<button class="server-btn active">سيرفر خاص</button>';
		document.getElementById('match-details-header').innerHTML = `
			<div class="manual-match-row">
				<div class="manual-info">
					<h3>ناساف كارشي vs الهلال</h3>
					<p>دوري أبطال آسيا للنخبة</p>
					<span class="live">مباشر الآن</span>
				</div>
			</div>
		`;
		return;
	}
	if (CONFIG.servers.length > 0) {
		videoPlayer.src = CONFIG.servers[0].url;
	}
	CONFIG.servers.forEach((server, index) => {
		const button = document.createElement('button');
		button.className = 'server-btn';
		if (index === 0) button.classList.add('active');
		button.textContent = server.name;
		button.onclick = () => {
			videoPlayer.src = server.url;
			document.querySelectorAll('.server-btn').forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');
		};
		serverButtonsContainer.appendChild(button);
	});
}
