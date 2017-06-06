export class UserData {
	email: string;
	password: string;
	firstname: string;
	lastname: string;
	dob: string;
	allergies: string
	phone: string;
	constructor(){
		this.email = "";
		this.password = "";
		this.firstname = "";
		this.lastname = "";
		this.dob = "";
		this.allergies = "";
		this.phone = "";
	}
	static fromJSON(json: any): UserData {
		let data = Object.create(UserData.prototype);
		Object.assign(data, json);
		return data;
	}
}
