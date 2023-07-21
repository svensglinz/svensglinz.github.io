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
includeFile(fileName = '/footer.html', idName = 'footer');
includeFile(fileName = '/header.html', idName = 'header');
includeFile(fileName = '/social-media.html', idName = 'social-media-bar');


/* script from here: 
https://codepen.io/dudleystorey/pen/RRwryd
to fade background !!!

also need something to fade elements and pictures
*/
var nystories = document.querySelector("p").offsetTop;
window.onscroll = function () {
    if (window.pageYOffset > 0) {
        var opac = (window.pageYOffset / nystories);
        console.log(opac);
        document.body.style.background = "linear-gradient(rgba(255, 255, 255, " + opac + "), rgba(255, 255, 255, " + opac + ")), url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/times-square-perspective.jpg) no-repeat";
    }
}