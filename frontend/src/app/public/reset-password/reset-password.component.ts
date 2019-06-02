import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";

import { ResetPasswordService } from "./reset-password.service";
import { ResetPasswordModel } from "./reset-password.model";

@Component({
  selector: 'public-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  @Input() resetPasswordData: ResetPasswordModel
  token: string;
  passwordResetMessage: string;
  errorMessage: string;
  reponse: any;
  error: any;
  constructor(private route: ActivatedRoute,
  	private resetPasswordService: ResetPasswordService) { 

  }

  ngOnInit() {
  	this.route.queryParams
   .subscribe((params: Params) => {
      this.token = params["token"];});
    this.resetPasswordData = new ResetPasswordModel();
	this.passwordResetMessage = "";
	this.errorMessage = "";

  }

  resetPassword(): void{
		this.errorMessage = "";
		this.passwordResetMessage = "";
		this.resetPasswordService.resetPassword(this.resetPasswordData, this.token).
		subscribe(response => {
			this.passwordResetMessage = "Salasanan vaihto onnistui.";
		}, 
		error => {
			this.error = <any>error;
			this.setErrorMessage(error.status);
		});

	}
	private setErrorMessage(statusCode: number){
		console.log("Status: " + statusCode);
		if (statusCode == 404){
			this.errorMessage = "Käyttäjätietoja ei löytynyt";
		} else {
			this.errorMessage = "Tuntematon virhe.";
		}
	}

}
