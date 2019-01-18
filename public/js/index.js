var socket=io();

var dropDown=jQuery('#drop-down_existing-room');
var roomInputBox=jQuery('#input-box_room');

socket.on('connect',function(){
    socket.emit('newIncomingRequest');
});

socket.on('updateRoomList',function(data){

    var op1=jQuery('<option></option').text('Add new room').attr("value","add");
    jQuery("#drop-down_existing-room").html(op1);
    data.forEach(function(room){
        console.log(room);
        jQuery("#drop-down_existing-room").append(jQuery('<option></option>').text(room).attr('value',room));
    });


});

dropDown.on('change',function(){

    if(this.value!='add'){
        dropDown.attr('name','room');
        roomInputBox.attr('value',this.value);
        roomInputBox.attr('disabled','disabled');
    }else{
        roomInputBox.removeAttr('value');
        dropDown.attr('name','');
        roomInputBox.removeAttr('disabled');
    }
});
