const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(()=>{
    users = new Users();
    users.users=[{
      id:'1',
      name: 'AKhil',
      room: 'A'
    },{
      id:'2',
      name: 'Chinna',
      room: 'B'
    },{
      id:'3',
      name: 'Munna',
      room: 'A'
    }];
  });

  it('SHould add new user', ()=>{
    var users= new Users();
    var user ={
      id: '123',
      name: 'Andrew',
      room: 'The office fans'
    };
    var resUser= users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });
   it('should find user user', () =>{
       var userId = '2';
       var user = users.getUser(userId);

       expect(user.id).toBe(userId);
   });
   it('should not find user', () =>{
       var userId ='99';
       var user =users.getUser(userId);

       expect(user).toNotExist();
   });
  it('should return names for A',()=>{
    var userList = users.getUserList('A');

    expect(userList).toEqual(['AKhil','Munna']);
  });
  it('should return names for B',()=>{
    var userList = users.getUserList('B');

    expect(userList).toEqual(['Chinna']);
  });
});
