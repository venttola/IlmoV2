export class ResetPasswordModel {
	password: string;
	verifyPassword: string;
	constructor(){
		this.password = "";
		this.verifyPassword = "";

	}
	public allPresent(): boolean{
		return this.password ==="" ||
		       this.verifyPassword ==="";
	}

	public passwordsMatching(): boolean{
		return  this.password !=="" && 
				this.verifyPassword !=="" && 
				this.password === this.verifyPassword;
	}
}
