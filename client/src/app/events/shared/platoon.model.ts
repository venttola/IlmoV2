import { ParticipantGroup } from "./participantgroup.model";

export class Platoon {
	id: number;
	name: string;
	participantGroups: ParticipantGroup[];
	
	constructor() {
		this.id = 0;
		this.name = "";
	}
	static fromJSON(json: any): Platoon {
		let platoon = Object.create(Platoon.prototype);
		Object.assign(platoon, json);
		return platoon;
	}
}
