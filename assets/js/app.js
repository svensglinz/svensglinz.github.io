
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

// creates a scrolldot that is connected to one child element --> If this comes into view, the scroll-dot will change class (scroll-dot, child combo)
class scrollArrows {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.observer = this.#createObserver();
        this.observePosition();
        this.firstChild = parentElement.firstElementChild;
        this.lastChild = parentElement.lastElementChild;
        this.arrowLeft = this.createArrow("left");
        this.arrowRight = this.createArrow("right");
        this.observeClick();
        this.lastInView = undefined;
        this.lastOutView = undefined; // hard coded for first click
    }

    #createObserver() {

        let options = {
            root: this.parentElement,
            rootMargin: "0px",
            threshold: .8,
        };

        const observer = new IntersectionObserver(entries => {
            const index = [];
            for (const entry of entries) {

                // get the element that left the screen
                if (!entry.isIntersecting) {
                    this.lastOutView = Array.from(this.parentElement.children).indexOf(entry.target);
                    index.push(this.lastOutView);
                }

                if (entry.isIntersecting) {
                    this.lastInView = Array.from(this.parentElement.children).indexOf(entry.target);
                    index.push(this.lastInView);
                }

                if (entry.target == this.firstChild) {
                    if (entry.isIntersecting) {
                        this.arrowLeft.style.visibility = "hidden";
                    } else {
                        this.arrowLeft.style.visibility = "visible";
                    }
                }

                if (entry.target == this.lastChild) {
                    if (entry.isIntersecting) {
                        this.arrowRight.style.visibility = "hidden";
                    } else {
                        this.arrowRight.style.visibility = "visible";
                    }
                }
                console.log("lastOutView = " + index);
                console.log("lastInView = " + index);
            }

        }, options);

        return observer;
    }

    observePosition() {
        Array.from(this.parentElement.children).forEach(child => {
            this.observer.observe(child);
        });
    }

    unobservePosition() {
        this.observer.unobserve(children);
    }

    createArrow(direction) {
        const arrow = document.createElement("div");
        arrow.classList.add("timeline-button");
        if (direction == "left") {
            arrow.classList.add("left");
            arrow.innerHTML += "<span>&#8592</span>";
        } else if (direction == "right") {
            arrow.classList.add("right");
            arrow.innerHTML += "<span>&#8594</span>";
        }
        return arrow;
    }

    clickNext() {
        let scrollTo;
        if (this.lastInView > this.lastOutView) {
            scrollTo = this.lastInView + 1;
        } else {
            scrollTo = this.lastOutView;
        }

        this.parentElement.children[scrollTo].scrollIntoView({ behavior: "smooth", block: "nearest" })

    }

    clickPrevious() {
        let scrollTo;
        if (this.lastInView > this.lastOutView) {
            scrollTo = this.lastOutView;
        } else {
            scrollTo = this.lastInView - 1;
        }
        this.parentElement.children[scrollTo].scrollIntoView({ behavior: "smooth", block: "nearest" })


    }

    observeClick() {
        this.arrowRight.addEventListener("click", () => {
            // add direction left and right!
            this.clickNext();
        });

        this.arrowLeft.addEventListener("click", () => {
            this.clickPrevious();

        })
    }
}

class ScrollDot {
    constructor(childElement) {
        this.childElement = childElement;
        this.dotElement = this.createDot();
        this.observeClick();
        this.observer = this.#createObserver();
        this.observeElement();
    }

    createDot() {
        const dotElement = document.createElement("div");
        dotElement.classList.add("scroll-dot");
        return dotElement;
    }

    observeClick() {
        this.dotElement.addEventListener("click", () => {
            this.childElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
        })
    }

    #createObserver() {

        let options = {
            root: this.childElement.parentElement,
            rootMargin: "0px",
            threshold: .5,
        };

        const observer = new IntersectionObserver(entry => {
            if (entry[0].isIntersecting) {
                this.dotElement.classList.add("active");
            } else {
                this.dotElement.classList.remove("active");
            }
        }, options);

        return observer;
    }

    observeElement() {
        this.observer.observe(this.childElement);
    }

    unobserveElement() {
        this.observer.unobserve(this.ChildElement);
    }
}

class ScrollContainer {
    constructor(gridElement) {
        this.gridElement = gridElement;
        this.scrollItems = this.gridElement.children;
        this.arrows = this.createArrows();
        this.scrollBox = this.createScrollBox();
        this.dots = this.createDots();
        this.appendArrows();
        this.appendScrollBox();
        // this.observeDots();
    }

