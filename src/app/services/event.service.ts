import { Injectable } from '@angular/core';

//Kiegészítők
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

//Models
import { EventModel } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  //Json urlje
  private eventsURL = 'http://localhost:3000/events';

  constructor(private http: HttpClient) { }

  getEvents(eventsId: string): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.eventsURL}/${eventsId}`);
  }

}
