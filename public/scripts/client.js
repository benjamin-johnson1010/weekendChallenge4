console.log('sourced');
//create task
$(document).ready(function(){
  $('.submit').on('click', function(){
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
        console.log('server hit');
        $('#taskIn').val('');
        displayTasks();
      }//end success
    });//end ajax
  });//end click
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
    for(var i=0; i < data.length; i++){
      $('#outputTask').append(data[i]);
    }
  }
  });
};
