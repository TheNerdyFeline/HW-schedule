// Initialize Firebase
var config = {
    apiKey: "AIzaSyBieMFbwBwM0qaU6Pf7z36CcI39t3YZD9Q",
    authDomain: "ferry-schedule-b61a2.firebaseapp.com",
    databaseURL: "https://ferry-schedule-b61a2.firebaseio.com",
    storageBucket: "ferry-schedule-b61a2.appspot.com",
    messagingSenderId: "930431604316"
};
firebase.initializeApp(config);

// declare var
var database = firebase.database();

// 2. Button for adding ferries
$("#add-ferry-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var ferryName = $("#ferry-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstFerry = moment($("#ferry-input").val().trim(), "hh:mm").format("hh:mm");
    var frequency = moment($("#frequency-input").val().trim(), "mm").format("mm");

    // Creates local "temporary" object for holding ferry data
    var newFerry = {
	name: ferryName,
	destination: destination,
	firstFerry: firstFerry,
	frequency: frequency
    };

    // Uploads ferry data to the database
    database.ref().push(newFerry);


    // Clears all of the text-boxes
    $("#ferry-name-input").val("");
    $("#destination-input").val("");
    $("#ferry-input").val("");
    $("#frequency-input").val("");

    // Prevents moving to new page
    return false;
});

// 3. Create Firebase event for adding ferry to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    // Store everything into a variable.
    var ferryName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstFerry = childSnapshot.val().firstFerry;
    var frequency = childSnapshot.val().frequency;
   
    // Calculate the minutes til next ferry
    var diffFirstFerry = moment().diff(moment(firstFerry, "hh:mm"), "minutes");
    var remainder = diffFirstFerry % frequency;
    var minNextFerry = frequency - remainder;
    var nextFerry = moment().add(minNextFerry, "minutes");
    var nextArr = moment(nextFerry).format("hh:mm");
    
    // Add each train's data into the table
    $("#ferry-schedule > tbody").append("<tr><td>" + ferryName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArr  + "</td><td>" + minNextFerry);
});
