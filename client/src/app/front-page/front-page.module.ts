import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { LoginService } from "./login/login.service";

import { SignupService } from "./signup/signup.service"; 

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [LoginComponent, SignupComponent],
    exports: [LoginComponent, SignupComponent],
    providers: [LoginService, SignupService]
})
export class FrontPageModule { }