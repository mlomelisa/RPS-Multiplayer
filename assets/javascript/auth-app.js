var database = firebase.database();
var that = this;

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


var where2Application = {userDetails: {
  displayName : "",
  email : "",
  emailverified : "",
  photoURL : "",
  isAnonymous : "",
  uid : "",
  providerData : "",
  isAuthenticated : false
},
 userSelection: ""
};

// Login function
$(document).on("click", "#login", function(){
  ui.start('#firebaseui-auth-container', uiConfig);
});

// LogOut function

$(document).on("click", "#signOut", function(myPlayerNumber,userID){
  firebase.auth().signOut().then(function() {
    }, function(error) {
      console.error('Sign Out Error', error);
    });
    $('#signOut').removeClass("show");
    $('#signOut').addClass("disable");
    $('#gameSection').removeClass('game-section-show');
    $('#gameSection').addClass('game-section-hide');
    $('.result p').text('');
    $('#user-score').text('0');
    $('#computer-score').text('0');
  
   userID = that.where2Application.userDetails.uid
   playerNumber = that.where2Application.userDetails.myPlayerNumber
   firebase.database().ref('users/').child(that.where2Application.userDetails.uid).remove();
   firebase.database().ref('RPS/').child('playerData').child(playerNumber).remove();
   firebase.database().ref('RPS/').child('playerList').child(playerNumber).remove();

   if (playerNumber === 0){
    document.getElementById('user-label').classList.remove('aqua-glow');
  }else{
    document.getElementById('computer-label').classList.remove('aqua-glow');
  }




   
    

});

//Firebase Remove child action from PlayerData
// firebase.database().ref('RPS/').child('playerData/' + ).child(that.where2Application.userDetails.uid).remove();
// firebase.database().ref('RPS/').child(key).child(key).child(that.where2Application.userDetails.uid).remove();
function removeUserFromPlayList(myPlayerNumber, userID){

  ref = firebase.database().ref('/users/');
  ref.on('child_removed', function(snapshot){
 
    console.log(myPlayerNumber);
  });

     // removed!


}
// ref.remove()


// Firebase UI variable being created with specific configuration
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return false;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    // tosUrl: 'tos.html',
    // Privacy policy url.
    // privacyPolicyUrl: 'privacy.html'
  };

  //function Monitors for Auth Change via FirebaseAUth
firebase.auth().onAuthStateChanged(function(user) {

  if (user) {
    // User is signed in.
    // User info if we need it
    that.where2Application.userDetails = {
        displayName : user.displayName,
        email : user.email,
        emailverified : user.emailVerified,
        photoURL : user.photoURL,
        isAnonymous : user.isAnonymous,
        uid : user.uid,
        providerData : user.providerData,
        isAuthenticated : true
    }
    addUsertoDatabase(that.where2Application.userDetails.uid)
    $("#login-modal").modal('hide');
    $('#signOut').removeClass("disable");
    $('#signOut').addClass("show");
    $('#login').removeClass("show");
    $('#login').addClass("disable");
    var userID = that.where2Application.userDetails.uid;
    
    var gameRef = database.ref(game_location);
    assignPlayerNumberandPlayGame(userID, gameRef);
    $('#gameSection').removeClass('game-section-hide');
    $('#gameSection').addClass('game-section-show');
  
   
    // ...

  } else {
    that.where2Application.userDetails = {
        displayName : "",
        email : "",
        emailverified : "",
        photoURL : "",
        isAnonymous : "",
        uid : "",
        providerData : "",
        isAuthenticated : false
    }
    $('#login').removeClass("disable");
    $('#login').addClass("show")
   

  }

});



  
function addUsertoDatabase(userId,name,email){
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var username = (snapshot.val() && snapshot.val().username)
      //If user is not in DB we add them.
      if(!username){
          firebase.database().ref('users/' + userId).set({
              username: that.where2Application.userDetails.displayName,
              email: that.where2Application.userDetails.email,

          });
      } else {
      }
    });
}



