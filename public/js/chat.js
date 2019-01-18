var socket = io();


function scrollToBottom () {
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
     messages.scrollTop(scrollHeight);
  }
}
socket.on('connect', function () {
   var params = jQuery.deparam(window.location.search);

   socket.emit('join',params, function(err){
     if(err){
      alert(err);
      window.location.href = '/';
     }else{
      console.log('No error');
     }
   });
});

 socket.on('updateUserList', function(users){
   var ol =jQuery('<ol></ol>');

   users.forEach(function (user) {
     ol.append(jQuery('<li></li>').text(user));
   });
   jQuery('#users').html(ol);
 });


 socket.on('oldMessages', function (docs) {
    var template = $('#message-template').html();

    scrollToBottom();

    docs.map(function (doc) {
        var formattedTime = moment(doc.createdAt).format('h:mm a');
        var html = Mustache.render(template, {
            text: doc.message,
            from: doc.name,
            createdAt: formattedTime
        });

        var list = jQuery('#messages').children('li:last-child');
        if (message.from === params.name) {
        list.css({'float':'right', 'padding':'10px'});
        }
        if (message.from === 'Admin') {
        list.css({'display':'table', 'margin':'0 auto'});
        }

        $('#messages').append(html);
    });
});

socket.on('newMessage', function (message) {
  var params = jQuery.deparam(window.location.search);
  var formattedTime= moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();

  jQuery('#message').append(template);
  var html =Mustache.render(template,{
    text:message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);

  var list = jQuery('#messages').children('li:last-child');
      if (message.from === params.name) {
          list.css({'float':'right', 'padding':'10px'});
      }
      if (message.from === 'Admin') {
          list.css({'display':'table', 'margin':'0 auto'});
      }



  scrollToBottom();

});

socket.on('newLocationMessage', function (message) {
  var params = jQuery.deparam(window.location.search);
  var formattedTime= moment(message.createdAt).format('h:mm a');
  var template=jQuery('#location-message-template').html();
  var html = Mustache.render(template,{
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
jQuery('#messages').append(html);
var list = jQuery('#messages').children('li:last-child');
    if (message.from === params.name) {
        list.css({'float':'right', 'padding':'10px'});
    }
scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
    messageTextBox.val('')

  });
});


var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');
  var myVar;

  navigator.geolocation.getCurrentPosition(function (position) {


    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
  socket.on('disconnect', function () {
    console.log('Disconnected from server');
  });
});
