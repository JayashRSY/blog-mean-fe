import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IPost } from '../post.model';
import { mimeType } from './mime-type.validator';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent {
  inputTitle = ''
  inputContent = ''
  form: FormGroup
  imgPreview: string
  btnText: string = 'Save Post'
  node: string = 'createPost'
  editingPost: IPost = {
    id: '',
    title: '',
    content: '',
    imagePath: ''
  };
  private postId: string = '';
  isLoading: boolean = false;
  constructor(private _postService: PostService,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    })
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        this.btnText = 'Save Post'
        this.node = 'editPost'
        this.postId = String(paramMap.get('postId'))
        this.isLoading = true
        this._postService.getPost(this.postId).subscribe(postData => {
          this.editingPost = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          }
          this.form.setValue({
            title: this.editingPost.title,
            content: this.editingPost.content,
            image: this.editingPost.imagePath
          })
          this.isLoading = false
        })
      } else {
        this.btnText = 'Create Post'
        this.node = 'createPost'
        this.postId = ''
      }
    })
  }
  onFilePicker(e: Event) {
    const file = (e.target as HTMLInputElement).files![0]
    this.form.patchValue({
      image: file
    })
    this.form.get('image')?.updateValueAndValidity()
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }
  onSavePost() {
    if (this.form.invalid) {
      return
    }
    if (this.node === 'createPost') {
      this.isLoading = true
      this._postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image)
      this.isLoading = false
    } else if (this.node === 'editPost') {
      this.isLoading = true
      this._postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      )
      this.isLoading = false
    }
    this.form.reset()
  }
}
