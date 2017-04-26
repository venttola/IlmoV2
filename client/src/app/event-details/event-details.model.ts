import { Platoon } from "./platoon.model";
import { Event } from "../event.model";

export class EventDetails {
	event: Event;
	platoonList: Platoon[];
	constructor(private data: any){
		this.event = Event.fromJSON(data.event);
		this.platoonList = new Array<Platoon>();
		for ( let platoon of data.platoons){
			this.platoonList.push(Platoon.fromJSON(platoon));
		}
	}
}
