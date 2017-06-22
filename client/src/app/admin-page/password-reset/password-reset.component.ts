import { Component, OnInit } from '@angular/core';
import { AdminService } from "../shared/admin.service";
@Component({
	selector: 'admin-password-reset',
	templateUrl: './password-reset.component.html',
	styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
	userEmail: string;
	password: string;
	rePassword: string;
	error: any;
	users: any[];
	constructor( private adminService: AdminService  ) {
	 }

	ngOnInit() {
		this.adminService.getUsers().
		subscribe(users => {
			this.users = users
		}, error => {
			this.error = <any> error;
		});
	}
	public resetUserPassword() {
		this.adminService.resetUserPassword(this.userEmail, this.password, this.rePassword).
		subscribe(function(result){
			console.log("In AdminPageComponent" + result);
		}, error => this.error = <any>error);
	}

}
