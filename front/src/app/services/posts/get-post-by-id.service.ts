import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Posts } from '../../models/posts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetPostByIdService {

  constructor(
    private http: HttpClient
  ) { }

  private readonly API_URL = 'http://localhost:9000/api/post';

  getPostById(id: string) : Observable<Posts> {
    return this.http.get<Posts>(`${this.API_URL}/${id}`, { withCredentials: true });
  }
}
