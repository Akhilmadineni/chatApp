const expect = require('expect');

//import isRealString

const {isRealString} =require('./validation');

describe('isRealString', () =>{
  it('should reject non-string values', () => {
     var res = isRealString(98);
     expect(res).toBe(false);
  });
  it('should reject string with only spaces', ()=>{
    var res = isRealString(' Andrew  ');
    expect(res).toBe(true);
  });
});
