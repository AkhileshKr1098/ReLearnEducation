import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnglishRoutingModule } from './english-routing.module';
import { HomeComponent } from './home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import {MatCardModule} from '@angular/material/card';

import { MatMenuModule } from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardComponent } from './dashboard/dashboard.component';


import { MatButtonToggleModule } from "@angular/material/button-toggle"
import { MatDividerModule } from "@angular/material/divider"
import { MatSelectModule } from "@angular/material/select";

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    EnglishRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatCardModule,
    MatProgressBarModule,
    BaseChartDirective,
    MatButtonToggleModule,
    MatDividerModule,
    MatSelectModule,
    MatListModule,
    MatSidenavModule,
  ]
})
export class EnglishModule { }
