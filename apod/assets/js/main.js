// NASA APOD API: https://api.nasa.gov/index.html#browseAPI
// Personal NASA API key from api.nasa.gov.
// Sign up at https://api.nasa.gov/index.html#signUp and paste your own key here.
const API_KEY = "JgDUbQk0FD2YojYo6PWjIvrNtIdQ7hUSr6N3P8zX";
const API_URL = "https://api.nasa.gov/planetary/apod";
const FIRST_APOD_DATE = "1995-06-16";

// Grab the page elements we need to change
const datePicker = document.querySelector("#date-picker");
const todayButton = document.querySelector("#today-btn");
const statusMessage = document.querySelector("#status");
const apodSection = document.querySelector("#apod");
const apodTitle = document.querySelector("#apod-title");
const apodDate = document.querySelector("#apod-date");
const apodMedia = document.querySelector("#apod-media");
const apodExplanation = document.querySelector("#apod-explanation");
const apodCredit = document.querySelector("#apod-credit");

// Format a Date as YYYY-MM-DD using the local time zone
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Show a loading or error message above the results
function showStatus(message, isError) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", Boolean(isError));
}

// Show an image or an embedded video depending on media_type
function displayMedia(data) {
  apodMedia.innerHTML = "";

  if (data.media_type === "video") {
    const frame = document.createElement("iframe");
    frame.src = data.url;
    frame.title = data.title;
    frame.allowFullscreen = true;
    apodMedia.appendChild(frame);
  } else {
    const image = document.createElement("img");
    image.src = data.url;
    image.alt = data.title;
    apodMedia.appendChild(image);
  }
}

// Put the API response data on the page
function displayApod(data) {
  apodTitle.textContent = data.title;
  apodDate.textContent = data.date;
  apodExplanation.textContent = data.explanation;
  apodCredit.textContent = data.copyright ? `Image credit: ${data.copyright.trim()}` : "";
  displayMedia(data);
  apodSection.hidden = false;
}

// The one REST API call: request the APOD for a given date
async function fetchApod(date) {
  showStatus("Loading...", false);
  apodSection.hidden = true;

  try {
    const response = await fetch(`${API_URL}?api_key=${API_KEY}&date=${date}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || `Request failed (status ${response.status})`);
    }

    displayApod(data);
    showStatus("", false);
  } catch (error) {
    showStatus(`Could not load the picture: ${error.message}`, true);
  }
}

// Set the picker to today's date and load that picture
function loadToday() {
  datePicker.value = formatDate(new Date());
  fetchApod(datePicker.value);
}

// Only allow dates that have an APOD entry
datePicker.min = FIRST_APOD_DATE;
datePicker.max = formatDate(new Date());

// Load a new picture whenever the user picks a different date
datePicker.addEventListener("change", () => {
  if (datePicker.value) {
    fetchApod(datePicker.value);
  }
});

todayButton.addEventListener("click", loadToday);

// Show today's picture when the page first loads
loadToday();
