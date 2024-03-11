var shareImageButton = document.querySelector('#share-image-button');

shareImageButton.addEventListener('click', openCreatePostModal);

function openCreatePostModal() {
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

var workoutCardsContainer = document.querySelector('.workout-cards');

function clearCards() {
  while (workoutCardsContainer.hasChildNodes()) {
    workoutCardsContainer.removeChild(workoutCardsContainer.lastChild);
  }
}

function createCard(data) {
  data.forEach((workout) => {
    const card = document.createElement('div');
    card.classList.add('workout-card');
    card.innerHTML = `
          <img src="${workout.image}" alt="${workout.title}">
          <h3>${workout.title}</h3>
          <!-- Add other workout details here -->
      `;
    workoutCardsContainer.appendChild(card);

    card.addEventListener('click', () => {
      showWorkoutDetails(workout);
    });
  });
}

function showWorkoutDetails(workout) {
  const overlay = document.getElementById('overlay');
  const titleElement = document.getElementById('workout-title');
  const descriptionElement = document.getElementById('workout-description');

  titleElement.textContent = workout.name;
  descriptionElement.textContent = workout.detail;

  overlay.style.display = 'block';

  const closeOverlayButton = document.getElementById('close-overlay');
  closeOverlayButton.addEventListener('click', () => {
    overlay.style.display = 'none';
  });
}

function updateUI(data) {
  clearCards();
  createCard(data);
}

var url = 'https://tes-1-c14210182-default-rtdb.asia-southeast1.firebasedatabase.app/workout.json';
var networkDataReceived = false;

fetch(url)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

const overlay = document.getElementById('overlay');
const closeOverlayButton = document.getElementById('close-overlay');

document.querySelectorAll('.workout-card').forEach((card) => {
  card.addEventListener('click', () => {
    overlay.style.display = 'block';
  });
});


if ('indexedDB' in window) {
  readAllData('posts')
    .then(function (data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}
