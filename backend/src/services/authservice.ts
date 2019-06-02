import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

import { UserService } from "./userservice";
module Service {
	export class AuthService {
		constructor(private userService: UserService) {

		}
		public checkIfAdmin = (username: any) => {
            return new Promise((resolve, reject) => {
            	this.userService.getUser(username).then((user: any) => {
	                user.hasAdmin(function (err: any, isAdmin: Boolean) {
	                    if (err && err.literalCode !== "NOT_FOUND") {
	                        console.log("ERROR OCCURED: " + err);
	                        return reject(err);
	                    } else {
	                        //console.log("User '" + user.email + "' admin status: " + isAdmin);
	                        return resolve(isAdmin);
	                    }
	                });
	            });
            });
        }

		public getOrganizationMemberships = (username: string) => {
			return new Promise((resolve, reject) => {
				this.userService.getUser(username).then((user: any) => {
					user.getOrganizations(function(err: any, organizations: any){
						if (err) {
							return reject(err);
						} else {
							 //console.log("User '" + user.email + "' Organizations: " + JSON.stringify(organizations));
							 let organizationIds = organizations.map((o: any) => {
							 	return {id: o.id};
							 });
							return resolve(organizationIds);
						}
					});
				});
			});

		}
		public getModeratedGroups = (username: string) => {
			return new Promise((resolve, reject) => {
				this.userService.getUser(username).then((user: any) => {
					user.getModeratedGroups(function(err: any, groups: any){
						if (err) {
							return reject(err);
						} else {
							 //console.log("User '" + user.email + "' Groups: " + JSON.stringify(groups));
							 let groupIds = groups.map((g: any) => {
							 	return {id: g.id};
							 });
							return resolve(groupIds);
						}
					});
				});
			});

		}

	}
}

export = Service;