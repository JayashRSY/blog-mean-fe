import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  private authStatusSubs: Subscription = new Subscription();

  constructor(public _authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSubs = this._authService.getAuthStatusListener()
      .subscribe(isAuthStatus => {
        this.isLoading = false
      })
  }
  onLogin(form: NgForm): void {
    if (form.invalid) {
      return
    }
    this.isLoading = true;
    this._authService.loginUser(form.value.email, form.value.password)
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe()
  }
}
