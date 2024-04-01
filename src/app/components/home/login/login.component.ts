import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Credential } from '../../../auth/credential';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credential!: Credential;
  errorAuth!: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    // localStorage.removeItem('username');
    this.authService.clearLoginData();
    this.credential = new Credential();
    this.authService.logoutWithoutRedirect();
  }

  login() {
    debugger
    this.authService.authenticate(this.credential, () => {
      debugger
      this.errorAuth = true;
    });
    // this.usernameEvent.emit(this.credential.username);
    // this.authService.setUsername(this.credential.username);
    // localStorage.setItem('username', this.credential.username);
  }
}
