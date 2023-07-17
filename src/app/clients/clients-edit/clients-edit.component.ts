import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clients } from '../model/Clients';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-clients-edit',
  templateUrl: './clients-edit.component.html',
  styleUrls: ['./clients-edit.component.scss']
})
export class ClientsEditComponent implements OnInit {

  clients : Clients;

  constructor(
    public dialogRef: MatDialogRef<ClientsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientsService: ClientsService
  ) { }

  ngOnInit(): void {
    if (this.data.clients != null) {
      this.clients = Object.assign({}, this.data.clients);
    }
    else {
      this.clients = new Clients();
    }
  }

  onSave() {
    this.clientsService.saveClients(this.clients).subscribe({
      complete:()=>this.dialogRef.close(),
      error:(e)=>console.log(e)
    });    
  }  

  onClose() {
    this.dialogRef.close();
  }

}
