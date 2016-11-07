"use strict";

export = function(db: any) {
	db.define("User", {
		name: String
	});
};