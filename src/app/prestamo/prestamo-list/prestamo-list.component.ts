import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Prestamo } from '../model/Prestamo';
import { PrestamoService } from '../prestamo.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Pageable } from 'src/app/core/model/page/Pageable';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
import { PrestamoEditComponent } from '../prestamo-edit/prestamo-edit.component';
import { ClientsService } from 'src/app/clients/clients.service';
import { Clients } from 'src/app/clients/model/Clients';
import { Game } from 'src/app/game/model/Game';
import { GameService } from 'src/app/game/game.service';
import { Moment } from 'moment';

@Component({
  selector: 'app-prestamo-list',
  templateUrl: './prestamo-list.component.html',
  styleUrls: ['./prestamo-list.component.scss']
})
export class PrestamoListComponent implements OnInit{

  pageNumber = 0;
  pageSize = 5;
  totalElements = 0;
    
  clients: Clients[];
  games: Game[];
  prestamos: Prestamo[];

  filterClient: Clients;
  filterTitle: Game;
  filterDate: Moment;

  dataSource = new MatTableDataSource<Prestamo>();
  displayedColumns: string[] = ['id', 'name', 'client', 'datein', 'dateout', 'action'];

  constructor(
      private prestamoService: PrestamoService,
      private clientsService: ClientsService,
      private gameService: GameService,
      public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    
    this.gameService.getGames().subscribe(
        game => this.games = game
    )
    this.clientsService.getClients().subscribe(
        clients => this.clients = clients
    )
    
    this.loadPage();
  }

  loadPage(event?: PageEvent) {

      const pageable : Pageable =  {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          sort: [{
              property: 'id',
              direction: 'ASC'
          }]
      }
      const gameId=null;
      const clientName=null;
      const datePrestamo=null;

      if (event != null) {
          pageable.pageSize = event.pageSize
          pageable.pageNumber = event.pageIndex;
      }

      this.prestamoService.getFilterPrestamos(gameId, clientName, datePrestamo, pageable).subscribe(data => {
          this.dataSource.data = data.content;
          this.pageNumber = data.pageable.pageNumber;
          this.pageSize = data.pageable.pageSize;
          this.totalElements = data.totalElements;
      });

  }  

  onCleanFilter(): void {
    this.filterTitle = null;
    this.filterClient = null;
    this.filterDate = null;

    this.loadPage();
}

onSearch(): void {

    const gameId = this.filterTitle != null ? this.filterTitle.id: null;
    const clientId = this.filterClient != null ? this.filterClient.id: null;
    const datePrestamo = this.filterDate != null ? this.filterDate.toDate(): null;
    const pageable : Pageable =  {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sort: [{
            property: 'id',
            direction: 'ASC'
        }]
    }



    this.prestamoService.getFilterPrestamos(gameId, clientId, datePrestamo, pageable).subscribe(
        data => {
            this.dataSource.data = data.content;
            this.pageNumber = data.pageable.pageNumber;
            this.pageSize = data.pageable.pageSize;
            this.totalElements = data.totalElements;
        }
    );
}

  createPrestamo() {      
      const dialogRef = this.dialog.open(PrestamoEditComponent, {
          data: {}
      });

      dialogRef.afterClosed().subscribe(() => {
          this.ngOnInit();
      });      
  }  

  editPrestamo(prestamo: Prestamo) {    
      const dialogRef = this.dialog.open(PrestamoEditComponent, {
          data: { prestamo: prestamo }
      });

      dialogRef.afterClosed().subscribe(() => {
          this.ngOnInit();
      });    
  }

  deletePrestamo(prestamo: Prestamo) {    
      const dialogRef = this.dialog.open(DialogConfirmationComponent, {
          data: { title: "Eliminar prestamo", description: "Atención si borra el prestamo se perderán sus datos.<br> ¿Desea eliminar el prestamo?" }
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.prestamoService.deletePrestamos(prestamo.id).subscribe(() =>  {
                  this.ngOnInit();
              }); 
          }
      });
  }  
}