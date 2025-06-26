import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnsubscribeService {

  constructor(
      private http: HttpClient
    ) { }
  
    private readonly API_URL = 'http://localhost:9000/api/subscribe';
  
    subscribe (topicId: number){
      return this.http.delete(`${this.API_URL}/${topicId}`, { withCredentials: true });
    }
}
