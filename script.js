import { getRandomWordFromFile, fetchXMLDefinition, translateWord } from "./utils.js";

const imgAuthor = document.getElementById("img-author");
const currentTime = document.getElementById("current-time");
const weatherDiv = document.getElementById("weather-div");
const wordContainer = document.getElementById("korean-word");
const API_KEY = "05623374BED888DBCD8185F279824576";

function updateTime() {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    currentTime.innerHTML = `<h1>${hours}:${minutes}</h1>`;
}

updateTime();
setInterval(updateTime, 1000);

async function displayWord() {
    try {
        const word = await getRandomWordFromFile();
        const translation = await translateWord(word);
        const definition = await fetchXMLDefinition(word, API_KEY);

        wordContainer.innerHTML = `
            <span class="korean">${word}</span>
            <span class="english-hover">${translation}</span>
        `;
        wordContainer.setAttribute("data-definition", definition || "");
    } catch (error) {
        console.error("Error displaying wordL", error);
        wordContainer.textContent = "Error loading word";
        wordContainer.setAttribute("data-definition", "");
    }
}

displayWord();

fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=seoul")
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url(${data.urls.regular})`;
        imgAuthor.innerHTML = data.user.instagram_username
            ? `<p>Credit: @${data.user.instagram_username}</p>`
            : `<p>Credit: ${data.user.name}</p>`;
    }) 
    .catch(err => {
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1628008335819-7175b35fa4f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDY0NDU2Mjh8&ixlib=rb-4.0.3&q=80&w=1080)`;
        imgAuthor.innerHTML = `<p>Credit: @shining.shot</p>`;
    });

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`)
            .then(res => {
                if (!res.ok) throw new Error("Weather data not available");
                return res.json();
            })
            .then(data => {
                weatherDiv.innerHTML = `
                    <div class="weather-styling">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
                        <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                        <p class="weather-city">${data.name}</p>
                    </div>
                `;
            })
            .catch(err => console.error(err));
    })