import { Component, Input, OnInit } from '@angular/core';

import { UserData } from "./userdata.model";
import { UserSettingsService } from "./user-settings.service";
@Component({
	selector: 'user-settings',
	templateUrl: './user-settings.component.html',
	styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
	@Input() userData: UserData;
	error: any;
	constructor(private userDataService: UserSettingsService ) { }

	ngOnInit() {
		this.userData = new UserData;
		this.userDataService.getUserData().subscribe(userData => this.userData = userData,
			error => this.error = <any>error);
	}
	sendUpdate(): void{
		console.log("foo");
	}

}
