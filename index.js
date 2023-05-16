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
        scrambleText(header);

        about.style.display = "block";

        home.style.display = "none";
        programming.style.display = "none";
        photography.style.display = "none";
        contact.style.display = "none";
    } else if (id == 'programming') {
        scrambleText(header);

        programming.style.display = "block";

        home.style.display = "none";
        about.style.display = "none";
        photography.style.display = "none";
        contact.style.display = "none";
    } else if (id == 'photography') {
        scrambleText(header);

        photography.style.display = "block";

        home.style.display = "none";
        programming.style.display = "none";
        about.style.display = "none";
        contact.style.display = "none";
    } else if (id == 'contact') {
        scrambleText(header);

        contact.style.display = "block";

        home.style.display = "none";
        programming.style.display = "none";
        photography.style.display = "none";
        about.style.display = "none";
    } else {
        scrambleText(header);

        home.style.display = "block";

        about.style.display = "none";
        programming.style.display = "none";
        photography.style.display = "none";
        contact.style.display = "none";
    }
}

const track = document.getElementById("image-track");

const handleOnDown = e => track.dataset.mouseDownAt = isNaN(e.clientX) ? 0 : e.clientX;

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";  
  track.dataset.prevPercentage = track.dataset.percentage;
  console.log(track.dataset.percentage);
};

const handleOnMove = e => {
  if(track.dataset.mouseDownAt === "0") return;
  
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;
  
  const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

        /*
        console.log(track.dataset.prevPercentage);
        console.log(nextPercentageUnconstrained);
        console.log(nextPercentage);
        */
  
  track.dataset.percentage = nextPercentage;
  
  if (isNaN(nextPercentage)) return;

  track.animate({
    transform: `translate(${nextPercentage}%, -50%)`
  }, { duration: 1200, fill: "forwards" });
  
  for(const image of track.getElementsByClassName("image")) {
    image.animate({
      objectPosition: `${100 + nextPercentage}% center`
    }, { duration: 1200, fill: "forwards" });
  }

  console.log("hello");
};

window.onmousedown = e => handleOnDown(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = e => handleOnUp(e);

window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);