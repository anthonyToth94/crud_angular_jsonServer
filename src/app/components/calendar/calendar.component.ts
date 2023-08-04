import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

//Kiegészítők
//calendar
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

//Eventhez uj dialog
import { MatDialog } from '@angular/material/dialog';

//Egyedi azonosító ID
import { v4 as uuidv4 } from 'uuid';

//Services components
import { INITIAL_EVENTS } from '../../event-utils';
import { NewEventDialogComponent } from '../new-event-dialog/new-event-dialog.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { EventService } from '../../services/event.service';
import { Subscription, tap } from 'rxjs';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  //Bejelentkezés után feltöltött adat
  @Input()
  activeUser: any;

  calendarAdatok: EventInput[] = [];
  calendarOptions: CalendarOptions = {};

  //Új esemnyben ez alapján adjuk hozzá a 'Titlet'
  newEventName: string = '';

  //Esemény és Időbeosztás -> Színének változtatása
  colorForEvents: boolean = true;

  subscriptions: Subscription[] = [];
  //                                                          formbuilder meghívása          dialog meghívása           
  constructor(private dialog: MatDialog, private _eventService: EventService, private _calendarService: CalendarService) { }

  ngOnInit(): void {
    this.initializeCalendar();
    this.getCalendarAndEventsForUser();
  }

  //Subscriptionok leiratkozása
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  //Calendar létrehozásának alap beállítása
  initializeCalendar(): void {
    //Beállítom a calendar tulajdonságait
    this.calendarOptions = {
      //events: this.calendarEvents,  //Eventeket ide rakom kívülről érkezik
      initialView: 'dayGridMonth',  //Kezdő nézet
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin], //Pluginok
      //dateClick: this.handleDateTimeClick.bind(this), 
      weekends: true,    //Legyen-e hetvege
      locale: 'hu',
      allDayText: "Egész nap",
      headerToolbar: {  //Header elrendezése a naptárnak
        left: 'prev,next,today',
        center: 'title',
        right: 'timeGridDay,timeGridWeek,dayGridMonth'
      },
      buttonText: {   //Átírod a neveket
        today: 'Ma',
        month: 'Hónap',
        week: 'Hét',
        day: 'Nap',
        list: 'Lista'
      },
      //eventColor: '#378006',
      //eventTextColor: "black",
      dayMaxEventRows: 4,
      editable: true,     //Mozgathatod és szerkesztheted az elemeket (egérr gombot lenyomva, húzhatod)
      selectable: true,   //Kijelölhetsz dolgokat és úgy adhatsz eseményt több nap hosszúra
      //selectMirror:true,
      dayMaxEvents: true,  //Ez nem engedi egymás alá rakni az eseményeket, lekorlátozza és egy dobozkába rakja + al tudod megnyitni
      //initialEvents: this.calendarAdatok,  //Adatbázisbol betölti ezeket az inicializált eventeket
      select: this.openNewEventDialog.bind(this),  //beágyazod az infot, amire selectálsz (inicializálás)
      eventClick: this.handleEventClick.bind(this),  //Esemény törlése
    };
  }

  //Naptár lekérése Felhasználón belül és feltöltése  a JSON ből
  getCalendarAndEventsForUser(): void {
    this.subscriptions.push(
      //Hozzáadom a subscriptionhoz, kikérem a Felhasználónevet és ha nincs ilyen hozzáadom
      this._calendarService.getCalendarForUser(this.activeUser.calendarId)
        .subscribe(
          (calendar) => {
            //Ellenőrzés, hogy van-e naptár és ilyen id

            //Eventset belehívom
            this.getEventsFromJson(calendar.eventsId);
            console.log(calendar); //ELLENŐRÍZNI 

          },
          (error) => {
            console.error(error);
          }
        )
    );
  }

  //Események lekérése Felhasználón belül, ami a calendarhoz tartozik és feltöltése a JSON ből
  getEventsFromJson(evetsId: string): void {
    //Hozzáadom a subscriptionhoz, kikérem a Felhasználónevet és ha nincs ilyen hozzáadom
    this.subscriptions.push(
      this._eventService.getEvents(evetsId)
        .subscribe((response) => {
          this.calendarOptions.events = response;
          console.log(this.calendarOptions.events); //ELLENŐRÍZNI
        },
          (error) => {
            console.error(error);
          })
    )
  }

  //Esemény törlése
  handleEventClick(clickInfo: EventClickArg) {  //importálni kell
    if (confirm(`Biztos ki akarod törölni az elemet? '${clickInfo.event.title}'`)) {   //confirm egy Js függvény, ami olyan mint az alert, de vár 1 megerősítést
      clickInfo.event.remove();  //Törli az eseményt
    }
  }

  //Idősáv hozzáadása
  openNewTimelineDialog(selectInfo: any) {
    //Új dialógus ablak megnyitása (paramétereket vár/komponens referenciáját)
    //MatDialogRef -> ad vissza ezzeltudod megfigyelni az interakciót a megnyitott dialógusban
    //Feliratkozhatunk az ablak eseményeire -> afterClosed() azaz amikor bezárják az ablakot
    const dialogRef = this.dialog.open(TimelineComponent, {
    });
    const calendarApi = selectInfo.view.calendar;  //Ezzel kapod meg a belső infokat

    calendarApi.unselect(); // Kitörli, hogy ne legyen semmi selectálva

    dialogRef.afterClosed().subscribe((eventData) => {
      //Itt használod a dialogus ablakban átadott adatokat
      if (eventData) {
        calendarApi.addEvent({
          id: uuidv4(),
          title: eventData.title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          display: 'background',
          allDay: false,
          backgroundColor: eventData.backgroundColor
        });
        console.log(calendarApi);
      }
    });
  }

  //Esemény hozzáadása
  openNewEventDialog(selectInfo: any) {
    //Új dialógus ablak megnyitása (paramétereket vár/komponens referenciáját)
    //MatDialogRef -> ad vissza ezzeltudod megfigyelni az interakciót a megnyitott dialógusban
    //Feliratkozhatunk az ablak eseményeire -> afterClosed() azaz amikor bezárják az ablakot
    const dialogRef = this.dialog.open(NewEventDialogComponent, {
    });
    const calendarApi = selectInfo.view.calendar;  //Ezzel kapod meg a belső infokat

    calendarApi.unselect(); // Kitörli, hogy ne legyen semmi selectálva

    dialogRef.afterClosed().subscribe((eventData) => {
      //Itt használod a dialogus ablakban átadott adatokat
      if (eventData) {
        calendarApi.addEvent({
          id: uuidv4(),
          title: eventData.title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: false,
          backgroundColor: eventData.backgroundColor
        });
        console.log(calendarApi);
      }
    });
  }

  //Eseménynek click alapján meghívom és a Dialogot beállítom
  eventHandler(): void {
    this.calendarOptions.select = this.openNewEventDialog.bind(this);
    this.colorForEvents = true;
  }

  //Idősávnak click alapján meghívom és a Dialogot beállítom
  timelineHandler(): void {
    this.calendarOptions.select = this.openNewTimelineDialog.bind(this);
    this.colorForEvents = false;
  }
}
