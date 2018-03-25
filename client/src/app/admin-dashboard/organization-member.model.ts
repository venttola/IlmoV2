export class OrganizationMember {
	id: number;
	name: string;
	constructor() {
		this.id = 0;
		this.name = "";
	}
	static fromJSON (json: any): OrganizationMember{
		let organizationMember = Object.create(OrganizationMember.prototype);
		Object.assign(organizationMember, json);
		return organizationMember;
	}
}
