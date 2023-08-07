
// change header background color 
const header = document.getElementById("header");
const background = document.querySelector(".background");
const trigger = background.clientHeight;

window.onscroll = function () {
    if (window.scrollY > trigger) {
        header.classList.add("inverted");
        console.log("CLASS added");
    } else {
        header.classList.remove("inverted");
    }
}