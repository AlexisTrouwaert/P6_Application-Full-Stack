import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Posts } from '../../models/posts';

@Injectable({
  providedIn: 'root'
})
export class GetAllPostsService {

  constructor(
    private http : HttpClient
  ) { }

  private readonly API_URL = 'http://localhost:9000/api/post';

  getAllPosts(page: number, size: number) : Observable<Posts[]> {
    return this.http.get<Posts[]>(`${this.API_URL}?page=${page}&size=${size}`, { withCredentials: true });
  }
}
