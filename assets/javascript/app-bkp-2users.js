

 var firebaseConfig = {
  apiKey: "AIzaSyDBCYFOGOmD95zfLSBFiofOde2kfO7-XMs",
  authDomain: "testfirebase-ce82f.firebaseapp.com",
  databaseURL: "https://testfirebase-ce82f.firebaseio.com",
  projectId: "testfirebase-ce82f",
  storageBucket: "testfirebase-ce82f.appspot.com",
  messagingSenderId: "963993073118",
  appId: "1:963993073118:web:24f92b514b54cc71"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Variable to reference the database.
var database = firebase.database();

// The max number of players. if there are already
//Num_players assigned users wont be able to join the game
var num_players = 2;
var game_location = database.ref('RPS');
// Location under game_location that will use store the list
//of players who have joined the game (up to Max_players])
var players_location = 'playerList';
// Location under game_location that will use store data
//for each player (game state)
var player_data_location = 'playerData';

//Function main

$('#btnLogin').on('click', function(event){
  
  var gameRef = database.ref(game_location);
  assignPlayerNumberandPlayGame(userID, gameRef); 

});
// Function assign userID

database.ref().child('RPS').child('playerData').on('value', function(snapshot){
  snapshot.forEach(function(childSnapshot){
    
      $('#player1').text(snapshot.child(0).val().userID);
       
      $('#player2').text(snapshot.child(1).val().userID);

  })
  
});
    





//Connections reference stored in DB
var connectionsRef = database.ref("/sessions");
// variable to find when connection state changes
var connectedRef = database.ref(".info/connected");




// When the client's connection change
connectedRef.on("value", function(snap){

  if(snap.val()){
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
}); //Connection state changes


//When first loaded or when connection list change


connectionsRef.on("value", function(snap){
  $('#connected-viewers').text(snap.numChildren());
});//connections loadpage








let userScore = 0;
let computerScore = 0;
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result > p")
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");

function getComputerChoice() {
  const choices = ['r', 'p', 's'];
  const randomNumber = Math.floor(Math.random() * 3);
  return choices[randomNumber];
}

function convertToWorld(letter) {
  if(letter === "r") return "Rock";
  if(letter === "p") return "Paper";
  return "Scissors";
  
}
function win(userChoice, computerChoice) {
  userScore++;
  userScore_span.innerHTML = userScore;
  computerScore_span.innerHTML = computerScore;
  result_p.innerHTML = convertToWorld(userChoice) + " beats " + convertToWorld(computerChoice) + ". You win!!"
  document.getElementById(userChoice).classList.add('green-glow');
  setTimeout(() => {document.getElementById(userChoice).classList.remove('green-glow')}, 1000);
}

function lose(userChoice, computerChoice) {
  computerScore++;
  userScore_span.innerHTML = userScore;
  computerScore_span.innerHTML = computerScore;
  result_p.innerHTML = convertToWorld(userChoice) + " beats " + convertToWorld(computerChoice) + ". You Lost!!"
  document.getElementById(userChoice).classList.add('red-glow');
  setTimeout(() => {document.getElementById(userChoice).classList.remove('red-glow')}, 1000);
}

function draw(userChoice, computerChoice) {
  userScore_span.innerHTML = userScore;
  computerScore_span.innerHTML = computerScore;
  result_p.innerHTML = convertToWorld(userChoice) + "  " + convertToWorld(computerChoice) + ". Draww!!"
  document.getElementById(userChoice).classList.add('gray-glow');
  setTimeout(() => {document.getElementById(userChoice).classList.remove('gray-glow')}, 1000);
}

function game(userChoice) {
  const computerChoice = getComputerChoice();
    switch (userChoice + computerChoice) {
      case "rs":
      case "pr":
      case "sp":
        win(userChoice, computerChoice);
        break;
      case "sr":
      case "rp":
      case "ps":
        lose(userChoice, computerChoice);
        break;
      case "ss":
      case "rr":
      case "pp":
       draw(userChoice, computerChoice);
       break;
    }
  
}

function main(){

  rock_div.addEventListener('click', () => {
    game("r");

  })

  paper_div.addEventListener('click', () => {
    game("p");
  })

  scissors_div.addEventListener('click', () => {
    game("s");
  })

}

main();