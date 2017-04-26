import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { UserData } from "./userdata.model";
import { CredentialUpdate } from "./credentialupdate.model";
import { UserSettingsService } from "./user-settings.service";
@Component({
	selector: 'user-settings',
	templateUrl: './user-settings.component.html',
	styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
	@Input() userData: UserData;
	@Input() credentialUpdate: CredentialUpdate;
	reponse: any;
	error: any;
	constructor(private userDataService: UserSettingsService ) { }

	ngOnInit() {
		this.userData = new UserData;
		this.credentialUpdate = new CredentialUpdate;
		this.userDataService.getUserData().subscribe(userData => this.userData = userData,
			error => this.error = <any>error);
	}
	updateInformation(): void{
		this.userDataService.updateUserData(this.userData).subscribe(response => console.log(response), error => this.error = <any>error);
	}
	updatePassword(): void{
		if (this.credentialUpdate.checkPasswordMatching()){
			this.userDataService.updatePassword(this.credentialUpdate).subscribe(response => console.log(response), error => this.error = <any>error);
			alert("ok");
		}
		else{
			alert("Salasanat eivät täsmää");
		}

	}

}
