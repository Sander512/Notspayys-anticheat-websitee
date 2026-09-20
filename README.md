# NotSpayys Anti-Cheat — Website

Statische landingpage + minimaal dashboard. Geen build-stap nodig — puur
HTML/CSS/JS, dus dit deployt direct op Vercel (of elke andere statische host).

## Bestanden

- `index.html` — landingpage (hero, detectiemodules, security, dashboard-preview, FAQ, download-CTA)
- `dashboard.html` — minimale ingelogde pagina: haalt `/auth/me` en `/licenses` op bij de API, toont license-status, kan een gratis license aanmaken
- `style.css`, `app.js` — styling en de live incident-feed-animatie in de hero
- `config.js` — **hierin vul je je API-URL en Discord-invite in**

## 1. config.js invullen

```js
window.NOTSPAYYS_CONFIG = {
    API_BASE_URL: 'https://jouw-api.vercel.app',   // de URL van je backend (zie api/README.md)
    DISCORD_INVITE_URL: 'https://discord.gg/...',
};
```

## 2. Lokaal bekijken

Elke simpele statische server werkt, bijvoorbeeld:
```bash
npx serve .
```

## 3. Deployen op Vercel

1. Zelfde repo als de API, of een aparte repo — beide kan. Push deze map naar GitHub.
2. Vercel → **New Project** → koppel de repo. **Root Directory**: `website`
   (als je de hele projectstructuur behoudt). Geen build-command nodig — Vercel
   herkent dit automatisch als een statische site.
3. Deploy. Je krijgt een URL zoals `https://notspayys.vercel.app`.
4. Zet die URL in `config.js` (`API_BASE_URL` moet naar je **API**-project
   wijzen, niet naar deze website), en zet dezelfde website-URL als
   `PUBLIC_WEBSITE_URL` in de **API**'s environment variables op Vercel
   (nodig voor CORS en de redirect na login).
5. Redeploy de API na die laatste stap.

## Belangrijk: cross-domain login

Website en API staan op twee verschillende Vercel-domeinen. De API's
sessie-cookie staat daarom op `SameSite=None; Secure` (zie
`api/src/routes/auth.js`) zodat `dashboard.html` 'm via `fetch(..., {credentials:
'include'})` kan meesturen. Dit werkt alleen over **https** — wat Vercel
standaard al regelt, dus in productie hoef je hier niets voor te doen.

## Eigen domein koppelen

Vercel → je project → **Settings → Domains** → voeg je gekochte domeinnaam
toe en volg de DNS-instructies (meestal een CNAME of A-record bij je
registrar). Dit is gratis op het Hobby-plan; alleen de domeinnaam zelf koop
je apart.
