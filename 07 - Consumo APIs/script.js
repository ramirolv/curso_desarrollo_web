// Token de Spotify: Asegúrate de incluir scopes necesarios, por ejemplo 'user-read-recently-played'
const token = "BQC_VjU0NYWL2Da6fafnQttFKJlX3CxK5geitlpUnvMt6BmLSaOBJ9O0BMG6fTAO0v1_JrdHHp2RLFimIWNlm4el6IdccCCQf2SLXPHnp3ma8FYBu5QbCQiJVksDDtblUH-a5pobsis";

// Variables para Top Tracks (scroll infinito)
let topTracksOffset = 0;
const topTracksLimit = 5;
let topTracksTotal = null;
let loading = false;
let currentView = "topTracks";

// Función genérica para consultar la API de Spotify
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
    },
    method,
    body: body ? JSON.stringify(body) : null,
  });
  return await res.json();
}

// Funciones para llamar a endpoints de la API
async function getTopTracks(offset = 0) {
  return await fetchWebApi(
    `v1/me/top/tracks?time_range=long_term&limit=${topTracksLimit}&offset=${offset}`,
    "GET"
  );
}
async function getTopArtists() {
  return await fetchWebApi(
    `v1/me/top/artists?time_range=long_term&limit=10`,
    "GET"
  );
}
async function getRecentlyPlayed() {
  // NOTA: Este endpoint requiere el scope 'user-read-recently-played'
  return await fetchWebApi(`v1/me/player/recently-played?limit=3`, "GET");
}
async function searchSpotify(query) {
  return await fetchWebApi(
    `v1/search?q=${encodeURIComponent(query)}&type=track,artist&limit=10`,
    "GET"
  );
}

// Funciones para renderizar contenido

// Renderiza una card de track (para Top Tracks y resultados de búsqueda)
function renderTrackCard(track, container) {
  const card = document.createElement("div");
  card.className = "track-card";
  const img = document.createElement("img");
  img.src = track.album.images?.[0]?.url || "";
  img.alt = `Portada de ${track.name}`;
  img.className = "track-image";
  const info = document.createElement("div");
  info.className = "info";
  const title = document.createElement("div");
  title.className = "title";
  title.textContent = track.name;
  const subtitle = document.createElement("div");
  subtitle.className = "subtitle";
  subtitle.textContent = track.artists.map((artist) => artist.name).join(", ");
  info.appendChild(title);
  info.appendChild(subtitle);
  card.appendChild(img);
  card.appendChild(info);
  container.appendChild(card);
}

// Renderiza cards de artistas en un contenedor dado
function renderArtistsCards(artists, container) {
  artists.forEach((artist) => {
    const card = document.createElement("div");
    card.className = "artist-card";
    const img = document.createElement("img");
    img.src = artist.images?.[0]?.url || "";
    img.alt = artist.name;
    img.className = "artist-image";
    const info = document.createElement("div");
    info.className = "info";
    const name = document.createElement("div");
    name.className = "title";
    name.textContent = artist.name;
    info.appendChild(name);
    card.appendChild(img);
    card.appendChild(info);
    container.appendChild(card);
  });
}

// Renderiza resultados de Recently Played
function renderRecentlyPlayedItems(items) {
  items.forEach((item) => {
    const track = item.track;
    renderTrackCard(track, document.getElementById("content"));
  });
}

// Renderiza resultados de búsqueda en secciones (Tracks y Artistas)
function renderSearchResults(results) {
  const container = document.getElementById("content");
  container.innerHTML = "";
  // Sección para Tracks
  if (results.tracks && results.tracks.items.length > 0) {
    const trackSection = document.createElement("section");
    trackSection.className = "search-result-section";
    const headerTracks = document.createElement("h2");
    headerTracks.textContent = "Tracks";
    trackSection.appendChild(headerTracks);
    const trackGrid = document.createElement("div");
    trackGrid.className = "result-grid";
    results.tracks.items.forEach((track) => {
      renderTrackCard(track, trackGrid);
    });
    trackSection.appendChild(trackGrid);
    container.appendChild(trackSection);
  }
  // Sección para Artistas
  if (results.artists && results.artists.items.length > 0) {
    const artistSection = document.createElement("section");
    artistSection.className = "search-result-section";
    const headerArtists = document.createElement("h2");
    headerArtists.textContent = "Artistas";
    artistSection.appendChild(headerArtists);
    const artistGrid = document.createElement("div");
    artistGrid.className = "result-grid";
    renderArtistsCards(results.artists.items, artistGrid);
    artistSection.appendChild(artistGrid);
    container.appendChild(artistSection);
  }
}

// Funciones para cargar cada vista
async function loadTopTracks(initial = true) {
  const container = document.getElementById("content");
  if (initial) {
    container.innerHTML = "";
    topTracksOffset = 0;
    topTracksTotal = null;
  }
  try {
    const data = await getTopTracks(topTracksOffset);
    if (topTracksTotal === null) topTracksTotal = data.total;
    data.items.forEach((track) => {
      renderTrackCard(track, container);
    });
    topTracksOffset += topTracksLimit;
  } catch (error) {
    console.error("Error al cargar Top Tracks:", error);
  }
}

async function loadTopArtists() {
  const container = document.getElementById("content");
  container.innerHTML = "";
  try {
    const data = await getTopArtists();
    renderArtistsCards(data.items, container);
  } catch (error) {
    console.error("Error al cargar Top Artists:", error);
  }
}

async function loadRecentlyPlayed() {
  const container = document.getElementById("content");
  container.innerHTML = "";
  try {
    const data = await getRecentlyPlayed();
    // Si el token no tiene el scope necesario, mostrar mensaje de error
    if (data.error) {
      container.innerHTML =
        "<p>Error: Insufficient client scope for Recently Played. Asegúrate de incluir el scope <code>user-read-recently-played</code> en el token.</p>";
      return;
    }
    renderRecentlyPlayedItems(data.items);
  } catch (error) {
    console.error("Error al cargar Recently Played:", error);
  }
}

async function handleSearch(container) {
  const query = document.getElementById("searchQuery").value;
  if (query.trim() !== "") {
    container.innerHTML = ""; // Limpiar resultados previos
    try {
      const results = await searchSpotify(query);
      renderSearchResults(results);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  }
}

function renderSearchView() {
  const container = document.getElementById("content");
  container.innerHTML = "";
  // Contenedor de búsqueda con diseño corregido
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Buscar en Spotify...";
  input.id = "searchQuery";
  input.onkeydown = async (e) => {
    if (e.key == "Enter") {
      await handleSearch(container);
    }
  };

  const button = document.createElement("button");
  button.textContent = "Buscar";
  button.onclick = async () => {
    await handleSearch(container);
  };

  searchContainer.appendChild(input);
  searchContainer.appendChild(button);
  container.appendChild(searchContainer);
}

function setView(view) {
  currentView = view;
  window.removeEventListener("scroll", handleScroll);
  switch (view) {
    case "topTracks":
      loadTopTracks(true);
      window.addEventListener("scroll", handleScroll);
      break;
    case "topArtists":
      loadTopArtists();
      break;
    case "recentlyPlayed":
      loadRecentlyPlayed();
      break;
    case "search":
      renderSearchView();
      break;
  }
}

function handleScroll() {
  if (
    currentView === "topTracks" &&
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !loading
  ) {
    if (topTracksTotal !== null && topTracksOffset >= topTracksTotal) return;
    loading = true;
    loadTopTracks(false).then(() => {
      loading = false;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setView("topTracks");
});
