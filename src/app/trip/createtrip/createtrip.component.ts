import { Component, ViewChild, ElementRef, Inject, OnInit } from '@angular/core';
import { ITrip } from '../shared/index';
import { TripService } from '../index';
import { AuthService } from '../../user/auth.service';
import { Router } from '@angular/router';
import { JQ_TOKEN } from '../../common/jQuery.service';
import { TOASTR_TOKEN } from '../../common/toastr.service';

@Component({
	templateUrl: './createtrip.component.html',
	styleUrls: ['./createtrip.component.css']
})

export class CreateTripComponent implements OnInit {
	mouseoverForm: boolean = false;
	createFormError: string;
	carDetailsFormError: string;

	fromMetadata = "Western University"
	fromCity = "London"
	fromState = "Ontario"
	fromCountry = "Canada"
	toMetadata = "Western University"
	toCity = "London"
	toState = "Ontario"
	toCountry = "Canada"
	numPassengers = "4"
	// date = '2017-03-15T12:03';
	price = "20"
	tripDetails = "Details"

	firstTime: boolean;

	@ViewChild('confirmModal') containerEl: any;

	// Placeholders
	fromDetailsPlaceholder: string;
	fromCityPlaceholder: string;
	fromStatePlaceholder: string;
	fromCountryPlaceholder: string;
	toDetailsPlaceholder: string;
	toCityPlaceholder: string;
	toStatePlaceholder: string;
	toCountryPlaceholder: string;
	numPassengersPlaceholder: string;
	datePlaceholder: string;
	pricePlaceholder: string;
	detailsPlaceholder: string;

	constructor (
		private tripService: TripService,
		private router: Router,
		private authService: AuthService,
		@Inject(JQ_TOKEN) private $: any,
		@Inject(TOASTR_TOKEN) private toastr: any
	) {}

	ngOnInit() {
		console.log("First time: ", this.authService.currentUser);

		// Check if the user is a first time driver
		if (this.authService.currentUser.car_model) {
			this.firstTime = false;
		} else {
			this.firstTime = true;
		}

		this.fromDetailsPlaceholder = "Details";
		this.fromCityPlaceholder = "City";
		this.fromStatePlaceholder = "State";
		this.fromCountryPlaceholder = "Country";
		this.toDetailsPlaceholder = "Details";
		this.toCityPlaceholder = "City";
		this.toStatePlaceholder = "State";
		this.toCountryPlaceholder = "Country";
		this.numPassengersPlaceholder = "Number of Passengers";
		this.datePlaceholder = "Departure Date";
		this.pricePlaceholder = "Price";
		this.detailsPlaceholder = "Additional Information";
	}

	confirm(formValues) {
		// Reset the date to epoch time
		let local_date = new Date(formValues.date)
		console.log("Local date is: ", local_date)
		// Turn the date into UTC format
		let utc_date = new Date(local_date.getUTCFullYear(), local_date.getUTCMonth(), local_date.getUTCDate(),  local_date.getUTCHours(), local_date.getUTCMinutes(), local_date.getUTCSeconds());
		console.log("The UTC time is: ", utc_date)

		var now = new Date(); 
		console.log("Now is: ", now);
		var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
		console.log("The UTC for right now is: ", now_utc)

		formValues.date = utc_date.getTime();
		console.log("Submitting to form with the time: ", formValues.date);
		// Get the current time
		let current_time = (new Date).getTime();
		console.log("Current time: ", current_time, "Listed time: ", formValues.date);
		// Check that the user is making a date after right now
		if (formValues.date > current_time) {
			this.$ ( this.containerEl.containerEl.nativeElement ).modal('show');
		} else {
			this.toastr.error("The trip departure date must be after today!");
		}
		
	}

	create(formValues) {
		console.log("Creating", formValues);
		this.tripService.createTrip(formValues)
			.subscribe(
				(data) => {
					if (data) {
						this.$ ( this.containerEl.containerEl.nativeElement ).modal('hide');
						this.toastr.success("Event Created!");
						this.tripService.dashboardShowRequests = false;
						this.authService.cached_user_trips = false;
						this.router.navigate(['/', 'dashboard']);
						console.log("Subscribed create function returns: ", data);
					}
				},
				(err) => {
					this.$ ( this.containerEl.containerEl.nativeElement ).modal('hide');
					this.createFormError = err;
					this.toastr.error(err)
				}
			);
		console.log("form Values: ", formValues);
	}

	cancel() {
		this.router.navigate(['/']);
	}

	checkError(form) {
		console.log("Checking form")
		if (!form.valid) {
			console.log("Value: ", form.value)
			if (!form.value.fromLocation.fromMetadata) {
				this.fromDetailsPlaceholder = "Details - Required!";
			}
			if (!form.value.fromLocation.fromCity) {
				this.fromCityPlaceholder = "City - Required!";
			}
			if (!form.value.fromLocation.fromState) {
				this.fromStatePlaceholder = "State - Required!";
			}
			if (!form.value.fromLocation.fromCountry) {
				this.fromCountryPlaceholder = "Country - Required!";
			}
			if (!form.value.toLocation.toMetadata) {
				this.toDetailsPlaceholder = "Details - Required!";
			}
			if (!form.value.toLocation.toCity) {
				this.toCityPlaceholder = "City - Required!";
			}
			if (!form.value.toLocation.toState) {
				this.toStatePlaceholder = "State - Required!";
			}
			if (!form.value.toLocation.toCountry) {
				this.toCountryPlaceholder = "Country - Required!";
			}
			if (!form.value.price) {
				this.pricePlaceholder = "Price - Required!";
			}
			if (!form.value.numPassengers) {
				this.numPassengersPlaceholder = "Number of Passengers - Required!";
			}
			if (!form.value.date) {
				this.datePlaceholder = "Departure Date - Required!";
			}
		} else {
			this.confirm(form.value);
		}
	}

	updateCarDetails(formValues) {
		console.log("Form Values: ", formValues);
		this.tripService.updateDriverDetails(formValues)
			.subscribe(
				(data) => {
					this.toastr.success("Driver Details Updated!");
					this.firstTime = false;
				}, (err) => {
					this.carDetailsFormError = err;
					this.toastr.error(err)
				}
			);
	}

}

















