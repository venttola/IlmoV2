"use strict";

export = function(db: any) {
	var participantGroup = db.define("ParticipantGroup", {
		name: { type: "text" },
		information: { type: "text" }
	});

	participantGroup.hasMany("moderator", db.models.User, {reverse: "moderatedGroups"});
	participantGroup.hasMany("member", db.models.User);
};