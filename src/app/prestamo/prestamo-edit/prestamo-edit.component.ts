import { Component, Inject, OnInit } from '@angular/core';
import { Prestamo } from '../model/Prestamo';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Game } from 'src/app/game/model/Game';
import { Clients } from 'src/app/clients/model/Clients';
import { GameService } from 'src/app/game/game.service';
import { PrestamoService } from '../prestamo.service';
import { ClientsService } from 'src/app/clients/clients.service';

@Component({
  selector: 'app-prestamo-edit',
  templateUrl: './prestamo-edit.component.html',
  styleUrls: ['./prestamo-edit.component.scss']
})
export class PrestamoEditComponent implements OnInit{

  prestamo: Prestamo;
  games: Game[];
  clients: Clients[];

  constructor(
    public dialogRef: MatDialogRef<PrestamoEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
        private gameService: GameService,
        private clientsService: ClientsService,
        private prestamoService: PrestamoService,
  ){}
  


ngOnInit(): void {
  if(this.data.prestamo !=null){
    this.prestamo = Object.assign({}, this.data.prestamo);
  }else{
    this.prestamo = new Prestamo();
  }
  
  this.clientsService.getClients().subscribe(
    clients => {
      this.clients = clients;

      if(this.prestamo.clients !=null){
        let clientFilter: Clients[] = clients.filter(clients => clients.id == this.data.prestamo.id);
        if(clientFilter != null){
          this.prestamo.clients = clientFilter[0];
        }
      }
    }
  );

  this.gameService.getGames().subscribe(
    games => {
      this.games = games;

      if(this.prestamo.game != null){
        let nameFilter: Game[] = games.filter(game => game.title == this.data.game.title);
        if(nameFilter != null){
          this.prestamo.game = nameFilter[0];
        }
      }
    }
  );
  
 
  }

  onSave() {
    console.log('Datos a enviar:', this.prestamo);
    this.prestamoService.savePrestamos(this.prestamo).subscribe(result => {
      this.dialogRef.close();
    });    
}  

  onClose() {
    this.dialogRef.close();
  }
}
