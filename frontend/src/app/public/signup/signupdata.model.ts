export class SignupData {
	email: string;
	password: string;
	repassword: string;
	firstname: string;
	lastname: string;
	dob: string;
	phone: string;

	constructor() {
	}

	public allPresent(): boolean {
		return (this.email != undefined &&
			this.password != undefined &&
			this.repassword != undefined &&
			this.firstname != undefined &&
			this.lastname != undefined &&
			this.dob != undefined);
	}
	public encodePassword(): void {
		//Perform encoding
		//this.password = btoa(this.password);
	}
	public passwordsMatching(): boolean {
		return this.password == this.repassword;
	}
}