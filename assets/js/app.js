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
/*includeFile(fileName = '/footer.html', idName = 'footer'); */
includeFile(fileName = 'header.html', idName = 'header');
includeFile(fileName = 'social-media.html', idName = 'social-media-bar');


/* script from here: 
https://codepen.io/dudleystorey/pen/RRwryd
to fade background !!!

also need something to fade elements and pictures
*/

document.addEventListener("DOMContentLoaded", function () {

    /*scrollable timeline with buttons*/
    timeline_container = document.querySelector(".timeline");
    timeline_container_width = timeline_container.clientWidth;
    timeline_button_right = document.querySelector(".right");
    timeline_button_left = document.querySelector(".left");
    timeline_element = document.querySelectorAll(".timeline-text");

    /* checks if item is visible from the right*/
    is_visible_in_parent = function (element) {
        is_visible = element.offsetLeft + element.clientWidth - timeline_container.scrollLeft <= timeline_container_width;
        return is_visible;
    }

    const start_index = Array.from(timeline_element).findIndex(item => !is_visible_in_parent(item));
    timeline_button_left.style.visibility = "hidden";
    let index = start_index;

    console.log("first_index_determined: " + index);
    /*get index of first item that is not visible from the right anymore*/

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

    /* observer for rectangles*/
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const intersecting = entry.isIntersecting;
            entry.target.style.opacity = intersecting ? "1" : "0";
            entry.target.style.transform = intersecting ? "translateY(0px)" : "translateY(100px)";
        });
    },
        { threshold: 0, rootMargin: "-50px" }
    );

    /*
    /* problems: effect only once ? at least only if scrolling takes place from the top, not from the bottom!!! (eg. see the fade-in boxes!)*/
    const observer_plane = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const intersecting = entry.isIntersecting;
            if (intersecting) {
                entry.target.style.visibility = "visible";
                entry.target.style.opacity = "0.3";
                entry.target.style.transform = "scale(1) translateX(0px) translateY(0px)";
            } else {
                entry.target.style.visibility = "hidden";
                entry.target.style.opacity = "0";
                entry.target.style.transform = "scale(1.5) translateX(-500px) translateY(500px)";
            }
        });
    }, { threshold: 1, rootMargin: "500px" });

    /*get all elements*/
    const elements = document.querySelectorAll(".fade-in");

    for (let i = 0; i < elements.length; i++) {
        const aboutPageElement = elements[i];

        if (aboutPageElement) {
            observer.observe(aboutPageElement);
        } else {
            console.warn("Element with id 'about-page' not found.");
        }
    }



    document.addEventListener("scroll", function () {
        /*for background opacity*/
        const yScroll = window.scrollY;
        const windowHeight = window.innerHeight;
        const opac = yScroll / windowHeight;
        document.body.style.setProperty('--scroll', 1 - opac)
    })

});


/* 
ONE FUNCTION FOR THE INTERSECTION OBSERVER WHICH ADDS A CLASS TO AN ELEMENT WHICH CAN THEN TRIGGER AN ANIMATION
function observeRectangles(className, addClass) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const intersecting = entry.isIntersecting;
            entry.target.style.opacity = intersecting ? "1" : "0";
            entry.target.style.transform = intersecting ? "translateY(0px)" : "translateY(100px)";
            
            if (addClass && intersecting) {
                entry.target.classList.add(addClass);
            } else if (addClass && !intersecting) {
                entry.target.classList.remove(addClass);
            }
        });
    },
    { threshold: 0, rootMargin: "-50px" });

    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => observer.observe(element));
}

// Example usage:
observeRectangles("rectangle", "fade-in");
*/