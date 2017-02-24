"use strict";

export = function(db: any) {
	var participantGroup = db.define("ParticipantGroup", {
		name: { type: "text", required: true },
		description: { type: "text", required: true}
	});
	participantGroup.hasMany("moderator", db.models.User, {}, {reverse: "moderatedGroups"});
	participantGroup.hasMany("member", db.models.User);
};