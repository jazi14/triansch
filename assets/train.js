  // Initialize Firebase
var config = {
    apiKey: "AIzaSyAnY-1jyZXI_YqWnWiz2Re3B_CUQ1InYi0",
    authDomain: "my-train-pro2017.firebaseapp.com",
    databaseURL: "https://my-train-pro2017.firebaseio.com",
    projectId: "my-train-pro2017",
    storageBucket: "",
    messagingSenderId: "489274018028"
  };
firebase.initializeApp(config);
  
var database = firebase.database();

$("#add-train-button").on("click", function(event) {
  event.preventDefault();
  // Gets the values the user inputs and saves them as variables
  var trainName = $("#train-name").val().trim();
  var trainDestination = $("#train-destination").val().trim();
  var trainTime = moment($("#train-time-input").val().trim(), "HH:mm").format("HH:mm");
  var trainTimeUnix = moment($("#train-time-input").val().trim(), "HH:mm").format("X");
  var trainFrequency = $("#train-frequency").val().trim();
  // Creates a temporary object to send to firebase
  var newTrain = {
    train: trainName,
    destination: trainDestination,
    time: trainTime,
    timeUnix: trainTimeUnix,
    frequency: trainFrequency
  };
  
  // Pushs the object to firebase
  database.ref().push(newTrain);

  // Clears the input values
  $("#train-name").val("");
  $("#train-destination").val("");
  $("#train-time-input").val("");
  $("#train-frequency").val("");

  });

// Gets the values from firebase and populates the HTMl
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  // Store everything into a variable.
  var trainName = childSnapshot.val().train;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainTimeUnix = childSnapshot.val().timeUnix;
  var trainFrequency = childSnapshot.val().frequency;

// Need to calculate time to next train.  The equation is in the format:
// ((now-trainTime) % frequency) would give us the remainder.  Frequency - remainder + Now gives us the next train time.
// Frequency - Remainder gives us time till the next train
var nowUnixTime = moment().format("X");
var nowMilitaryTime = moment().format("HH:mm");
var difference = nowUnixTime - trainTimeUnix;
var differenceInMinutes = difference / 60;
differenceInMinutes = Math.floor(differenceInMinutes);
var remainder = differenceInMinutes % trainFrequency;
var minutesAway = trainFrequency - remainder;
var nextTrainUnix = moment().add(minutesAway, "minutes");
var nextTrain = moment(nextTrainUnix).format("HH:mm");

// If the first train comes in after now, set an if statement to show the correct time.
if (trainTimeUnix > nowUnixTime) {
  console.log("train comes later");
  nextTrain = trainTime;
  minutesAway = Math.floor((trainTimeUnix - nowUnixTime) / 60);
  console.log(minutesAway);
}



  // Puts the data into the HTML
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td></tr>");
});