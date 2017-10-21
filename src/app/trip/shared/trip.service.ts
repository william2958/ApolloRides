import { Injectable, EventEmitter, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ITrip } from './trip.model';
import { Subject, Observable } from 'rxjs/Rx';
import { AuthService } from '../../user/auth.service';
import { APP_CONFIG } from '../../app.config';

@Injectable()
export class TripService {

  foundTrips: any[];
  cached: string;
  dashboardShowRequests: boolean = true;

  constructor (
    private http: Http,
    private authService: AuthService,
    @Inject(APP_CONFIG) private config: any
  ) {}

  searchTrips(from: string, to: string, date: string):Observable<any[]> {

    // Turn from and to into lowercase
    from = from.toLocaleLowerCase();
    to = to.toLocaleLowerCase();

    // Set the cached key
    this.cached = from+to+date;

    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(`${this.config.apiEndpoint}/search_trips?from_location=${from}&to_location=${to}&date=${date}`, options)
      .do((resp: any) => {
        if(resp) {
          // Cache the trips into the foundTrips variable
          this.foundTrips = JSON.parse(resp._body).results;
        }
      }).catch(this.handleError);
  }

  setFoundTrips(trips: ITrip[]) {
    this.foundTrips = trips;
  }

  getFoundTrips() {
    return this.foundTrips;
  }

  createTrip(tripValues: any):Observable<any> {
    if (this.authService.currentUser.auth_token) {
      let headers = new Headers();
      headers.append('Authorization', this.authService.currentUser.auth_token);
      let options = new RequestOptions({headers: headers});

      console.log("Inside trip service, time is: ", tripValues.date)
      console.log('driver: ', this.authService.currentUser.id.$oid);
      console.log('driver: ', this.authService.currentUser.id);
      return this.http.post(
        `${this.config.apiEndpoint}/create_trip
				?driver=${this.authService.currentUser.id.$oid}
				&date=${(tripValues.date/1000).toString()}
				&spaces=${tripValues.numPassengers}
				&price=${tripValues.price}
				&from_country=${tripValues.fromLocation.fromCountry.toLocaleLowerCase()}
				&from_state=${tripValues.fromLocation.fromState.toLocaleLowerCase()}
				&from_city=${tripValues.fromLocation.fromCity.toLocaleLowerCase()}
				&from_metadata=${tripValues.fromLocation.fromMetadata}
				&to_country=${tripValues.toLocation.toCountry.toLocaleLowerCase()}
				&to_state=${tripValues.toLocation.toState.toLocaleLowerCase()}
				&to_city=${tripValues.toLocation.toCity.toLocaleLowerCase()}
				&to_metadata=${tripValues.toLocation.toMetadata}
				&trip_details=${tripValues.tripDetails}`
        , options, {headers: headers})
        .do((resp: any) => {
          console.log("the resp after creating was: ", resp);
        }).catch(this.handleError);
    }
  }

  updateDriverDetails(detailValues: any):Observable<any> {
    if (this.authService.currentUser.auth_token) {
      let headers = new Headers();
      headers.append('Authorization', this.authService.currentUser.auth_token);
      let options = new RequestOptions({headers: headers});

      return this.http.post(
        `${this.config.apiEndpoint}/driver_details
				?license_plate=${detailValues.license_plate}
				&car_model=${detailValues.car_model}`
        , options, {headers: headers})
        .do((resp: any) => {
          console.log("the resp after creating was: ", resp);
        }).catch(this.handleError);
    }
  }

  cancelTrip(id: string):Observable<any> {
    if (this.authService.currentUser.auth_token) {
      let headers = new Headers();
      headers.append('Authorization', this.authService.currentUser.auth_token);
      let options = new RequestOptions({headers: headers});

      return this.http.post(`${this.config.apiEndpoint}/delete_trip?trip_id=${id}`, options, {headers: headers})
        .do((resp: any) => {
          console.log("The trip was successfully cancelled and the resposne was: ", resp)
        }).catch(this.handleError);
    }
  }

