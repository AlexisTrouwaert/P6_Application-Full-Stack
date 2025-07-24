import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Posts} from "../../models/posts";

@Injectable({
  providedIn: 'root'
})
export class GetPostByTopicService {

  constructor(
    private http : HttpClient
  ) { }

  private readonly API_URL = 'http://localhost:9000/api/post';

  getAllPostsbyTopic(page: number, size: number, sortOrder: string, topicId: number) : Observable<Posts[]> {
    return this.http.get<Posts[]>(`${this.API_URL}/topic/${topicId}?page=${page}&size=${size}&sortOrder=${sortOrder}`, { withCredentials: true });
  }
}
