export class Organization {
	id: number;
	name: string;
	bankAccount: string;
	constructor() {
		this.id = 0;
		this.name = "";
		this.bankAccount = "";
	}
	static fromJSON (json: any): Organization{
		console.log("json: " + JSON.stringify(json));

		let organization = Object.create(Organization.prototype);
		Object.assign(organization, json);
		return organization;
	}
}
