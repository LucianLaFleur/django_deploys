// Note: the "shuffle" used here is NOT imported from rand module, but defined below
// find algo for shufflinf at shuffleCards()

class AudioController {
    constructor(){
        this.bgMusic = new Audio('assets/audio/witchTime.wav');
        // this.flipSound = new Audio('assets/audio/pageTurn.wav');
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
        this.flipSound = new Audio('assets/audio/scrape1.wav');
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
        // below is the "flip count" ticker; note, this targets the area, need to use inner text to assign int
        this.flipCount = document.getElementById('flips');
        // match counter to track progress, also just targets, need to target inner text to assign
        this.matchCount = 0;
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeCount = 0;
        this.matchedCards = [];
        this.busy = true;
        
        this.shuffleCards(this.cardsArray);
        // give a half second timeout after calling the functions
        setTimeout(() => {
            // background music is turned off currently
            // this.audioController.startMusic();
            this.countup = this.startCountup();
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

    waitASec() {
        this.busy = true;
        // console.log('busy now..')
        setTimeout(() => {
            this.busy = false;
            // console.log('no longer busy')
        }, 300)
    }

    flipCard(card) { 
        if(this.canFlipCard(card)){
            this.audioController.flip();
            this.totalClicks++;
            this.flipCount.innerText = this.totalClicks;
            // add the visible class to the card you flip
            card.classList.add('visible');

            if(this.cardToCheck){
                this.checkForCardMatch(card);
            }else{
                this.cardToCheck = card;
            }
        }
        this.waitASec()
    }
    checkForCardMatch(card){
        if (!this.busy && 
            (this.idStr(card) !== this.idStr(this.cardToCheck))){
            if  ((this.getCardTag(card) === this.getCardTag(this.cardToCheck))){
                // if the cards match, call the function that pushed them to the arr
                this.cardMatchToArr(card, this.cardToCheck);
            }else{
                this.cardMismatch(card, this.cardToCheck);
            }
            this.cardToCheck = null;
        }
    };
    cardMatchToArr(card1, card2) {
        this.busy=true;
        // increase the match ticker by 1
        this.matchCount += 1;
        console.log(this.matchCount);
        document.getElementById('match-count').innerText = this.matchCount;
        // add matched cards to array tracking and make them permanently face-up
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.classList.add('visible');
        card2.classList.add('visible');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
        this.busy=true;
        setTimeout(() =>{
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy=false;
        }, 1000);
    }
    getCardTag(card) {
        // get the string representation of the rank from the html id via string slicing
        // console.log(card.getElementsByClassName('card-value')[0].id.slice(0, -3));
        return (card.getElementsByClassName('card-value')[0].id.slice(0, -3))
    }
    idStr(card){
        // get the full string ending to the img id
        // console.log(card.getElementsByClassName('card-value')[0].id.slice(0));
        return (card.getElementsByClassName('card-value')[0].id.slice(0));
    }

    threeDigitDisplay(num){
        let stringyNum = num.toString();
        let displayNum = "000";
        if (stringyNum.length == 1){
            
            displayNum = ("00" + stringyNum)
            // console.log('single digit triggered...')
            // console.log(displayNum)
            return displayNum
        } else if(stringyNum.length == 2){
            // console.log('dub digit triggered...')
            displayNum = ("0" + stringyNum)
            return displayNum
        } else {
            // console.log('none above triggered...')
            return num
        }
    }

    // countup timer functionality, up one every 1000ms
    startCountup(){
        return setInterval(() => {
            this.timeCount ++;
            this.timeDisplayString = this.threeDigitDisplay(this.timeCount);
            this.timer.innerText = this.timeDisplayString;
            if(this.timeCount === 300){
                this.gameOver};
        }, 1000);
    }

    gameOver(){
        clearInterval(this.countup);
        this.audioController.gameOver();
        // another way to give a class to a thing
        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() {
        clearInterval(this.countup);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }
    shuffleCards(){
        for(let i = this.cardsArray.length -1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i+1))
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
//  Warning, this depends on dismissing the initial overlay to trigger the game start...

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

// /// audio handling for multi channels

var channel_max = 5;										
    // ^^ number of channels
	audiochannels = new Array();
	for (a=0;a<channel_max;a++) {									
    // ^^ prepare the channels
		audiochannels[a] = new Array();
		audiochannels[a]['channel'] = new Audio();						
    // ^^ create a new audio object
		audiochannels[a]['finished'] = -1;							
    // ^^ expected end time for this channel
	}
