"use strict";

export function ParticipantPayment(db: any) {
	var participantPayment = db.define("ParticipantPayment", {
		paidOn: {type: "date"},
		isPaid: {type: "boolean"}

	});
	//Add a price function
};