    // creates arrows for traversing through the scrollBox; 
    createArrows() {
        const arrows = new scrollArrows(this.gridElement);
        return [arrows.arrowLeft, arrows.arrowRight];
    }

    appendArrows() {
        this.gridElement.parentNode.appendChild(this.arrows[0]);
        this.gridElement.parentNode.appendChild(this.arrows[1]);
    }

    createScrollBox() {
        const scrollBox = document.createElement("div");
        scrollBox.classList.add("scroll-box");
        return scrollBox;
    }

    // creates dots to append to scrollBox 
    createDots() {
        const dots = [];
        for (let i = 0; i < this.scrollItems.length; i++) {
            const dot = new ScrollDot(this.scrollItems[i]);
            dots.push(dot);
        }

        // first dot is active;
        return dots;
    }

    // fill scrollBox with scrollDots
    appendScrollBox() {
        this.scrollBox.innerHTML = "";
        for (const dot of this.dots) {
            this.scrollBox.appendChild(dot.dotElement);
        }

        // add scrollbox below container
        this.gridElement.insertAdjacentElement("afterend", this.scrollBox);
    }
}

const test = document.querySelector(".career-grid");
const testcontainer = new ScrollContainer(test);
const testarows = new scrollArrows(test);

const smartphone_screen = window.matchMedia("(min-width: 768px)");
smartphone_screen.addEventListener("change", (event) => {
    if (event.matches) {
        scroll_box.style.display = "none";
    } else {
        scroll_box.style.display = "inline-block";
    }
})

// observe elements for fade-in
observeIntersection("download-cv", "test", "0px");
observeIntersection("expand", "expandBars", "0px");
observeIntersection("fade-in", "fadeIn", "0px");
observeIntersection("fade-in-left", "fadeInLeft", "-100px");


// select needed DOM elements
const startImage = document.querySelector("#picture-me");
const startImageMe = document.querySelector("#picture-me");
const bgImage = document.querySelector("#start-bg");
const startPage = document.querySelector(".start-page");
const startText = document.querySelector(".start-text");
var scrollSpeedImg = .5;

/*initialize opacity value for the background*/
var scrollPos = startPage.scrollTop;
var bgOpacity = .4;
startImage.style.setProperty('--opac', Math.max(bgOpacity, .4));

const text0 = document.getElementById("text-0");
const text1 = document.getElementById("text-1");
const text2 = document.getElementById("text-2");

textArray = Array.from([text0, text1, text2])

const setBgOpacity2 = function () {
    scrollPos = window.scrollY;
    bgOpacity = window.scrollY / window.innerHeight;
    bgImage.style.setProperty('--opac', Math.max(bgOpacity, .3));
}

window.addEventListener("scroll", setBgOpacity2);

var ImageScroll = function () {
    startImage.style.transform = `translateY(-${window.scrollY / 2 + "px"})`
    startImage.style.opacity = `${.8 - window.scrollY / window.innerHeight}`;
}

window.addEventListener("scroll", ImageScroll);
function smoothScrollTo(targetElement) {
    const startPosition = window.scrollY;
    const targetPosition = targetElement.offsetTop;
    const distance = targetPosition - startPosition;
    const duration = 500; // Duration in milliseconds

    let startTime = null;

    function animationStep(timestamp) {
        if (!startTime) startTime = timestamp;

        const progress = Math.min((timestamp - startTime) / duration, 1);
        const interpolatedPosition = startPosition + distance * progress;

        window.scrollTo(0, interpolatedPosition);

        if (progress < 1) {
            requestAnimationFrame(animationStep);
        }
    }

    requestAnimationFrame(animationStep);
}

/*------------------------------------------------------------------------------------
Controls smooth scroll
------------------------------------------------------------------------------------*/

const smoothScroll = document.querySelectorAll('.smooth-scroll');

smoothScroll.forEach(elem => {
    elem.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        smoothScrollTo(targetElement);
    });
});

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

// expand Nav Bar on Mobile upon click on Hamb Button
document.querySelector('#hamb-button').addEventListener('click', expandNav);


expandSubNav = function () {

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

// add click event listener to dropdown buttons
for (let i = 0; i < dropDownElems.length; i++) {
    dropDownElems[i].children.item("a").addEventListener('click', expandSubNav);
}

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
