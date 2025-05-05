fetch ("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=seoul")
    .then (res => res.json())
    .then (data => {
        document.body.style.backgroundImage = `url("${data.urls.regular}")`
    })