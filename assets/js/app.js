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
includeFile(fileName = '/header.html', idName = 'header');
includeFile(fileName = '/social-media.html', idName = 'social-media-bar');


/* script from here: 
https://codepen.io/dudleystorey/pen/RRwryd
to fade background !!!

also need something to fade elements and pictures
*/

document.addEventListener("DOMContentLoaded", function () {

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const intersecting = entry.isIntersecting;
            entry.target.style.transform = intersecting ? "translateY(0px)" : "translateY(100px)";
        });
    },
        { threshold: 0, rootMargin: "0px" }
    );

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

});

// Separate the function declaration
function setBackgroundOpacity(opacity) {
    document.querySelector(".landing-page").style.backgroundImage = `linear-gradient(to bottom, rgba(000, 000, 000, ${opacity}), rgba(000, 000, 000, ${opacity})),
    url('/assets/images/website_backround.jpg')`;
}

document.addEventListener("scroll", function () {
    const yScroll = window.scrollY;
    const windowHeight = window.innerHeight;
    const opac = yScroll / windowHeight;

    // Call the setBackgroundOpacity() function with the calculated opacity
    setBackgroundOpacity(opac);
});

/*fade out background picture*/

/*with classList.add() and classList.remove() we can add or remove a class based on the apparance of the*/

console.log(document.getElementById("about-page"))
console.log(100 + 100)

/* --> all elements shold fade out on the screen -> If the bottom of the elemnt is at the very top, opacity shoudl be at X). 
Same for images etc.. But they shoudl aso fadein when they coome into the viewport!

also fade out intro image!
/*may also want window.innterHeight --> To calculate the offset to the top of the window*/