// Function called after player assign completes
function playGame(myPlayerNumber, userId, justJoinedGame, gameRef) {
  var playerDataRef = gameRef.child(player_data_location).child(myPlayerNumber);
  var realPlayerNumber = myPlayerNumber + 1;
  $('.result p').text('You are player number ' + realPlayerNumber);

  if (myPlayerNumber === 0){
    document.getElementById('user-label').classList.add('aqua-glow');
  }else{
    document.getElementById('computer-label').classList.add('aqua-glow');
  }

  
  $("#btnLogin").addClass('disable');
  $("#btnLogOut").removeClass('disable').addClass('show');

       
  if(justJoinedGame) {
    
    // result_p.innerHTML = 'Doing first-time initialization of data';
    playerDataRef.set({userId:userId});

  }
  return myPlayerNumber
};//playGame function

  //use transaction() to assign a player number, then call playGame()
  function assignPlayerNumberandPlayGame(userId, gameRef) {
    var playerListRef = gameRef.child(players_location);
    var myPlayerNumber, alreadyInGame = false;

    playerListRef.transaction(function(playerList){

      if(playerList === null){
        playerList = [];
      }

      for  (var i =0; i< playerList.length; i++){
        if(playerList[i] === userId){
          alreadyInGame = true;
          myPlayerNumber = i;
      
          that.where2Application.userDetails.myPlayerNumber = myPlayerNumber;
          return myPlayerNumber;
        }
      }
     
      if (i< num_players){
        playerList[i] = userId;
        myPlayerNumber = i;
        that.where2Application.userDetails.myPlayerNumber = myPlayerNumber;
        return playerList;
      }
      myPlayerNumber = null;
    },function (error, commited){
      if (commited ||alreadyInGame){
        
          playGame(myPlayerNumber, userId, !alreadyInGame, gameRef);
          
      } else {
        alert('Game is full')
      }
    });
  }

// RPS game section

let userScore = 0;
let computerScore = 0;
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result > p")
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");
var oponentChoice;



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
function win(userChoice, oponentChoice) {
  
  userScore++;
  database.ref('RPS').child('playerData').child(that.where2Application.userDetails.myPlayerNumber).child('userId/').update({'userscore':userScore});
  userScore_span.innerHTML = userScore;
  computerScore_span.innerHTML = computerScore;
  result_p.innerHTML = convertToWorld(userChoice) + " beats " + convertToWorld(oponentChoice) + ". You win!!"
  document.getElementById(userChoice).classList.add('green-glow');
  setTimeout(() => {document.getElementById(userChoice).classList.remove('green-glow')}, 1000);
  
}

function lose(userChoice, oponentChoice) {
  
  computerScore++;
  database.ref('RPS').child('playerData').child(that.where2Application.userDetails.myPlayerNumber).child('userId/').update({'oponentscore':computerScore});
  userScore_span.innerHTML = userScore;
  computerScore_span.innerHTML = computerScore;
  result_p.innerHTML = convertToWorld(userChoice) + " beats " + convertToWorld(oponentChoice) + ". You Lost!!"
  document.getElementById(userChoice).classList.add('red-glow');
  setTimeout(() => {document.getElementById(userChoice).classList.remove('red-glow')}, 1000);
  var playersRef = database.ref('RPS').child('playerData');
    
    playersRef.child('1').child('userId/').child('event').on('value', function(data){
      oponentChoice = data.val();
      return oponentChoice;

})
}

function draw(userChoice, oponentChoice) {
  
  userScore_span.innerHTML = userScore;
  computerScore_span.innerHTML = computerScore;
  result_p.innerHTML = convertToWorld(userChoice) + "  " + convertToWorld(oponentChoice) + ". Draww!!"
  document.getElementById(userChoice).classList.add('gray-glow');
  setTimeout(() => {document.getElementById(userChoice).classList.remove('gray-glow')}, 1000);
  
}

function game(userChoice) {

   var oponenChoice = getOponentChoice();

   if(oponenChoice == null){
    result_p.innerHTML = 'Waiting for oponent to move'
   }else{

  
  
    switch (userChoice + oponenChoice) {
      case "rs":
      case "pr":
      case "sp":
        win(userChoice, oponenChoice);
        break;
      case "sr":
      case "rp":
      case "ps":
        lose(userChoice, oponenChoice);
        break;
      case "ss":
      case "rr":
      case "pp":
       draw(userChoice, oponenChoice);
       break;
    }
  }
}

function getOponentChoice() {
  var currentUser = that.where2Application.userDetails.myPlayerNumber
 
  
  if (currentUser === 0){
    var playersRef = database.ref('RPS').child('playerData');
    
    playersRef.child('1').child('userId/').child('event').on('value', function(data){
      oponentChoice = data.val();
      return oponentChoice;
      
    })
   

  } else {
    var playersRef = database.ref('RPS').child('playerData');
   
    playersRef.child('0').child('userId/').child('event').on('value', function(data){
      oponentChoice = data.val();
      
      return oponentChoice;
    })
  }
  return oponentChoice;
}

function main(){

  rock_div.addEventListener('click', () => {
    database.ref('RPS').child('playerData').child(that.where2Application.userDetails.myPlayerNumber).child('userId/').update({event:"r"});
    game("r");

  })

  paper_div.addEventListener('click', () => {
    database.ref('RPS').child('playerData').child(that.where2Application.userDetails.myPlayerNumber).child('userId/').update({event:"p"});
    game("p");
  })

  scissors_div.addEventListener('click', () => {
    database.ref('RPS').child('playerData').child(that.where2Application.userDetails.myPlayerNumber).child('userId/').update({event:"s"});
    game("s");
  })

 


}

main();
