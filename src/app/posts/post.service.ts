import { Injectable } from '@angular/core';
import { IPost } from './post.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: IPost[] = []
  private postUpdated = new Subject<IPost[]>()
  url = "http://localhost:3000"

  constructor(private http: HttpClient, private routers: Router) { }

  getPostUpdateListener() {
    return this.postUpdated.asObservable()
  }

  getPosts() {
    this.http.get<{ message: string, posts: any }>(this.url + '/getPosts')
      .pipe(map((postData) => {
        return postData.posts.map((post: any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          }
        })
      }))
      .subscribe(newPostData => {
        this.posts = newPostData
        this.postUpdated.next([...this.posts])
      })
    return [...this.posts]
  }
  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: File
    }>(this.url + '/getPost/' + id)
  }
  addPost(title: string, content: string, image: File) {
    const postData = new FormData()
    postData.append("title", title)
    postData.append("content", content)
    postData.append("image", image, title)
    this.http.post<{ message: string, post: IPost }>(this.url + '/addPost', postData)
      .subscribe(res => {
        const post: IPost = {
          id: res.post.id,
          title: title,
          content: content,
          imagePath: res.post.imagePath
        }
        this.posts.push(post)
        this.postUpdated.next([...this.posts])
        this.routers.navigate(["/"])
      })
  }

  deletePost(id: string) {
    this.http.delete<{ message: string }>(this.url + '/deletePost/' + id)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== id)
        this.posts = updatedPosts
        this.postUpdated.next([...this.posts])
      })
  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: IPost | FormData
    if (typeof image === 'object') {
      postData = new FormData()
      postData.append("id", id)
      postData.append("title", title)
      postData.append("content", content)
      postData.append("image", image, title)
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    this.http.put(this.url + '/updatePost/' + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts]
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id)
        const post: IPost = {
          id: id,
          title: title,
          content: content,
          imagePath: image
        }
        updatedPosts[oldPostIndex] = post
        this.posts = updatedPosts
        this.postUpdated.next([...this.posts])
        this.routers.navigate(["/"])
      })
  }
}

