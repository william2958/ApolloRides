import { Injectable, Inject } from '@angular/core';
import { IUser } from './user.model';
import { IPublicUser } from './publicuser.model';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { APP_CONFIG } from '../app.config';
import { CookieService } from 'angular2-cookie/core';
import { NavBarService } from '../nav/navbar.service';
import { TOASTR_TOKEN } from '../common/toastr.service';

@Injectable()
export class AuthService {

	currentUser: any;
	cached_user_trips: boolean = false;
	cached_user_trips_response;

	constructor(
		@Inject(APP_CONFIG) private config: any, 
		private http:Http,
		private cookieService: CookieService,
		private navBarService: NavBarService,
		@Inject(TOASTR_TOKEN) private toastr: any
	) {}

	loginUser(email: string, password: string):Observable<any> {
		let headers = new Headers({ 'Content-Type': 'application/json'});
		let options = new RequestOptions({headers: headers});

		console.log("Attempting to log in");
		return this.http.post(`${this.config.apiEndpoint}/sign_in?email=${email}&password=${password}`, options)
			.do((resp: any) => {
				if (resp) {
					console.log("Logged in as: ", resp)
					this.currentUser = JSON.parse(resp._body);
					console.log("Current user is: ", this.currentUser)
					this.cookieService.put("auth_token", this.currentUser.auth_token);
					this.toastr.success("Logged In");
				}
			}).catch(this.handleError)
	}

	signUp(email: string, first_name: string, last_name: string, password: string, phone_number: string, facebook_link: string) {
		console.log("Attempting to sign up user.");

		let headers = new Headers({ 'Content-Type': 'application/json'});
		let options = new RequestOptions({headers: headers});

		let stripped_phone_number = phone_number.replace(" ", "");

		return this.http.post(`${this.config.apiEndpoint}/sign_up
			?email=${email}
			&first_name=${first_name}
			&last_name=${last_name}
			&password=${password}
			&phone_number=${stripped_phone_number}
			&facebook_link=${facebook_link}`, options)
			.do((resp: any) => {
				if (resp) {
					console.log("Successfully signed up.")
				}
			}).catch(this.handleError);
	}

	updateUser(id: string, first_name: string, last_name: string, phone_number: string, facebook_link: string, car_model: string, license: string) {
		console.log("Updating user");

		let headers = new Headers({ 'Content-Type': 'application/json'});
		headers.append('Authorization', this.currentUser.auth_token);
		let options = new RequestOptions({headers: headers});

		let stripped_phone_number = phone_number.replace(" ", "");

		return this.http.post(`${this.config.apiEndpoint}/update_user
			?id=${id}
			&first_name=${first_name}
			&last_name=${last_name}
			&phone_number=${stripped_phone_number}
			&facebook_link=${facebook_link}
			&car_model=${car_model}
			&license_plate=${license}`, JSON.stringify({}), options)
			.do((resp:any) => {
				if (resp) {
					console.log("Successfully updated the user", resp);
					this.currentUser = JSON.parse(resp._body).user
				}
			}).catch(this.handleError);
	}

	loginWithToken(token: string):Observable<any> {
		var headers = new Headers();
		headers.append('Authorization', token);
		let options = new RequestOptions({headers: headers})
		
		return this.http.get(`${this.config.apiEndpoint}/user`, {headers: headers})
			.do((resp: any) => {
				this.currentUser = JSON.parse(resp._body);
				this.currentUser.auth_token = token;
				this.navBarService.update();
			}).catch(this.handleError);
	}

	logout() {
		this.currentUser = null;
		this.cookieService.removeAll();
	}

	getTrips():Observable<any> {
		var headers = new Headers();
		headers.append('Authorization', this.currentUser.auth_token)
		let options = new RequestOptions({headers: headers})
		
		if (!this.cached_user_trips) {
			if (this.currentUser.auth_token) {
				return this.http.post(`${this.config.apiEndpoint}/get_user_trips`, options, {headers: headers})
					.do((resp: any) => {
						this.cached_user_trips = true;
						this.cached_user_trips_response = JSON.parse(resp._body);
						console.log("Response from server is: ", resp);
					}).catch(this.handleError);
			}
		} else {
			return this.cached_user_trips_response;
		}
	}

	getUser() {
		return this.currentUser;
	}

