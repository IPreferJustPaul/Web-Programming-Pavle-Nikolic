const input = document.getElementById("unos");
const dugme = document.getElementById("dugme");
const rezultat = document.getElementById("rezultat");
var name_list = [];
var hidden;
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://spire-codex.com/api/cards")
    .then(proveriOdgovor)
    .then(pretvoriUJSON)
    .then(makeList)
    .catch(prikaziGresku);
});

dugme.onclick = guessCard;

function makeList(data) {
  var hiddenname;
  data = JSON.stringify(data);
  data = JSON.parse(data);
  for (let i = 0; i < data.length; i++) {
    name_list.push(data[i].id);
  }
  hiddenname = name_list[Math.floor(Math.random() * name_list.length)];
  hiddenname = hiddenname.toLowerCase().trim();
  rezultat.innerHTML = `<p>${hiddenname}</p>`;
  fetch("https://spire-codex.com/api/cards/" + hiddenname)
    .then(proveriOdgovor)
    .then(pretvoriUJSON)
    .then(function (data) {
      hidden = data;
    })
    .then(prikaziCard)
  /*if(hidden.keywords == null){
    hidden.keywords = "None";
  }*/

}

function guessCard() {
  const guess = input.value.toLowerCase().trim().replace(" ", "_");

  if (guess === "") {
    rezultat.innerHTML = `<p>Enter a Card</p>` + rezultat.innerHTML;
    return;
  }
  rezultat.innerHTML = rezultat.innerHTML.replace(`Enter a Card`, '');
  rezultat.innerHTML = rezultat.innerHTML.replace(`Enter an existing card.`, '');

  fetch("https://spire-codex.com/api/cards/" + guess)
    .then(proveriOdgovor)
    .then(pretvoriUJSON)
    .then(prikaziCard)
    .catch(prikaziGresku);
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
  if (hidden.keywords == null) {
    hidden.keywords = ["None"];
  }
  if (guess.keywords == null) {
    guess.keywords = ["None"];
  }
  var overlap = guess.keywords.filter(value => hidden.keywords.includes(value));
  var keyword_rightness;
  if (overlap.length == hidden.keywords.length && overlap.length == guess.keywords.length) {
    keyword_rightness = "true";
  } else if (overlap.length > 0) {
    keyword_rightness = "kindatrue";
  } else {
    keyword_rightness = "false";
  }
  const html = `
    <div class="kartica">
      <img src="https://spire-codex.com${guess.image_url}">
      <p class ="is${guess.type == hidden.type}">${guess.type} ${hidden.type}</p>
      <p class ="is${guess.color == hidden.color}">${guess.color} ${hidden.color}</p>
      <p class ="is${guess.rarity == hidden.rarity}">${guess.rarity} ${hidden.rarity}</p>
      <p class ="is${guess.cost == hidden.cost}">${guess.cost} ${hidden.cost}</p>
      <p class ="is${keyword_rightness}">${guess.keywords} ${hidden.keywords}</p>
      <p class ="is${guess.target == hidden.target}">${guess.target} ${hidden.target}</p>
    </div>
  `;
  rezultat.innerHTML = html + rezultat.innerHTML;
}

function prikaziGresku(error) {
  rezultat.innerHTML = `<p>${error.message}</p>` + rezultat.innerHTML;
}