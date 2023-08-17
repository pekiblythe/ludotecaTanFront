import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Prestamo } from './model/Prestamo';
import { PrestamoPage } from './model/PrestamoPage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Clients } from '../clients/model/Clients';


@Injectable({
    providedIn: 'root'
})
export class PrestamoService {

    constructor(
        private http: HttpClient,
    ) { }



    getClients(): Observable<Clients[]>{
        return this.http.get<Clients[]>('http://localhost:8080/clients');
    }
/*
    getPrestamos(pageable: Pageable): Observable<PrestamoPage> {
        return this.http.post<PrestamoPage>('http://localhost:8080/prestamo', {pageable:pageable});
    }
*/
    getFilterPrestamos(gameId?: number, clientName?: number, datePrestamo?: Date, pageable?:Pageable): Observable<PrestamoPage>{
       // const filters = {game:gameId, clients:clientName, datein:datePrestamo}
        return this.http.post<PrestamoPage>('http://localhost:8080/prestamo', {gameId:gameId, clientsId:clientName, datein:datePrestamo, pageable});
      }

     

    savePrestamos(prestamo: Prestamo): Observable<Prestamo> {
        let url = 'http://localhost:8080/prestamo';
        if (prestamo.id != null) url += '/'+prestamo.id;
        
        return this.http.put<Prestamo>(url, prestamo).pipe(
            catchError(this.handleError)
          );
    }

    deletePrestamos(idPrestamo : number): Observable<unknown> {
        return this.http.delete('http://localhost:8080/prestamo/'+idPrestamo);
    }    

    private composeFindUrl(gameId?: number, clientId?: number, datePrestamo?:Date) : string {
        let params = '';
    
        if (gameId != null) {
            params += 'game_id='+gameId;
        }
    
        if (clientId != null) {
            if (params != '') params += "&";
            params += "clients_id="+clientId;
        }

        if (datePrestamo != null) {
            if (params != '') params += "&";
            params += "datein="+datePrestamo.toISOString().slice(0,10);
        }
    
        const url = 'http://localhost:8080/prestamo'
    
        if (params == '') return url;
        else return url + '?'+params;
    }

    private handleError(error: HttpErrorResponse) {
        //console.error(error.error.message);
          /*  this.dialog.open(DialogConfirmationComponent, {
                data: { 
                    title: "La accion no se ha podido realizar", 
                    description: error.error.message }
            });    */          
                
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
         /* console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
         */
        // Return an observable with a user-facing error message.
        // console.error(error.error);
        return throwError(() => new Error(error.error.message));
      }
}