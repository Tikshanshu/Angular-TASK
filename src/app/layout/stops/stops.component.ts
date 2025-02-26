import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommontableComponent } from '../../commontable/commontable.component';


@Component({
  selector: 'app-stops',
  standalone:true,
  imports: [HttpClientModule,CommonModule,CommontableComponent],
  templateUrl: './stops.component.html',
  styleUrl: './stops.component.scss'
})
export class StopsComponent implements OnInit{
   
  url:string='assets/mock/stops.json';

  stopData:any[]=[];

  constructor(private http:HttpClient){}

  ngOnInit(){
    this.http.get<any[]>(this.url).subscribe(data => {
      this.stopData=data;
      console.log(this.stopData[0]);
      });
  }



}
  




