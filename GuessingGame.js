var generateWinningNumber = function() {
  return Math.floor(Math.random() * 100) + 1;
};

var shuffle = function(array) {
  var m = array.length;
  var t;
  var i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

function Game(playersGuess) {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  let answer = this.playersGuess - this.winningNumber;
  return Math.abs(answer);
};

Game.prototype.isLower = function() {
  if (this.playersGuess < this.winningNumber) return true;
  else return false;
};

Game.prototype.playersGuessSubmission = function(num) {
  this.playersGuess = num;
  if (num < 1 || num > 100 || typeof num !== "number") {
    throw "That is an invalid guess.";
  }
  return this.checkGuess();
};

Game.prototype.checkGuess = function() {
  if (this.playersGuess === this.winningNumber) {
    $("#hint, #submit").prop("disabled", true);
    $(".headers")
      .text("You win! Press the Reset button to play again!")
      .css({
        color: "salmon",
        "font-size": "4rem"
      });
    return "You Win!";
  } else {
    if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
      $(".headers")
        .text("You have already guessed that number!")
        .css({
          color: "salmon",
          "font-size": "4rem"
        });
    } else {
      this.pastGuesses.push(this.playersGuess);
      $("#guesses li:nth-child(" + this.pastGuesses.length + ")")
        .text(this.playersGuess)
        .css({
          "background-color": "white"
        });
      if (this.pastGuesses.length === 6) {
        $("#hint, #submit").prop("disabled", true);
        $(".headers")
          .text("You Lose . . . Press the Reset button to play again!")
          .css({
            color: "salmon",
            "font-size": "4rem"
          });
        return "You Lose.";
      } else {
        var diff = this.difference();
        if (this.isLower()) {
          $(".headers")
            .text("Guess Higher!")
            .css({
              "margin-top": "30px",
              color: "salmon",
              "font-size": "9rem"
            });
        } else {
          $(".headers")
            .text("Guess Lower!")
            .css({
              "margin-top": "30px",
              color: "salmon",
              "font-size": "9rem"
            });
        }
        if (diff < 10) return "You're burning up!";
        else if (diff < 25) return "You're lukewarm.";
        else if (diff < 50) return "You're a bit chilly.";
        else return "You're ice cold!";
      }
    }
  }
};

// Game.prototype.checkGuess = function() {
//   if(this.winningNumber === this.playersGuess) {
//     $('#hint, #submit').prop("disabled",true);
//     $('#headers').text("You win! Press the Reset button to play again!").css({
//       'color': 'salmon',
//       'font-size': '4rem'
//     });
//     return 'You Win!';
//   }

//   if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
//     //Not sure why this doesn't work.
//     $('#headers').text("You have already guessed that number!").css({
//       'color': 'salmon',
//       'font-size': '4rem'
//     });
//   } else {
//     this.pastGuesses.push(this.playersGuess);
//     $('#guesses li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess).css({
//       'background-color': 'white'
//     })
//   }

//   if(this.pastGuesses.length === 6) {
//     $('#hint, #submit').prop("disabled",true);
//     $('#headers').text("You Lose . . . Press the Reset button to play again!").css({
//       'color': 'salmon',
//       'font-size': '4rem'
//     });
//     return 'You Lose.'
//   } else {
//     if(this.isLower()) {
//       $('#headers').text("Guess Higher!").css({
//         'margin-top': '30px',
//         'color': 'salmon',
//         'font-size': '9rem'
//       });
//   } else {
//       $('#headers').text("Guess Lower!").css({
//         'margin-top': '30px',
//         'color': 'salmon',
//         'font-size': '9rem'
//       });
//   }
//     if(this.difference() < 10) return 'You\'re burning up!';
//     else if(this.difference() < 25) return 'You\'re lukewarm.';
//     else if(this.difference() < 50) return 'You\'re a bit chilly.';
//     else return 'You\'re ice cold!';
//   }
// }

function newGame() {
  return new Game();
}

Game.prototype.provideHint = function() {
  var hintArray = [
    this.winningNumber,
    generateWinningNumber(),
    generateWinningNumber()
  ];
  return shuffle(hintArray);
  // return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

function makeAGuess(game) {
  var guess = $("#player-input").val();
  $("#player-input").val("");
  var output = game.playersGuessSubmission(parseInt(guess, 10));
  $("#title").text(output);
}

$(document).ready(function() {
  var game = new Game();
  $("#submit").click(function() {
    makeAGuess(game);
  });

  $("#player-input").keypress(function(event) {
    if (event.which == 13) {
      makeAGuess(game);
    }
  });

  $("#reset").click(function() {
    game = newGame();
    // $('.headers').removeClass('.headers');
    // $('#app').filter('.headers').addClass('.headers');
    $("#headers").text("Play the Guessing Game! Pick a number between 1-100.");
    // $("#subtitle").text("Guess a number between 1-100!");
    $(".guess")
      .text("#")
      .css({
        "background-color": "rgb(253, 167, 167,.9)"
      });
    $("#hint, #submit").prop("disabled", false);
  });

  $("#hint").click(function() {
    var hints = game.provideHint();
    $("#headers")
      .text(
        "The winning number is " +
          hints[0] +
          ", " +
          hints[1] +
          ", or " +
          hints[2]
      )
      .css({
        color: "salmon",
        "font-size": "3rem"
      });
  });
});
