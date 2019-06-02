import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { UserData } from "./userdata.model";
import { UserSettingsService } from "./user-settings.service";
@Component({
	selector: 'users-user-settings',
	templateUrl: './user-settings.component.html',
	styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
	@Input() userData: UserData;
	
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
		this.userDataService.getUserData().subscribe(userData => {this.userData = userData; console.log(JSON.stringify(this.userData));},
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
