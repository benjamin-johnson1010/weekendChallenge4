console.log('sourced');
//create task
$(document).ready(function(){
  displayTasks();
  $('.submit').on('click', function(){
    //make variable to check if something has been input
    var taskValue ='';
    if($('#taskIn').val()== taskValue){
      alert('Please input a value');
    }
    else{
    console.log('clicked createTask');
    var newTask = {
      task: $('#taskIn').val(),
      status: "INCOMPLETE"
    };
    console.log(newTask);
    //send info to server
    $.ajax({
      type: 'POST',
      url: '/newTask',
      data: newTask,
      success: function(data){
        console.log('server hit', data);
        $('#taskIn').val('');
        displayTasks(data);

      }//end success
    });
  }//end ajax
  });//end click
//in complete button
$('#outputTask').on('click', '.completeButton', function(){

console.log('in complete button');
//set status to change and get id for it
var completeTask ={
  status: "COMPLETE",
  id: $(this).val()
};
$.ajax({
  type: 'POST',
  url: '/complete',
  data: completeTask,
  success: function(data){
    console.log('returned for complete');
    displayTasks(data);

  }
});

});
$('#outputTask').on('click', '.deleteButton', function(){
  console.log('in deleteButton');
  if(confirm('Are you sure?')){
  var deleteTask ={
    id: $(this).val()
  };
  console.log();
  $.ajax({
    type: 'POST',
    url: '/delete',
    data: deleteTask,
    success: function(data){
      console.log('returned for complete',data);
      displayTasks(data);
    }
  });
}
});
});//end doc ready
//function to display the taks
var displayTasks = function(){
  console.log('in displayTasks');
  $.ajax({
  type: 'GET',
  url: '/newTask',
  success: function(data){
    console.log('in get displayTasks', data);
    //empty outputTask
    $('#outputTask').empty();
    for(var i = 0; i < data.length; i++){
      if(data[i].status == "COMPLETE"){
        console.log(data[i].status);
      $('#outputTask').append('<h4 class="yellow">' + data[i].task + '<br>status: ' + data[i].status +
      '<br><button class="completeButton" value="' + data[i].id + '">Completed</button>' +
      '<button class="deleteButton" value="' + data[i].id + '">Delete</button>' + '<br>' + '</h4>');
    }
    else{
      console.log(data[i].status);
      $('#outputTask').append('<h4>' + data[i].task + '<br>status: ' + data[i].status +
      '<br><button class="completeButton" value="' + data[i].id + '">Completed</button>' +
      '<button class="deleteButton" value="' + data[i].id + '">Delete</button>' + '<br>' + '</h4>');
    }
    }

  }
  });
};
