// Function to include the footer.html content into the specified element
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
includeFile(fileName = 'header.html', idName = 'header');
includeFile(fileName = 'social-media.html', idName = 'social-media-bar');



/*

document.addEventListener("DOMContentLoaded", function () {

timeline_container = document.querySelector(".timeline");
timeline_container_width = timeline_container.clientWidth;
timeline_button_right = document.querySelector(".right");
timeline_button_left = document.querySelector(".left");
timeline_element = document.querySelectorAll(".timeline-text");


is_visible_in_parent = function (element) {
    is_visible = element.offsetLeft + element.clientWidth - timeline_container.scrollLeft <= timeline_container_width;
    return is_visible;
}

const start_index = Array.from(timeline_element).findIndex(item => !is_visible_in_parent(item));
timeline_button_left.style.visibility = "hidden";
let index = start_index;

console.log("first_index_determined: " + index);

timeline_button_right.addEventListener("click", function () {
    if (index < timeline_element.length) {
        timeline_button_left.style.visibility = "visible";
        timeline_element[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "end" })
        console.log(index);
        index += 1;
    } else {
        timeline_button_right.style.visibility = "hidden";
        console.log("finished scrolling right");
        console.log(index);
    }
});
console.log(index);

timeline_button_left.addEventListener("click", function () {
    if (index <= timeline_element.length && index >= start_index + 1) {
        timeline_button_right.style.visibility = "visible";
        timeline_element[index - 2].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "end" })
        console.log(index);
        index -= 1;
    } else {
        timeline_button_left.style.visibility = "hidden";
        console.log("finished scrolling left");
        console.log(index);
    }
});

console.log(index);


document.addEventListener("scroll", function () {
const yScroll = window.scrollY;
const windowHeight = window.innerHeight;
const opac = yScroll / windowHeight;
document.body.style.setProperty('--scroll', 1 - opac)
})

});
*/
/** */

function createAndAddCircles() {

    /*add box below for dot elements*/
    document.querySelector(".career").insertAdjacentHTML('afterend', '<div class="scroll-box"></div>');
    const scroll_element = document.querySelectorAll(".timeline-text");

    /*creates a circle element*/
    function createScrollDot(targetIndex) {
        const scroll_dot = document.createElement('div');
        scroll_dot.classList.add('scroll-dot');
        scroll_dot.setAttribute('data-target', targetIndex);
        return scroll_dot;
    }

    /*adds the required number of circles to the document*/
    for (let i = 0; i < scroll_element.length; i++) {
        const scroll_box = document.querySelector(".scroll-box")
        const scroll_dot = createScrollDot(i);
        scroll_box.appendChild(scroll_dot);
    }
}

function visibleArea(element, threshold) {
    const elemPos = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    console.log("window width: " + windowWidth);
    const offsetLeft = elemPos.left;
    console.log("offset left: " + offsetLeft);
    const offsetRight = elemPos.right;
    console.log("offset right: " + offsetRight);

    const visibleArea = Math.min(offsetRight, windowWidth) - Math.min(Math.max(0, offsetLeft), windowWidth);
    console.log("visible area: " + visibleArea);
    return ((visibleArea / windowWidth) >= threshold);
}

document.addEventListener("DOMContentLoaded", function () {

    createAndAddCircles();

    let scroll_dot = document.querySelectorAll(".scroll-dot");
    const scroll_element = document.querySelectorAll(".timeline-text");
    /*check which element is fully visible on the screen
    if left and right are both between 0 and window.inner-width!*/


    scroll_dot[0].classList.add('active');

    window.addEventListener("keydown", function () {
        console.log("key-pressed");
        this.setTimeout(function () {
            let index = Array.from(scroll_element).findIndex(element => visibleArea(element, .5));

            if (index !== -1 && index < scroll_element.length) {
                scroll_dot.forEach(dot => dot.classList.remove('active'));
                scroll_dot[index].classList.add('active');
                console.log(index);
            }
        }, 300)

    });

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

    function observeIntersection(className, addClass, rootMargin, onlyOnce = false) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const intersecting = entry.isIntersecting;
                const topOffset = entry.boundingClientRect.top;

                /*animation is only added if element enters the screen from the bottom (ie. user scrolls up)*/
                if (intersecting && topOffset > 0) {
                    entry.target.classList.add(addClass);

                    /*animation class is only removed if element leaves screen to the bottom (ie. user scrolls up)*/
                } else if (!intersecting && topOffset > 0) {
                    entry.target.classList.remove(addClass);
                }
            });
        }, { threshold: 0, rootMargin: rootMargin });

        const elements = document.querySelectorAll(`.${className}`);
        elements.forEach(element => observer.observe(element));

        if (onlyOnce) {
            observer.unobserve(element);
        }
        // Start observing each element
    }

    // Example usage:
    observeIntersection("download-cv", "test", "0px");
    observeIntersection("expand", "expandBars", "0px");
    observeIntersection("fade-in", "fadeIn", "0px");
});

