
// function which observes an element of a specific class and adds a class addClass to it (used for fade-in animations)
function observeIntersection(className, addClass, rootMargin) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const intersecting = entry.isIntersecting;
            const topOffset = entry.boundingClientRect.top;

            //animation is only added if element enters the screen from the bottom (ie. user scrolls up)
            if (intersecting) {
                entry.target.classList.add(addClass);

                //animation class is only removed if element leaves screen to the bottom (ie. user scrolls up)
            } else if (!intersecting && topOffset > 0) {
                entry.target.classList.remove(addClass);
            }
        });
    }, { threshold: 0, rootMargin: rootMargin });

    // Start observing each element
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => observer.observe(element));
}

// observe elements for fade-in
observeIntersection("download-cv", "test", "0px");
observeIntersection("expand", "expandBars", "0px");
observeIntersection("fade-in", "fadeIn", "0px");
observeIntersection("fade-in-left", "fadeInLeft", "-100px");

// select needed DOM elements
const startPicture = document.querySelector("#picture-me");

/*------------------------------------------------------------------------------------
Controls opacity of the start picture
------------------------------------------------------------------------------------*/

/*initialize opacity value for the background*/
var bgOpacity = .4;
if (window.innerWidth < 768) {
    startPicture.style.setProperty('--opac', Math.min(bgOpacity, 1));
} else {
    startPicture.style.setProperty('--opac', .92);
}

const text0 = document.getElementById("text-0");
const text1 = document.getElementById("text-1");
const text2 = document.getElementById("text-2");

textArray = Array.from([text0, text1, text2])

// set variable opacity of Start Picture with scroll 
const setBgOpacity2 = function () {
    if (window.innerWidth < 768) {
        scrollPos = window.scrollY;
        bgOpacity = 0.3 - window.scrollY / 1000;
        opacStartPic = 1 - window.scrollY / (window.innerHeight / 2);
        startPicture.style.setProperty('--opac', Math.min(opacStartPic, 1));
    }
}

window.addEventListener("scroll", setBgOpacity2);


/*------------------------------------------------------------------------------------
Controls typewriter effect of section titles
------------------------------------------------------------------------------------*/

const typeWriterElem = document.querySelectorAll(".type-writer");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var typeWriter = async function (elem) {
    var text = elem.textContent.trim();
    text = text.split(/[\n\s]+/).join(' ');
    elem.textContent = '';
    var blinkerElem;

    // whether blinking element appear at end of text
    if (elem.classList.contains("type-writer-no-blink")) {
        blinkerElem = '';
    } else {
        blinkerElem = '<span class=blink>|<span>';
    }

    for (let i = 1; i <= text.length; i++) {
        await sleep(100);
        elem.innerHTML = text.substring(0, i) + blinkerElem;
    }
}

// play animation upon intersection (only once)
const observeTypeWriter = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.style.visibility = "hidden";
        if (entry.isIntersecting) {
            entry.target.style.visibility = "visible";
            typeWriter(entry.target);
            observeTypeWriter.unobserve(entry.target);
        }
    })
});

Array.from(typeWriterElem).forEach(elem => {
    observeTypeWriter.observe(elem);
});

/*------------------------------------------------------------------------------------
Control Page Theme (Dark / Light) via theme toggler
------------------------------------------------------------------------------------*/

const togglerParams = {
    container: document.getElementById("theme-toggler"),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: "https://lottie.host/41e5cfc4-48d4-46b2-9bc7-f371670bb97b/wIGpgIMrmX.json",
}

const togglerAnim = bodymovin.loadAnimation(togglerParams);
togglerAnim.setSpeed(3);

// turn light theme on
function switchToLight() {
    document.documentElement.classList.add("light-theme");
    document.documentElement.classList.remove("dark-theme");
    togglerAnim.playSegments([0, 60], true);

    // load light bulb with black lines
    animEdu.destroy();
    animEdu = bodymovin.loadAnimation(paramsLight);
    animEdu.play();
}

// turn dark theme on
function switchToDark() {
    document.documentElement.classList.remove("light-theme");
    document.documentElement.classList.add("dark-theme");
    togglerAnim.playSegments([60, 120], true);

    // load light bulb with white lines
    animEdu.destroy();
    animEdu = bodymovin.loadAnimation(paramsDark);
    animEdu.play();
}

// controls switch of appearance on click
let clickCount = 0;
var toggleTheme = function () {
    clickCount = (clickCount + 1) % 2;
    if (clickCount == 1) {
        switchToDark();
    } else {
        switchToLight();
    }
}

