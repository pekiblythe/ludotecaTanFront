import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Prestamo } from './model/Prestamo';
import { PrestamoPage } from './model/PrestamoPage';
//import { PRESTAMO_DATA } from './model/mock-prestamos';
import { HttpClient } from '@angular/common/http';
import { Clients } from '../clients/model/Clients';


@Injectable({
    providedIn: 'root'
})
export class PrestamoService {

    constructor(
        private http: HttpClient
    ) { }

    getClients(): Observable<Clients[]>{
        return this.http.get<Clients[]>('http://localhost:8080/clients');
    }

    getPrestamos(pageable: Pageable): Observable<PrestamoPage> {
        return this.http.post<PrestamoPage>('http://localhost:8080/prestamo', {pageable:pageable});
    }

    getFilterPrestamos(title?: String, clientName?: Number, datePrestamo?: Date): Observable<Prestamo[]>{
        return this.http.get<Prestamo[]>(this.composeFindUrl(title, clientName, datePrestamo));
      }

    savePrestamos(prestamo: Prestamo): Observable<Prestamo> {
        let url = 'http://localhost:8080/prestamo';
        if (prestamo.id != null) url += '/'+prestamo.id;
        
        return this.http.put<Prestamo>(url, prestamo);
    }

    deletePrestamos(idPrestamo : number): Observable<any> {
        return this.http.delete('http://localhost:8080/prestamo/'+idPrestamo);
    }    

    private composeFindUrl(title?: String, clientId?: Number, datePrestamo?:Date) : string {
        let params = '';
    
        if (title != null) {
            params += 'title='+title;
        }
    
        if (clientId != null) {
            if (params != '') params += "&";
            params += "clients_id="+clientId;
        }

        if (datePrestamo != null) {
            if (params != '') params += "&";
            params += "datein="+datePrestamo.toISOString().slice(0,10);
        }
    
        let url = 'http://localhost:8080/prestamo'
    
        if (params == '') return url;
        else return url + '?'+params;
    }
}
