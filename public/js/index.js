var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formattedTime= moment(message.createdAt).format('h:mm a');

  var li = jQuery('<ul><liclass="message other-message float-right"></li></ul>');
  li.text(`${message.from}: ${formattedTime} ${message.text}`);

  jQuery('#messages').append(li);
});
// socket.on('newLocationMessage',function(message){
//   var li =jQuery('<li></li>');
//   var a = jQuery('<a target="_blank">My current location</a>');
//
//   li.text(`${message.form}:`);
//   a.attr('href:',message.url);
//   li.append(a);
//   jQuery('#messages').append(li);
// });
socket.on('newLocationMessage', function (message) {
  var formattedTime= moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from}:  ${formattedTime}`);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
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

// var locationB= jQuery('#send-location');
// locationB.on('click',function(){
//   if(!navigator.geolocation){
//     return alert('geolocation not supported');
//   }
//
//   locationB.attr('disabled','disabled');
//   navigator.geolocation.getCurrentPosition(function () {}, function () {}, {});
//
//
//   navigator.geolocation.getCurrentPosition(function(position){
//     locationB.removeAttr('disabled');
//     socket.emit('createLocationMessage', {
//     latitude: position.coords.latitude,
//     longitude: position.coords.longitude
//  });
// },function(){
//     alert('unable to fetch location');
//   });
// });
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

});
