import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'public-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  @Input() userEmail: string;
  errorMessage: string;
  constructor() { 
  	this.errorMessage = "";
  }

  ngOnInit() {
  	this.userEmail ="";
  }
  requestPasswordReset(): void {

  }

}
