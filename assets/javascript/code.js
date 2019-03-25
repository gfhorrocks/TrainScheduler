
  var database = firebase.database();
  
  setInterval(update,1000);  //Sets interval to one second to update clock

  function update(){
    $("#clock").html(moment().format("MMMM D YYYY hh:mm:ss A"));  // pulls time using moment and adds to clock div
  }
  
  $("#addTrainButton").on("click", function(event) {
    event.preventDefault();
  
    var trainName = $("#trainNameInput").val().trim();
    var destName = $("#destinationInput").val().trim();
    var firstTime = $("#trainTimeInput").val().trim();
    var frequencyTime = $("#frequencyInput").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: destName,
      time: firstTime,
      frequency: frequencyTime
    };
  
    // Uploads train data to database (firebase)
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
    var key = childSnapshot.key;

    // console.log(key);
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment().format("HH:mm");

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % frequencyTime;

    // Minute Until Train
    var tMinutesTillTrain = frequencyTime - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destName),
      $("<td>").text(frequencyTime),
      $("<td>").text(nextTrain),
      $("<td>").text(tMinutesTillTrain),
      $("<button class='removeButton' id="+key+">").text("X")
    );

    newRow.attr("id",key);

    // Append the new row to the table
    $("#trainData").append(newRow);
  });

$(document).on("click",".removeButton", function(){
  
  var key = $(this).attr("id");
  console.log(key);

  dbRef = database.ref(key);

  dbRef.remove();

  $("#"+key).closest('tr').remove();

});
  