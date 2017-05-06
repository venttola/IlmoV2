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
		let organization = Object.create(Organization.prototype);
		Object.assign(Organization, json);
		return organization;
	}
}
