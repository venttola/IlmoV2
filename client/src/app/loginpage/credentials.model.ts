export class Credentials {
    email: string
    password: string
    
    constructor() {
    }
    public encodePassword(): void{
    	//Perform encoding
    	//this.password = btoa(this.password);
    }
}