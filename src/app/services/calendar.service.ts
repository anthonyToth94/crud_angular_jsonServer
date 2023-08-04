import { Injectable } from '@angular/core';

//Kiegészítők
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

//Models
import { CalendarModel } from '../models/calendar.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  //Json urlje
  private calendarsURL = 'http://localhost:3000/calendars';

  constructor(private http: HttpClient) { }

  //Lekérem useren belül calendarId alapján a calendart
  getCalendarForUser(calendarId: string): Observable<CalendarModel> {
    return this.http.get<CalendarModel>(`${this.calendarsURL}/${calendarId}`);
  }

}
