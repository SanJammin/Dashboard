const imgAuthor = document.getElementById("img-author");
const currentTime = document.getElementById("current-time");
const weatherDiv = document.getElementById("weather-div");

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

fetch ("https://krdict.korean.go.kr/api/search")
    .then (res => {
        if (!res.ok) throw Error("Data not available");
        return res.json();
    })
    .then (data => {
        
    })
    .catch (err => console.error(err));

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