import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Clients } from '../model/Clients';
import { ClientsService } from '../clients.service';
import { MatDialog } from '@angular/material/dialog';
import { ClientsEditComponent } from '../clients-edit/clients-edit.component';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
  dataSource = new MatTableDataSource<Clients>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private clientsService: ClientsService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.clientsService.getClients().subscribe(
      clients => this.dataSource.data = clients
    );
  }

  createClients() {    
    const dialogRef = this.dialog.open(ClientsEditComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });    
  }

  editClients(clients: Clients) {
    const dialogRef = this.dialog.open(ClientsEditComponent, {
      data: { clients }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  deleteClients(clients: Clients) {    
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { title: "Eliminar cliente", description: "Atención si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientsService.deleteClients(clients.id).subscribe(() => {
          this.ngOnInit();
        }); 
      }
    });
  }
}
