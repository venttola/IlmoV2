export class SignupDetails {
    eventId: number;
    eventName: string;

    groupId: number;
    groupName: string;

    constructor(eventId: number, eventName: string, groupId: number, groupName: string) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.groupId = groupId;
        this.groupName = groupName;
    }

    static fromJSON(json: any): SignupDetails {
        let details = Object.create(SignupDetails.prototype);
        Object.assign(details, json);
        return details;
    }
}
