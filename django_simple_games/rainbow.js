

// /////////////////////////////////
var rainbowHeader = document.getElementById("rainbowH");

//  From part 74 of the Django Course on manipulating the DOM
// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
function getRandomColor(){
  var letters = "0123456789ABCDEF";
  var color = '#';
  for (var i = 0; i < 6; i++) {
      // get an index from the reference string randomly
    var rand_idx = Math.floor(Math.random()*16);
     // add the rand index to the colorcode string
    color += letters[rand_idx];
  }
  return color
}

// Apply the random hex color-code to the style
function changeHeaderColor(){
  rainbowHeader.style.color = getRandomColor();
}


// Now perform the action over intervals (milliseocnds):
setInterval("changeHeaderColor()",500);

// /////////////
var hover_header = document.querySelector("#hoverH");
var click_header = document.querySelector("#clickH");
var dbl_header = document.querySelector("#dblclkH");
// get the jumbotron, note this is targeting classes so returns an array
var jumbotron_area = document.getElementsByClassName("jumbotron");
var jumbotron_paragraphs = document.getElementsByClassName('p_in_jumbo');
var p_under_jumbo = document.getElementById('p_under_jumbo');
var reset_btn = document.getElementById('resetBGButton');

//  control hover in and hover out events with mouseover and mouseout
hover_header.addEventListener("mouseover", function(){
    randHColor = getRandomColor()
    hover_header.textContent = `On hover, I become a random color ${randHColor}`;
    hover_header.style.color = randHColor; 
    // randomizes the array of paragraphs from class .p_in_jumbo
    for (var i = 0; i < jumbotron_paragraphs.length; i++){
        randPColor = getRandomColor()
        jumbotron_paragraphs[i].innerHTML = `I am now color ${randPColor}`
        jumbotron_paragraphs[i].style.color = randPColor;
        // (inner HTML) `On hover, I become a random color ${randHColor}`
    };
});

hover_header.addEventListener("mouseout", function(){
    hover_header.textContent = "Hover for random text color (randomizes paragraph colors too)";
    hover_header.style.color = "black"; 
});

click_header.addEventListener("click", function(){
    click_color = getRandomColor();
    click_header.style.color = click_color;
    click_header.textContent = `A click changed my color to ${click_color} (you can click me again)`;
});

dbl_header.addEventListener("dblclick", function(){
    randColor = click_color = getRandomColor();
    // console.log(jumbotron_area[0].style.background);
    jumbotron_area[0].style.background= randColor;
    p_under_jumbo.innerHTML = `<strong>Current BG color:</strong> ${randColor}`;
});

// adding an event listener on a button through the js
reset_btn.addEventListener("click", function(){
    jumbotron_area[0].style.background= "";
    p_under_jumbo.innerHTML = `<strong>Current BG color:</strong> Jumbotron's BG color has reverted to default again`;
});
