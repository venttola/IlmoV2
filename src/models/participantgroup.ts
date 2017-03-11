"use strict";

export = function(db: any) {
	var participantGroup = db.define("ParticipantGroup", {
		name: { type: "text", required: true },
		description: { type: "text", required: true}
	});

	// TODO: Defined reverse doesn't seem to generate method getMemberships to User model
	participantGroup.hasMany("members", db.models.User, {}, {reverse: "memberships"});
	participantGroup.hasMany("moderator", db.models.User, {}, {reverse: "moderatedGroups"});
};