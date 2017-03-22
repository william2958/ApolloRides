import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { dashboardRoutes } from './dashboard.routes';
import { DashboardComponent } from './dashboard.component';
import { MyTripThumbnailComponent } from './trip-details/my-trip-thumbnail.component';
import { RequestDetailsComponent } from './trip-details/request-details.component';
import { ListingDetailsComponent } from './trip-details/listing-details.component';
import { TripDetailResolver } from '../trip/index';
import { ListingDetailResolver } from './trip-details/listing-details-resolver.service';
import { ProfileComponent } from './profile/profile.component';

import { CommonRideshareModule } from '../common/common.module';
import { JQ_TOKEN } from '../common/jQuery.service';
import { APP_CONFIG, AppConfig } from '../app.config';
import { TOASTR_TOKEN } from '../common/toastr.service';

let jQuery : Object = window['$'];
let toastr : Object = window['toastr'];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CommonRideshareModule,
		MaterialModule,
		RouterModule.forChild(dashboardRoutes)
	],
	declarations: [
		RequestDetailsComponent,
		ListingDetailsComponent,
		MyTripThumbnailComponent,
		DashboardComponent,
		ProfileComponent
	],
	providers: [
		TripDetailResolver,
		ListingDetailResolver,
		{ provide: JQ_TOKEN, useValue: jQuery},
		{ provide: APP_CONFIG, useValue: AppConfig},
		{ provide: TOASTR_TOKEN, useValue: toastr }
	]
})

export class DashboardModule {}