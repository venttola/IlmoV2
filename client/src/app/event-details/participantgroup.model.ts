export class ParticipantGroup {
    name: string;
    description: string;

    static fromJSON(json: any): ParticipantGroup {
        let group = Object.create(ParticipantGroup.prototype);
        Object.assign(group, json);
        return group;
    }
}
