//  add data-rank="pfc" or the like
//  get and upload all patches
//  fix timer start
//  switch timer to count up instead of down

class AudioController {
    constructor(){
        this.bgMusic = new Audio('assets/audio/witchTime.wav');
        this.flipSound = new Audio('assets/audio/pageTurn.wav');
        this.matchSound = new Audio('assets/audio/brightBell.wav');
        this.victorySound = new Audio('assets/audio/steelDrum.wav');
        this.gameOverSound = new Audio('assets/audio/darkBell.wav')
        this.bgMusic.volume = 0.3;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory(){
        this.victorySound.play();
    }
    gameOver(){
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(cards){
        this.cardsArray = cards;
        this.totalClicks = 0;
        this.matchedCards = [];
        this.timeCount = 0;
        this.timeDisplayString = "000";
        this.timer = document.getElementById('time-countup');
        this.matchCount = document.getElementById('match-count')
        // below is the "flip count" ticker
        this.flipCount = document.getElementById('flips');
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeCount = 0;
        this.matchedCards = [];
        this.busy = true;

        // give a half second timeout after calling the functions
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countdown = this.startCountdown();
            this.busy = false ;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeDisplayString;
        this.flipCount.innerText = this.totalClicks;
    }

    hideCards(){
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card) {
        if(this.canFlipCard(card)){
            this.audioController.flip();
            this.totalClicks++;
            this.flipCount.innerText = this.totalClicks;
            // add the visible class to the card you flip
            card.classList.add('visible');
        }
        if(this.cardToCheck)
            this.checkForCardMatch(card);
        else
        this.cardToCheck = card;
    }
    checkForCardMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            // if the cards match, call the function that pushed them to the arr
            this.cardMatchToArr(card, this.cardToCheck);
        else
        this.cardMismatch(Card);

        this.cardToCheck = card;
    }
    cardMatchToArr(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        this.matchCount += 1
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card){
        this.busy=true;
        setTimeout(() =>{
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy=false;
        }, 1000);
    }
    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }

    threeDigitDisplay(num){
        let stringyNum = num.toString();
        let displayNum = "000";
        if (stringyNum.length == 1){
            
            displayNum = ("00" + stringyNum)
            console.log('single digit triggered...')
            console.log(displayNum)
            return displayNum
        } else if(stringyNum.length == 2){
            console.log('dub digit triggered...')
            displayNum = ("0" + stringyNum)
            return displayNum
        } else {
            console.log('none above triggered...')
            return num
        }
    }

    // countdown timer functionality, drop every 1000ms
    startCountdown(){
        return setInterval(() => {
            // add 1 turn to str, pad zeroes
            this.timeCount ++;
            this.timeDisplayString = this.threeDigitDisplay(this.timeCount);
            this.timer.innerText = this.timeDisplayString;
            if(this.timeCount === 300){
                this.gameOver};
        }, 1000);
    }

    gameOver(){
        clearInterval(this.countdown);
        this.audioController.gameOver();
        // another way to give a class to a thing
        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() {
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }
    shuffleCards(){
        for(let i = this.cardsArray.length -1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i-1))
            // take an item and shuffle it with a random index generated up to the len of arr
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    canFlipCard(card) {
        return(!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck)
    }
}

if(document.readyState === 'loading') {
    //  wait until the DOM loads, then call function ready()
        document.addEventListener('DOMContentLoaded', ready())
    } else {
        ready();
    }

    
function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(cards);

    // needs initial call to start counting up
    game.startCountdown(0)

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}