angular.module('factory.service',[])
.factory('Factory',  function($state) {
  　var Option = {
　　　　create: function(mi, ma, st){
　　　　　　var option = {
            quantity: mi,
            min: mi,
            max: ma,
            step: st
          };
    　　　 option.increase = function(){
            this.quantity = this.quantity + this.step;
            if (this.quantity >= this.max) {
              this.quantity = this.max;
            }
          };
          option.decrease = function(){
            this.quantity = this.quantity - this.step;
            if (this.quantity <= this.min) {
              this.quantity = this.min;
            }
          };
　　　　　　return option;
　　　　}
　　};


  return {
    newOption: function(min, max, step) {
      return Option.create(min, max, step);
    }
    
  }
});