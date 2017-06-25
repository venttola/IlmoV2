const FinnishBankUtils = require('finnish-bank-utils')

exports.up = function(next){
  this.addColumn("GroupPayment",{ 
  	referenceNumber: {type: "text", required: true,  defaultValue: FinnishBankUtils.generateFinnishRefNumber()}
  }, next);
};

exports.down = function(next){
  next();
};
