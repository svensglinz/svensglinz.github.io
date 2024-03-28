function centerSocialMedia(){

    const socialMedia = document.querySelector('.social_media');
    const greeting = document.querySelector('.greeting');
    document.querySelector('.more').style.width = greeting.style.width;

    const initialMargin = socialMedia.style.marginLeft;

    if (window.innerWidth >= 756){
        //document.querySelector('.more').style.marginLeft = greeting.offsetLeft + 'px';
        //socialMedia.style.marginLeft = (greeting.clientWidth - socialMedia.clientWidth) / 2 + 'px';
    } else {
        socialMedia.style.marginLeft = initialMargin;
        //document.querySelector('.more').style.marginLeft =0;
    }
}
//window.addEventListener('resize', () => centerSocialMedia());

const socialMedia = document.querySelector('.social_media');
const greeting = document.querySelector('.greeting');
document.querySelector('.more').style.maxWidth = "min(100vw, greeting.clientWidth - 35 + 'px')";