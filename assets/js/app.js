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
        console.log(opac)
    })

});


/* --> all elements shold fade out on the screen -> If the bottom of the elemnt is at the very top, opacity shoudl be at X). 
Same for images etc.. But they shoudl aso fadein when they coome into the viewport!

also fade out intro image!
/*may also want window.innterHeight --> To calculate the offset to the top of the window*/

/*
onLoadFunction = function () {
    document.body.style.opacity = '1';
    document.querySelectorAll('.fade-in-on-load').forEach(element => {
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
    })

}

window.onload = onLoadFunction;
*/