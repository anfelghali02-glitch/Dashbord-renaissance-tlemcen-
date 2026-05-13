// INITIALIZE FEATHER ICONS
feather.replace();

// -----------------------------------------
// EVENTS SECTION
// -----------------------------------------
const events = [
  {
    id: 1, name: "Mariage", company: "Famille Benali",
    date: "4 Mai 2026", time: "18:00", location: "Salle des Fetes", logoUrl: "public/logos/event-1.jpg"
  },
  {
    id: 2, name: "Conference Internationale", company: "Sonatrach",
    date: "5 Mai 2026", time: "09:00", location: "Centre de Conferences", logoUrl: "public/logos/event-2.jpg"
  },
  {
    id: 3, name: "Gala Annuel", company: "Chambre de Commerce",
    date: "6 Mai 2026", time: "20:00", location: "Grand Ballroom", logoUrl: "public/logos/event-3.jpg"
  },
  {
    id: 4, name: "Seminaire Leadership", company: "Djezzy",
    date: "7 Mai 2026", time: "10:00", location: "Salle Andalousie", logoUrl: "public/logos/event-4.jpg"
  }
];

function renderEvents() {
  const container = document.getElementById("events-container");
  container.innerHTML = events.map(event => `
    <div class="group relative flex rounded-xl border border-primary/20 bg-card-60 glass overflow-hidden hover:border-primary/40 transition-colors">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-primary/20"></div>
      <div class="flex-1 flex flex-col justify-center gap-1 p-2 pl-4 min-w-0">
        <div class="flex flex-col">
          <span class="text-base font-semibold tracking-wider text-primary/80 uppercase truncate">${event.company}</span>
          <p class="font-serif text-xl font-bold text-foreground leading-tight line-clamp-2">${event.name}</p>
        </div>
        <div class="flex flex-col gap-1 mt-1">
          <div class="flex items-center gap-2 text-muted-foreground">
            <i data-feather="clock" class="w-4 h-4 text-primary/50 flex-none"></i>
            <span class="text-sm font-medium text-foreground/90">${event.date} - ${event.time}</span>
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <i data-feather="map-pin" class="w-4 h-4 text-primary/50 flex-none"></i>
            <span class="text-sm font-medium text-foreground/90 truncate">${event.location}</span>
          </div>
        </div>
      </div>
      <div class="flex-none w-28 flex items-center justify-center p-2 bg-primary/5 border-l border-primary/10">
        ${event.logoUrl
      ? `<img src="${event.logoUrl}" class="w-24 h-24 rounded-lg object-contain bg-white" alt="${event.company}">`
      : `<div class="w-24 h-24 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center"><span class="text-[9px] text-primary/40 font-medium">LOGO</span></div>`
    }
      </div>
    </div>
  `).join("");
  feather.replace();
}

