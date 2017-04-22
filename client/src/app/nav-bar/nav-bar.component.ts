import { Component, OnInit } from '@angular/core';
import { AuthService } from "../authentication/auth.service";

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private authService : AuthService) { }

  ngOnInit() {
  }
  isLoggedIn(): boolean {
  	return this.authService.loggedIn();
  }
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  logout(): void{
  	this.authService.logout();
  }

}
