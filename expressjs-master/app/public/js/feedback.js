
$(function() {

  $.getJSON('api', updateFeedback);

  $('.feedback-form').submit(function(e) {
    e.preventDefault();
    $.post('api', {
      id:createGuid(),
      status:"Pending Approval",
      name: $('#feedback-form-name').val(),
      title: $('#feedback-form-title').val(),
      message: $('#feedback-form-message').val()
    });
    $.getJSON('api', updateFeedback);
  });

  $('.feedback-messages').on('click', function(e) {
      if (e.target.className == 'glyphicon glyphicon-remove') {
        $.ajax({
          url: 'api/' + e.target.id,
          type: 'DELETE',
          success: updateFeedback
        }); //ajax
      } // the target is a delete button
  }); //feedback messages

  function createGuid(){  
    function S4() {  
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);  
    }  
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();  
 }

  function updateFeedback(data) {
   var output = '';
   $.each(data,function(key, item) {
     output += '     <div class="feedback-item item-list media-list">';
     output += '       <div class="feedback-item media">';
     output += '       <div class="media-left"><button class="feedback-delete btn btn-xs btn-danger"><span id="' + key + '" class="glyphicon glyphicon-remove"></span></button></div>';
     output += '         <div class="feedback-info media-body">';
     output += '           <div class="feedback-head">';
     output += '             <div class="feedback-title">' + item.title + ' <small class="feedback-name label label-info">'+item.status+'</small></div>';
     output += '           </div>';
     output += '           <div class="feedback-message">' + item.message + '</div>';
     output += '         </div>';  
     output += '           <div class="feedback-message">' + item.name + '</div>';
     output += '         </div>';  
     output += '       </div>';
     output += '     </div>';
   });
   $('.feedback-messages').html(output);
  }
});
