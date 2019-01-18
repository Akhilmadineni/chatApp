 const _ = require('lodash');

class Users{
  constructor () {
    this.users = [];
  }
  addUser (id, name , room) {
      var user = {id , name, room};
      this.users.push(user);
      return user;
  }
  removeUser(id) {
   var user =this.getUser(id);

   if(user){
     var newUsers=this.users= this.users.filter((user) => user.id !==id);
     this.users=newUsers;
   }
   return user;
  }
  getUser(id){
      var user=this.users.filter((user) => user.id ===id)[0];
      return user;
  }
  getUserList(room){
    var users = this.users.filter((user)=>user.room===room);
      var namesArray =users.map((user)=>user.name);

      return namesArray;

  }
  getRooms(){
       var rooms=[];
       var users=this.users;
       users.forEach((user)=>{
           rooms.push(user.room);
       });
       rooms=_.uniq(rooms);
       return rooms;
   }
}

module.exports ={Users};
