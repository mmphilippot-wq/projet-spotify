async function chargerMusiques() {
  const response = await fetch("data/data.json");
  const musiques = await response.json();
  return musiques;
}

function formaterDuree(ms) {
  if (!ms) return "0:00";
  const totalSecondes = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSecondes / 60);
  const secondes = String(totalSecondes % 60).padStart(2, "0");
  return `${minutes}:${secondes}`;
}

function formaterDate(dateStr) {
  if (!dateStr) return "Date inconnue";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

function creerGraphiqueArtistes(musiques) {
  const compteur = {};
  musiques.forEach(morceau => {
    morceau.artists.forEach(artiste => {
      compteur[artiste.name] = (compteur[artiste.name] || 0) + 1;
    });
  });

  const trie = Object.entries(compteur)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const labels = trie.map(([nom]) => nom).reverse();
  const valeurs = trie.map(([, n]) => n).reverse();

  new Chart(document.getElementById("chartArtistes"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Nombre de morceaux",
        data: valeurs,
        backgroundColor: "rgba(100, 181, 246, 0.85)"
      }]
    },
    options: {
      indexAxis: "y",
      animation: false,
      events: [],
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Nombre de morceaux",
            align: "center"
          }
        }
      }
    }
  });
}

function creerGraphiqueGenres(musiques) {
  const compteur = {};
  musiques.forEach(morceau => {
    morceau.artists.forEach(artiste => {
      (artiste.genres || []).forEach(genre => {
        compteur[genre] = (compteur[genre] || 0) + 1;
      });
    });
  });

  const trie = Object.entries(compteur).sort((a, b) => b[1] - a[1]);
  const top = trie.slice(0, 7);
  const reste = trie.slice(7).reduce((total, [, n]) => total + n, 0);
  if (reste > 0) top.push(["Autres", reste]);

  const labels = top.map(([genre]) => genre);
  const valeurs = top.map(([, n]) => n);

  new Chart(document.getElementById("chartGenres"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: valeurs,
        backgroundColor: [
          "#f48fb1", "#90caf9", "#ffe082", "#80deea",
          "#ce93d8", "#ffcc80", "#a5d6a7", "#b0bec5"
        ]
      }]
    },
    options: {
      animation: false,
      events: [],
      plugins: {
        legend: {
          position: "right",
          align: "center"
        },
        tooltip: { enabled: false }
      }
    }
  });
}