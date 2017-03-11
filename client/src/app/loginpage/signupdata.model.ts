export class SignupData{
	email: string;
	password: string;
	repassword: string;
	firstname: string;
	lastname: string;
	constructor(){
	}
	public allPresent(): boolean{
		return (this.email != undefined &&
			   this.password != undefined &&
			   this.repassword != undefined &&
			   this.firstname != undefined &&
			   this.lastname != undefined);
	}
	public encodePassword(): void{
    	//Perform encoding
    	//this.password = btoa(this.password);
    }
    public checkPasswordMatching(): boolean{
    	return this.password == this.repassword;
    }
}