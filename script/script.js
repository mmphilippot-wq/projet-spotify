async function chargerMusiques() {
  const response = await fetch("data/data.json");
  const musiques = await response.json();
  return musiques;
}