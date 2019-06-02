
exports.up = function(next){
  this.addColumn("User",{ 
  	phone: {type: "text", defaultValue: ""}
  }, next);
};

exports.down = function(next){
  next();
};
