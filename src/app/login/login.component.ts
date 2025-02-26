import { Component,EventEmitter, Output  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { DUMMY_USERS } from '../dummy_user';
import { HomeComponent } from "../home/home.component";


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username:string="";
  password:string="";
  message:string="";
  isLoggedIn: boolean = false;

  @Output() loginStatusChanged = new EventEmitter<boolean>();
  
  constructor(private router: Router) {}

  onLogin() {
    const user = DUMMY_USERS.find(
      u => u.username === this.username && u.password === this.password
    );

    if (user) {
      this.isLoggedIn = true;
      this.message = ''; 
      this.loginStatusChanged.emit(true);
      this.router.navigate(['/home']);
    } else {
      this.message = 'Invalid username or password';
    }
  }

}
