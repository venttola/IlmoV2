export class UserData {
	email: string;
	password: string;
	newPassword: string;
	reNewPassword: string;
	firstname: string;
	lastname: string;
	dob: string;
	allergies: string
	constructor(){
	}
	
	public encodePassword(): void{
    	//Perform encoding
    	//this.password = btoa(this.password);
    }
    public checkPasswordMatching(): boolean{
    	return this.newPassword == this.reNewPassword;
    }
}
