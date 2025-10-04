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

// ---------------- Fetch Murals ----------------
async function fetchMurals() {
    try {
        const snapshot = await db.collection("Murals").get();
        const murals = [];
        snapshot.forEach(doc => murals.push({ id: doc.id, ...doc.data() }));
        return murals;
    } catch (error) {
        console.error("Error fetching murals:", error);
        return [];
    }
}

// ---------------- Display Murals ----------------
async function displayMurals() {
    const murals = await fetchMurals();
    const grid = document.getElementById("grid");
    const emptyDiv = document.getElementById("empty");

    if (murals.length === 0) {
        emptyDiv.classList.remove("hidden");
        grid.classList.add("hidden");
        return;
    } else {
        emptyDiv.classList.add("hidden");
        grid.classList.remove("hidden");
    }

    murals.forEach(mural => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3 class="card-title">${mural.name}</h3>
            
            <div class="card-footer">
                <button class="info-btn" onclick="showInfo('${mural.id}')">Info</button>
                
            </div>
        `;
        grid.appendChild(card);
    });
}


// ---------------- Info Button ----------------
function showInfo(muralId) {
    db.collection("Murals").doc(muralId).get()
      .then(doc => {
          if (doc.exists) {
              const data = doc.data();
              if(data.infoURL) {
                  // Open the document in the same tab
                  window.location.href = data.infoURL;
              } else {
                  alert("No info document available for this mural.");
              }
          }
      })
      .catch(err => console.error("Error getting info:", err));
}





// ---------------- Initialize ----------------
displayMurals();
