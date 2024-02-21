// navbar box-shadow if scroll position != 0
const nav = document.querySelector('nav');
document.addEventListener('scroll', ()=>{
    if (document.documentElement.scrollTop > 0){
        if (document.querySelector('body').classList.contains('theme_light'))
            nav.style.boxShadow = '0 10px 10px 0 rgba(9,5,29,.05)';
        else
            nav.style.boxShadow = '0 10px 10px 0 rgba(200,180,210,.05)';
    } else {
        nav.style.boxShadow =  'none';
    }
})



