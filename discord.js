/**
 * notspayy Anti-Cheat — Discord Server Builder
 * -------------------------------------------------------------
 * Bouwt automatisch een complete Discord-server op: rollen,
 * categorieën, kanalen, permissies en info-embeds.
 *
 * GEBRUIK (geen .env nodig, je vult alles in tijdens het runnen):
 *   1. npm install discord.js
 *   2. node build-server.js
 *   3. Vul je Bot Token en Server (Guild) ID in wanneer gevraagd.
 *
 * VEREISTEN VOOR DE BOT:
 *   - De bot moet al lid zijn van de server (via een OAuth2 invite
 *     link met de "bot" + "applications.commands" scope en
 *     "Administrator" permissie).
 *   - "Server Members Intent" hoeft niet aan te staan voor dit script.
 *
 * Je kan de inhoud van ROLES / STRUCTURE hieronder vrij aanpassen
 * aan je eigen wensen (namen, kleuren, tekst van de embeds, etc.)
 */

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const readline = require("readline");

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

// ------------------------------------------------------------------
// 1. CONFIGURATIE — pas dit gerust aan
// ------------------------------------------------------------------

const ROLES = [
  {
    key: "owner",
    name: "Owner",
    color: 0xe74c3c,
    hoist: true,
    permissions: [PermissionsBitField.Flags.Administrator],
  },
  {
    key: "staff",
    name: "Staff",
    color: 0xf39c12,
    hoist: true,
    permissions: [
      PermissionsBitField.Flags.ManageChannels,
      PermissionsBitField.Flags.ManageMessages,
      PermissionsBitField.Flags.KickMembers,
      PermissionsBitField.Flags.ManageRoles,
    ],
  },
  {
    key: "member",
    name: "notspayy Gebruiker",
    color: 0x2ecc71,
    hoist: true,
    permissions: [],
  },
];

// type: "text". readonly=true -> @everyone kan alleen lezen, niet posten.
// staffOnly=true -> alleen owner/staff kunnen het kanaal zelfs zien.
const STRUCTURE = [
  {
    category: "📢 WELKOM",
    channels: [
      { name: "welkom", topic: "Welkom bij de officiële notspayy server!", readonly: true },
      { name: "regels", topic: "Serverregels — lees dit voor je verder gaat.", readonly: true },
      { name: "announcements", topic: "Belangrijke updates en aankondigingen.", readonly: true },
    ],
  },
  {
    category: "🛡️ NOTSPAYY ANTI-CHEAT",
    channels: [
      { name: "over-notspayy", topic: "Wat is notspayy en wat doet het?", readonly: true },
      { name: "features", topic: "Alle functies van notspayy op een rij.", readonly: true },
      { name: "hoe-te-krijgen", topic: "Zo krijg en installeer je notspayy.", readonly: true },
      { name: "changelog", topic: "Updates en wijzigingen per versie.", readonly: true },
    ],
  },
  {
    category: "💬 COMMUNITY",
    channels: [
      { name: "algemeen", topic: "Kletsen over van alles en nog wat." },
      { name: "suggesties", topic: "Ideeën en verbeteringen voor notspayy." },
    ],
  },
  {
    category: "🎫 SUPPORT",
    channels: [
      { name: "support", topic: "Vragen of problemen? Stel ze hier." },
      { name: "bug-reports", topic: "Gevonden een bug? Meld 'm hier." },
    ],
  },
  {
    category: "🔒 STAFF",
    channels: [
      { name: "staff-chat", topic: "Overleg tussen staff.", staffOnly: true },
      { name: "staff-logs", topic: "Server- en modlogs.", staffOnly: true },
    ],
  },
];

