export class Platoon {
	id: number;
	name: string;
	constructor(){
		this.id = 0;
		this.name = "";
	}
	static fromJSON (json: any): Platoon{
		let platoon = Object.create(Platoon.prototype);
		Object.assign(platoon, json);
		return platoon;
	}
}
