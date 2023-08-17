import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clients } from './model/Clients';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(
    private http: HttpClient
  ) { }

  getClients(): Observable<Clients[]> {
    return this.http.get<Clients[]>('http://localhost:8080/clients');
  }

  saveClients(clients: Clients): Observable<Clients> {
    let url = 'http://localhost:8080/clients';
        if (clients.id != null) url += '/'+clients.id;

        return this.http.put<Clients>(url, clients);
  }

  deleteClients(idClients : number): Observable<any> {
    return this.http.delete('http://localhost:8080/clients/'+idClients);
  }  
}
