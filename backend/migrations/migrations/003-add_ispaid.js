
exports.up = function(next){
  this.addColumn("GroupPayment",{
  	isPaid: {type: "boolean", defaultValue: false }
  }, next);
};

exports.down = function(next){
  next();
};
