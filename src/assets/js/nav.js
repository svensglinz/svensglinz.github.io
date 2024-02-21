
// switch theme from dark to light
const themeToggler = document.querySelector('.theme');
const icon = document.querySelector('.theme img');

function switchTheme(){
    const main = document.querySelector('body');
    if (main.classList.contains('theme_dark')){
        main.classList.replace('theme_dark', 'theme_light');
        icon.src = "/src/assets/images/moon_icon.svg"
    }
    else {
        main.classList.replace('theme_light', 'theme_dark');
        icon.src = "/src/assets/images/sun_icon.svg"
    }
}
// left offset of greeting as left margin of more!

// navbar box-shadow if scroll position != 0
const nav = document.querySelector('nav');

function observeScroll() {
    if (document.documentElement.scrollTop > 0){
        if (document.querySelector('body').classList.contains('theme_light'))
            nav.style.boxShadow = '0 10px 10px 0 rgba(9,5,29,.05)';
        else
            nav.style.boxShadow = '0 10px 10px 0 rgba(200,180,210,.05)';
    } else {
        nav.style.boxShadow =  'none';
    }
}

themeToggler.addEventListener('click', ()=> switchTheme());
document.addEventListener('scroll', ()=> observeScroll());