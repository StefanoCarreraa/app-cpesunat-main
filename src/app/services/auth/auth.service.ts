import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { catchError, Observable, throwError } from "rxjs";
import { HttpClient,HttpErrorResponse,HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public url = environment.url;
  constructor(
    private _http:HttpClient
  ) { }

  login_admin(data:any):Observable<any>{
    return this._http.post(this.url+'login_admin',data).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
