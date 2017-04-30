export class Organizer {
	id: number;
	name: string;
	constructor() {
		this.id = 0;
		this.name = "";
	}
	static fromJSON (json: any): Organizer{
		let organizer = Object.create(Organizer.prototype);
		Object.assign(organizer, json);
		return organizer;
	}
}
