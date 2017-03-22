import { Routes } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { Error404Component } from './errors/404.component';
import { AuthGuard } from './guards/auth.guard';
import { ChangePasswordComponent } from './user/password/changepassword.component';
import { ConfirmEmailComponent } from './user/confirm/confirmemail.component';

import { tripRoutes } from './trip/trip.routes';
import { dashboardRoutes } from './dashboard/dashboard.routes';


export const appRoutes:Routes = [
	{ path: '', component: LandingComponent },
	{ 
		path: 'dashboard', 
		// children: dashboardRoutes,
		
		loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
		canActivate: [AuthGuard]
	},
	{ 
		path: 'trip', 
		// children: tripRoutes
		loadChildren: 'app/trip/trip.module#TripModule'
	},
	{ path: 'changepassword/:token', component: ChangePasswordComponent },
	{ path: 'confirm_email/:token', component: ConfirmEmailComponent },
	{ path: '**', component: Error404Component }
]