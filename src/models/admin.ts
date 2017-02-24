"use strict";

export = function(db: any) {
	var admin = db.define("Admin", {
	});
	admin.hasMany ("administrator", db.models.User);
};