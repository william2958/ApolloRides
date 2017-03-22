import { Component, OnInit } from '@angular/core';
import { AuthService } from './user/auth.service';
import { CookieService } from 'angular2-cookie/core';

@Component({
	selector: 'rideshare',
	template: `
		<nav-bar></nav-bar>
		<router-outlet></router-outlet>
	`
})

export class RideshareAppComponent implements OnInit {

	cookie: string = "";

	constructor(
		private authService: AuthService,
		private cookieService: CookieService
	) {}

	ngOnInit() {
		console.log("Enter token here");
		this.cookie = this.cookieService.get("auth_token");
		console.log("Cookie that was retreived is", this.cookie)
		if (this.cookie) {
			this.authService.loginWithToken(this.cookie).subscribe(resp => {
				console.log("After login with token in rideshare component, response from server was: ", resp);
			})
		}
	}

}