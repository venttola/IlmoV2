export class CredentialUpdate {
	email: string;
	password: string;
	newPassword: string;
	reNewPassword: string;
	constructor(){
		this.email = "";
		this.password = "";
		this.newPassword ="";
		this.reNewPassword = "";

	}
	public allPresent(): boolean{
		return this.password ==="" ||
			   this.newPassword ==="" ||
		       this.reNewPassword ==="";
	}

	public checkPasswordMatching(): boolean{
		return  this.newPassword !=="" && 
				this.reNewPassword !=="" && 
				this.newPassword === this.reNewPassword;
	}
}