	forgotPassword(email: string):Observable<any> {
		let headers = new Headers({ 'Content-Type': 'application/json'});
		let options = new RequestOptions({headers: headers});
		return this.http.post(`${this.config.apiEndpoint}/
			forgot_password?email=${email}`, options)
			.do((resp: any) => {
				console.log("Reset Password email sent!");
			}).catch(this.handleError);
	}

	changePassword(confirm_token: string, password: string) {
		let headers = new Headers({ 'Content-Type': 'application/json'});
		let options = new RequestOptions({headers: headers});
		return this.http.post(`${this.config.apiEndpoint}/change_password
			?confirm_token=${confirm_token}
			&password=${password}`, options)
			.do((resp: any) => {
				console.log("Password reset!");
			}).catch(this.handleError);
	}

	confirmEmail(confirm_token: string) {
		let headers = new Headers({ 'Content-Type': 'application/json'});
		let options = new RequestOptions({headers: headers});
		return this.http.post(`${this.config.apiEndpoint}/confirm_email
			?confirm_token=${confirm_token}`, options)
			.do((resp: any) => {
				console.log("Email confirmed in service!");
			}).catch(this.handleError);
	}

	private handleError (error: Response | any) {
	  // In a real world app, you might use a remote logging infrastructure
	  let err = JSON.parse(error._body)
	  let errMsg: string;
	  console.log("error handling", err)
	  if (err.status == "error") {
	  	errMsg = err.message
	  }
	  // if (error instanceof Response) {
	  //   const body = error.json() || '';
	  //   const err = body.error || JSON.stringify(body);
	  //   errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
	  // } else {
	  //   errMsg = error.message ? error.message : error.toString();
	  // }
	  console.error(errMsg);
	  return Observable.throw(errMsg);
	}

}

