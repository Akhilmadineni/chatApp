var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});

var locationB= jQuery('#send-location');
locationB.on('click',function(){
  if(navigator.geolocation){
    return alert('geolocation not supported');
  }
  navigator.geolocation.getCurrentPostion(function(position){
       console.log(position);  
  },function(){
    alert('unable to fetch location');
  });
});
