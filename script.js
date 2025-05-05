const imgAuthor = document.getElementById("img-author");

fetch ("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=seoul")
    .then (res => res.json())
    .then (image => {
        document.body.style.backgroundImage = `url("${image.urls.regular}")`
        console.log(image)
        if (image.user.instagram_username) {
            imgAuthor.innerHTML = `
            <p>Credit: @${image.user.instagram_username}</p>
        `
        } else {
            imgAuthor.innerHTML = `
            <p>Credit: ${image.user.name}</p>
        `
        }
        
    });