exports.up = function(next){
 this.addColumn("User",{ 
	passwordResetExpires: {type: "integer", size: 8, defaultValue: 0}
  }, next);
};

exports.down = function(next){
  next();
};
