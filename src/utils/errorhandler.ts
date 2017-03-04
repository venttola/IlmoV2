export const enum ErrorType {
    NOT_FOUND,
    DATABASE_READ
}

export module ErrorHandler {
    export function getErrorMsg(item: String, errorType: ErrorType) {
        const prefix = "ERROR:";

        let msg = "";
        switch (errorType) {
            case ErrorType.NOT_FOUND:
                msg = `${prefix} ${item} was not found`;
                break;
            case ErrorType.DATABASE_READ:
                msg = `${prefix} ${item} could not be read from the database`;
        }

        console.log(msg);
        return msg;
    }
}

export class APIError extends Error {
    constructor(public statusCode: number, public message: string) {
        super();
    }
}

export class DatabaseError extends APIError {}