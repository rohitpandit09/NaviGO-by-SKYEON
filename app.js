// Mock user (replace with auth data if needed)
const currentUserName = "Guest";

// Mock monasteries data (replace with Firebase Firestore later)
// const monasteries = [
//   {
//     id: "1",
//     name: "Rumtek Monastery",
//     gps: "27.3389° N, 88.5583° E",
//     year: 1966,
//     sect: "Kagyu",
//     festival: "Losar",
//     description:
//       "The largest monastery in Sikkim and the main seat of the Karma Kagyu lineage outside Tibet.",
//   },
//   {
//     id: "2",
//     name: "Pemayangtse Monastery",
//     gps: "27.3167° N, 88.2167° E",
//     year: 1705,
//     sect: "Nyingma",
//     festival: "Chaam",
//     description:
//       "One of the oldest and premier monasteries of Sikkim, meaning 'Perfect Sublime Lotus'.",
//   },
//   {
//     id: "3",
//     name: "Enchey Monastery",
//     gps: "27.3314° N, 88.6138° E",
//     year: 1909,
//     sect: "Nyingma",
//     festival: "Chaam",
//     description:
//       "Built on the site blessed by Lama Druptob Karpo, known for its annual Chaam dance.",
//   },
//   {
//     id: "4",
//     name: "Tashiding Monastery",
//     gps: "27.3333° N, 88.2667° E",
//     year: 1717,
//     sect: "Nyingma",
//     festival: "Bhumchu",
//     description:
//       "Sacred monastery where the holy water ceremony of Bhumchu takes place annually.",
//   },
//   {
//     id: "5",
//     name: "Dubdi Monastery",
//     gps: "27.3000° N, 88.2000° E",
//     year: 1701,
//     sect: "Nyingma",
//     festival: "Losar",
//     description: "The oldest monastery in Sikkim, also known as Yuksom Monastery.",
//   },
//   {
//     id: "6",
//     name: "Phensang Monastery",
//     gps: "27.4000° N, 88.3000° E",
//     year: 1721,
//     sect: "Nyingma",
//     festival: "Pang Lhabsol",
//     description:
//       "A beautiful monastery known for its scenic location and traditional architecture.",
//   },
// ];

const icons = {
  mapPin:
    '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/></svg>',
  calendar:
    '<svg class="icon" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 3v4M8 3v4M3 11h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  users:
    '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2"/></svg>',
  book:
    '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="2"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="2"/></svg>',
  cam:
    '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2v10z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2"/></svg>',
};

const state = {
  sect: "all",
  sort: "year-desc",
};

function el(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}
function renderCard(m) {
  return `
    <div class="card">
      <div class="card-body">
        <h3>${m.name}</h3>
        <div class="meta">${icons.mapPin}<span>${m.gps}</span></div>
        <div class="kv-row">
          <span class="badge-secondary">${icons.calendar}<span>${m.year}</span></span>
          <span class="badge-outline">${icons.users}<span>${m.sect}</span></span>
          <span class="badge-default">${icons.book}<span>${m.festival}</span></span>
        </div>
        <p style="color: var(--muted-fg); margin: 0.25rem 0 0.5rem;">
          ${m.description}
        </p>
        <div class="actions">
          <button class="btn-ghost" title="View Map" onclick="openMap('${m.gps}')">
            ${icons.mapPin} View Map
          </button>
          <button class="btn-ghost view-tour" data-url="${m.tour360}">
            ${icons.cam} 360° Tour
          </button>
          <button class="btn-ghost play-audio" 
                  data-hindi="${m.audioHindi}" 
                  data-english="${m.audioEnglish}">
            🔊 Audio
          </button>
        </div>
      </div>
    </div>
  `;
}


function applyFilters(data) {
  let res = [...data];
  if (state.sect !== "all") {
    res = res.filter((m) => m.sect === state.sect);
  }
  switch (state.sort) {
    case "year-asc":
      res.sort((a, b) => a.year - b.year);
      break;
    case "name-asc":
      res.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default: // year-desc
      res.sort((a, b) => b.year - a.year);
  }
  return res;
}