// -----------------------------------------
// FLIGHTS SECTION
// -----------------------------------------
const STATUS_CONFIG = {
  "scheduled": { label: "Prévu", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  "active": { label: "En vol", cls: "text-primary bg-primary/10 border-primary/40 animate-pulse-slow" },
  "landed": { label: "Atterri", cls: "text-muted-foreground bg-muted/30 border-muted/30" },
  "cancelled": { label: "Annulé", cls: "text-red-400 bg-red-400/10 border-red-400/30" },
  "incident": { label: "Incident", cls: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  "diverted": { label: "Dérouté", cls: "text-amber-400 bg-amber-400/10 border-amber-400/30" }
};

const manualFlights = [
  // Départs
  { flightNumber: "DAH1098", airline: "Air Algérie", destination: "Lyon (LYS)", type: "dep", time: "06 Mai 08:50", status: "scheduled" },
  { flightNumber: "DAH6117", airline: "Air Algérie", destination: "Alger (ALG)", type: "dep", time: "06 Mai 15:15", status: "scheduled" },
  { flightNumber: "TVF7299", airline: "Transavia", destination: "Paris Orly (ORY)", type: "dep", time: "06 Mai 19:15", status: "scheduled" },
  { flightNumber: "VOE2679", airline: "Volotea", destination: "Marseille (MRS)", type: "dep", time: "06 Mai 21:10", status: "scheduled" },
  // Arrivées
  { flightNumber: "DAH1099", airline: "Air Algérie", destination: "Lyon (LYS)", type: "arr", time: "06 Mai 13:55", status: "scheduled" },
  { flightNumber: "TVF7298", airline: "Transavia", destination: "Paris Orly (ORY)", type: "arr", time: "06 Mai 17:55", status: "scheduled" },
  { flightNumber: "DAH1287", airline: "Air Algérie", destination: "Paris Orly (ORY)", type: "arr", time: "06 Mai 20:38", status: "scheduled" }
];

let currentFlightView = 'dep';
let flightPage = 0;
const FLIGHTS_PER_PAGE = 4;

function renderFlights() {
  const btnIcon = document.querySelector('button[onclick="renderFlights()"] i');
  if (btnIcon) {
    btnIcon.classList.add('animate-spin');
    setTimeout(() => btnIcon.classList.remove('animate-spin'), 500);
  }

  const now = new Date();
  document.getElementById("flight-last-update").textContent = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("flight-source-badge").textContent = "MANUEL";

  const renderFlightRow = (flight, i) => {
    const st = STATUS_CONFIG[flight.status] || STATUS_CONFIG["scheduled"];
    const bgClass = i % 2 === 0 ? "bg-transparent" : "bg-primary/[0.02]";
    return `
      <div class="flex-none grid grid-cols-[70px_1fr_1.2fr_110px_90px] gap-x-3 items-center px-3 py-2 border-b border-border/20 last:border-b-0 ${bgClass}">
        <span class="font-mono text-xs text-foreground font-semibold tracking-wide">${flight.flightNumber}</span>
        <span class="text-xs text-muted-foreground truncate">${flight.airline}</span>
        <span class="flex items-center gap-2 text-xs text-foreground">
          <i data-feather="${flight.type === 'dep' ? 'arrow-up-right' : 'arrow-down-right'}" class="w-3 h-3 text-primary/50 flex-none"></i>
          <span class="truncate">${flight.destination}</span>
        </span>
        <span class="font-mono text-[11px] text-foreground tabular-nums font-medium">${flight.time}</span>
        <span class="text-[9px] px-2 py-0.5 rounded-full border font-semibold text-center ${st.cls}">${st.label}</span>
      </div>
    `;
  };

  const flightsForView = manualFlights.filter(f => f.type === currentFlightView);
  const totalPages = Math.ceil(flightsForView.length / FLIGHTS_PER_PAGE);
  const paginatedFlights = flightsForView.slice(flightPage * FLIGHTS_PER_PAGE, (flightPage + 1) * FLIGHTS_PER_PAGE);

  const isDep = currentFlightView === 'dep';
  const pageStr = totalPages > 1 ? ` (Page ${flightPage + 1}/${totalPages})` : "";

  const container = document.getElementById("flights-container");
  container.innerHTML = `
    <div class="flex-none px-4 py-2 bg-gradient-to-r ${isDep ? 'from-primary/10' : 'from-emerald-500/10'} to-transparent border-b ${isDep ? 'border-primary/20' : 'border-emerald-500/20'} flex items-center justify-between transition-colors duration-500">
      <div class="flex items-center gap-2">
        <i data-feather="${isDep ? 'plane-takeoff' : 'plane-landing'}" class="w-4 h-4 ${isDep ? 'text-primary' : 'text-emerald-500'}"></i>
        <span class="text-[11px] font-bold ${isDep ? 'text-primary' : 'text-emerald-500'} tracking-widest uppercase">${isDep ? 'Départs Programmés' : 'Arrivées Programmées'}${pageStr}</span>
      </div>
      <div class="flex gap-1.5 opacity-60">
        <div class="w-1.5 h-1.5 rounded-full transition-all duration-500 ${isDep ? 'bg-primary shadow-[0_0_5px_rgba(189,162,91,0.8)]' : 'bg-primary/20'}"></div>
        <div class="w-1.5 h-1.5 rounded-full transition-all duration-500 ${!isDep ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]' : 'bg-primary/20'}"></div>
      </div>
    </div>
    <div class="flex flex-col flex-none animate-[pulse_1s_ease-in-out]">
      ${paginatedFlights.map(renderFlightRow).join("")}
    </div>
  `;
  feather.replace();
}

function nextFlightPage() {
  const flightsForView = manualFlights.filter(f => f.type === currentFlightView);
  const totalPages = Math.ceil(flightsForView.length / FLIGHTS_PER_PAGE);
  
  if (flightPage + 1 < totalPages) {
    flightPage++;
  } else {
    currentFlightView = currentFlightView === 'dep' ? 'arr' : 'dep';
    flightPage = 0;
  }
  renderFlights();
}

// -----------------------------------------
// INSTAGRAM SECTION
// -----------------------------------------
const INSTA_POSTS = [
  { id: 1, imageUrl: "public/insta-1.jpg.png", caption: "L'élégance et le confort vous attendent au Renaissance Tlemcen. Découvrez notre majestueux lobby.", likes: 1247, comments: 89 },
  { id: 2, imageUrl: "public/insta-2.jpg.png", caption: "Une expérience gastronomique inoubliable avec une vue imprenable sur Tlemcen.", likes: 982, comments: 56 },
  { id: 3, imageUrl: "public/insta-3.jpg.jpg", caption: "Laissez-vous charmer par la beauté nocturne de notre établissement sublimée par nos fontaines.", likes: 1534, comments: 112 },
  { id: 4, imageUrl: "public/insta-4.jpg.jpg", caption: "Le confort absolu de nos chambres luxueuses pour un séjour parfait et inoubliable.", likes: 2103, comments: 145 },
  { id: 5, imageUrl: "public/insta-5.jpg.png", caption: "Des moments de pure détente et une ambiance raffinée dans un cadre somptueux.", likes: 1876, comments: 134 },
  { id: 6, imageUrl: "public/insta-6.jpg.jpg", caption: "Plongez dans un havre de paix. Une architecture arabo-mauresque exceptionnelle.", likes: 1420, comments: 95 },
  { id: 7, imageUrl: "public/insta-7.jpg.jpg", caption: "L'art de recevoir, une tradition au Renaissance Tlemcen Hotel. Bienvenue chez vous.", likes: 1650, comments: 108 }
];

let instaIndex = 0;
function formatNumber(n) { return n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n); }

function renderInstaPost(index) {
  const post = INSTA_POSTS[index];
  const postEl = document.getElementById("insta-post");

  postEl.classList.remove("opacity-100");
  postEl.classList.add("opacity-0");

  setTimeout(() => {
    document.getElementById("insta-img").src = post.imageUrl;
    document.getElementById("insta-counter").textContent = `${index + 1} / ${INSTA_POSTS.length}`;
    document.getElementById("insta-caption").textContent = post.caption;
    document.getElementById("insta-likes").textContent = formatNumber(post.likes);
    document.getElementById("insta-comments").textContent = formatNumber(post.comments);

    const dotsContainer = document.getElementById("insta-dots");
    dotsContainer.innerHTML = INSTA_POSTS.map((_, i) => `
      <button onclick="changeInstaPost(${i})" class="rounded-full transition-all duration-300 ${i === index ? 'w-5 h-2 bg-primary' : 'w-2 h-2 bg-primary/30 hover:bg-primary/50'}"></button>
    `).join("");

    postEl.classList.remove("opacity-0");
    postEl.classList.add("opacity-100");
  }, 500);
}

window.changeInstaPost = function (i) {
  instaIndex = i;
  renderInstaPost(i);
}

// -----------------------------------------
// CLOCKS SECTION
// -----------------------------------------
const WORLD_CITIES = [
  { city: "Tlemcen", tz: "Africa/Algiers", flag: "DZ" },
  { city: "Paris", tz: "Europe/Paris", flag: "FR" },
  { city: "Riyadh", tz: "Asia/Riyadh", flag: "SA" },
  { city: "Canada", tz: "America/Toronto", flag: "CA" },
];

function getFlagEmoji(code) {
  return code.toUpperCase().split("").map(c => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join("");
}

function updateClocks() {
  const container = document.getElementById("clocks-container");
  container.className = "grid grid-cols-2 gap-2 flex-none";

  container.innerHTML = WORLD_CITIES.map(({ city, tz, flag }) => {
    const d = new Date();
    const timeStr = d.toLocaleTimeString("fr-FR", { timeZone: tz, hour: "2-digit", minute: "2-digit" });
    const [hh, mm] = timeStr.split(":");

    return `
      <div class="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md px-3 py-2 group hover:border-primary/40 transition-all flex items-center justify-between">
        <div class="absolute -right-4 -top-4 w-12 h-12 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
        <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50"></div>
        
        <div class="flex items-center gap-2 relative z-10">
          <span class="text-base drop-shadow-md">${getFlagEmoji(flag)}</span>
          <span class="text-[11px] text-foreground font-bold tracking-widest uppercase">${city}</span>
        </div>
        
        <div class="flex items-center relative z-10">
          <span class="font-mono text-base font-medium text-foreground tabular-nums tracking-tight">${hh}</span>
          <span class="font-mono text-base font-medium text-primary/80 animate-pulse">:</span>
          <span class="font-mono text-base font-medium text-foreground tabular-nums tracking-tight">${mm}</span>
        </div>
      </div>
    `;
  }).join("");
}




// -----------------------------------------
// WEATHER SECTION
// -----------------------------------------
const WEA_ICONS = {
  "sun": '<i data-feather="sun" class="text-amber-400" style="width:100%;height:100%"></i>',
  "cloud-sun": '<i data-feather="cloud" class="text-amber-300" style="width:100%;height:100%"></i>',
  "cloud": '<i data-feather="cloud" class="text-slate-400" style="width:100%;height:100%"></i>',
  "cloud-rain": '<i data-feather="cloud-rain" class="text-blue-400" style="width:100%;height:100%"></i>',
  "snowflake": '<i data-feather="cloud-snow" class="text-sky-300" style="width:100%;height:100%"></i>',
  "zap": '<i data-feather="zap" class="text-yellow-400" style="width:100%;height:100%"></i>',
};

function parseWeatherCode(code) {
  if (code <= 2) return { label: "Ensoleillé", icon: code > 0 ? "cloud-sun" : "sun" };
  if (code <= 48) return { label: "Nuageux", icon: "cloud" };
  if (code <= 67 || code >= 80) return { label: "Pluvieux", icon: "cloud-rain" };
  if (code <= 77 || code === 85 || code === 86) return { label: "Neigeux", icon: "snowflake" };
  if (code >= 95) return { label: "Orageux", icon: "zap" };
  return { label: "Ensoleillé", icon: "sun" };
}

async function fetchWeather() {
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=34.8783&longitude=-1.315&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Africa%2FAlgiers";
    const res = await fetch(url);
    const data = await res.json();

    if (data.current) {
      const parsed = parseWeatherCode(data.current.weather_code);
      document.getElementById("weather-current-icon").innerHTML = `<div class="w-14 h-14">${WEA_ICONS[parsed.icon] || WEA_ICONS["sun"]}</div>`;
      document.getElementById("weather-temp").textContent = Math.round(data.current.temperature_2m);
      document.getElementById("weather-feels").textContent = `/${Math.round(data.current.apparent_temperature)}°`;
      document.getElementById("weather-label").textContent = parsed.label;
      document.getElementById("weather-humidity").textContent = `${data.current.relative_humidity_2m}%`;
      document.getElementById("weather-wind").textContent = `${Math.round(data.current.wind_speed_10m)} km/h`;
    }
    feather.replace();
  } catch (e) {
    console.error(e);
  }
}

// -----------------------------------------
// FOOTER TICKER
// -----------------------------------------
const MESSAGES = [
  "Bienvenue au Renaissance Tlemcen Hotel",
  "Wi-Fi gratuit disponible - reseau : Renaissance_Guest",
  "Spa & Wellness Center",
  "Conciergerie 24h/24 a votre service",
  "Navette aeroport disponible sur demande",
];

function initFooter() {
  const ticker = MESSAGES.join("   •   ");
  const html = `
    <span class="whitespace-nowrap text-sm text-muted-foreground tracking-wide px-4">${ticker}</span>
    <span class="whitespace-nowrap text-sm text-muted-foreground tracking-wide px-4">${ticker}</span>
  `;
  document.getElementById("footer-ticker").innerHTML = html;
}

// -----------------------------------------
// INIT
// -----------------------------------------
renderEvents();
initFooter();
renderInstaPost(instaIndex);
updateClocks();
renderFlights();
fetchWeather();

setInterval(updateClocks, 1000);
setInterval(fetchWeather, 900000); // 15 mins
setInterval(nextFlightPage, 8000);

setInterval(() => {
  instaIndex = (instaIndex + 1) % INSTA_POSTS.length;
  renderInstaPost(instaIndex);
}, 7000);
