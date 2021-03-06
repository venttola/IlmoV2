import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { SignupDetails } from "./signup-details.model";
import { AuthorizedHttpService } from "../../shared/authorizedhttp.service";

@Injectable()
export class SignupListingService extends AuthorizedHttpService {

  constructor(protected http: Http) {
    super(http);
  }

  getSignupDetails(): Observable<SignupDetails[]> {
    let username = localStorage.getItem("user");

    return this.http.get("/api/user/" + username + "/event/signup", { headers: this.headers })
      .map((res: Response) => {
        return res.json().map(d => SignupDetails.fromJSON(d));
      })
      .catch(err => this.handleError(err));
  }
}
