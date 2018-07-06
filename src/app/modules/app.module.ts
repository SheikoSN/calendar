import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as $ from 'jquery';
import { ScheduleModule } from 'primeng/schedule';
import { FormsModule } from '@angular/forms';

import { ScheduleConfigService } from '../services/schedule-config.service';
import { DatesService } from '../services/dates.service';
import { DataService } from '../services/data.service';
import { TestCellsService } from '../services/test-cells.service';

import { SchedulerHeader } from '../components/scheduler-header/scheduler-header.component'
import { RootComponent } from '../components/root/root.component';

@NgModule({
  declarations: [
    RootComponent,
    SchedulerHeader
  ],
  imports: [
    BrowserModule,
    ScheduleModule,
    FormsModule
  ],
  providers: [ScheduleConfigService, DatesService, DataService, TestCellsService],
  bootstrap: [RootComponent]
})
export class AppModule { }
