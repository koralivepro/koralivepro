// /assets/js/config.js

// NOTE: Do NOT store secret API keys in client-side code. If you need to call the API
// from the browser, proxy the request via your server and keep the API key on the server-side.
const CONFIG = {
    // ضع مفتاح API-Football الخاص بك هنا
    apiKey: '4dacc53e6232827f801107853303d82a', // <-- User's real API key
    importantLeagueIds: [39, 140, 135, 78, 61, 2, 3, 13, 160],
    importantTeamIds: [623, 630, 151, 154, 155, 186, 187, 197, 198, 210, 211, 152],
    servers: [
        { name: 'السيرفر الأول', url: 'https://embed.example.com/stream1' },
        { name: 'السيرفر الثاني', url: 'https://embed.example.com/stream2' },
        { name: 'السيرفر الثالث', url: 'https://embed.example.com/stream3' },
        { name: 'السيرفر الرابع', url: 'https://embed.example.com/stream4' },
        { name: 'السيرفر الخامس', url: 'https://external-server.com/live' }
    ]
};

// Arabic name mapping for teams and leagues
const ARABIC_NAMES = {
    teams: {
        40: 'ليفربول',
        42: 'آرسنال',
        541: 'ريال مدريد',
        529: 'برشلونة',
        623: 'الأهلي',
        630: 'الزمالك',
        151: 'الهلال',
        154: 'النصر',
        155: 'الاتحاد',
        186: 'الرجاء',
        187: 'الوداد',
        197: 'الترجي',
        198: 'النجم الساحلي',
        210: 'العين',
        211: 'الأهلي الإماراتي',
        152: 'الأهلي السعودي',
        12345: 'ناساف كارشي',
    },
    leagues: {
        39: 'الدوري الإنجليزي الممتاز',
        140: 'الدوري الإسباني',
        135: 'الدوري الإيطالي',
        78: 'الدوري الألماني',
        61: 'الدوري الفرنسي',
        2: 'دوري أبطال أوروبا',
        3: 'الدوري الأوروبي',
        13: 'دوري أبطال أفريقيا',
        160: 'دوري أبطال آسيا للنخبة',
    }
};