// const temp_user:any = {
// 	id: "idstring",
// 	first_name: "William",
// 	last_name: "Huang",
// 	trips_driving: [
// 		{
// 			id: "58bf35b56a48864d1494d88f",
// 			driver: {
// 				id: "58bf35996a48864ce84696b1",
// 				first_name: "Ted",
// 				last_name: "Mosby"
// 			},
// 			date: new Date('4/15/2017'),
// 			spaces: 2,
// 			price: 20,
// 			user_requests: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Lily",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			accepted_users: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			location: {
// 				from: {
// 					from_country: "Canada",
// 					from_state: "Ontario",
// 					from_city: "London",
// 					from_metadata: "Western University",
// 					pickup_location: "Anywhere on main campus"
// 				}, 
// 				destination: {
// 					to_country: "Canada",
// 					to_state: "Ontario",
// 					to_city: "Toronto",
// 					to_metadata: "Fairview"
// 				}
// 			}
// 		},
// 		{
// 			id: "58bf35b56a48864d1494d88f",
// 			driver: {
// 				id: "58bf35996a48864ce84696b1",
// 				first_name: "Ted",
// 				last_name: "Mosby"
// 			},
// 			date: new Date('4/15/2017'),
// 			spaces: 2,
// 			price: 20,
// 			user_requests: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Lily",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			accepted_users: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			location: {
// 				from: {
// 					from_country: "Canada",
// 					from_state: "Ontario",
// 					from_city: "London",
// 					from_metadata: "Western University",
// 					pickup_location: "Anywhere on main campus"
// 				}, 
// 				destination: {
// 					to_country: "Canada",
// 					to_state: "Ontario",
// 					to_city: "Toronto",
// 					to_metadata: "Fairview"
// 				}
// 			}
// 		}
// 	],
// 	trips_requested: [
// 		{
// 			id: "58bf35b56a48864d1494d88f",
// 			driver: {
// 				id: "58bf35996a48864ce84696b1",
// 				first_name: "Ted",
// 				last_name: "Mosby"
// 			},
// 			date: new Date('4/15/2017'),
// 			spaces: 2,
// 			price: 20,
// 			user_requests: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Lily",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			accepted_users: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			location: {
// 				from: {
// 					from_country: "Canada",
// 					from_state: "Ontario",
// 					from_city: "London",
// 					from_metadata: "Western University",
// 					pickup_location: "Anywhere on main campus"
// 				}, 
// 				destination: {
// 					to_country: "Canada",
// 					to_state: "Ontario",
// 					to_city: "Toronto",
// 					to_metadata: "Fairview"
// 				}
// 			}
// 		},
// 		{
// 			id: "58bf35b56a48864d1494d88f",
// 			driver: {
// 				id: "58bf35996a48864ce84696b1",
// 				first_name: "Ted",
// 				last_name: "Mosby"
// 			},
// 			date: new Date('4/15/2017'),
// 			spaces: 2,
// 			price: 20,
// 			user_requests: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Lily",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			accepted_users: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			location: {
// 				from: {
// 					from_country: "Canada",
// 					from_state: "Ontario",
// 					from_city: "London",
// 					from_metadata: "Western University",
// 					pickup_location: "Anywhere on main campus"
// 				}, 
// 				destination: {
// 					to_country: "Canada",
// 					to_state: "Ontario",
// 					to_city: "Toronto",
// 					to_metadata: "Fairview"
// 				}
// 			}
// 		}
// 	],
// 	past_trips_requested: [
// 		{
// 			id: "58bf35b56a48864d1494d88f",
// 			driver: {
// 				id: "58bf35996a48864ce84696b1",
// 				first_name: "Ted",
// 				last_name: "Mosby"
// 			},
// 			date: new Date('4/15/2017'),
// 			spaces: 2,
// 			price: 20,
// 			user_requests: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Lily",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			accepted_users: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			location: {
// 				from: {
// 					from_country: "Canada",
// 					from_state: "Ontario",
// 					from_city: "London",
// 					from_metadata: "Western University",
// 					pickup_location: "Anywhere on main campus"
// 				}, 
// 				destination: {
// 					to_country: "Canada",
// 					to_state: "Ontario",
// 					to_city: "Toronto",
// 					to_metadata: "Fairview"
// 				}
// 			}
// 		},
// 		{
// 			id: "58bf35b56a48864d1494d88f",
// 			driver: {
// 				id: "58bf35996a48864ce84696b1",
// 				first_name: "Ted",
// 				last_name: "Mosby"
// 			},
// 			date: new Date('4/15/2017'),
// 			spaces: 2,
// 			price: 20,
// 			user_requests: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Lily",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			accepted_users: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			location: {
// 				from: {
// 					from_country: "Canada",
// 					from_state: "Ontario",
// 					from_city: "London",
// 					from_metadata: "Western University",
// 					pickup_location: "Anywhere on main campus"
// 				}, 
// 				destination: {
// 					to_country: "Canada",
// 					to_state: "Ontario",
// 					to_city: "Toronto",
// 					to_metadata: "Fairview"
// 				}
// 			}
// 		}
// 	],
// 	past_trips_driven: [
// 		{
// 			id: "58bf35b56a48864d1494d88f",
// 			driver: {
// 				id: "58bf35996a48864ce84696b1",
// 				first_name: "Ted",
// 				last_name: "Mosby"
// 			},
// 			date: new Date('4/15/2017'),
// 			spaces: 2,
// 			price: 20,
// 			user_requests: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Lily",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			accepted_users: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			location: {
// 				from: {
// 					from_country: "Canada",
// 					from_state: "Ontario",
// 					from_city: "London",
// 					from_metadata: "Western University",
// 					pickup_location: "Anywhere on main campus"
// 				}, 
// 				destination: {
// 					to_country: "Canada",
// 					to_state: "Ontario",
// 					to_city: "Toronto",
// 					to_metadata: "Fairview"
// 				}
// 			}
// 		},
// 		{
// 			id: "58bf35b56a48864d1494d88f",
// 			driver: {
// 				id: "58bf35996a48864ce84696b1",
// 				first_name: "Ted",
// 				last_name: "Mosby"
// 			},
// 			date: new Date('4/15/2017'),
// 			spaces: 2,
// 			price: 20,
// 			user_requests: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Lily",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			accepted_users: [
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Robin",
// 					last_name: "Scherbazky"
// 				},
// 				{
// 					id: "58bf35996a48864ce84696b1",
// 					first_name: "Marshall",
// 					last_name: "Scherbazky"
// 				}
// 			],
// 			location: {
// 				from: {
// 					from_country: "Canada",
// 					from_state: "Ontario",
// 					from_city: "London",
// 					from_metadata: "Western University",
// 					pickup_location: "Anywhere on main campus"
// 				}, 
// 				destination: {
// 					to_country: "Canada",
// 					to_state: "Ontario",
// 					to_city: "Toronto",
// 					to_metadata: "Fairview"
// 				}
// 			}
// 		}
// 	],
// 	facebook_link: "facebook.com/william.huang.7737",
// 	phone_number: "416-555-7485"
// }