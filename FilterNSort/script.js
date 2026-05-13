const input = document.getElementById("unos");
const searchBtn = document.getElementById("search");
const filterBtn = document.getElementById("filter");
const sortBtn = document.getElementById("sort");
const rezultat = document.getElementById("rezultat");
const add50Btn = document.getElementById("add50");
var card_list = [];
var big_list = [];

searchBtn.onclick = searchCard;
filterBtn.onclick = filterCards;
sortBtn.onclick = sortCards;
add50Btn.onclick = add50Cards;

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://spire-codex.com/api/cards")
    .then(proveriOdgovor)
    .then(pretvoriUJSON)
    .then(makeList)
    .catch(prikaziGresku);
});

function searchCard() {
  const search = input.value.toLowerCase().trim().replace(" ", "_");

  if (search === "") {
    rezultat.innerHTML = `<p>Enter a Card</p>` + rezultat.innerHTML;
    return;
  }
  rezultat.innerHTML = rezultat.innerHTML.replace(`Enter a Card`, '');
  rezultat.innerHTML = rezultat.innerHTML.replace(`Enter an existing card.`, '');

  fetch("https://spire-codex.com/api/cards/" + search)
    .then(proveriOdgovor)
    .then(pretvoriUJSON)
    .then(addCard)
    .then(prikaziSve)
    .catch(prikaziGresku);
}

function prikaziSve() {
  rezultat.innerHTML = "";
  for (let i = 0; i < card_list.length; i++) {
    prikaziCard(card_list[i]);
  }
}

function addCard(card) {
  for (let i = 0; i < card_list.length; i++) {
    if (card_list[i].id === card.id) {
      rezultat.innerHTML = `<p>Card already exists</p>` + rezultat.innerHTML;
      return;
    }
  }
  rezultat.innerHTML = rezultat.innerHTML.replaceAll(`Card already exists`, '');
  card_list.push(card);
}

function filterCards() {
  rezultat.innerHTML = "";
  for (let i = 0; i < card_list.length; i++) {
    const card = card_list[i];
    if (card.color === input.value.toLowerCase().trim().replace(" ", "_")) {
      prikaziCard(card);
    }
  }

}

function sortCards() {
  switch (input.value.toLowerCase().trim()) {
    case "color":
      card_list.sort((a, b) => a.color.localeCompare(b.color));
      break;
    case "rarity":
      card_list.sort((a, b) => a.rarity.localeCompare(b.rarity));
      break;
    case "cost":
      card_list.sort((a, b) => a.cost - b.cost);
      break;
    case "name":
      card_list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "type":
      card_list.sort((a, b) => a.type.localeCompare(b.type));
      break;
    default:
      rezultat.innerHTML = `<p>Enter a valid sort category</p>` + rezultat.innerHTML;
      return;
  }
  prikaziSve();
}
function rarityCompare(a, b) {
  const rarities = ["basic", "common", "uncommon", "rare", "ancient", "event", "quest", "curse", "status", "attack", "skill", "power", "relic"];
  return rarities.indexOf(a) - rarities.indexOf(b);
}
function add50Cards() {
  rezultat.innerHTML = "";
  for (let i = 0; i < 50; i++) {
    const card = big_list[Math.floor(Math.random() * big_list.length)];
    addCard(card);
  }
  prikaziSve();
}

function makeList(data) {
  data = JSON.stringify(data);
  data = JSON.parse(data);
  big_list = data;
}

function proveriOdgovor(input) {
  if (input.ok === false) {
    throw new Error("Enter an existing card.");
  }

  return input;
}

function pretvoriUJSON(input) {

  return input.json();
}

function pretvoriUNiz(input) {
  return JSON.parse(input);
}

function prikaziCard(guess) {
  const html = `
    <div class="kartica">
      <img src="https://spire-codex.com${guess.image_url}">
      <p><b>${guess.name}</b></p>
      <p><b>Type:</b> ${guess.type}</p>
      <p><b>Color:</b> ${guess.color}</p>
      <p><b>Rarity:</b> ${guess.rarity}</p>
      <p><b>Cost:</b> ${guess.cost}</p>
      <p><b>Keywords:</b> ${guess.keywords}</p>
      <p><b>Target:</b> ${guess.target}</p>
    </div>
  `;
  rezultat.innerHTML = html + rezultat.innerHTML;
}

function prikaziGresku(error) {
  rezultat.innerHTML = `<p>${error.message}</p>` + rezultat.innerHTML;
}