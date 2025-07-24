import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Topics } from '../../models/topics';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetUsersTopicsService {

  constructor(
    private http: HttpClient
  ) { }

  private readonly API_URL = 'http://localhost:9000/api/topic'

  getSubscribedTopics(): Observable<Topics[]> {
    return this.http.get<Topics[]>(`${this.API_URL}/subscribed`, { withCredentials: true });
  }
}
