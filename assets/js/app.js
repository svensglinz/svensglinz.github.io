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

    /*
    const div = document.getElementById('myDiv');

    div.addEventListener('wheel', (e) => {
        // Check if the user is scrolling vertically
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            // Adjust the scrollLeft property based on the vertical scroll direction
            div.scrollLeft += e.deltaY;
            // Prevent the default vertical scrolling behavior
            e.preventDefault();
        }
    });
*/
    /* prevent default scrolling when the div comes into view! */
    /*
        const div = document.getElementById('myDiv');
        div.addEventListener('wheel', (e) => {
            // Check if the user is scrolling vertically
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                // Adjust the scrollLeft property based on the vertical scroll direction
                div.scrollLeft += e.deltaY;
                // Prevent the default vertical scrolling behavior
                e.preventDefault();
            }
        });
    */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const intersecting = entry.isIntersecting;
            entry.target.style.opacity = intersecting ? "1" : "0";
            entry.target.style.transform = intersecting ? "translateY(0px)" : "translateY(100px)";
        });
    },
        { threshold: 0, rootMargin: "-50px" }
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


    document.addEventListener("scroll", function () {
        /*for background opacity*/
        const yScroll = window.scrollY;
        const windowHeight = window.innerHeight;
        const opac = yScroll / windowHeight;
        document.body.style.setProperty('--scroll', opac)
    })

});



/* --> all elements shold fade out on the screen -> If the bottom of the elemnt is at the very top, opacity shoudl be at X). 
Same for images etc.. But they shoudl aso fadein when they coome into the viewport!

also fade out intro image!
/*may also want window.innterHeight --> To calculate the offset to the top of the window*/

onLoadFunction = function () {
    document.body.style.opacity = '1';
    document.querySelectorAll('.move-in-on-load').forEach(element => {
        element.style.transform = 'translateY(0)';
    })

}

window.onload = onLoadFunction;

