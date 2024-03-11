// app.js
document.addEventListener('DOMContentLoaded', () => {
    // Fetch workout data from server (network first)
    fetchWorkoutsFromServer()
        .then((workouts) => {
            // Display workout cards
            renderWorkoutCards(workouts);
        })
        .catch((error) => {
            console.error('Error fetching workouts:', error);
            // Fallback to cached data (if available)
            getCachedWorkouts()
                .then((cachedWorkouts) => {
                    renderWorkoutCards(cachedWorkouts);
                });
        });
});

function fetchWorkoutsFromServer() {
    return fetch('https://blablabla-6d66e-default-rtdb.asia-southeast1.firebasedatabase.app/workout.json')
        .then((response) => response.json())
        .then((data) => {
            // Convert the data object into an array of workouts
            return Object.keys(data).map((key) => ({
                id: key,
                imageUrl: data[key].image,
                name: data[key].title
            }));
        });
}

// Function to render workout cards
function renderWorkoutCards(workouts) {
    const workoutCardsContainer = document.querySelector('.workout-cards');
    workouts.forEach((workout) => {
        const card = document.createElement('div');
        card.classList.add('workout-card');
        card.innerHTML = `
            <img src="${workout.imageUrl}" alt="${workout.name}">
            <h3>${workout.name}</h3>
            <!-- Add other workout details here -->
        `;
        workoutCardsContainer.appendChild(card);
    });
}
