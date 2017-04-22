export class Event {
	id: number;
	name: string;
	startDate: Date;
	endDate: Date;
	description: string;
	registerationOpen: boolean;
	constructor(){
		this.name = "";
		this.registerationOpen = false;
	}
}
