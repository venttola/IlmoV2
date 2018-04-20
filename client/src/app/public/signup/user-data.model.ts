export class UserData {
	id: number;
	email: string;

	constructor (){
		this.id = 0;
		this.email = "";
	}
static fromJSON(json: any): UserData {
		let user = Object.create(UserData.prototype);
		Object.assign(user, json);
		return user;
	}
}
