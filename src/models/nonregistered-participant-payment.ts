"use strict";

export function NonregisteredParticipantPayment(db: any) {
	var nonregisteredParticipantPayment = db.define("NonregisteredParticipantPayment", {
		paidOn: {type: "date"},
		isPaid: {type: "boolean"}

	});
	//Add a price function
};