// Define the submissions variable
let submissions = getCookie("BCC_count");
//let submissions = 1

// Define the thresholds for each star
const thresholds = [10, 50, 100, 500, 1000, 10000,1000000];

// Function to calculate stars
function calculateStars(submissions) {
    let stars = 0;
    for (let i = 0; i < thresholds.length; i++) {
        if (submissions >= thresholds[i]) {
            stars++;
        } else {
            break;
        }
    }
    return stars;
}

function starsMessage(stars) {
    if (stars == 0) {return 'Newbie: Submit observations to earn stars'} else
    if (stars == 1) {return 'Apprentice Surveyor'} else
    if (stars == 2) {return 'Local Expert'} else
    if (stars == 3) {return 'Neighbourhood Champion'} else
    if (stars == 4) {return 'Pro Car Spotter'} else
    if (stars == 5) {return 'Outstanding Surveyor'} else
    return 'Scientific Superstar'
}


// Function to calculate progress
function calculateProgress(submissions) {
    let progress = 0;
    for (let i = 0; i < thresholds.length; i++) {
        if (submissions < thresholds[i]) {
            progress = (submissions / thresholds[i]) * 100;
            break;
        }
    }
    return progress;
}

// Calculate stars and progress
let stars = calculateStars(submissions);
let progress = calculateProgress(submissions);

// Display stars
let starsDiv = document.getElementById('stars');
for (let i = 0; i < 5; i++) {
    let star = document.createElement('img');
    if (i < stars) {
        star.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="yellow" d="M528.1 171.5L382 150.2 288 0 194 150.2 47.9 171.5 136.2 290.4 93.2 443.5 288 371.3 482.8 443.5 439.8 290.4z"></path></svg>';
    } else {
        star.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="grey" d="M528.1 171.5L382 150.2 288 0 194 150.2 47.9 171.5 136.2 290.4 93.2 443.5 288 371.3 482.8 443.5 439.8 290.4z"></path></svg>';
    }
    star.style.height = "40px";
    star.style.width = "40px";
    starsDiv.appendChild(star);
}

// Display progress bar
let progressBar = document.getElementById('progress-bar');
progressBar.style.width = progress + '%';
progressBar.setAttribute('aria-valuenow', progress);
progressBar.innerHTML = '.';

// Display starsMessage
let messageDiv = document.getElementById('stars-message');
messageDiv.innerHTML = starsMessage(stars)