import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';





@Component({
  selector: 'app-root',
  imports: [ RouterOutlet,  LoginComponent, CommonModule, FormsModule,GridModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Task-1';

  isLoggedIn: boolean = true;

  onLoginStatusChange(status: boolean): void {
    this.isLoggedIn = status;  
  }
}
