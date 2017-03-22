import { Component, ViewChild, ElementRef, Inject, OnInit } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { IUser } from '../user/user.model';
import { Router } from '@angular/router';
import { JQ_TOKEN } from '../common/jQuery.service';
import { NavBarService } from './navbar.service';
import { TOASTR_TOKEN } from '../common/toastr.service';

@Component({
	selector: 'nav-bar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})

export class NavBarComponent implements OnInit{

	// An object to store the current user
	currentUser;
	// This shows a message if the user tries to sign in and enters incorrect info
	loginInvalid:boolean = false;
	formErrorMessage:string = "";

	@ViewChild('signupModal') signupEl: any;
	@ViewChild('loginModal') loginEl: any;
	@ViewChild('loginGuardModal') loginGuardEl: any;
	@ViewChild('forgotPasswordModal') forgotPasswordEl: any;

	// Boolean to show and hide the login modal
	showLoginModal: boolean;

	// Signup Form Fields
	signupInvalid: boolean = false;
	passwordMatch: boolean = false;
	forgotPasswordEmailInvalid: boolean = false;
	// Placeholders
	firstNamePlaceholder: string;
	lastNamePlaceholder: string;
	emailPlaceholder: string;
	passwordPlaceholder: string;
	confirmPasswordPlaceholder: string;
	phonePlaceholder: string;
	facebookPlaceholder: string;

	constructor (
		private auth:AuthService, 
		private router: Router, 
		private navbarService: NavBarService,
		@Inject(JQ_TOKEN) private $: any,
		@Inject(TOASTR_TOKEN) private toastr: any
	){}

	ngOnInit() {
		this.currentUser = this.auth.getUser();

		// This makes the service listen to when other components want to show the login modal
		this.navbarService.showLogin.subscribe((newValue: boolean) => {
			this.showLoginModal = newValue;
			console.log("Login guard element is: ", this.loginGuardEl)
			this.$ ( this.loginGuardEl.containerEl.nativeElement ).modal('show');
		});

		this.navbarService.updateNav.subscribe((newValue: boolean) => {
			this.currentUser = this.auth.getUser();
			console.log("Updating navbar...");
		})

		this.firstNamePlaceholder = "First Name";
		this.lastNamePlaceholder = "Last Name";
		this.emailPlaceholder = "Email";
		this.passwordPlaceholder = "Password";
		this.confirmPasswordPlaceholder = "Confirm Password";
		this.phonePlaceholder = "Phone number";
		this.facebookPlaceholder = "Facebook Profile Link";

	}

	login(formValues) {
		this.auth.loginUser(formValues.userName, formValues.password)
			.subscribe(
				(data) => {
					console.log("Navbar logged in.")
					this.$ ( this.loginEl.containerEl.nativeElement ).modal('hide');
					this.$ ( this.loginGuardEl.containerEl.nativeElement ).modal('hide');
					
					this.showLoginModal = false;
					this.currentUser = this.auth.getUser();
				}, (err) => {
					this.loginInvalid = true;
					this.formErrorMessage = err;
				}
			)
	}

	signup(form) {

		console.log(form);
		console.log(form.valid)

		if (!form.valid) {
			if (!form.value.first_name) {
				console.log("Invalid first name")
				this.firstNamePlaceholder = "First Name - Required!";
			}
			if (!form.value.last_name) {
				this.lastNamePlaceholder = "Last Name - Required!";
			}
			if (!form.value.email) {
				this.emailPlaceholder = "Email - Required!";
			}
			if (!form.value.password) {
				this.passwordPlaceholder = "Password - Required!";
			}
			if (!form.value.password_confirm) {
				this.confirmPasswordPlaceholder = "Confirm Password - Required!";
			}
			if (!form.value.phone_number) {
				this.phonePlaceholder = "Phone Number - Required!";
			}
			if (!form.value.facebook_link) {
				this.facebookPlaceholder = "Facebook Link - Required!";
			}
			if (form.value.password != form.value.password_confirm) {
				this.passwordPlaceholder = "Password - Passwords don't match!";
				this.confirmPasswordPlaceholder = "Confirm - Passwords don't match!";
			}
		} else {
			if (form.value.password != form.value.password_confirm) {
				this.passwordPlaceholder = "Password - Passwords don't match!";
				this.confirmPasswordPlaceholder = "Confirm - Passwords don't match!";
			} 
			// Add additional elsifs to further check the inputs
			else {
				let formValues = form.value;
				this.auth.signUp(
					formValues.email,
					formValues.first_name,
					formValues.last_name,
					formValues.password,
					formValues.phone_number,
					formValues.facebook_link)
					.subscribe(
						(data) => {
							console.log("Sign up Successful");
							this.$ ( this.signupEl.containerEl.nativeElement ).modal('hide');
							this.toastr.success("Sign Up Successful!", "Please check your email for the confirmation link.")
						}, (err) => {
							console.log("Sign up Unsuccessful");
							this.signupInvalid = true;
							this.formErrorMessage = err;
						}
					)
			}
		}
	}

	logout() {
		this.auth.logout();
		this.currentUser = null;
		this.toastr.success("Logged Out");
	}

	cancel() {
		this.$ ( this.signupEl.containerEl.nativeElement ).modal('hide');
		this.$ ( this.loginEl.containerEl.nativeElement ).modal('hide');
		this.$ ( this.loginGuardEl.containerEl.nativeElement ).modal('hide');
	}

	signupRedirect() {
		this.$ ( this.loginGuardEl.containerEl.nativeElement ).modal('hide');
		this.$ ( this.signupEl.containerEl.nativeElement ).modal('show');
	}

	forgotPasswordRedirect() {
		this.cancel();
		this.$ ( this.forgotPasswordEl.containerEl.nativeElement ).modal('show');
	}

	forgotPassword(form) {
		this.auth.forgotPassword(form.email).subscribe(
			(data) => {
				console.log("Forgot password email sent.");
				this.$ ( this.forgotPasswordEl.containerEl.nativeElement ).modal('hide');
				this.toastr.success("Reset Password Email Sent!", "Please check your email for a reset link.")
			}, (err) => {
				console.log("Unable to send the reset email.");
				this.forgotPasswordEmailInvalid = true;
				this.toastr.error(err);
			}
		)
		console.log("Forgot password triggered, form is: ", form);
	}

	showLoginModalFunction() {
		this.$ ( this.loginEl.containerEl.nativeElement ).modal('show');
	}

	showSignupModalFunction() {
		this.$ ( this.signupEl.containerEl.nativeElement ).modal('show');
	}

	// if (this.showLoginModal) {
	// 	this.$ ( this.loginEl.loginEl.nativeElement ).modal('show');
	// }
	

}