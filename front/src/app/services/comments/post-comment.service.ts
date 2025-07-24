import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comments } from '../../models/comments';

@Injectable({
  providedIn: 'root'
})
export class PostCommentService {

  constructor(
    private http: HttpClient
  ) { }

  private readonly API_URL = 'http://localhost:9000/api/comment';

  sendComment(comment: FormData) {
    return this.http.post(`${this.API_URL}`, comment, { withCredentials: true });
  }

  getCommentsByPostId(postId: string): Observable<Comments[]> {
    return this.http.get<Comments[]>(`${this.API_URL}/${postId}`, { withCredentials: true });
  }

  deleteComment(commentId: number) {
    return this.http.delete(`${this.API_URL}/${commentId}`, { withCredentials: true });
  }
}
