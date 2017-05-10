//import Promise from "ts-promise";
import { ErrorHandler, ErrorType, APIError, DatabaseError } from "../utils/errorhandler";

module Service {
    export class OrganizationService {
        constructor(private organizationModel: any) { }

        public getOrganization = (name: string) => {
            return new Promise((resolve, reject) => {
                this.organizationModel.one({ name: name }, function (err: Error, organization: any) {
                    if (err) {
                        let errorMsg = ErrorHandler.getErrorMsg("Organization data", ErrorType.DATABASE_READ);
                        reject(new DatabaseError(500, errorMsg));
                    } else if (!organization) {
                        let errorMsg = ErrorHandler.getErrorMsg("organization", ErrorType.NOT_FOUND);
                        reject(new DatabaseError(400, errorMsg));
                    } else {
                        return resolve(organization);
                    }
                });
            });
        };
    }
}

export = Service;