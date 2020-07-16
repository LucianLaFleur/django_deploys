var player1 = prompt("P1, enter name for Blue team");
var player1Color = 'rgb(86, 191, 255)';

var player2 = prompt("P2, enter name for Red team");
var player2Color = 'rgb(244, 51, 95)';

var game_on = true;
var table = $('table tr');

var winning_coords = ''

function reportWin(rowNum, colNum){
    // Reports on coordinates, changing bootlex indexing in HTML to standard coord-reading for graphs
    winReport = ` X:${colNum + 1}, Y:${6 - rowNum}`;
    console.log(winReport)
    return winReport
}

// changes the color at coords to "color" arg
function changeColor(rowIndex, colIndex, color){
    // Get the row index of the table you're targeting
    // grab the <td> tag array, and eq into the col idx
    // target the button there, and then target it's css background, and set it to "color"
    return table.eq(rowIndex).find('td').eq(colIndex).find('button').css('background-color', color)
}

// checks what color is at the given coords
function returnColor(rowIndex, colIndex){
    return table.eq(rowIndex).find('td').eq(colIndex).find('button').css('background-color')
}

function checkBottom(colIndex){
    var colorReport = returnColor(5, colIndex);
    // start at 5 to check the bottom-most row first, iteration increments towards 0
    for (var row=5 ; row > -1; row --){
        // in the given index, check the column
        colorReport = returnColor(row, colIndex)
        // looks for first grey button
        if (colorReport === 'rgb(128, 128, 128)'){
            return row
        }
    }
}

function colorMatchCheck(one, two, three, four){
    // checks 4 buttons, makes sure they aren't grey for a false row
    // also, doesn't count for "undefined" coords outside of the table 
    return (one == two && one == three && one == four && 
        one != 'rgb(128, 128, 128)' && one != undefined)
}


// Check for Horizontal Wins
function horizontalWinCheck() {
    // for the 6 rows, check the 4 connected columns to find if there was a win
    for (var row = 0; row < 6; row++) {
      for (var col = 0; col < 4; col++) {
        if (colorMatchCheck(returnColor(row,col), returnColor(row,col+1) ,returnColor(row,col+2), returnColor(row,col+3))) {
          console.log('horiz');
          winning_coords = reportWin(row,col);
          return true;
        }else {
          continue;
        }
      }
    }
  }
  
  // Check for Vertical Wins
  function verticalWinCheck() {
    // check each of the 7 columns for 4 chips consecutive
    for (var col = 0; col < 7; col++) {
      for (var row = 0; row < 3; row++) {
        if (colorMatchCheck(returnColor(row,col), returnColor(row+1,col) ,returnColor(row+2,col), returnColor(row+3,col))) {
          console.log('vertical');
          winning_coords = reportWin(row,col);
          return true;
        }else {
          continue;
        }
      }
    }
  }
  
  // Check for Diagonal Wins
  function diagonalWinCheck() {
    for (var col = 0; col < 5; col++) {
      for (var row = 0; row < 7; row++) {
        //   check for a positive slope connected to target chip
        if (colorMatchCheck(returnColor(row,col), returnColor(row+1,col+1) ,returnColor(row+2,col+2), returnColor(row+3,col+3))) {
          winning_coords = reportWin(row,col);
          return true;
        //   check for a negative slope for the connected chips
        }else if (colorMatchCheck(returnColor(row,col), returnColor(row-1,col+1) ,returnColor(row-2,col+2), returnColor(row-3,col+3))) {
          winning_coords = reportWin(row,col);
          return true;
        }else {
          continue;
        }
      }
    }
  }

//   Initialize player 1 as the starting player
var currentPlayer = 1
var currentName = player1;
var currentColor = player1Color

// Game End
function gameEnd(winningPlayer) {
    for (var col = 0; col < 7; col++) {
      for (var row = 0; row < 7; row++) {
        $('h3').fadeOut('fast');
        $('h2').fadeOut('fast');
        winningCoords = 
        $('h1').text(winningPlayer+" has won at coords" + winning_coords +"! Refresh to play again!").css("fontSize", "50px")
      }
    }
  }

// the only h3 is the turn-counter (the id="turnTrackingMsg")
$('h3').text(player1 + " your move")

$('.board button').on('click',function() {
    // Recognize what column was chosen
    var col = $(this).closest("td").index();
    // Get back bottom available row to change
    var bottomAvail = checkBottom(col);
    // Drop the chip in that column at the bottomAvail Row
    changeColor(bottomAvail,col,currentColor);
    // Check for a win or a tie.
    if (horizontalWinCheck() || verticalWinCheck() || diagonalWinCheck()) {
        gameEnd(currentName);
    }
    // If no win or tie, continue to next player, switches between positive and negative 1
    currentPlayer = currentPlayer * -1 ;
    // Re-Check who the current Player is.
    if (currentPlayer === 1) {
    currentName = player1;
    $('h3').text(currentName+" : your turn, drop a BLUE chip.");
    currentColor = player1Color;
    }else {
    currentName = player2
    $('h3').text(currentName+" : your turn, drop a RED chip");
    currentColor = player2Color;
    }

})