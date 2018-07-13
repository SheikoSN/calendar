import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {  Subscription } from 'rxjs';
import { Schedule } from 'primeng/schedule';
import { ScheduleConfigService } from '../../services/schedule-config.service';
import { DataService } from '../../services/data.service';
import { TestCellsService } from '../../services/test-cells.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RootComponent implements OnInit, AfterViewInit {
  public scheduleOptions: any;
  public testCells: any[];
  private dataServiceSubscription: Subscription;

  @ViewChild('schedule') schedule: Schedule;

  constructor(private scheduleConfigService: ScheduleConfigService,
              private dataService: DataService,
              private testCellsService: TestCellsService) {

  }

  ngOnInit() {
    const { schedule } = this;
    this.scheduleOptions = this.scheduleConfigService.getScheduleConfig();

    this.dataServiceSubscription = this.dataService.dataSource.subscribe((data) => {
      schedule.events = data;
    });

    this.testCellsService.testCellsSubject.subscribe((data) => {
      this.testCells = [...data];
    });
  }

  ngAfterViewInit() {
    this.scheduleConfigService.onCalendarRendered(this.schedule);
  }

  public onTestCellToggled(cellId: string) {
    this.testCellsService.toggleTestCell(cellId);
  }
}
