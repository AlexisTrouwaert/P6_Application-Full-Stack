import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  constructor(
    private http: HttpClient
  ) { }

  private readonly API_URL = 'http://localhost:9000/api/post';

  deletePost(postId: number) {
    return this.http.delete(`${this.API_URL}/${postId}`, { withCredentials: true });
  }
}
