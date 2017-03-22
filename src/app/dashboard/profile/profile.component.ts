import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../user/auth.service';
import { TOASTR_TOKEN } from '../../common/toastr.service';
import { NavBarService } from '../../nav/navbar.service';

@Component ({
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
	currentUser: any;
	edit_mode: boolean = false;

	// Placeholders
	firstNamePlaceholder: string;
	lastNamePlaceholder: string;
	phonePlaceholder: string;
	facebookPlaceholder: string;

	// Default values
	first_name: string;
	last_name: string;
	phone_number: string;
	facebook_link: string;
	car_model: string;
	license: string;

	constructor(
		private authService: AuthService,
		private navbarService: NavBarService,
		@Inject(TOASTR_TOKEN) private toastr: any
	) {}

	ngOnInit() {
		this.currentUser = this.authService.getUser();
		console.log(this.currentUser);

		this.firstNamePlaceholder = "First Name";
		this.lastNamePlaceholder = "Last Name";
		this.phonePlaceholder = "Phone number";
		this.facebookPlaceholder = "Facebook Profile Link";
		this.first_name = this.currentUser.first_name;
		this.last_name = this.currentUser.last_name;
		this.phone_number = this.currentUser.phone_number;
		this.facebook_link = this.currentUser.facebook_link;

		if (this.currentUser.car_model) {
			this.license = this.currentUser.license_plate;
			this.car_model = this.currentUser.car_model;
		}
	}

	edit() {
		this.edit_mode = true;
	}

	updateUser(formValues) {
		console.log(formValues);
		this.authService.updateUser(this.currentUser.id, 
			formValues.first_name, 
			formValues.last_name, 
			formValues.phone_number, 
			formValues.facebook_link,
			formValues.car_model,
			formValues.license)
			.subscribe(
				(data) => {
					console.log("Successfully updated the user's data");
					this.currentUser = this.authService.getUser();
					this.navbarService.update();
					this.edit_mode = false;
				},
				(err) => {
					this.toastr.error(err);
				}
			)
	}

	cancel() {
		this.edit_mode = false;
	}

	checkError(form) {
		console.log("Form checked", form)
		// Check that the form is value
		if (!form.valid) {
			// If not valid, show the errors
			if (!form.value.first_name) {
				this.firstNamePlaceholder = "First Name - Required!";
			}
			if (!form.value.last_name) {
				this.lastNamePlaceholder = "Last Name - Required!";
			}
			if (!form.value.phone_number) {
				this.phonePlaceholder = "Phone Number - Required!";
			}
			if (!form.value.facebook_link) {
				this.facebookPlaceholder = "Facebook Link - Required!";
			}
		} else {
			// Check that the user actually changed something
			if (form.value.first_name != this.currentUser.first_name ||
				form.value.last_name != this.currentUser.last_name || 
				form.value.phone_number != this.currentUser.phone_number ||
				form.value.facebook_link != this.currentUser.facebook_link ||
				form.value.car_model != this.currentUser.car_model ||
				form.value.license != this.currentUser.license_plate) {
				this.updateUser(form.value);
			} else {
				this.cancel();
			}
		}
	}

}