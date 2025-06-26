import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostCommentService {

  constructor(
    private http: HttpClient
  ) { }

  private readonly API_URL = 'http://localhost:9000/api/comment';

  sendComment(comment: any) {
    return this.http.post(`${this.API_URL}`, comment, { withCredentials: true });
  }
}
