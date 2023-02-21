import { Component, OnInit, Input } from '@angular/core';
import { IPost } from '../post.model'
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
  posts: IPost[] = []
  private postsSub: Subscription = new Subscription();
  constructor(private _postService: PostService) { }
  
  ngOnInit(): void {
    this._postService.getPosts()
    this.postsSub = this._postService.getPostUpdateListener().subscribe((posts: IPost[]) => {
      this.posts = posts
    })
  }
  onPostEdit(id: string): void {
    this._postService.getPost(id)
  }

  onPostDelete(id: string): void {
    this._postService.deletePost(id)
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe()
  }
}
