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
	userDataUpdateMessage: string;
	credentialUpdateMessage: string;
	errorMessage: string;
	reponse: any;
	error: any;
	constructor(private userDataService: UserSettingsService ) { 
		this.errorMessage = "";
		this.userDataUpdateMessage = "";
		this.credentialUpdateMessage = "";
	}

	ngOnInit() {
		this.userData = new UserData;
		this.credentialUpdate = new CredentialUpdate;
		this.userDataService.getUserData().subscribe(userData => this.userData = userData,
			error => this.error = <any>error);
	}
	updateInformation(): void{
		this.errorMessage = "";
		this.userDataUpdateMessage = "";
		this.userDataService.updateUserData(this.userData).
		subscribe(response => {
			console.log(response);
			this.userDataUpdateMessage = "Käyttäjätietojen päivitys onnistui.";
			this.errorMessage = "";

		}, 
		error => {
			this.error = <any>error;
			this.setErrorMessage(error.status);
		});
	}
	updatePassword(): void{
		this.errorMessage = "";
		this.credentialUpdateMessage = "";
		this.userDataService.updatePassword(this.credentialUpdate).
		subscribe(response => {
			console.log(response)
			this.credentialUpdateMessage = "Salasanan vaihto onnistui.";

		}, 
		error => {
			this.error = <any>error;
			this.setErrorMessage(error.status);
		});

	}
	private setErrorMessage(statusCode: number){
		console.log("Status: " + statusCode);
		if (statusCode == 403){
			this.errorMessage = "Virheellinen salasana.";
		} else if (statusCode == 404) {
			this.errorMessage = "Käyttäjää ei löytynyt.";
		} else {
			this.errorMessage = "Tuntematon virhe.";
		}
	}

}
