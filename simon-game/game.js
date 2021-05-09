var randomNumber, randomChosenColor, userChosenColor;
var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var isGameStarted = 0;
var level = 0;

function nextSequence() {
  $("h1").text("Level " + level);
  randomNumber = Math.floor(Math.random() * 4);
  randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  flashColorAndPlaySound(randomChosenColor);
  level++;
}
function flashColorAndPlaySound(chosenColor) {
  new Audio("sounds/" + chosenColor + ".mp3").play();
  $("#" + chosenColor)
    .fadeOut(100)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
}
function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}
function checkAnswer() {
  for (var i = 0; i < userClickedPattern.length; i++) {
    if (gamePattern[i] != userClickedPattern[i]) {
      $("h1").text("Game Over, Press a key to start");
      $("body").addClass("game-over");
      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);
      new Audio("sounds/wrong.mp3").play();
      isGameStarted = false;
      break;
    }
  }
  if (userClickedPattern.length === gamePattern.length) {
    setTimeout(function () {
      if ($("h1").text() != "Game Over, Press a key to start") {
        userClickedPattern = [];
        nextSequence();
      }
    }, 1000);
  }
}

$(document).keydown(function (event) {
  if (isGameStarted == 0) {
    isGameStarted = 1;
    userClickedPattern = [];
    gamePattern = [];
    level = 0;
    nextSequence();
  }
});
$(".btn").click(function (event) {
  userChosenColor = event.target.id;
  userClickedPattern.push(userChosenColor);
  flashColorAndPlaySound(userChosenColor);
  animatePress(userChosenColor);
  checkAnswer();
});