const animContainer = document.getElementById('theme-toggler');
animContainer.addEventListener("click", toggleTheme);

/*------------------------------------------------------------------------------------
Controls appearance of Ligh Bulb Animation in Education Section
------------------------------------------------------------------------------------*/

// version for light-theme
const paramsLight = {
    container: document.getElementById('light-bulb-anim'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: "https://lottie.host/ce5e2854-4bab-4f34-ba4a-249711da8dc1/qT0jKeIlZc.json",
}

// version for dark-theme
const paramsDark = {
    container: document.getElementById('light-bulb-anim'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: "https://lottie.host/f8070cae-2182-423f-95ce-1c0155f8b014/pcV0jPNetL.json",
}

// draw animation if visible
const EduObserver = new IntersectionObserver(elements => {
    elements.forEach(elem => {
        if (elem.isIntersecting) {
            animEdu.play();
        } else {
            animEdu.stop();
        }
    })
})

// load light version of the animation at start
var animEdu = bodymovin.loadAnimation(paramsLight);
EduObserver.observe(document.getElementById('light-bulb-anim'));



/*------------------------------------------------------------------------------------
Controls behavior of NavBar
------------------------------------------------------------------------------------*/
// this could be solved via class instances! 
const dropDownElems = document.querySelectorAll(".dropdown");
const hambButton = document.querySelector("#hamb-button");
const mainDropDown = document.querySelector(".nav-buttons");

expandNav = function () {

    if (window.innerWidth < 768) {
        // remove class active from all sub dropdown menus
        for (let i = 0; i < dropDownElems.length; i++) {
            dropDownElems[i].classList.remove('active');
            dropDownElems[i].children[1].style.setProperty("height", 0);
        }

        if (hambButton.classList.contains('active')) {
            mainDropDown.style.setProperty("height", 0);
            hambButton.classList.remove('active');
            mainDropDown.classList.remove('active');
        } else {
            mainDropDown.style.setProperty("height", mainDropDown.scrollHeight + 25 + "px");
            hambButton.classList.add('active');
            mainDropDown.classList.add('active');
        }
    }
}

document.querySelector('#hamb-button').addEventListener('click', expandNav);

expandSubNav = function () {
    if (window.innerWidth < 768) {
        if (this.parentElement.classList.contains('active')) {
            // close all subsequent active lists
            this.parentElement.children[1].style.setProperty("height", 0);
            this.parentElement.classList.remove('active');
            const allLists = this.parentElement.querySelectorAll('.dropdown');
            for (let i = 0; i < allLists.length; i++) {
                allLists[i].classList.remove('active');
            }
            // adjust height of main navbar as a result of expanding / collapsing sub-menus
            mainDropDown.style.setProperty("height", mainDropDown.lastElementChild.offsetTop + mainDropDown.lastElementChild.clientHeight - this.parentElement.children[1].scrollHeight + "px");

        } else {
            // add active only to clicked list
            this.parentElement.classList.add('active');
            this.parentElement.children[1].style.setProperty("height", this.parentElement.children[1].scrollHeight + "px");
            // adjust height of main navbar as a result of expanding / collapsing sub-menus
            mainDropDown.style.setProperty("height", mainDropDown.lastElementChild.offsetTop + mainDropDown.lastElementChild.clientHeight + this.parentElement.children[1].scrollHeight + "px");
        }
    }
}

// add click event listener to dropdown buttons
for (let i = 0; i < dropDownElems.length; i++) {
    dropDownElems[i].children.item("a").addEventListener('click', expandSubNav);
}

/*------------------------------------------------------------------------------------
Controls behavior of NavBar
------------------------------------------------------------------------------------*/

createSpanLetters = function (elem) {
    const text = elem.innerHTML.trim();
    var letters = text.split("");
    elem.innerHTML = "";
    // replace space with space character for span to display
    letters = letters.map(letter => letter == ' ' ? '&nbsp;' : letter);
    letters.forEach((letter) => {
        const span = document.createElement("span");
        span.style.display = "inline-block";
        // Delay each letter's animation
        span.innerHTML = letter;
        elem.appendChild(span);
    });
}

wiggleLetter = function (elem) {
    for (let i = 0; i < elem.textContent.length; i++) {
        elem.children[i].style.animation = "wiggleLetter both 3s infinite";
        elem.children[i].style.animationDelay = `${i * 30 + "ms"}`
    }
}

const downloadCV = document.querySelector("#download_cv").querySelector("a")
createSpanLetters(downloadCV);

wiggleLetter(downloadCV); 