function renderGrid() {
  const grid = document.getElementById("grid");
  const empty = document.getElementById("empty");
  const items = applyFilters(monasteries);

  if (items.length === 0) {
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  grid.innerHTML = items.map(renderCard).join("");
}

function initControls() {
  const sect = document.getElementById("sect-filter");
  const sort = document.getElementById("sort-by");
  sect.addEventListener("change", () => {
    state.sect = sect.value;
    // renderGrid();
  });
  sort.addEventListener("change", () => {
    state.sort = sort.value;
    // renderGrid();
  });
}

function initHeader() {
  const welcome = document.getElementById("welcome-text");
  welcome.textContent = `Welcome, ${currentUserName}`;
  const signout = document.getElementById("signout-btn");
  signout.addEventListener("click", () => {
    alert("Sign out is not implemented in static mode.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initControls();
//   renderGrid();
});

// Fire Base Config Snippet 


 // Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCQIWsrk8-w3zCAp5n3EzdVKnTaU8Pe8CQ",
  authDomain: "database-603c8.firebaseapp.com",
  projectId: "database-603c8",
  storageBucket: "database-603c8.firebasestorage.app",
  messagingSenderId: "125241237179",
  appId: "1:125241237179:web:72625856b2a733b7cb139e",
  measurementId: "G-LZSSMT5PTL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch monasteries

const monasteries = []; // global array

db.collection("monasteries").get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      monasteries.push(doc.data());
    });

    // Now that data is loaded, initialize grid and filters
    renderGrid();
    initControls();
    initHeader();
  })
  .catch(error => console.error("Error fetching monasteries:", error));

// Testing 

db.collection("monasteries").get()
  .then(snapshot => {
    console.log("Snapshot:", snapshot);
    snapshot.forEach(doc => console.log(doc.id, doc.data()));
  })
  .catch(error => console.error("Error fetching:", error));

// 360 VIEW Feature 

function attach360Listeners() {
  const buttons = document.querySelectorAll(".qtitle");
  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const monastery = monasteries[index]; // get the corresponding monastery
      open360Tour(monastery.tour360);
    });
  });
}

// Call this after renderGrid()
renderGrid();
attach360Listeners();

// To access the 360 button 

const viewerContainer = document.getElementById("viewer-container");
let viewer;

function open360Tour(imgUrl) {
  viewerContainer.classList.remove("hidden");
  if (viewer) viewer.destroy();
  viewer = new PhotoSphereViewer.Viewer({
    container: viewerContainer,
    panorama: imgUrl,
    navbar: ["autorotate", "zoom", "fullscreen"],
  });
}

document.getElementById("close-viewer").addEventListener("click", () => {
  viewerContainer.classList.add("hidden");
  if (viewer) viewer.destroy();
});

// Bug Fix 

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-tour")) {
    const url = e.target.getAttribute("data-url");
    if (!url) {
      alert("No 360° tour available for this monastery!");
      return;
    }
    window.open(url, "_blank"); // opens in new tab
  }
});



// Map View Feature 

const mapContainer = document.getElementById("map-container");
const mapFrame = document.getElementById("map-frame");

function openMap(gps) {
  let [latStr, lagStr] = gps.split(",");
  
  const lat = parseFloat(latStr.replace(/[^\d.-]/g, ""));
  const lag = parseFloat(lagStr.replace(/[^\d.-]/g, ""));
  
  mapFrame.innerHTML = `
    <iframe
      width="100%"
      height="100%"
      style="border:0"
      loading="lazy"
      allowfullscreen
      src="https://www.google.com/maps/embed/v1/view?key=AIzaSyDMncrM5wRhVcBn7X9JOEslTxIUQV2HV30&center=${lat},${lag}&zoom=16&maptype=satellite">
    </iframe>
  `;
  mapContainer.classList.remove("hidden");
}
 // Closes map 

document.getElementById("close-map").addEventListener("click", () => {
  mapContainer.classList.add("hidden");
  mapFrame.innerHTML = ""; // remove iframe when closed
});


// Audio Feature 

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("play-audio")) {
    const hindi = e.target.getAttribute("data-hindi");
    const english = e.target.getAttribute("data-english");

    // Show modal
    const audioFile = document.getElementById("audio-file");
    const player = document.getElementById("audio-player");

    audioFile.classList.remove("hidden");
    player.pause();
    player.src = ""; // reset

    // Handle Hindi/English buttons
    document.getElementById("play-hindi").onclick = () => {
      player.src = hindi;
      player.play();
    };
    document.getElementById("play-english").onclick = () => {
      player.src = english;
      player.play();
    };
  }
});

// Close audio modal
document.getElementById("close-audio").addEventListener("click", () => {
  document.getElementById("audio-file").classList.add("hidden");
  const player = document.getElementById("audio-player");
  player.pause();
  player.src = "";
});



