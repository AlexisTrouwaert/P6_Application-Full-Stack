import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetAllTopicService {

  constructor(
    private http : HttpClient
  ) { }

  private readonly API_URL = 'http://localhost:9000/api/topic';

  getAllTopics() {
    return this.http.get(`${this.API_URL}`, { withCredentials: true });
  }
}
