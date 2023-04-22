import { Component, OnInit, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IPost } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent {
  posts: IPost[] = [];
  isLoading: boolean = false;
  totalPosts: number = 10;
  postsPerPage: number = 2;
  currentPage: number = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription = new Subscription();
  private authListenerSubs: Subscription;
  userIsAuthenticated: boolean = false;
  userId: string;
  constructor(
    private _postService: PostService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this._postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this._authService.getUserId();
    this.postsSub = this._postService
      .getPostUpdateListener()
      .subscribe((postData: { posts: IPost[]; postCount: number }) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.isLoading = false;
    this.userIsAuthenticated = this._authService.getIsAuth();
    this.authListenerSubs = this._authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this._authService.getUserId();
      });
  }
  onPostEdit(id: string): void {
    this._postService.getPost(id);
  }

  onPostDelete(id: string): void {
    this.isLoading = true;
    this._postService.deletePost(id).subscribe(
      () => {
        this._postService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
    this.isLoading = false;
  }
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this._postService.getPosts(this.postsPerPage, this.currentPage);
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
