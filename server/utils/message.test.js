var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');
describe('generate message',()=>{
  it('should generate correct message object',()=>{
    var from ='Akhil';
    var text = 'Some message';
    var message = generateMessage(from, text);

    expect(typeof message.createdAt).toEqual('number');
    expect(message).toMatchObject({from, text});
  });

});
describe('generate location message',()=>{
  it('should generate correct object',()=>{
    var from = 'Akhil';
    var latitude= '15';
    var longitude= '19';
    var url = 'https://www,google.com/maps?q=15,19'
    var message= generateLocationMessage(from, latitude,longitude);

    expect(typeof message.createdAt).toEqual('number');
    expect(message).toMatchObject({from, url});
  })

})
