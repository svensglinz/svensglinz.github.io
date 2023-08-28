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
const bgImage = document.querySelector(".start-image");
const startPage = document.querySelector(".start-page");
const startText = document.querySelector(".start-text");
var scrollSpeedImg = .5;

/*initialize opacity value for the background*/
var scrollPos = startPage.scrollTop;
var bgOpacity = .4;
startImage.style.setProperty('--opac', Math.max(bgOpacity, .4));


// get text elements
const text0 = document.getElementById("text-0");
const text1 = document.getElementById("text-1");
const text2 = document.getElementById("text-2");
textArray = Array.from([text0, text1, text2])

// set top property for sticky position
text0.style.top = "20vh";
text1.style.top = `calc(20vh + ${text0.clientHeight + 20 + "px"})`
text2.style.top = `calc(20vh + ${text0.clientHeight + text1.clientHeight + 40 + "px"})`

// set bottom margin for non-overlapping sticky position
text0.style.marginBottom = text1.clientHeight + text2.clientHeight + 40 + "px";
text1.style.marginBottom = text2.clientHeight + 20 + "px";

// set height of start container after effect 
startPage.style.height = `calc(${text2.style.top} + ${text2.clientHeight + "px"})`

text1.style.marginTop = `calc(100vh - ${text0.style.top} - ${text0.style.marginBottom})`;
text2.style.marginTop = `calc(100vh - ${text1.style.top} - ${text1.style.marginBottom})`;
text2.style.marginBottom = `calc(${text2.style.marginTop} - ${text1.clientHeight + "px"})`;

// set opacity of fixed background while scorlling within start section
const setBgOpacity = function () {
    scrollPos = startPage.scrollTop;
    bgOpacity = startPage.scrollTop / window.innerHeight;
    bgImage.style.setProperty('--opac', Math.max(bgOpacity, .3));
}

// set opacity of fixed background while scrolling main window
const setBgOpacity2 = function () {
    scrollPos = window.scrollY;
    bgOpacity = window.scrollY / window.innerHeight;

    bgImage.style.setProperty('--opac', Math.max(bgOpacity, .3));
}

// control fade-in of texts and fade-out of start-picture
const scrollHandler = function () {

    scrollPos = startPage.scrollTop;
    // slowly fade out Start Image

    startImage.style.transform = `translateY(${-scrollPos * scrollSpeedImg}px)`;
    startImage.style.opacity = 1 - (scrollPos / (startImage.clientHeight / scrollSpeedImg));

    if (startPage.scrollTop == Math.round((startPage.scrollHeight - startPage.clientHeight))) {

        startPage.style.overflow = "hidden";

        document.documentElement.style.overflow = "visible";

        // also make scrollbar invisible!
        document.removeEventListener("scroll", scrollHandler);
        document.removeEventListener("touchmove", scrollHandler);

    }
}

// check how to initiatel class element
let startPageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

        if (!entry.isIntersecting) {
            document.documentElement.style.overflow = "visible";
            startPage.style.overflow = "hidden";
            startImage.style.transform = "translateY(0px)";
            startImage.style.opacity = 1;
            textArray.forEach((text) => {
                text.style.position = "static";
                text.style.marginTop = "0";
                text.style.marginBottom = "20px";

            })
            startPageObserver.unobserve(entry.target);
            window.addEventListener("scroll", setBgOpacity2);

        }
    })
})

const themeToggle = document.querySelector(".theme-toggle");
const sunToggle = document.getElementById("sun");
const moonToggle = document.getElementById("moon");

var toggleHandler = function () {
    if (sunToggle.classList.contains("active")) {
        moonToggle.classList.add("active");
        sunToggle.classList.remove("active");
    } else {
        moonToggle.classList.remove("active");
        sunToggle.classList.add("active");
    }
}

sunToggle.addEventListener("click", toggleHandler);
moonToggle.addEventListener("click", toggleHandler);

startPageObserver.observe(startPage);
startPage.addEventListener('scroll', scrollHandler);
startPage.addEventListener('touchmove', scrollHandler);
startPage.addEventListener("scroll", setBgOpacity);

// document.documentElement.style.overflow = "hidden";

// set this at the beginning --> makes it possible to scroll ! only once the full scroll is done, make element responsive
// set overflow to 0 in the main element!
// set height of main element to 100vh! and overflow to visible in the beginning!

// the back container cannot be scrolled BUT the container in front will be scrollable!!!


function smoothScrollTo(targetElement) {
    const startPosition = window.scrollY;
    const targetPosition = targetElement.offsetTop;
    const distance = targetPosition - startPosition;
    const duration = 300; // Duration in milliseconds

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