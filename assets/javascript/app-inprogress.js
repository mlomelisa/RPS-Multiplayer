

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
  event.preventDefault();
  var userID = $('#inputUserId').val();
  var gameRef = database.ref(game_location);
  var email = $('#inputEmail').val();
  var pass = $('#inputPassword').val();
  var auth = firebase.auth();
  var promise = auth.signInWithEmailAndPassword(email, pass);
  var currentUser = auth.currentUser;
  assignPlayerNumberandPlayGame(userID, email, gameRef); 
  promise.catch(e=> console.log(e.message));

  $("#btnLogOut").removeClass('disable').addClass('show');
  $("#btnLogin").addClass('disable');
  $("#btnSignUp").addClass('disable');
 
  $('#inputUserId').val('');
  $('#inputEmail').val('');
  $('#inputPassword').val('');

});

//Add a realtime Listener
firebase.auth().onAuthStateChanged(function(user) {
  window.user = user;
  if(user){
    // var loginQueu = database.ref().child('RPS').child('playerData').
    
    // console.log('im here');
    // $("#btnLogOut").removeClass('disable').addClass('show');
    // $("#btnLogin").addClass('disable');
  } else{
    console.log('not logged in')
    $("#btnLogOut").addClass('disable');
    $("#btnLogin").removeClass('disable').addClass('show');
  
   
  }
});

// Add Signup Event
$('#btnSignUp').on('click', e =>{
  console.log('Im here?')
  e.preventDefault();
  // Get email and password
 var email = $('#inputEmail').val();
 var pass = $('#inputPassword').val();
 var auth = firebase.auth();
//Sign In
var promise = auth.createUserWithEmailAndPassword(email, pass);
promise

.catch(e=> console.log(e.message));
$('#inputUserId').val('');
$('#inputEmail').val('');
$('#inputPassword').val('');
});

// Button LogOut
$('#btnLogOut').on('click', function(event){
  event.preventDefault();
  firebase.auth().signOut();
});

// Function assign userID

database.ref().child('RPS').child('playerData').on('value', function(snapshot){
  snapshot.forEach(function(childSnapshot){
    
      $('#player1').text(snapshot.child(0).val().userID);
       
      $('#player2').text(snapshot.child(1).val().userID);

  })
  
});



// Function called after player assign completes
function playGame(myPlayerNumber, userID, email, justJoinedGame, gameRef) {
  var playerDataRef = gameRef.child(player_data_location).child(myPlayerNumber);
  var realPlayerNumber = myPlayerNumber + 1;
  result_p.innerHTML = 'You are player number ' + realPlayerNumber;
  
 
       
      

  if(justJoinedGame) {
    
    // result_p.innerHTML = 'Doing first-time initialization of data';
    playerDataRef.set({userID:userID, email:email });

  }
};//playGame function

  //use transaction() to assign a player number, then call playGame()
  function assignPlayerNumberandPlayGame(userID, email, gameRef) {
    var playerListRef = gameRef.child(players_location);
    var myPlayerNumber, alreadyInGame = false;

    playerListRef.transaction(function(playerList){

      if(playerList === null){
        playerList = [];
      }

      for  (var i =0; i< playerList.length; i++){
        if(playerList[i] === userID){
          alreadyInGame = true;
          myPlayerNumber = i;
         
          return;
        }
      }
     
      if (i< num_players){
        playerList[i] = userID;
        myPlayerNumber = i;
        
        return playerList;
      }
      myPlayerNumber = null;
    },function (error, commited){
      if (commited ||alreadyInGame){
        
          playGame(myPlayerNumber, userID, email, !alreadyInGame, gameRef);
        
      } else {
        alert('Game is full')
      }
    });

    

  }


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