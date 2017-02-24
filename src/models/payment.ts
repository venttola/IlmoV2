"use strict";

export = function(db: any) {
	var payment = db.define("Payment", {
		name: { type: "text", required: true},
		price: { type: "number", require: true}
	});
	payment.hasOne ("event", db.models.Event, {}, {reverse: "products"} );
	payment.hasOne ("payee", db.models.User, {}, {reverse: "payments"});
};