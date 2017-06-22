//import Promise from "ts-promise";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";
import { uniq, flatten, contains } from "underscore";
module Service {
    export class AdminService {
        constructor(private userModel: any) { }

        public getAllUsers = (query: string) => {
            return new Promise((resolve, reject) => {
                console.log(JSON.stringify (this.userModel));
                this.userModel.all(function (err: Error, users: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("User data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!users) {
                        let errorMsg = ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        let userData = users.map((user: any) => {
                                user.password = undefined; 
                                return user});
                        return resolve(users);
                    }
                });
            });
        };
}
}

export = Service;