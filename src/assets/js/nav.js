
// switch theme from dark to light
const themeToggler = document.querySelector('.theme');
const icon = document.querySelector('.theme img');

// initial setting of the theme
if (window.localStorage.getItem('dark') === '0'){
    document.querySelector('body').classList.add('theme_light');
    icon.src = "/src/assets/images/moon_icon.svg"
}

function switchTheme(){
    const main = document.querySelector('body');
    let mode = window.localStorage.getItem('dark');
    if (mode == null || mode === '1'){
        main.classList.add('theme_light');
        window.localStorage.setItem('dark', '0');
        icon.src = "/src/assets/images/moon_icon.svg"
    }
    else {
        window.localStorage.setItem('dark', '1');
        main.classList.remove('theme_light');
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