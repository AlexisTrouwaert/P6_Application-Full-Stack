import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreatePostService {

  constructor(
    private http : HttpClient
  ) { }

  private readonly API_URL = 'http://localhost:9000/api/post';

  createPost(post: any) {
    return this.http.post(`${this.API_URL}`, post, { withCredentials: true });
  }
}
