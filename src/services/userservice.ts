//import Promise from "ts-promise";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Service {
    export class UserService {
        constructor(private userModel: any) { }

        public getUser = (email: string) => {
            return new Promise((resolve, reject) => {
                this.userModel.one({ email: email }, function (err: Error, user: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("User data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!user) {
                        let errorMsg = ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        return resolve(user);
                    }
                });
            });
        };

        public getUserById = (id: number) => {
            return new Promise((resolve, reject) => {
                this.userModel.one({ id: id }, function (err: Error, user: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("User data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!user) {
                        let errorMsg = ErrorHandler.getErrorMsg("User", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        return resolve(user);
                    }
                });
            });
        };
    }
}

export = Service;