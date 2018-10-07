$(document).ready(function(){

// Audio for Thomas the Dank Engine

let background = new Audio("./assets/audio/thomas.mp3");
background.loop = true;

// Firebase

var config = {
    apiKey: "AIzaSyDbC6nN5T5gze-tKW2eeecByavcVTm_fy4",
    authDomain: "train-cb99c.firebaseapp.com",
    databaseURL: "https://train-cb99c.firebaseio.com",
    projectId: "train-cb99c",
    storageBucket: "train-cb99c.appspot.com",
    messagingSenderId: "1029551671678"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

// On click function for adding new trains

$("#trainBtn").on("click", function(){

    // Grabs user input and assign to variables

    var trainName = $("#trainNameInput").val().trim();

    var lineName = $("#lineInput").val().trim();

    var destination = $("#destinationInput").val().trim();

    // Grab the time input and use the moment.js to format it

    var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").subtract(1, "years").format("X");;

    var frequencyInput = $("#frequencyInput").val().trim();

    // Debugging

    console.log(trainName);

    console.log(lineName);

    console.log(destination);

    console.log(trainTimeInput);

    console.log(frequencyInput);


    // Pushing items into firebase only if the required items are filled out

    if (trainName === "", lineName === "", destination === "", frequencyInput === "") {

        alert("You must fill in the required information");

        // Return false to prevent page from refreshing

        return false;
    }

    else {
        
    // Audio play

    background.play();

    var newTrain = {

        name:  trainName,

        line: lineName,

        destination: destination,

        trainTime: trainTimeInput,

        frequency: frequencyInput,
    }

    // Push the new data into Firebase

    database.ref().push(newTrain);

    // Clear out the text boxes for new inputs

    $("#trainNameInput").val("");

    $("#lineInput").val("");

    $("#destinationInput").val("");

    $("#trainInput").val("");

    $("#frequencyInput").val("");

    // Prevents page from refreshing

    return false;

    }

});

database.ref().on("child_added", function(childSnapshot, prevChildKey){

    console.log(childSnapshot.val());

    // Pull info from firebase

    var firebaseName = childSnapshot.val().name;

    var firebaseLine = childSnapshot.val().line;

    var firebaseDestination = childSnapshot.val().destination;

    var firebaseTrainTimeInput = childSnapshot.val().trainTime;

    var firebaseFrequency = childSnapshot.val().frequency;
    
    var diffTime = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes");

    var timeRemainder = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") % firebaseFrequency;

    var minutes = firebaseFrequency - timeRemainder;

    var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
    
    // Debugging

    console.log(minutes);

    console.log(nextTrainArrival);

    console.log(moment().format("hh:mm A"));

    console.log(nextTrainArrival);

    console.log(moment().format("X"));

    // Put info onto the page

    $("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>" + firebaseLine + "</td><td>"+ firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

    });

});
