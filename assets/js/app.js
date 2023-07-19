// Function to include the header.html content into the specified element
function includeHeader() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            // Replace the content of the placeholder with the content of footer.html
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching footer.html:', error);
        });
}

// Call the function to include the header on each page
includeHeader();