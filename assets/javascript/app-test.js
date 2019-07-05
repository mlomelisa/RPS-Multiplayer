var firebaseConfig = {
  apiKey: "AIzaSyDBCYFOGOmD95zfLSBFiofOde2kfO7-XMs",
  authDomain: "testfirebase-ce82f.firebaseapp.com",
  databaseURL: "https://testfirebase-ce82f.firebaseio.com",
  projectId: "testfirebase-ce82f",
  storageBucket: "testfirebase-ce82f.appspot.com",
  messagingSenderId: "963993073118",
  appId: "1:963993073118:web:964f4507c2e0a21e"
};

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  var preObject = document.getElementById('object');
  var uList = document.getElementById('list');

  var dbRefObject = firebase.database().ref().child('object');
  var dbRefList = dbRefObject.child('hobbies');


  dbRefObject.on('value', snap => {
    preObject.innerHTML = JSON.stringify(snap.val(), null, 3);
  });

  dbRefList.on('child_added', snap => {

    var li = document.createElement('li');
    li.innerText = snap.val();
    uList.appendChild(li);
  });



  // {
  //   "users": {
  //     "oliver": {
  //       "userId" : "user1",
  //       "firstname": "Oliver",
  //       "lastname": "Perez-Lomeli"
  //     }
  //     "Misael": {
  //       "userId" : "user2",
  //       "firstname": "Misael",
  //       "lastname": "Perez-Martinez"
  //     }
  //   } 
  // }

  // var query = firebase.database().ref('users').orderByKey();
  // query.once('value')
  //   .then(function(snapshot) {
  //     snapshot.forEach(function(childSnapshot) {
  //       var key = childSnapshot.key;
  //       var childData = childSnapshot.val();
  //     });
  //   });