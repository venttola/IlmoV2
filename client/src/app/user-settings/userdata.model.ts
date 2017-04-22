export class UserData {
	email: string;
	password: string;
	firstname: string;
	lastname: string;
	dob: string;
	allergies: string
	constructor(){
		this.email = "";
		this.password = "";
		this.firstname = "";
		this.lastname = "";
		this.dob = "";
		this.allergies = "";
	}
	public passwordPresent(): boolean{
		return this.password !=="";
	}
}
