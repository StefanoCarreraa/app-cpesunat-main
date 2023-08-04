import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { catchError, Observable, throwError } from "rxjs";
import { HttpClient,HttpErrorResponse,HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GuiaRemisionRemitenteService {
  public url = environment.url;

  constructor(private _http:HttpClient) { }

  guiaremisionremitente_envio(data:any):Observable<any>{
    return this._http.post(this.url + 'GuiaRemisionRemitente',data).pipe(catchError(this.handleError));
  }

  guiaremisionremitentemanual_registrar(data:any):Observable<any>{
    return this._http.post(this.url + 'GuiaRemisionRemitente/Manual',data).pipe(catchError(this.handleError));
  }

  guiaremisionremitentemanual_listar(ruc:string):Observable<any>{
    return this._http.get(this.url + 'GuiaRemisionRemitente/Manual/Listar/'+ruc).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
