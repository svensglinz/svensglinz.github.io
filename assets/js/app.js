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
includeFile(fileName = 'footer.html', idName = 'footer-placeholder');
includeFile(fileName = 'header.html', idName = 'header-placeholder');
includeFile(fileName = 'social-media.html', idName = 'social-media-placeholder');