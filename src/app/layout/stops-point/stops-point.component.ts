import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommontableComponent } from '../../commontable/commontable.component';

@Component({
  selector: 'app-stops-point',
   imports: [HttpClientModule,CommonModule,CommontableComponent],
 
  templateUrl: './stops-point.component.html',
  styleUrl: './stops-point.component.scss'
})
export class StopsPointComponent {
 url:string='assets/mock/stoppoints.json';

  stopData:any[]=[];

  constructor(private http:HttpClient){}

  ngOnInit(){
    this.http.get<any[]>(this.url).subscribe(data => {
      this.stopData=data;
       
      });
  }
  

}
