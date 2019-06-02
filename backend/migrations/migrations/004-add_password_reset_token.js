exports.up = function(next){
  this.addColumn("User",{ 
  	passwordResetToken: {type: "text", defaultValue: ""},
  }, next);
};

exports.down = function(next){
  next();
};
