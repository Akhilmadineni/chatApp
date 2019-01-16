var expect = require('expect');

var {generateMessage} = require('./message');
describe('generate message',()=>{
  it('should generate correct message object',()=>{
    var from ='Akhil';
    var text = 'Some message';
    var message = generateMessage(from, text);

    expect(typeof message.createdAt).toEqual('number');
    expect(message).toMatchObject({from, text});
  });

});
