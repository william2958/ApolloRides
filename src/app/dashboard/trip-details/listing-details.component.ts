import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ITrip, TripService } from '../../trip/index';
import { ActivatedRoute, Router } from '@angular/router';
import { JQ_TOKEN } from '../../common/jQuery.service';
import { TOASTR_TOKEN } from '../../common/toastr.service';
import { AuthService } from '../../user/auth.service';

@Component ({
	templateUrl: './listing-details.component.html',
	styleUrls: ['./listing-details.component.css']
})

export class ListingDetailsComponent implements OnInit {

	trip: any = [];
	user_requests: any = [];
	accepted_users: any = [];
	trip_details: any;
	expired: boolean;

	// Show requests or accepted
	requests: boolean

	currentUser;

	errorMessage: string;

	@ViewChild('confirmCancelModal') cancelEl: any;
	@ViewChild('confirmCancelUsersModal') cancelUserEl: any;
	@ViewChild('confirmRequestModal') requestEl: any;
	@ViewChild('contactModal') contactEl: any;

	constructor (
		private tripService: TripService,
		private authService: AuthService,
		private route: ActivatedRoute,
		private router: Router,
		@Inject(JQ_TOKEN) private $: any,
		@Inject(TOASTR_TOKEN) private toastr: any
	) {}

	ngOnInit() {
		this.trip = this.route.snapshot.data['trip'];
		this.trip = JSON.parse(this.trip._body).trip;
		this.trip_details = this.trip.trip_details;
		this.user_requests = this.trip.user_requests;
		this.accepted_users = this.trip.accepted_users;
		console.log("The listing details are: ", this.trip);
		console.log("The accepted users are: ", this.accepted_users);
		console.log("The requests are: ", this.user_requests);
		this.requests = true;

		if (this.trip.date < (new Date).getTime()/1000) {
			this.expired = true;
		}
	}

	showContact(user) {
		this.currentUser = user;
		console.log(user);
		this.$ ( this.contactEl.containerEl.nativeElement ).modal('show');
	}

	confirmAccept(user) {
		this.currentUser = user;
		this.$ ( this.requestEl.containerEl.nativeElement ).modal('show');
	}

	accept() {
		this.$ ( this.requestEl.containerEl.nativeElement ).modal('hide');
		this.tripService.acceptRequest(this.trip_details.id, this.currentUser._id).subscribe(
			(data) => {
				// If the request was successful
				this.toastr.success("Request Accepted!")
				// Append the accepted user to the accepted users array
				this.accepted_users.push(this.currentUser);
				// Remove the accepted user from the requests array
				for (var i=0; i < this.user_requests.length; i++) {
					if (this.user_requests[i].id == this.currentUser._id) {
						this.user_requests.splice(i, 1);
						console.log("index was: ", i)
						break;
					}
				}
				// Subtract one from the spaces
				this.trip_details.spaces -= 1;
			}, (err) => {
				// If an error was thrown
				this.toastr.error(err);
				this.errorMessage = err;
			}
		)
	}

	confirmCancel() {
		if (this.accepted_users.length > 0) {
			this.$ ( this.cancelUserEl.containerEl.nativeElement ).modal('show');
		} else {
			this.$ ( this.cancelEl.containerEl.nativeElement ).modal('show');
		}
	}

	cancelTrip() {
		console.log('Trip cancelled')
		this.tripService.cancelTrip(this.trip_details.id).subscribe(
			(data) => {
				this.$ ( this.cancelUserEl.containerEl.nativeElement ).modal('hide');
				this.$ ( this.cancelEl.containerEl.nativeElement ).modal('hide');
				this.tripService.dashboardShowRequests = false;
				// If there is cached data in the dashboard
				if (this.authService.cached_user_trips) {
					// This runs through the cached items and removes the listing that was just deleted
					for (var i=0; i < this.authService.cached_user_trips_response.trips_listed.length; i++) {
						if (this.authService.cached_user_trips_response.trips_listed[i].id == this.trip_details.id) {
							this.authService.cached_user_trips_response.trips_listed.splice(i, 1);
							console.log("index was: ", i)
							break;
						}
					}
				}
				this.toastr.success("Trip deleted.");
				this.router.navigate(['/', 'dashboard']);
			}, (err) => {
				this.toastr.error(err);
				this.errorMessage = err;
			}
		)

	}

	back() {
		this.tripService.dashboardShowRequests = false;
		this.router.navigate(['/', 'dashboard']);
	}

}
