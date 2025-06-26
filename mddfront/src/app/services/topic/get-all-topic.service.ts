import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Topics } from '../../models/topics';

@Injectable({
  providedIn: 'root'
})
export class GetAllTopicService {

  constructor(
    private http : HttpClient
  ) { }

  private readonly API_URL = 'http://localhost:9000/api/topic';

  getAllTopics(): Observable<Topics[]> {
    return this.http.get<Topics[]>(`${this.API_URL}`, { withCredentials: true });
  }
}
