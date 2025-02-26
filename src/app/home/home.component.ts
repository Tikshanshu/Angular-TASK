import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../layout/nav-bar/nav-bar.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule,NavBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isCollapsed = true;
  compname:string='Home';

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  setCompName(x:string){
    this.compname=x;
  }

}
