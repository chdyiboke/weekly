/**
 * A instanceof B
 */

function myInstanceof(obj, type) {
  while(true){
    if(obj.__proto__ === type.prototype) {
      return true;
    }else{
      obj= obj.__proto__;
      if(obj){
        myInstanceof(obj, type);
      }else{
        return false;
      }
    }
  }
}
myInstanceof([], Array)
myInstanceof([], Object)