  getTripListing(id: string):Observable<any> {

    if (this.authService.currentUser.auth_token) {
      let headers = new Headers();
      headers.append('Authorization', this.authService.currentUser.auth_token);
      let options = new RequestOptions({headers: headers});

      return this.http.post(`${this.config.apiEndpoint}/get_trip_listing?trip_id=${id}`, options, {headers: headers});
    }
  }

  getTrip(id: string):Observable<any> {
    let headers = new Headers();
    let options = new RequestOptions();

    return this.http.post(`${this.config.apiEndpoint}/get_trip?trip_id=${id}`, options)
      .do((resp:any) => {
        console.log("Get trip response: ", resp);
      });
  }

  getAuthorizedTrip(id: string):Observable<any> {
    let headers = new Headers();
    headers.append('Authorization', this.authService.currentUser.auth_token);
    let options = new RequestOptions();

    return this.http.post(`${this.config.apiEndpoint}/get_authorized_trip?trip_id=${id}`, options, {headers: headers})
      .do((resp:any) => {
        console.log("Get trip response: ", resp);
      });
  }

  requestRide(trip_id: string): Observable<any> {

    if (this.authService.currentUser.auth_token) {

      let headers = new Headers();
      headers.append('Authorization', this.authService.currentUser.auth_token);
      let options = new RequestOptions({headers: headers});

      return this.http.post(`${this.config.apiEndpoint}/request_trip?trip_id=${trip_id}&user_id=${this.authService.currentUser.id}`, options, {headers: headers});

    } else {
      return Observable.of(false);
    }

  }

  cancelTripRequest(trip_id: string): Observable<any> {
    if (this.authService.currentUser.auth_token) {

      let headers = new Headers();
      headers.append('Authorization', this.authService.currentUser.auth_token);
      let options = new RequestOptions({headers: headers});

      return this.http.post(`${this.config.apiEndpoint}/cancel_request?trip_id=${trip_id}`, options, {headers: headers});

    } else {
      return Observable.of(false);
    }
  }

  acceptRequest(trip_id: string, user_id: string): Observable<any> {
    if (this.authService.currentUser.auth_token) {
      let headers = new Headers();
      headers.append('Authorization', this.authService.currentUser.auth_token);
      let options = new RequestOptions({headers: headers});

      return this.http.post(`${this.config.apiEndpoint}/accept_request?trip_id=${trip_id}&user_id=${user_id}`, options, {headers: headers})
        .do((resp: any) => {
          console.log("the resp after accepting the request was: ", resp);
        }).catch(this.handleError);
    }
  }

  checkExpired() {
    if (this.authService.currentUser.auth_token) {
      let headers = new Headers();
      headers.append('Authorization', this.authService.currentUser.auth_token);
      let options = new RequestOptions({headers: headers});

      return this.http.post(`${this.config.apiEndpoint}/check_expired`, options, {headers: headers})
        .do((resp: any) => {
          console.log("Check for expired trips. Response from server was: ", resp);
        }).catch(this.handleError);
    }
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    console.log("The error returned was: ", error);
    if (error.status == 0) {
      console.log("The result from the server is not ok")
      return Observable.throw("There was an error communicating with the server.")
    } else {
      let err = JSON.parse(error._body)
      let errMsg: string;
      console.log("error handling", err)
      if (err.status == "error") {
        errMsg = err.message
      }
      console.error(errMsg);
      return Observable.throw(errMsg);
    }

  }

}

