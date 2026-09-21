// BELANGRIJK: API_BASE_URL moet LEEG blijven ('').
// De website stuurt API-calls nu zelf door naar de echte API (zie
// vercel.json -> "rewrites"), zodat de browser altijd met hetzelfde domein
// praat. Dat lost het "steeds uitgelogd op andere pagina's"-probleem op,
// want de sessie-cookie is zo geen cross-site (third-party) cookie meer.
window.NOTSPAYYS_CONFIG = {
    API_BASE_URL: 'https://notspayys-anticheat-websitee.vercel.app',
    DISCORD_INVITE_URL: 'https://discord.gg/8NUnKJgsMh',
};
