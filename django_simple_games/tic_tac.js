var resetBtn = document.querySelector("#resetBtn");
var all_squares = document.querySelectorAll("td");
var turnCounter = "xturn"

function clearBoard(){
    for (var i = 0; i < 9; i ++) {
        all_squares[i].textContent = '';
        all_squares[i].style.background = "rgb(73, 15, 95)";
    }
}

// add event listener for clearing board on the button click
resetBtn.addEventListener('click', clearBoard);

// takes in start, end, and increment
function checkSequence(st, en, inc){
    rowTrigger = 0
    for (var i = st; i < en; i += inc) {
        // win trigger is a flag that must become 3 or -3 to win
        if (all_squares[i].textContent == "X"){
            rowTrigger += 1;
        } else if (all_squares[i].textContent == "O"){
            rowTrigger -= 1;
        };
    }
    // This return below will be -3 if O wins, +3 if X wins
    return rowTrigger
}

// check location for top-row, mid-row, and bottom-row cell for diagonal (2 variations possible)
// yes, middle will always be 4; preserved for later expansion, if needed
function checkDiagonal(topr, midr, botr, msg){
    // Check to see if the text content (X or O) matches in diagonals
    if ((all_squares[topr].textContent == all_squares[midr].textContent) && 
        (all_squares[midr].textContent == all_squares[botr].textContent)) {
        if (all_squares[midr].textContent == "X"){
            // message indicates if it's the down-slope or up-slope that wins
            document.getElementById("winMsg").textContent = `X wins on the ${msg} diagonal!`
            return 3
        } else if (all_squares[midr].textContent == "O") {
            document.getElementById("winMsg").textContent = `O wins on the ${msg} diagonal!`
            return -3
        }
    }
}
function checkBothDiagonals(){
    // check upper-left to lower-right diagonal
    checkDiagonal(0,4,8, "downward");
    // check upper-right to lower-left diagonal
    checkDiagonal(2,4,6, "upward");
}

function checkForSecretDiamond(){
    if ((all_squares[1].textContent == "X") && (all_squares[3].textContent == "X") && (all_squares[5].textContent == "X") && (all_squares[7].textContent == "X")){
        document.getElementById("winMsg").textContent = "You found the secret diamond!"
    }
    return "diaWin"
}

// UNTESTED DRAW/ FULL Board CHECKER
// checks if there are any empty squares left on the board (should come after checking rows)
function hasEmptyCells() {
    // scan through all cells, looking at text content for empty spaces
    var empty_spaces = 0
    for (let i = 0; i < 9; i++) {
        if (all_squares[i].textContent == ''){
            // return true if an empty cell is identified
            empty_spaces += 1
        } 
    }
    if (empty_spaces == 0){
        document.getElementById("winMsg").textContent = "It's a draw! The board is filled";
    } else {
        console.log(`${empty_spaces} cells remain`)
    }
}
// WIN CONDITIONS ARE HERE
function checkForWin(){
// Long first-draft of conditionals
    // row1 = checkSequence(0,3,1);
    // if (row1 == 3) {
    //     document.getElementById("winMsg").textContent = 'X wins in row 1!'
    // }
    // else if (row1 == -3){
    //     document.getElementById("winMsg").textContent = 'O wins in row 1!'
    // };
    // row2 = checkSequence(3,6,1);
    // if (row2 == 3) {
    //     document.getElementById("winMsg").textContent = 'X wins in row 2!'
    // }
    // else if (row2 == -3){
    //     document.getElementById("winMsg").textContent = 'O wins in row 2!'
    // };
    // row3 = checkSequence(6,9,1);
    // if (row3 == 3) {
    //     document.getElementById("winMsg").textContent = 'X wins in row 3!'
    // }
    // else if (row3 == -3){
    //     document.getElementById("winMsg").textContent = 'O wins in row 3!'
    // };
    // col1 = checkSequence(0,8,3)
    // if (col1 == 3) {
    //     document.getElementById("winMsg").textContent = 'X wins in column 1!'
    // }
    // else if (col1 == -3){
    //     document.getElementById("winMsg").textContent = 'O wins in column 1!'
    // };
    // col2 = checkSequence(1,9,3)
    // if (col2 == 3) {
    //     document.getElementById("winMsg").textContent = 'X wins in column 2!'
    // }
    // else if (col2 == -3){
    //     document.getElementById("winMsg").textContent = 'O wins in column 2!'
    // };
    // col3 = checkSequence(2,10,3)
    // if (col3 == 3) {
    //     document.getElementById("winMsg").textContent = 'X wins in column 3!'
    // }
    // else if (col3 == -3){
    //     document.getElementById("winMsg").textContent = 'O wins in column 3!'
    // };

    // secret daimond prioritized over lines
    checkForSecretDiamond()
    
    // Improved line-checking logic
    sequencesToCheck= [[0,3,1, "first row"], [3, 6, 1, "second row"], [6, 9, 1, "third row"], 
    [0, 8, 3, "first column"], [1, 9, 3, "second column"], [2, 9, 3, "third column"]];
    // idx 3 in arr set is the position-related message in a string in each check-array
    // look at all possible win alignments
    for (let i = 0; i < sequencesToCheck.length; i++) {
        curr_arr = sequencesToCheck[i]
        positional_msg = curr_arr[3]
        // Each array contains the start, end, and increment args to be used in checkSequence()
        seq_score = checkSequence(curr_arr[0], curr_arr[1], curr_arr[2]);
        if (seq_score == 3){
            console.log("win detected");
            document.getElementById("winMsg").textContent = `X wins in the ${positional_msg}!`
        } else if (seq_score == -3) {
            console.log("win detected");
            document.getElementById("winMsg").textContent = `O wins in the ${positional_msg}!`
        }
    }
    checkBothDiagonals();
    // After all lines are checked, look for empty cells
    hasEmptyCells();
}

////////////////////////

function clearOnDbl(){
    this.textContent = '';
    this.style.background = "rgb(73, 15, 95)";
};

function toggleSq(){
    if (turnCounter == "xturn"){
        this.textContent = "X";
        this.style.background = "url('./imgs/xdsqVector.png')";
        // place the x in target square then turn to o's turn
        turnCounter = "oturn";
    } else if (turnCounter == "oturn"){
        this.textContent = "O";
        this.style.background = "url('./imgs/oemoji_sq.png')";
        turnCounter = 'xturn';
    };
    checkForWin();
}

//  dummy toggle version, doesn't track turncounters
    // if (this.textContent === ''){
    //     this.textContent = "X";
    // } else if (this.textContent === "X"){
    //     this.textContent = "O";
    // } else if (this.textContent === "O") {
    //     this.textContent = ''
    // };

function lightSquare(){
    this.style.background = "#42f347"
    this.style.color = "black"
}
function dimSquare(){
    if (this.textContent === ''){
        this.style.background = "rgb(73, 15, 95)";
    } else if (this.textContent === "X"){
        this.style.background = "url('./imgs/xdsqVector.png')";
    } else if (this.textContent === "O") {
        this.style.background = "url('./imgs/oemoji_sq.png')";
    };
    this.style.color = "rgba(0,0,0,0)";
}

for (var i = 0; i < 9; i++) {
    all_squares[i].addEventListener('mouseover', lightSquare)
    all_squares[i].addEventListener('mouseout', dimSquare)
    all_squares[i].addEventListener('dblclick', clearOnDbl)
    all_squares[i].addEventListener('click', toggleSq)
}