const RETURNED_TRIPS: any[] = [
  {
    id: "58bf35b56a48864d1494d88f",
    driver: {
      id: "58bf35996a48864ce84696b1",
      first_name: "Ted",
      last_name: "Mosby"
    },
    date: new Date('4/15/2017'),
    spaces: 2,
    price: 20,
    user_requests: [
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Robin",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Marshall",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Lily",
        last_name: "Scherbazky"
      }
    ],
    accepted_users: [
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Robin",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Marshall",
        last_name: "Scherbazky"
      }
    ],
    location: {
      from: {
        from_country: "Canada",
        from_state: "Ontario",
        from_city: "London",
        from_metadata: "Western University",
        pickup_location: "Anywhere on main campus"
      },
      destination: {
        to_country: "Canada",
        to_state: "Ontario",
        to_city: "Toronto",
        to_metadata: "Fairview"
      }
    }
  },
  {
    id: "58bf35b56a48864d1494d88f",
    driver: {
      id: "58bf35996a48864ce84696b1",
      first_name: "Ted",
      last_name: "Mosby"
    },
    date: new Date('4/15/2017'),
    spaces: 2,
    price: 20,
    user_requests: [
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Robin",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Marshall",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Lily",
        last_name: "Scherbazky"
      }
    ],
    accepted_users: [
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Robin",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Marshall",
        last_name: "Scherbazky"
      }
    ],
    location: {
      from: {
        from_country: "Canada",
        from_state: "Ontario",
        from_city: "London",
        from_metadata: "Western University",
        pickup_location: "Anywhere on main campus"
      },
      destination: {
        to_country: "Canada",
        to_state: "Ontario",
        to_city: "Toronto",
        to_metadata: "Fairview"
      }
    }
  },
  {
    id: "58bf35b56a48864d1494d88f",
    driver: {
      id: "58bf35996a48864ce84696b1",
      first_name: "Ted",
      last_name: "Mosby"
    },
    date: new Date('4/15/2017'),
    spaces: 2,
    price: 20,
    user_requests: [
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Robin",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Marshall",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Lily",
        last_name: "Scherbazky"
      }
    ],
    accepted_users: [
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Robin",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Marshall",
        last_name: "Scherbazky"
      }
    ],
    location: {
      from: {
        from_country: "Canada",
        from_state: "Ontario",
        from_city: "London",
        from_metadata: "Western University",
        pickup_location: "Anywhere on main campus"
      },
      destination: {
        to_country: "Canada",
        to_state: "Ontario",
        to_city: "Toronto",
        to_metadata: "Fairview"
      }
    }
  },
  {
    id: "58bf35b56a48864d1494d88f",
    driver: {
      id: "58bf35996a48864ce84696b1",
      first_name: "Ted",
      last_name: "Mosby"
    },
    date: new Date('4/15/2017'),
    spaces: 2,
    price: 20,
    user_requests: [
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Robin",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Marshall",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Lily",
        last_name: "Scherbazky"
      }
    ],
    accepted_users: [
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Robin",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Marshall",
        last_name: "Scherbazky"
      }
    ],
    location: {
      from: {
        from_country: "Canada",
        from_state: "Ontario",
        from_city: "London",
        from_metadata: "Western University",
        pickup_location: "Anywhere on main campus"
      },
      destination: {
        to_country: "Canada",
        to_state: "Ontario",
        to_city: "Toronto",
        to_metadata: "Fairview"
      }
    }
  },
  {
    id: "58bf35b56a48864d1494d88f",
    driver: {
      id: "58bf35996a48864ce84696b1",
      first_name: "Ted",
      last_name: "Mosby"
    },
    date: new Date('4/15/2017'),
    spaces: 2,
    price: 20,
    user_requests: [
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Robin",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Marshall",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Lily",
        last_name: "Scherbazky"
      }
    ],
    accepted_users: [
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Robin",
        last_name: "Scherbazky"
      },
      {
        id: "58bf35996a48864ce84696b1",
        first_name: "Marshall",
        last_name: "Scherbazky"
      }
    ],
    location: {
      from: {
        from_country: "Canada",
        from_state: "Ontario",
        from_city: "London",
        from_metadata: "Western University",
        pickup_location: "Anywhere on main campus"
      },
      destination: {
        to_country: "Canada",
        to_state: "Ontario",
        to_city: "Toronto",
        to_metadata: "Fairview"
      }
    }
  }
]
