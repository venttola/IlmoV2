import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { AuthorizedHttpService } from "../../shared/authorizedhttp.service";
import { Organization } from "../../shared/organization.model";
@Injectable()
export class OrganizationListingService extends AuthorizedHttpService {
  constructor(protected http: Http) {
    super (http);
  }
  getMemberships(): Observable<Organization[]> {
    let userId = localStorage.getItem("user_id");
    return this.http.get("/api/user/" + userId + "/organizations", { headers: this.headers }).map(this.extractData).catch(this.handleError);
  }
}
