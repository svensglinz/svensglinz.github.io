const socialMedia = document.querySelector('.social_media');
const greeting = document.querySelector('.text .greeting');

document.querySelector('.text .more').style.marginLeft = greeting.offsetLeft + 'px';
socialMedia.style.marginLeft = (greeting.clientWidth - socialMedia.clientWidth) / 2 + 'px';


