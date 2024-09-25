const cards = document.querySelectorAll(".card");
const icons = ['&#9728;', '&#9728;', '&#9729;', '&#9729;', '&#9730;', '&#9730;', '&#9827;', '&#9827;', '&#9733;', '&#9733;', '&#9752;', '&#9752;', '&#9829;', '&#9829;', '&#9830;', '&#9830;'];
let current = []; 
let lockBoard = false;  
const resetButton = document.querySelector('.start-reset');
resetButton.addEventListener('click', reset);
document.body.onload = reset;
function reset() {
    current = [];  
    lockBoard = false;  
    cards.forEach(card => {
        card.classList.remove('flipped');  
    });
    setTimeout(random, 1000);  
}
function shuffle(icons) {
    for (let i = icons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [icons[i], icons[j]] = [icons[j], icons[i]];
    }
    return icons;
}
function random() {
    const shuffled = shuffle([...icons]);
    cards.forEach((card, index) => {
        card.classList.remove('flipped');
        const back = card.querySelector('.back i');
        back.innerHTML = shuffled[index];  
    });
}
cards.forEach(card => {
    card.addEventListener('click', () => {
        if (lockBoard) return;  
        if (current.includes(card)) return;  
        card.classList.add('flipped');  
        current.push(card); 
        if (current.length === 2) {
            verify(); 
        }
    });
});
function verify() {
    const [firstCard, secondCard] = current;
    const icon1 = firstCard.querySelector('.back i').innerHTML;
    const icon2 = secondCard.querySelector('.back i').innerHTML;
    if (icon1 === icon2) {
        current = [];  
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            current = []; 
            lockBoard = false;  
        }, 1000);
    }
}
