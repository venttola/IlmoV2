export class Event {
	id: number;
	name: string;
	startDate: Date;
	endDate: Date;
	description: string;
	registerationOpen: boolean;
	constructor() {
		this.name = "";
		this.registerationOpen = false;
	}
	static fromJSON(json: any): Event {
		let event = Object.create(Event.prototype);
		Object.assign(event, json);
		return event;
	}
}
