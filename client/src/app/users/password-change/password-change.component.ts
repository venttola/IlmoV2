import { Component, OnInit, Input } from '@angular/core';

import { PasswordChangeService } from "./password-change.service";

import { CredentialUpdate } from "./credentialupdate.model";
@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  @Input() credentialUpdate: CredentialUpdate;

  credentialUpdateMessage: string;
  errorMessage: string;
  reponse: any;
  error: any;
  constructor(private passwordChangeService: PasswordChangeService) { }

  ngOnInit() {

		this.credentialUpdate = new CredentialUpdate;

  }

  updatePassword(): void{
		this.errorMessage = "";
		this.credentialUpdateMessage = "";
		this.passwordChangeService.updatePassword(this.credentialUpdate).
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
		} else {
			this.errorMessage = "Tuntematon virhe.";
		}
	}
}