// Embeds die na het bouwen automatisch gepost worden
function buildEmbeds(roles) {
  return {
    welkom: new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle("👋 Welkom bij notspayy")
      .setDescription(
        "Dit is de officiële Discord van **notspayy**, een gratis custom Anti-Cheat systeem voor FiveM servers.\n\n" +
          "Lees zeker even de regels en check #over-notspayy en #hoe-te-krijgen om aan de slag te gaan."
      ),
    regels: new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle("📜 Serverregels")
      .setDescription(
        [
          "**1.** Wees respectvol naar iedereen.",
          "**2.** Geen spam, reclame of scams.",
          "**3.** Gebruik kanalen waar ze voor bedoeld zijn.",
          "**4.** Volg de instructies van Staff.",
          "**5.** Geen herdistributie van notspayy zonder toestemming.",
        ].join("\n")
      ),
    "over-notspayy": new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle("🛡️ Wat is notspayy?")
      .setDescription(
        "**notspayy** is een volledig custom Anti-Cheat systeem voor FiveM servers, gebouwd om cheaters " +
          "op te sporen en tegen te houden.\n\n" +
          "Het systeem controleert doorlopend of alles correct draait: de Anti-Cheat zelf, je " +
          "serverconfiguratie, scripts en verbindingen — en meldt automatisch als er iets mist of fout staat."
      ),
    features: new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle("✨ Features")
      .setDescription(
        [
          "• Realtime detectie van verdachte speleractiviteit",
          "• Automatische self-check van de Anti-Cheat installatie",
          "• Controle op serverconfiguratie en scripts",
          "• Verbindings- en integriteitschecks",
          "• Volledig beheer via het notspayy dashboard",
          "• Geen ingewikkelde config-bestanden nodig",
        ].join("\n")
      ),
    "hoe-te-krijgen": new EmbedBuilder()
      .setColor(0x1abc9c)
      .setTitle("📥 Hoe krijg je notspayy?")
      .setDescription(
        [
          "notspayy is **gratis** te gebruiken. Zo ga je aan de slag:",
          "",
          "**1.** Vraag toegang aan in #support.",
          "**2.** Je ontvangt de download/installatie-instructies.",
          "**3.** Koppel je server aan het notspayy dashboard.",
          "**4.** Klaar — de Anti-Cheat checkt zichzelf en je server automatisch.",
        ].join("\n")
      ),
    changelog: new EmbedBuilder()
      .setColor(0x95a5a6)
      .setTitle("📝 Changelog")
      .setDescription("Hier plaatst Staff toekomstige updates en wijzigingen."),
  };
}

// ------------------------------------------------------------------
// 2. BOUW-LOGICA — normaal gesproken hoef je hieronder niets aan te passen
// ------------------------------------------------------------------

async function main() {
  const token = await ask("Bot Token: ");
  const guildId = await ask("Server (Guild) ID: ");

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once("clientReady", async () => {
    console.log(`Ingelogd als ${client.user.tag}`);

    const guild = await client.guilds.fetch(guildId);
    await guild.channels.fetch();
    await guild.roles.fetch();

    console.log("Rollen aanmaken...");
    const roleMap = {};
    for (const r of ROLES) {
      let role = guild.roles.cache.find((existing) => existing.name === r.name);
      if (!role) {
        role = await guild.roles.create({
          name: r.name,
          color: r.color,
          hoist: r.hoist,
          permissions: r.permissions,
        });
        console.log(`  + rol aangemaakt: ${r.name}`);
      } else {
        console.log(`  = rol bestaat al: ${r.name}`);
      }
      roleMap[r.key] = role;
    }

    const everyone = guild.roles.everyone;
    const embeds = buildEmbeds(roleMap);

    console.log("Categorieën en kanalen aanmaken...");
    for (const cat of STRUCTURE) {
      let category = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildCategory && c.name === cat.category
      );
      if (!category) {
        category = await guild.channels.create({
          name: cat.category,
          type: ChannelType.GuildCategory,
        });
        console.log(`  + categorie aangemaakt: ${cat.category}`);
      }

      for (const ch of cat.channels) {
        let channel = guild.channels.cache.find(
          (c) => c.type === ChannelType.GuildText && c.name === ch.name && c.parentId === category.id
        );

        const overwrites = [];

        if (ch.staffOnly) {
          overwrites.push({ id: everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] });
          overwrites.push({
            id: roleMap.staff.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
          });
          overwrites.push({
            id: roleMap.owner.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
          });
        } else if (ch.readonly) {
          overwrites.push({
            id: everyone.id,
            deny: [PermissionsBitField.Flags.SendMessages],
            allow: [PermissionsBitField.Flags.ViewChannel],
          });
          overwrites.push({
            id: roleMap.staff.id,
            allow: [PermissionsBitField.Flags.SendMessages],
          });
          overwrites.push({
            id: roleMap.owner.id,
            allow: [PermissionsBitField.Flags.SendMessages],
          });
        }

        if (!channel) {
          channel = await guild.channels.create({
            name: ch.name,
            type: ChannelType.GuildText,
            parent: category.id,
            topic: ch.topic,
            permissionOverwrites: overwrites,
          });
          console.log(`    + kanaal aangemaakt: #${ch.name}`);

          // Post de bijbehorende embed als die bestaat en het kanaal net is aangemaakt
          if (embeds[ch.name]) {
            await channel.send({ embeds: [embeds[ch.name]] });
          }
        } else {
          console.log(`    = kanaal bestaat al: #${ch.name}`);
        }
      }
    }

    console.log("\nKlaar! De server is volledig opgezet.");
    process.exit(0);
  });

  client.login(token);
}

main().catch((err) => {
  console.error("Er ging iets mis:", err);
  process.exit(1);
});