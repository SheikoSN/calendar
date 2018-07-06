import { Schedule } from 'primeng/schedule';
import { Injectable } from '@angular/core';
import { DatesService } from './dates.service';
import { TestCellsService } from "./test-cells.service";
import { Observable, Subject, from, combineLatest, BehaviorSubject, ReplaySubject } from "rxjs";
import { pluck, distinctUntilChanged, publish, map } from "rxjs/operators";

@Injectable()
export class ScheduleConfigService {
  showWeekends: boolean = true;
  private schedule: any;
  private selectedCellsSource = this.testCellsService.selectedTestCellsSource;
  private defaultView: string = 'agendaWeek';
  private currentViewSubject: ReplaySubject<any> = new ReplaySubject(1);
  private currentViewTypeSource: any = from(this.currentViewSubject).pipe(pluck('type'), distinctUntilChanged(), publish());
  private viewOptionsSource: Observable<any> = combineLatest(this.currentViewTypeSource, this.selectedCellsSource);
  private calendarRendered: boolean = false;

  constructor(private datesService: DatesService, private testCellsService: TestCellsService) {
    this.currentViewSubject.subscribe((view) => {
      let calendarHeader = view.calendar.header.el[0];
      let currentDate = view.intervalStart;
      this.updateHeaderButtons(calendarHeader, currentDate, view.type);
    });
    this.viewOptionsSource.subscribe(this.setViewOptions.bind(this));
  }

  getScheduleConfig() {
    return {
      defaultDate: this.datesService.defaultDate,
      defaultView: this.defaultView,
      allDaySlot: false,
      eventStartEditable: true,
      header: {
        left: 'prev',
        right: 'next agendaWeek month agendaDay',
        center: 'title'
      },
      buttonText: {
        today:    'today',
        month:    'month',
        agendaWeek:'week',
        day:      'day',
        next:     '',
        prev:     '',
      },
      viewRender: ((view, el) => {
        //TODO: Check for rerender need
        console.log('view render with', view.type);
        this.currentViewSubject.next(view);
      }),
      views : {
        month: {
          titleFormat: 'MMMM, YYYY',
          weekends: this.showWeekends,
          themeSystem: 'standard',
          groupByDateAndResource: false,
          groupByResource: false,
          eventDataTransform: (data) => {
            return data;
          }
        },
        agendaWeek: {
          slotDuration: '00:15:00',
          slotLabelInterval: {hours: 1},
        },
        agendaDay: {
          slotDuration: '00:15:00',
          slotLabelInterval: {hours: 1},
          slotEventOverlap: false
        },
        timelineDay: {
          type: 'timeline',

          slotDuration: '00:15'
        },
        timelineWeek: {
          slotDuration: '00:15',
          type: 'timeline',
          duration: { days: 7 }
        }
      },
      resources: (cb) => {
        cb([]);
        this.testCellsService.selectedTestCellsSource.subscribe((selectedCells) => {
          cb(selectedCells)
        })
      }
    }
  }

  onCalendarRendered(schedule) {
    this.schedule = schedule;
    this.currentViewTypeSource.connect();
    this.calendarRendered = true;
  }

  setViewOptions(data) {
    const viewType = data[0];
    const selectedCells = data[1];
   console.log('set view options');
    if (viewType == 'month') {
      this.setOptions({groupByDateAndResource: false});
    }
    else if (selectedCells.length > 1 && selectedCells.length <= 3){
        if(viewType == 'timelineDay') this.schedule.fullCalendar('changeView', 'agendaDay');
        if(viewType == 'timelineWeek') this.schedule.fullCalendar('changeView', 'agendaWeek');

        if(!this.schedule.fullCalendar('option', 'groupByDateAndResource')){
          this.setOptions({groupByResource: true});
        }
      console.log('here1', viewType);
    }
    else if(selectedCells.length >= 4) {
      if(viewType == 'agendaDay') this.schedule.fullCalendar('changeView', 'timelineDay');
      if(viewType == 'agendaWeek') this.schedule.fullCalendar('changeView', 'timelineWeek');

      if(this.schedule.fullCalendar('option', 'groupByDateAndResource')){
        this.setOptions({groupByResource: false});
      }
      console.log('here2');
    }
    else {
      if(this.schedule.fullCalendar('option', 'groupByDateAndResource')){
        this.setOptions({groupByDateAndResource: false});
      }
    }
  }

  setOptions(options) {
    this.schedule.fullCalendar('option', options)
  }

  updateHeaderButtons(header, currentDate, type) {
    const { datesService } = this;

    let prevButton = header.querySelector('.fc-prev-button');
    let nextButton = header.querySelector('.fc-next-button');
    let nextText, prevText;

    if(type == 'month') {
      nextText = datesService.getNextMonth(currentDate, 'MMMM');
      prevText = datesService.getPrevMonth(currentDate, 'MMMM');
    }

    if(type == 'agendaWeek' || type == 'timelineWeek') {
      let _weekStart, _weekEnd, nextTextStart, nextTextEnd, prevTextStart, prevTextEnd;
      _weekEnd = datesService.getNextWeek(currentDate);
      _weekStart = datesService.getPrevWeek(currentDate);

      nextTextStart = _weekEnd.format('DD');
      nextTextEnd = _weekEnd.add(1, 'week').format('DD');

      prevTextStart = _weekStart.format('DD');
      prevTextEnd = _weekStart.add(1, 'week').format('DD');

      nextText = `${nextTextStart} - ${nextTextEnd}`;
      prevText = `${prevTextStart} - ${prevTextEnd}`;
    }

    if(type == 'agendaDay' || type == 'timelineDay') {
      nextText = datesService.getNextDay(currentDate, 'D');
      prevText = datesService.getPrevDay(currentDate, 'D');
    }

    prevButton.innerText = prevText;
    nextButton.innerText = nextText;
  }

}
