import { Component, OnInit, Input } from '@angular/core';
import { PasswordResetService } from "./password-reset.service";

@Component({
  selector: 'public-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  @Input() userEmail: string;
  errorMessage: string;
  error: any;
  constructor(private passwordResetService: PasswordResetService) { 
  	this.errorMessage = "";
  }

  ngOnInit() {
  	this.userEmail ="";
  }
  requestPasswordReset(): void {
  	this.passwordResetService.sendResetRequest(this.userEmail).
		subscribe(function(result){
		}, error => this.error = <any>error);

  }

}
