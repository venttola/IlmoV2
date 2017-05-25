import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

import { UserService } from "./userservice";
module Service {
	export class AuthService {
		constructor(private userService: UserService){

		}
		public getModeratedGroups = (username: string) => {
			return new Promise((resolve, reject) => {
				this.userService.getUser(username).then((user: any) => {
					user.getOrganizations(function(err: Error, organizations: any){
						if (err) {
							return reject(err);
						} else {
							return resolve(organizations);
						}
					});
				});
			});

		}
		public getOrganizationMemberships = (username: string) => {
			return new Promise((resolve, reject) => {
				this.userService.getUser(username).then((user: any) => {
					user.getModeratedGroups(function(err: Error, groups: any){
						if (err) {
							return reject(err);
						} else {
							return resolve(groups);
						}
					});
				});
			});

		}

	}
}

export = Service;