const cards = document.querySelectorAll('.track-card');

let currentCharacter = 0;
const speed = 30; /* The speed/duration of the effect in milliseconds */

let currentInterval = null;

cards.forEach(card => {
    card.addEventListener('mouseenter', event => {
        
        const el_cardTitle = event.currentTarget.querySelector('.card-title-text');
        const txt = el_cardTitle.dataset.content;
        currentCharacter = 0;

        el_cardTitle.innerHTML = '';

        currentInterval = setInterval(() => {
            el_cardTitle.innerHTML += txt.charAt(currentCharacter);
            currentCharacter++;

            if (currentCharacter > txt.length) {
                
                clearInterval(currentInterval);
                console.log('clear')
                
            }
        }, speed);
    });

    card.addEventListener('mouseleave', event => {
        if(currentInterval === undefined || currentInterval === null) return;
        clearInterval(currentInterval);
        console.log("exit");

        const el_cardTitle = event.currentTarget.querySelector('.card-title-text');
        el_cardTitle.innerHTML = '';
    });

});