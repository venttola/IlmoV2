export class ParticipantGroup {
    id: number;
    name: string;
    description?: string;
    platoonId?: number;
    eventId?: number;

    static fromJSON(json: any): ParticipantGroup {
        let group = Object.create(ParticipantGroup.prototype);
        Object.assign(group, json);
        return group;
    }
}
