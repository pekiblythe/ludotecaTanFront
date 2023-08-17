import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Prestamo } from './model/Prestamo';
import { PrestamoPage } from './model/PrestamoPage';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Clients } from '../clients/model/Clients';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../core/dialog-confirmation/dialog-confirmation.component';


@Injectable({
    providedIn: 'root'
})
export class PrestamoService {

    constructor(
        private http: HttpClient,
        public dialog: MatDialog,
    ) { }



    getClients(): Observable<Clients[]>{
        return this.http.get<Clients[]>('http://localhost:8080/clients');
    }

    getFilterPrestamos(gameId?: number, clientName?: number, datePrestamo?: Date, pageable?:Pageable): Observable<PrestamoPage>{
        return this.http.post<PrestamoPage>('http://localhost:8080/prestamo', {gameId:gameId, clientsId:clientName, datein:datePrestamo, pageable});
      }

     

    savePrestamos(prestamo: Prestamo): Observable<Prestamo> {
        const fechaInicio = new Date(prestamo.datein).getTime();
        const fechaFin = new Date(prestamo.dateout).getTime();
        const diff = (fechaFin - fechaInicio)/(1000*60*60*24);

        if(Math.abs(diff)>=14){
            this.dialog.open(DialogConfirmationComponent, {
                data: { 
                    title: "La accion no se ha podido realizar", 
                    description: "El periodo de préstamo máximo solo puede ser de 14 días" 
                }})
            }else if(prestamo.datein>prestamo.dateout){
                this.dialog.open(DialogConfirmationComponent, {
                    data: { 
                        title: "La accion no se ha podido realizar", 
                        description: "La fecha de fin no puede ser anterior a la de inicio" 
                    }})
        }else{
        let url = 'http://localhost:8080/prestamo';
        if (prestamo.id != null) url += '/'+prestamo.id;
        
        return this.http.put<Prestamo>(url, prestamo).pipe(
            catchError(this.handleError)
          );}
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
        return throwError(() => new Error(error.error.message));
      }
}