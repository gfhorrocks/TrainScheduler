
  var database = firebase.database();
  
  $("#addTrainButton").on("click", function(event) {
    event.preventDefault();
  
    var trainName = $("#trainNameInput").val().trim();
    var destName = $("#destinationInput").val().trim();
    var firstTime = $("#trainTimeInput").val().trim();
    var frequencyTime = $("#frequencyInput").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
      name: trainName,
      destination: destName,
      time: firstTime,
      frequency: frequencyTime
    };
  
    // Uploads employee data to the database
    database.ref().push(newTrain);
  
    // Clears all of the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#trainTimeInput").val("");
    $("#frequencyInput").val("");
  });
  
  database.ref().on("child_added", function(childSnapshot) {

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destName = childSnapshot.val().destination;
    var firstTime = childSnapshot.val().time;
    var frequencyTime = childSnapshot.val().frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment().format("HH:mm");
    //console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    //console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequencyTime;
    //console.log("REMAINER: " +tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequencyTime - tRemainder;
    //console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    //console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destName),
      $("<td>").text(frequencyTime),
      $("<td>").text(nextTrain),
      $("<td>").text(tMinutesTillTrain),
    );
    // Append the new row to the table
    $("#trainData").append(newRow);
  });