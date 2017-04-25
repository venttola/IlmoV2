import { Component, OnInit } from '@angular/core';
import { Event } from "../event-model";
import { AuthService } from "../authentication/auth.service";
@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  eventList: Event[];
  error: any;
  constructor(private authService: AuthService) {
  }

  ngOnInit() {

  }
 
  logout(): void {
    this.authService.logout();
  }
}
