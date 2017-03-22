import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ITrip } from '../../index';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../user/auth.service';
import { TripService } from '../../index'
import { JQ_TOKEN } from '../../../common/jQuery.service';
import { NavBarService } from '../../../nav/navbar.service';
import { TOASTR_TOKEN } from '../../../common/toastr.service';

@Component ({
	templateUrl: './trip-details.component.html',
	styleUrls: ['./trip-details.component.css']
})

export class TripDetailsComponent implements OnInit {

	trip: any;
	driver: any; 
	errorMessage: string;
	time;
	hours;
	minutes;
	pm;
	requestsRemaining: number;

	@ViewChild('confirmModal') containerEl: any;

	constructor (
		private route: ActivatedRoute, 
		private router: Router,
		private authService: AuthService,
		private tripService: TripService,
		private navbarService: NavBarService,
		@Inject(JQ_TOKEN) private $: any,
		@Inject(TOASTR_TOKEN) private toastr: any
	) {}

	ngOnInit() {
		console.log("Getting trip");
		this.trip = this.route.snapshot.data['trip'];
		console.log("Trip is: ", this.trip);
		let body = JSON.parse(this.trip._body)
		this.trip = body.trip
		this.driver = body.driver
		console.log("Driver: ", this.driver)
		let dateEpoch = this.trip.date;
		this.time = new Date(dateEpoch*1000);

		this.hours = this.time.getHours();
		this.minutes = this.time.getMinutes();

		console.log("minutes: ", this.minutes);

		// Filter the hours so it displays properly
		if (this.hours == 0) {
			this.hours = 12;
		}
		if (this.minutes < 10) {
			this.minutes = "0"+this.minutes;
		}
		if (this.hours > 12) {
			this.hours = this.hours - 12;
			this.pm = "PM";
		} else {
			this.pm = "AM";
		}
		console.log(this.trip);
	}

	requestRide() {

		this.tripService.requestRide(this.trip.id).subscribe (
			(data) => {
				if (data) {
					if (this.authService.cached_user_trips) {
						// Set the cached to false so that the function can go get 
						// fresh data
						this.authService.cached_user_trips = false;
						this.authService.getTrips().subscribe();
					}
					this.$ ( this.containerEl.containerEl.nativeElement ).modal('hide');
					this.authService.currentUser.trips_requested.push(this.trip.id);
					this.toastr.success("Request Sent!");
				}
			},
			(err) => {
				console.log("Error with requesting ride: ", err);
				this.errorMessage = JSON.parse(err._body).message;
				this.$ ( this.containerEl.containerEl.nativeElement ).modal('hide');
				this.toastr.error(this.errorMessage);
			}
		);
	}

	confirmRequest() {
		if (this.authService.currentUser) {
			this.$ ( this.containerEl.containerEl.nativeElement ).modal('show');
			this.requestsRemaining = 5 - this.authService.currentUser.trips_requested.length
		} else {
			this.navbarService.showLoginModal();
		}
	}

	back() {
		console.log("params: ", this.route.params)
		let parameters = <any>this.route.params;
		this.router.navigate(['trip', 'searchtrips', parameters.value.from, parameters.value.to, parameters.value.date])
	}

}