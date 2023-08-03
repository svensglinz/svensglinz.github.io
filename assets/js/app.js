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

// Call the function to include the header on each page
includeFile(fileName = '/header.html', idName = 'header');
includeFile(fileName = '/social-media.html', idName = 'social-media-bar');


// detects the closest non-visible child in a scrollable parent container from left or right
function closestNonVisible(child_class, parent_class, side) {
    // define variables
    const parent_elem = document.querySelector(`.${parent_class}`);
    const children_elem = document.querySelectorAll(`.${child_class}`);
    const children_array = Array.from(children_elem);
    let closestElement;
    if (side == "right") {
        const index = children_array.findIndex(elem => elem.offsetLeft - parent_elem.scrollLeft > parent_elem.clientWidth);
        closestElement = children_array[index];
    } else if (side == "left") {
        const index = children_array.findIndex(elem => elem.offsetLeft + elem.clientWidth >= parent_elem.scrollLeft) - 1;
        closestElement = children_array[index];
    } else {
        console.error("non-recognized value in `side`");
    }

    return (closestElement);
}

// function which observes an element of a specific class and adds a class addClass to it (used for fade-in animations)
function observeIntersection(className, addClass, rootMargin) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const intersecting = entry.isIntersecting;
            const topOffset = entry.boundingClientRect.top;

            //animation is only added if element enters the screen from the bottom (ie. user scrolls up)
            if (intersecting && topOffset > 0) {
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

/*function to create n circles below the career element (where n = # career entries)
circle styling & positioning is done in classes .scroll-box & .scroll-dot*/
function createAndAddCircles() {

    //add box below for dot elements
    document.querySelector(".career").insertAdjacentHTML('afterend', '<div class="scroll-box"></div>');
    const scroll_element = document.querySelectorAll(".timeline-text");

    // creates a circle element
    function createScrollDot(targetIndex) {
        const scroll_dot = document.createElement('div');
        scroll_dot.classList.add('scroll-dot');
        scroll_dot.setAttribute('data-target', targetIndex);
        return scroll_dot;
    }

    //adds the required number of circles to the document
    for (let i = 0; i < scroll_element.length; i++) {
        const scroll_box = document.querySelector(".scroll-box")
        const scroll_dot = createScrollDot(i);
        scroll_box.appendChild(scroll_dot);
    }
}

function visibleArea(element, threshold) {
    const elemPos = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const offsetLeft = elemPos.left;
    const offsetRight = elemPos.right;

    const visibleArea = Math.min(offsetRight, windowWidth) - Math.min(Math.max(0, offsetLeft), windowWidth);

    // 100% of area visible on the screen
    if (offsetLeft > 0 && offsetRight <= windowWidth) {
        return true;
    } else {
        return ((visibleArea / windowWidth) >= threshold);
    }
}

document.addEventListener("DOMContentLoaded", function () {

    // event listeners for scrolling the Jobs timeline
    const timeline = document.querySelector(".timeline");
    const button_left = document.querySelector(".left");
    const button_right = document.querySelector(".right");
    button_left.style.visibility = "hidden";

    // control visibility of click buttons
    let scrollPosition = timeline.scrollLeft;
    timeline.addEventListener("scroll", () => {

        if (timeline.scrollLeft > scrollPosition) {

            let closestElement = closestNonVisible("timeline-text", "timeline", "right");
            button_left.style.visibility = "visible";

            // no non-visible element to the right --> button is removed
            if (!closestElement) {
                button_right.style.visibility = "hidden";
            }

        } else {

            let closestElement = closestNonVisible("timeline-text", "timeline", "left");
            button_right.style.visibility = "visible";

            // no non-visible element to the left --> button is removed
            if (!closestElement) {
                button_left.style.visibility = "hidden";
            }
        }

        // update scroll position
        scrollPosition = timeline.scrollLeft;
    });


    // add event listeners for the buttons (visibility is controlled by the more general scroll listener)
    button_right.addEventListener("click", () => {

        const closestElement = closestNonVisible("timeline-text", "timeline", "right");

        if (closestElement) {
            closestElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "end" });
        }
    });


    button_left.addEventListener("click", () => {

        const closestElement = closestNonVisible("timeline-text", "timeline", "left");

        if (closestElement) {
            closestElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
        }
    });

});


document.addEventListener("DOMContentLoaded", function () {

    // add circles to the page
    createAndAddCircles();

    let scroll_dot = document.querySelectorAll(".scroll-dot");
    const scroll_element = document.querySelectorAll(".timeline-text");

    // first active element
    scroll_dot[0].classList.add('active');
    const timeline = document.querySelector(".timeline");

    let scrollPos = timeline.scrollLeft;
    let visibleElementIndex = 0;

    timefunction = function () {
        console.log("start-function-now");
        if (scrollPos < timeline.scrollLeft) {

            let nextNonVisible = closestNonVisible("timeline-text", "timeline", "right")
            scroll_dot[visibleElementIndex].classList.remove("active");

            if (!nextNonVisible) {
                visibleElementIndex = timeline.childElementCount - 1;
                scroll_dot[visibleElementIndex].classList.add("active");
            } else {
                let visibleElement = nextNonVisible.previousElementSibling;
                visibleElementIndex = Array.from(scroll_element).indexOf(visibleElement);
                scroll_dot[visibleElementIndex].classList.add("active");
            }

        } else {

            let nextNonVisible = closestNonVisible("timeline-text", "timeline", "left")
            scroll_dot[visibleElementIndex].classList.remove("active");

            if (!nextNonVisible) {
                visibleElementIndex = 0;
                scroll_dot[visibleElementIndex].classList.add("active");
            } else {
                let visibleElement = nextNonVisible.nextElementSibling;
                visibleElementIndex = Array.from(scroll_element).indexOf(visibleElement);
                scroll_dot[visibleElementIndex].classList.add("active");
            }
        }

        scrollPos = timeline.scrollLeft;
    }

    function throttle(fn, wait) {
        var time = Date.now();
        return function () {
            if ((time + wait - Date.now()) < 0) {
                fn();
                time = Date.now();
            }
        }
    }

    timeline.addEventListener("scroll", throttle(timefunction, 100));

    const scroll_dots = document.querySelectorAll(".scroll-dot");
    const scroll_elements = document.querySelectorAll(".timeline-text");

    scroll_dots.forEach((dot) => {
        dot.addEventListener("click", function () {
            const targetIndex = parseInt(dot.getAttribute("data-target"));
            if (targetIndex >= 0 && targetIndex < scroll_elements.length) {
                scroll_elements[targetIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
                scroll_dot.forEach(dot => dot.classList.remove('active'));
                scroll_dot[targetIndex].classList.add('active');
                console.log(targetIndex);
            }
        });
    });

    // observe elements for fade-in
    observeIntersection("download-cv", "test", "0px");
    observeIntersection("expand", "expandBars", "0px");
    observeIntersection("fade-in", "fadeIn", "0px");
});

