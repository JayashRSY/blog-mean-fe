import { Injectable } from '@angular/core';
import { IPost } from './post.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: IPost[] = [];
  private postUpdated = new Subject<{ posts: IPost[]; postCount: number }>();
  url = environment.apiUrl;

  constructor(private http: HttpClient, private routers: Router) {}

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        `${this.url}getPosts${queryParams}`
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
    return [...this.posts];
  }
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: File;
      creator: string;
    }>(`${this.url}getPost/${id}`);
  }
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: IPost }>(`${this.url}addPost`, postData)
      .subscribe((res) => {
        this.routers.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete(`${this.url}deletePost/${id}`);
  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: IPost | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    this.http
      .put(`${this.url}updatePost/${id}`, postData)
      .subscribe((response) => {
        this.routers.navigate(['/']);
      });
  }
}
