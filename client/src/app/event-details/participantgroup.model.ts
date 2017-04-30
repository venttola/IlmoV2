export class ParticipantGroup {
    name: string;
    description?: string;
    platoonId?: number;

    static fromJSON(json: any): ParticipantGroup {
        let group = Object.create(ParticipantGroup.prototype);
        Object.assign(group, json);
        return group;
    }
}
