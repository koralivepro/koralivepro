// /assets/js/config.js

const CONFIG = {
    // ضع مفتاح API-Football الخاص بك هنا
    // المفتاح الموجود هو مثال فقط ولا يعمل
    apiKey: 'YOUR_API_FOOTBALL_KEY_HERE',

    // IDs للدوريات المهمة التي ستظهر في الصفحة الرئيسية
    // يمكنك الحصول على IDs من لوحة تحكم API-Football
    importantLeagueIds: [
        39,  // England - Premier League
        140, // Spain - La Liga
        135, // Italy - Serie A
        78,  // Germany - Bundesliga
        61,  // France - Ligue 1
        2,   // UEFA Champions League
        3,   // UEFA Europa League
        13,  // CAF Champions League
        // أضف IDs لدوريات عربية مهمة هنا
    ],

    // IDs لفرق عربية مهمة لمباريات الديربي والكلاسيكو
    importantTeamIds: [
        623, // Al Ahly SC (Egypt)
        630, // Zamalek SC (Egypt)
        // أضف الأهلي، الهلال السعودي، إلخ.
    ],

    // قائمة السيرفرات لصفحة تفاصيل المباراة
    // يمكن تعديلها أو إضافة المزيد بسهولة
    servers: [
        { name: 'السيرفر الأول', url: 'https://embed.example.com/stream1' },
        { name: 'السيرفر الثاني', url: 'https://embed.example.com/stream2' },
        { name: 'السيرفر الثالث', url: 'https://embed.example.com/stream3' },
        { name: 'السيرفر الرابع', url: 'https://embed.example.com/stream4' },
        { name: 'السيرفر الخامس', url: 'https://external-server.com/live' }
    ]
};