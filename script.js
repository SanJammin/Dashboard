const imgAuthor = document.getElementById("img-author");
const currentTime = document.getElementById("current-time");
const weatherDiv = document.getElementById("weather-div");
const API_KEY = "05623374BED888DBCD8185F279824576";
const wordContainer = document.getElementById("korean-word");

function updateTime() {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    currentTime.innerHTML = `
    <h1>${hours}:${minutes}</h1>
    `;
};

updateTime();
setInterval(updateTime, 1000);

function getRandomWord() {
    return fetch ("./data/ko_50k.txt")
        .then (res => res.text())
        .then (text => {
            const lines = text.trim().split("\n");
            const words = lines.map(line => line.split(" ")[0]);
            const randomWord = words[Math.floor(Math.random() * words.length)];
            return randomWord
        });
};

function fetchDefinition(word) {
    const url = `https://krdict.korean.go.kr/api/search?key=${API_KEY}&q=${encodeURIComponent(word)}`;

    return fetch (url)
        .then (res => res.text())
        .then (str => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "application/xml");
            const definitionNode = xml.querySelector("definition");

            return definitionNode ? definitionNode.textContent : "No definition found.";
        });
};

function displayWord() {
    getRandomWord()
        .then (word => {
            fetchDefinition(word)
                .then (definition => {
                    wordContainer.textContent = word;
                    wordContainer.setAttribute("data-definition", definition);
                })
                .catch(err => {
                    console.err("Error fetching definition:", err);
                    wordContainer.textContent = word;
                    wordContainer.setAttribute("data-definition", "Definition not available.");
                });
        })
        .catch(err => {
            console.error("Error fetching word:", err);
            wordContainer.textContent = "Error loading word.";
            wordContainer.setAttribute("data-definition", "");
        });
};

displayWord();

fetch ("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=seoul")
    .then (res => res.json())
    .then (data => {
        document.body.style.backgroundImage = `url(${data.urls.regular})`
        if (data.user.instagram_username) {
            imgAuthor.innerHTML = `
            <p>Credit: @${data.user.instagram_username}</p>
        `;
        } else {
            imgAuthor.innerHTML = `
            <p>Credit: ${data.user.name}</p>
        `;
        }
    })
    .catch (err => {
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1628008335819-7175b35fa4f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDY0NDU2Mjh8&ixlib=rb-4.0.3&q=80&w=1080)`
        imgAuthor.innerHTML = `
            <p>Credit: @shining.shot</p>
        `;
    });

navigator.geolocation.getCurrentPosition((position) => {
    fetch (`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then (res => {
            if (!res.ok) throw Error("Weather data not available");
            return res.json();
        })
        .then (data => {
            weatherDiv.innerHTML = `
                <div class="weather-styling">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
                    <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                    <p class="weather-city">${data.name}</p>
                </div>
            `;
        })
        .catch (err => console.error(err));
});