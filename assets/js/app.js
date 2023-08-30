/*****************************************************************************************
Define Functions
*****************************************************************************************/

Array.prototype.findAllOccurences = function (find) {
    const indexArray = [];
    this.forEach((element, index) => {
        if (element == find) {
            indexArray.push(index);
        }
        return indexArray;
    })
}

// Function to include a file with the name FileName content into an element with id idName
function includeFile(fileName, idName) {
    fetch(fileName)
        .then(response => response.text())
        .then(data => {
            // Replace the content of the placeholder with the content of footer.html
            document.getElementById(idName).innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching' + fileName, error);
        });
}


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


// Call the function to include the header on each page
includeFile(fileName = '/header.html', idName = 'header');
includeFile(fileName = '/social-media.html', idName = 'social-media-bar');


// Functions to control expansion of Navigation Bar
expandNav = function () {

    // remove clas active from all sub dropdown menus
    const dropdownElems = document.querySelector(".nav-bar").querySelectorAll(".dropdown");

    for (let i = 0; i < dropdownElems.length; i++) {
        dropdownElems[i].classList.remove("active");
    }

    const elem = document.querySelector(".hamb");
    if (elem.classList.contains("active")) {
        elem.classList.remove("active");
    } else {
        elem.classList.add("active");
    }
}


headerFun = function () {
    const dropDownElem = document.querySelector(".nav-bar").querySelectorAll(".dropdown");

    expandSubNav = function () {
        if (this.parentElement.classList.contains("active")) {
            // close all subsequent active lists
            this.parentElement.classList.remove("active");
            const allLists = this.parentElement.querySelectorAll(".dropdown");
            for (let i = 0; i < allLists.length; i++) {
                allLists[i].classList.remove("active");
            }
        } else {
            // add active only to clicked list
            this.parentElement.classList.add("active");
        }
    }

    // add click event listener to dropdown buttons
    for (let i = 0; i < dropDownElem.length; i++) {
        dropDownElem[i].children.item("a").addEventListener("click", expandSubNav);
    }
}

// NAVBAR MENU
setTimeout(
    headerFun,
    1000
)



// select needed DOM elements
const startImage = document.querySelector(".test-picture");
const startImageMe = document.querySelector(".start-picture");
const bgImage = document.querySelector(".start-image");
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

var textFadeIn = function () {
    ratio = window.scrollY / window.innerHeight;
    text1.style.opacity = 0;
    text2.style.opacity = 0;
    text1.style.transform = "scale(.5)";
    text2.style.transform = "scale(.5)";
    //startImageMe.style.position = "sticky";

    console.log("test");
    if (ratio >= .05) {
        text1.style.opacity = 1;
        text1.style.transform = "scale(1)";

    } if (ratio >= .10) {
        text2.style.opacity = 1;
        text2.style.transform = "scale(1)";
        //startImageMe.style.position = "relative";
        //startImageMe.style.top = "var(--nav-bar-height)";
    }
}

window.addEventListener("scroll", textFadeIn);

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

document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.smooth-scroll');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            smoothScrollTo(targetElement);
        });
    });
});

const typeWriterElem = document.querySelectorAll(".section-title");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var typeWriter = async function (elem) {
    const text = elem.textContent; // Use textContent instead of innerHTML
    elem.textContent = ''; // Clear the element's content
    let i = 0;

    while (i < text.length) {
        await sleep(80);
        elem.innerHTML = text.substring(0, i + 1) + '<span class="blink">|</span>'; // Use textContent here too
        i++;
    }
}

const typeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            typeWriter(entry.target);
            typeObserver.unobserve(entry.target);
        }
    })
});

Array.from(typeWriterElem).forEach(elem => {
    typeObserver.observe(elem);
});


// initiate light-theme at beginning
const params = {
    container: document.getElementById('test'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: "https://lottie.host/41e5cfc4-48d4-46b2-9bc7-f371670bb97b/wIGpgIMrmX.json",
}

const paramsEduDark = {
    container: document.getElementById('edu_pic'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: "https://lottie.host/ce5e2854-4bab-4f34-ba4a-249711da8dc1/qT0jKeIlZc.json",
}

const paramsEduBright = {
    container: document.getElementById('edu_pic'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: "https://lottie.host/f8070cae-2182-423f-95ce-1c0155f8b014/pcV0jPNetL.json",
}

const EduObserver = new IntersectionObserver(elements => {
    elements.forEach(elem => {
        if (elem.isIntersecting) {
            animEdu.play();
        } else {
            animEdu.stop();
        }
    })
})

var animEdu = bodymovin.loadAnimation(paramsEduDark);
const anim = bodymovin.loadAnimation(params);
EduObserver.observe(document.getElementById('edu_pic'));

anim.setSpeed(5);
const animContainer = document.getElementById('test');

function toNight() {
    document.documentElement.classList.add("light-theme");
    document.documentElement.classList.remove("dark-theme");
    anim.playSegments([0, 60], true);
    animEdu.destroy();
    animEdu = bodymovin.loadAnimation(paramsEduDark);
    animEdu.play();

}

function toDay() {
    document.documentElement.classList.remove("light-theme");
    document.documentElement.classList.add("dark-theme");
    anim.playSegments([60, 120], true);
    animEdu.destroy();
    animEdu = bodymovin.loadAnimation(paramsEduBright);
    animEdu.play();

}

let clickCount = 0;
var handleDayNight = function () {
    clickCount = (clickCount + 1) % 2;
    if (clickCount == 1) {
        toDay();
    } else {
        toNight();
    }
}

animContainer.addEventListener("click", handleDayNight);

// solve via promise to make bullet proof! 
setTimeout(toNight, 500);

