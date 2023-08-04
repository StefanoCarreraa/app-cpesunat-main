import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FakeServicesService {

  constructor(private http: HttpClient) { }

  cargarUbigeos() {
    return this.http.get<any[]>('assets/json/ubigeos.json');
  }

  cargarUnidades() {
    return this.http.get<any[]>('assets/json/unidad-medida.json');
  }

}
