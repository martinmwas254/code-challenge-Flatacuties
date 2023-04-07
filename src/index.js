let currentVotes = 0;

function init() {
  const characterBar = document.querySelector("#character-bar");
  const detailedInfo = document.querySelector("#detailed-info");
  const image = document.querySelector("#image");

  fetchCharacters(characterBar, detailedInfo, image);
  attachVoteFormEvents();
  attachResetBtnEvents();
}

function fetchCharacters(characterBar, detailedInfo, image) {
  fetch("http://localhost:3000/characters")
    .then((res) => res.json())
    .then((data) => {
      console.log(data.votes);

      for (const character of data) {
        createCharacterButton(character, characterBar, detailedInfo, image);
      }
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
  document.querySelector("#name").textContent = character.name;
  image.src = character.image;
  document.querySelector("#vote-count").textContent = character.votes;
  currentVotes = character.votes;
}

function attachVoteFormEvents() {
  const form = document.getElementById("votes-form");
  const votecount = document.querySelector("#vote-count");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateVoteCount(votecount, form);
  });
}

function updateVoteCount(votecount, form) {
  let votes = parseInt(document.querySelector("#votes").value);
  if (isNaN(votes)) {
    votes = 0;
  }
  currentVotes += votes;
  votecount.innerHTML = currentVotes;
  form.reset();

  updateVoteCountOnServer(currentVotes);
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


function attachResetBtnEvents() {
  const resetBtn = document.querySelector("#reset-btn");
  resetBtn.addEventListener("click", () => {
    resetVoteCount();
    resetVoteCountOnServer();
  });
}

function resetVoteCount() {
  currentVotes = 0;
  document.querySelector("#vote-count").innerHTML = currentVotes;
}

function resetVoteCountOnServer() {
  const name = document.querySelector("#name").textContent;
  fetch(`http://localhost:3000/characters?name=${name}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ votes: currentVotes }),
  });
}

document.addEventListener("DOMContentLoaded", init);
