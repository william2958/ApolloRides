import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { CookieService } from 'angular2-cookie/services/cookies.service';

// Routing
import { appRoutes } from './routes';

// Services
import { AuthService } from './user/auth.service';
import { TripService } from './trip/index';
import { AuthGuard } from './guards/auth.guard';

// Extra Components
import { Error404Component } from './errors/404.component';
import { RideshareAppComponent } from './rideshare.component';
import { LandingComponent } from './landing/landing.component';
import { NavBarComponent } from './nav/navbar.component';
import { NavBarService } from './nav/navbar.service';

// Passwords
import { ChangePasswordComponent } from './user/password/changepassword.component';

import { CommonRideshareModule } from './common/common.module';

import { JQ_TOKEN } from './common/jQuery.service';
import { TOASTR_TOKEN, Toastr } from './common/toastr.service';
import { APP_CONFIG, AppConfig } from './app.config';

let jQuery : Object = window['$'];
let toastr : Toastr = window['toastr'];

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		CommonRideshareModule,
		RouterModule.forRoot(appRoutes)
	],
	declarations: [
		RideshareAppComponent,
		LandingComponent,
		NavBarComponent,
		ChangePasswordComponent,
		Error404Component
	],
	providers: [
		CookieService,
		AuthService,
		AuthGuard,
		TripService,
		NavBarService,
		{ provide: JQ_TOKEN, useValue: jQuery},
		{ provide: APP_CONFIG, useValue: AppConfig},
		{ provide: TOASTR_TOKEN, useValue: toastr }
	],
	bootstrap: [RideshareAppComponent]
})

export class AppModule {}