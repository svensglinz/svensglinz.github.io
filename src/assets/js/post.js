
// function to expand element on click


function toggleTOC(){
    const toc = document.querySelector('.toc');
    if (toc.classList.contains('visible'))
        toc.classList.remove('visible');
    else
        toc.classList.add('visible');
}

document.querySelector('.toc h2').addEventListener('click', () => toggleTOC());

