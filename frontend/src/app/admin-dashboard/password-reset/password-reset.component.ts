import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

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
	searchTermStream = new Subject<string>();
	users: Observable <any[]>;
	constructor( private adminService: AdminService  ) {
	 }

	ngOnInit() {
		this.users = this.searchTermStream.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((query: string) => this.adminService.getUsers(query)),
			);
		//For debugging
		//this.getUsers(undefined);
	}
	searchUsers(query: string) {
		this.searchTermStream.next(query);
	}
	resetUserPassword() {
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
