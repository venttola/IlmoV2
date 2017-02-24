"use strict";

export = function(db: any) {
	var admins = db.define("Admins", {
	});
	admins.hasMany ("administrator", db.models.User);
};