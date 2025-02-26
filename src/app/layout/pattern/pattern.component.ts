import { CommonModule } from '@angular/common';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommontableComponent } from '../../commontable/commontable.component';

@Component({
  selector: 'app-pattern',
  standalone:true,
 imports: [HttpClientModule,CommonModule,CommontableComponent],
  templateUrl: './pattern.component.html',
  styleUrl: './pattern.component.scss'
})
export class PatternComponent {
  url:string='assets/mock/pattern.json';
  
    patternData:any[]=[];
  
    constructor(private http:HttpClient){}
  
    ngOnInit(){
      this.http.get<any[]>(this.url).subscribe(data => {
        this.patternData=data;
        
        });
    }

}
