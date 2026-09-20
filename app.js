(function () {
    const cfg = window.NOTSPAYYS_CONFIG || {};

    // ---------------------------------------------------------------
    // Login-knoppen en Discord-links koppelen aan de configuratie
    // ---------------------------------------------------------------
    const loginUrl = `${cfg.API_BASE_URL}/auth/discord`;
    document.querySelectorAll('#loginBtn, #downloadLoginBtn').forEach((el) => {
        el.href = loginUrl;
    });
    document.querySelectorAll('.nav-discord').forEach((el) => {
        el.href = cfg.DISCORD_INVITE_URL || '#';
    });

    // ---------------------------------------------------------------
    // Live-ogende incident-feed in de hero. Eén orkestreerd moment,
    // geen decoratieve hover-effecten door de rest van de pagina.
    // ---------------------------------------------------------------
    const FAKE_ENTRIES = [
        { case: '48201', player: 'R.Vandenberg', detection: 'speed_manipulation', confidence: 22, state: 'safe' },
        { case: '48202', player: 'xX_Kowalski', detection: 'weapon_manipulation', confidence: 96, state: 'confirmed' },
        { case: '48203', player: 'J.Verbeek', detection: 'event_spam', confidence: 58, state: 'suspicious' },
        { case: '48204', player: 'Denise_RP', detection: 'noclip', confidence: 91, state: 'confirmed' },
        { case: '48205', player: 'Mo_Taxi92', detection: 'teleport', confidence: 34, state: 'safe' },
        { case: '48206', player: 'BackupUnit4', detection: 'resource_injection', confidence: 88, state: 'confirmed' },
        { case: '48207', player: 'L.Herrera', detection: 'explosion_abuse', confidence: 12, state: 'safe' },
        { case: '48208', player: 'Nightshift_PD', detection: 'godmode', confidence: 97, state: 'confirmed' },
    ];

    const feedEl = document.getElementById('incidentFeed');
    if (feedEl) {
        let i = 0;
        const maxLines = 9;

        function pushLine() {
            const entry = FAKE_ENTRIES[i % FAKE_ENTRIES.length];
            i += 1;

            const confClass = entry.confidence >= 70 ? 'feed-conf-high' : 'feed-conf-low';
            const line = document.createElement('div');
            line.className = 'feed-line';
            line.innerHTML =
                `<span class="feed-case">#${entry.case}</span> ${entry.player} — ${entry.detection} ` +
                `<span class="${confClass}">${entry.confidence}%</span> — ${entry.state}`;

            feedEl.appendChild(line);
            while (feedEl.children.length > maxLines) {
                feedEl.removeChild(feedEl.firstChild);
            }
            feedEl.scrollTop = feedEl.scrollHeight;
        }

        // eerste paar regels direct vullen, dan om de ~2.2s een nieuwe
        for (let n = 0; n < 5; n++) pushLine();
        setInterval(pushLine, 2200);
    }
})();
