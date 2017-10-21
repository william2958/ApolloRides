import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SpinnerService {

	showSpinner: Observable<boolean>;

	private showSpinnerSubject: Subject<boolean>;

	constructor() {
		this.showSpinnerSubject = new Subject<boolean>();
		this.showSpinner = this.showSpinnerSubject.asObservable();
	}

	spinnerOn() {
		this.showSpinnerSubject.next(true);
	}

	spinnerOff() {
		this.showSpinnerSubject.next(false);
	}

}