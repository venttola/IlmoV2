import { Component, OnInit } from '@angular/core';
import { AdminService } from "../shared/admin.service";
import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
@Component({
	selector: 'admin-password-reset',
	templateUrl: './password-reset.component.html',
	styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
	private userEmail: string;
	private password: string;
	private rePassword: string;
	private error: any;
	private searchTermStream = new Subject<string>();
	private users: Observable <any[]>;
	constructor( private adminService: AdminService  ) {
	 }

	ngOnInit() {
		this.users = this.searchTermStream
			.debounceTime(300)
			.distinctUntilChanged()
			.switchMap((query: string) => this.adminService.getUsers(query));
		//For debugging
		//this.getUsers(undefined);
	}
	searchUsers(query: string) {
		this.searchTermStream.next(query);
	}
	private resetUserPassword() {
		this.adminService.resetUserPassword(this.userEmail, this.password, this.rePassword).
		subscribe(function(result){
			console.log("In AdminPageComponent" + result);
		}, error => this.error = <any>error);
	}

	/*private getUsers(query: string) {
		this.adminService.getUsers(query).
		subscribe(users => {
			console.log(JSON.stringify(users));
			this.users = users;
		}, error => {
			this.error = <any> error;
		});
	}*/

}
