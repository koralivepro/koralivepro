// /assets/js/main.js

// --- Mock Data (بيانات وهمية للتجربة) ---
// هذه البيانات تحاكي الرد الذي ستحصل عليه من API-Football
const MOCK_FIXTURES = [
    // ... (هنا ستكون قائمة المباريات كما في الأسفل) ...
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
    // ... أضف المزيد من المباريات الوهمية للتجربة
];


// --- API Fetching Logic (منطق جلب البيانات) ---

// دالة وهمية لجلب البيانات. في مشروع حقيقي، ستستخدم fetch
async function mockFetchFixtures() {
    console.log("Using mock data. Replace with actual API call.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_FIXTURES), 500));
}

// دالة حقيقية (تحتاج خادم وسيط لتجنب كشف المفتاح)
async function fetchFixturesFromAPI() {
    const API_URL = 'https://v3.football.api-sports.io/fixtures?date=2025-09-29'; // مثال
    const headers = {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': CONFIG.apiKey
    };
    
    try {
        const response = await fetch(API_URL, { headers });
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}


// --- UI Rendering Logic (منطق عرض الواجهة) ---

function getMatchStatus(status) {
    const s = status.short;
    if (['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE'].includes(s)) {
        return { text: 'مباشر', className: 'live' };
    }
    if (s === 'FT' || s === 'AET' || s === 'PEN') {
        return { text: 'منتهي', className: 'finished' };
    }
    return { text: 'لم يبدأ', className: 'upcoming' };
}

function createMatchRow(fixtureData) {
    const { fixture, league, teams, goals } = fixtureData;
    const status = getMatchStatus(fixture.status);
    const score = (status.className !== 'upcoming') ? `${goals.home} - ${goals.away}` : new Date(fixture.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const row = document.createElement('div');
    row.className = 'match-row';
    row.setAttribute('data-fixture-id', fixture.id);
    row.onclick = () => {
        window.location.href = `/match.html?id=${fixture.id}`;
    };
    
    row.innerHTML = `
        <div class="team">
            <img src="${teams.home.logo}" alt="${teams.home.name}">
            <span class="team-name">${teams.home.name}</span>
        </div>
        <div class="match-center">
            <div class="${status.className === 'upcoming' ? 'time' : 'score'}">${score}</div>
            <button class="status-btn ${status.className}">${status.text}</button>
        </div>
        <div class="team right">
            <span class="team-name">${teams.away.name}</span>
            <img src="${teams.away.logo}" alt="${teams.away.name}">
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


// --- Main Functions (الدوال الرئيسية) ---

async function loadMatches(options = { importantOnly: false, adInterval: 0 }) {
    const container = document.getElementById('matches-board');
    if (!container) return;
    
    // استخدم الدالة الوهمية. استبدلها بـ fetchFixturesFromAPI في مشروع حقيقي.
    const allFixtures = await mockFetchFixtures(); 
    container.innerHTML = ''; // إزالة رسالة التحميل

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
        return;
    }

    fixturesToDisplay.forEach((fixture, index) => {
        container.appendChild(createMatchRow(fixture));
        if (options.adInterval > 0 && (index + 1) % options.adInterval === 0) {
            container.appendChild(createAdSpace());
        }
    });
}

function loadMatchDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const fixtureId = urlParams.get('id');
    if (!fixtureId) {
        // التعامل مع حالة عدم وجود ID
        return;
    }
    
    const videoPlayer = document.getElementById('video-player');
    const serverButtonsContainer = document.getElementById('server-buttons');
    
    // تعيين السيرفر الأول كافتراضي
    if (CONFIG.servers.length > 0) {
        videoPlayer.src = CONFIG.servers[0].url;
    }

    // إنشاء أزرار السيرفرات
    CONFIG.servers.forEach((server, index) => {
        const button = document.createElement('button');
        button.className = 'server-btn';
        if (index === 0) button.classList.add('active');
        button.textContent = server.name;
        button.onclick = () => {
            videoPlayer.src = server.url;
            // تحديث الزر النشط
            document.querySelectorAll('.server-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        };
        serverButtonsContainer.appendChild(button);
    });

    // يمكنك هنا عمل استدعاء API آخر لجلب تفاصيل المباراة وعرضها في الهيدر
    // updateMatchDetailsHeader(fixtureId);
}