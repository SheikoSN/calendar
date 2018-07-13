import { Schedule } from 'primeng/schedule';
import { Injectable } from '@angular/core';
import { DatesService } from './dates.service';
import { TestCellsService } from "./test-cells.service";
import { Observable, Subject, from, combineLatest, BehaviorSubject, ReplaySubject } from "rxjs";
import * as moment from 'moment';

@Injectable()
export class ScheduleConfigService {
  showWeekends: boolean = true;
  private schedule: any;
  private selectedCellsSource = this.testCellsService.selectedTestCellsSource;
  public defaultView: string = 'agendaWeek';
  public currentViewTypeSource: ReplaySubject<string> = new ReplaySubject(1);
  private viewOptionsSource: Observable<any> = combineLatest(this.currentViewTypeSource, this.selectedCellsSource);
  public currentDateSource: ReplaySubject<any> = new ReplaySubject(1);

  constructor(private datesService: DatesService, private testCellsService: TestCellsService) {
    this.currentViewTypeSource.next(this.defaultView);
  }

  getScheduleConfig() {
    return {
      //defaultDate: this.datesService.defaultDate,
      defaultView: this.defaultView,
      allDaySlot : false,
      eventStartEditable: true,
      nowIndicator: true,
      header: false,
      buttonText: {
        today:    'today',
        month:    'month',
        agendaWeek:'week',
        day:      'day'
      },
      contentHeight: 'auto',
      firstDay: 1,
      viewRender: ((view, el) => {
        console.log("rendering..");
        const {intervalStart, intervalEnd} = view;
        if(view.type == 'timelineWeek') {
          this.removeDayEndLabels(view.timeHeadEl);
          this.highlightCurrentDay(view);
        }
        if(view.type == 'agendaWeek') {
          this.setUpAgendaWeekDividers(view)
        }
        if(view.type == 'timelineWeek' || view.type == 'agendaDay' || view.type == 'timelineDay' || view.type == 'agendaWeek') {
          this.setNowIndicator(view);
        }
        if(view.type == 'agendaDay' || view.type == 'agendaWeek') {
          if(view.timeGrid && view.timeGrid.slatEls) {
            view.timeGrid.slatEls.map((i, elem) => {
              if (/\w+:\w/.test(elem.innerText)) {
                elem.classList.add('minor-time');
                elem.querySelector('.fc-time span').innerHTML = elem.innerText.replace(/\w+:/, '');
              }
            });
          }
        }

        if(view.type === 'timelineDay') {
          const elem = Array.from(document.querySelectorAll('.ui-widget-header .fc-cell-content .fc-cell-text'));
          elem.forEach((element:any) => {
            element.innerHTML = element.innerHTML.replace(/\w+:/, '')
          });
        }
        this.currentDateSource.next({intervalStart, intervalEnd})
      }),
      views : {
        month: {
          titleFormat: 'MMMM, YYYY',
          weekends: this.showWeekends,
          themeSystem: 'standard',
          groupByDateAndResource: false,
          groupByResource: false,
          columnHeaderFormat: 'dddd',
          eventDataTransform: (data) => {
            return data;
          }
        },
        agendaWeek: {
          slotDuration: '00:15:00',
          slotLabelInterval: {minutes: 15},
          groupByResource: true,
          slotLabelFormat: 'HH(:mm)',
          columnHeaderText: (date) => {
             return date.format('dd');
          },
        },
        agendaDay: {
          slotDuration: '00:15:00',
          slotLabelInterval: { minutes: 15},
          slotLabelFormat: 'HH(:mm)',
          slotEventOverlap: false,
          minTime: '07:00:00',
          maxTime: '20:00:00',
        },
        timelineDay: {
          type: 'timeline',
          slotLabelInterval: { minutes: 15},
          slotDuration: '00:15',
          slotLabelFormat: 'HH(:mm)',
          minTime: '07:00:00',
          maxTime: '20:00:00',
          resourceGroupField: 'category',
          resourceAreaWidth: '140px',
        },
        timelineWeek: {
          slotDuration: '00:15',
          type: 'timeline',
          resourceGroupField: 'category',
          resourceAreaWidth: '140px',
          duration: { days: 7 },
          slotWidth: 15,
          slotLabelFormat: [
            'dddd, D', // top level of text
            'hh'        // lower level of text
          ],
          scrollTime: '00:00:00'
        },
      },
      dayRender: (date, cell) => {
        let currentView = this.defaultView;
        if(this.schedule) {
          currentView = this.schedule.fullCalendar('getView').type;
        }
        if(currentView == 'timelineWeek') {
          if(date.get('hours') == 23 && date.get('minutes') == 45) {
            let elem = cell[0];
            if(elem) {
              elem.classList.add('day-end-divider');
            }
          }
        }
      },
      resourceRender: (resourceObj, labelTds, bodyTds) => {
        let view = this.defaultView;

        if(this.schedule) {
          view = this.schedule.fullCalendar('getView').type;
        }
        if(view == 'agendaWeek' || view == 'agendaDay') {
          let {category, title} = resourceObj;
          labelTds[0].innerHTML = `<div class="resource-name">${title}</div>
                                   <div class="resource-category">(${category})</div>`
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
    this.viewOptionsSource.subscribe(this.setViewOptions.bind(this));
  }

  setViewOptions(data) {
    if(!this.schedule) return;
    const viewType = data[0];
    const selectedCells = data[1];

    let nextViewType = this.calculateViewType(viewType, selectedCells.length);
    let isGrouped = this.schedule.fullCalendar('option', 'groupByDateAndResource');
    let nextViewOptions = this.getViewOptions(nextViewType, isGrouped);
    //console.log('nextViewOptions', nextViewOptions);
    this.changeView(nextViewType);
    if(nextViewOptions) this.setOptions(nextViewOptions);
  }

  calculateViewType(type: string, cellsLength: number) {
    if (cellsLength > 1 && cellsLength <= 3){
      if(type == 'timelineDay') return 'agendaDay';
      if(type == 'timelineWeek') return 'agendaWeek';
      return type
    }else if(cellsLength >= 4) {
      if(type == 'agendaDay') return 'timelineDay';
      if(type == 'agendaWeek') return 'timelineWeek';
      return type;
    }else {
     return type;
    }
  };

  getViewOptions(type: string, isGrouped: boolean) {
    if (type == 'month' && isGrouped) {
      return {groupByDateAndResource: false};
    }else if ((type == 'agendaDay' || type == 'agendaWeek') && !isGrouped) {
      return {groupByResource: true};
    }else if((type == 'timelineDay' || type == 'timelineWeek') && isGrouped) {
      return {groupByResource: false};
    }else {
      return null;
    }
  }

  highlightCurrentDay(view) {
    let timeHeaderArea = view.timeHeadEl;
    let daysRow = timeHeaderArea[0].querySelector('tr');
    let found = false;
    daysRow.querySelectorAll('.ui-widget-header').forEach((day) => {
      if(day.dataset.date) {
        if(found) return;
        let diff = moment().diff(moment(day.dataset.date), 'days');
        if(diff == 0) {
          found = true;
          day.classList.add('current-day');
        }
      }
    });
    //console.log('timeHeaderArea', timeHeaderArea[0].querySelector('tr'));
  }

  setNowIndicator(view) {
    let renderNowIndicator = view.renderNowIndicator;
    let wrapper = function(time) {
      renderNowIndicator = renderNowIndicator.bind(view);
      renderNowIndicator(time);
      setTimeout(() => {
        let container = <HTMLElement> document.querySelector('.fc-now-indicator-arrow');
        if(container) {
          container.innerText = time.format('hh:mm');
        }
      }, 50)
    }.bind(view);
    view.renderNowIndicator = wrapper;
  }

  setOptions(options) {
    this.schedule.fullCalendar('option', options)
  }

  removeDayEndLabels($header) {
    let elem = $header[0];
    let headers = elem.querySelectorAll('.fc-chrono th');
    if(headers) {
      headers.forEach((e) => {
        let time = e.dataset.date.split('T')[1];
        if(time === '00:00:00') {
          let textToRemove = e.querySelector('.fc-cell-text');
          if(textToRemove) {
            textToRemove.remove();
          }
        }
      });
    }
  }
  setUpAgendaWeekDividers(view) {
    // console.log(view.timeGrid.colEls);
    if(view.timeGrid && view.timeGrid.colEls){
      view.timeGrid.colEls.map((i, col) => {
        let date = col.dataset.date;
        if(moment(date).weekday() == 0) {
          col.classList.add('week-last-day');
        }
      })
    }
  }
  setNextView(viewType: string) {
    this.currentViewTypeSource.next(viewType);
  }

  changeView(viewType) {
    this.schedule.fullCalendar('changeView', viewType);
  }

  next() {
    this.schedule.fullCalendar('next');
  }

  prev() {
    this.schedule.fullCalendar('prev');
  }

}
