import { Component, OnInit, Input } from '@angular/core';
import { ForgotPasswordService } from "./forgot-password.service";

@Component({
  selector: 'public-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @Input() userEmail: string;
  successMessage: string; 
  errorMessage: string;
  error: any;
  constructor(private forgotPasswordService: ForgotPasswordService) { 
  	this.errorMessage = "";
    this.successMessage = "";
  }

  ngOnInit() {
  	this.userEmail ="";
  }
  requestPasswordReset(): void {
  	this.forgotPasswordService.sendResetRequest(this.userEmail).
		subscribe((result) => {
      this.successMessage = "Salasanan resetointilinkki on lähetetty sähköpostiisi.";
      console.log(this.successMessage);
		}, error => this.error = <any>error);

  }

}
