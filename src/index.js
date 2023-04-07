let currentVotes = 0;

function init() {
  const characterBar = document.querySelector("#character-bar");
  const detailedInfo = document.querySelector("#detailed-info");
  const image = document.querySelector("#image");

  fetchCharacters(characterBar, detailedInfo, image);
  attachEventListeners();
}

function fetchCharacters(characterBar, detailedInfo, image) {
  fetch("http://localhost:3000/characters")
    .then(res => res.json())
    .then(data => {
      console.log(data.votes);
      data.forEach(character => {
        createCharacterButton(character, characterBar, detailedInfo, image);
      });
    });
}

function createCharacterButton(character, characterBar, detailedInfo, image) {
  const button = document.createElement("button");
  button.textContent = character.name;
  button.addEventListener("click", () => {
    setCharacterInfo(character, detailedInfo, image);
  });
  characterBar.appendChild(button);
}

function setCharacterInfo(character, detailedInfo, image) {
  const nameElement = document.querySelector("#name");
  const voteCountElement = document.querySelector("#vote-count");
  const imageElement = image;

  nameElement.textContent = character.name;
  imageElement.src = character.image;
  voteCountElement.textContent = character.votes;
  currentVotes = character.votes;
}

function attachEventListeners() {
  const form = document.getElementById("votes-form");
  const resetBtn = document.querySelector("#reset-btn");
  const voteCountElement = document.querySelector("#vote-count");

  form.addEventListener("submit", event => {
    event.preventDefault();
    const votesInput = document.querySelector("#votes");
    const votes = parseInt(votesInput.value);
    if (!isNaN(votes)) {
      currentVotes += votes;
      voteCountElement.textContent = currentVotes;
      updateVoteCountOnServer(currentVotes);
    }
    form.reset();
  });

  resetBtn.addEventListener("click", () => {
    resetVoteCount();
    resetVoteCountOnServer(currentVotes);
  });
}

function resetVoteCount() {
  currentVotes = 0;
  const voteCountElement = document.querySelector("#vote-count");
  voteCountElement.textContent = currentVotes;
}

function updateVoteCountOnServer(currentVotes) {
  const name = document.querySelector("#name").textContent;
  if (typeof currentVotes !== "number" || currentVotes < 0) {
    console.error("Invalid input for currentVotes");
    return;
  }
  fetch(`http://localhost:3000/characters?name=${name}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ votes: currentVotes }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to update vote count");
    }
  })
  .catch(error => {
    console.error("Error updating vote count:", error);
  });
}

document.addEventListener("DOMContentLoaded", init);
