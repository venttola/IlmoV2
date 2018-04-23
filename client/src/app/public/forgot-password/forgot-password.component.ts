import { Component, OnInit, Input } from '@angular/core';
import { ForgotPasswordService } from "./forgot-password.service";

@Component({
  selector: 'public-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @Input() userEmail: string;
  errorMessage: string;
  error: any;
  constructor(private forgotPasswordService: ForgotPasswordService) { 
  	this.errorMessage = "";
  }

  ngOnInit() {
  	this.userEmail ="";
  }
  requestPasswordReset(): void {
  	this.forgotPasswordService.sendResetRequest(this.userEmail).
		subscribe(function(result){
		}, error => this.error = <any>error);

  }

}
