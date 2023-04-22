import { Component } from '@angular/core';
import { IPost } from '../app/posts/post.model'
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 
  constructor(private _authService: AuthService) {}
  ngOnInit() {
    this._authService.autoAuthUser()
  }
}
