import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading: boolean = false;
  private authStatusSubs: Subscription = new Subscription();

  constructor(public _authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSubs = this._authService.getAuthStatusListener()
      .subscribe(isAuthStatus => {
        this.isLoading = false
      })
  }
  onSignup(form: NgForm): void {
    if (form.invalid) {
      return
    }
    this.isLoading = true
    this._authService.signupUser(form.value.email, form.value.password)
    this.isLoading = false
  }
  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe()
  }
}
