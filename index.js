const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=+_1234567890,./<>?;':\"[]{}|`~";

let header = document.querySelector("h1");

scrambleText(header);

document.querySelectorAll("h2").forEach((navElement) => {
    navElement.addEventListener("mouseover", () => scrambleText(navElement));
});

function scrambleText(event) {
    let interval = null;

    let iteration = 0;

    clearInterval(interval);

    interval = setInterval(() => {
        event.innerText = event.innerText
            .split("")
            .map((character, index) => {
                if (index < iteration) {
                    return event.dataset.value[index];
                }

                return characters[Math.floor(Math.random() * characters.length)]
            })
            .join("");

        if (iteration >= event.dataset.value.length) {
            clearInterval(interval);
        }

        iteration += 1;
    }, 30);
}

function changeContent(id) {
    let home = document.getElementById("home-div");
    let about = document.getElementById("about-div");
    let programming = document.getElementById("prog-div");
    let photography = document.getElementById("photo-div");
    let contact = document.getElementById("contact-div");

    if (id == 'about') {
        document.body.style.backgroundColor = "crimson";
        scrambleText(header);

        about.style.display = "block";

        home.style.display = "none";
        programming.style.display = "none";
        photography.style.display = "none";
        contact.style.display = "none";
    } else if (id == 'programming') {
        document.body.style.backgroundColor = "dodgerblue";
        scrambleText(header);

        programming.style.display = "block";

        home.style.display = "none";
        about.style.display = "none";
        photography.style.display = "none";
        contact.style.display = "none";
    } else if (id == 'photography') {
        document.body.style.backgroundColor = "darkgoldenrod";
        scrambleText(header);

        photography.style.display = "block";

        home.style.display = "none";
        programming.style.display = "none";
        about.style.display = "none";
        contact.style.display = "none";
    } else if (id == 'contact') {
        document.body.style.backgroundColor = "olivedrab";
        scrambleText(header);

        contact.style.display = "block";

        home.style.display = "none";
        programming.style.display = "none";
        photography.style.display = "none";
        about.style.display = "none";
    } else {
        document.body.style.backgroundColor = "black";
        scrambleText(header);

        home.style.display = "block";

        about.style.display = "none";
        programming.style.display = "none";
        photography.style.display = "none";
        contact.style.display = "none";
    }
}
