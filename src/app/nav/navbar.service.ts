import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavBarService {
	showLogin: Observable<boolean>;
	showSignUp: boolean;
	updateNav: Observable<boolean>;

	private showLoginSubject: Subject<boolean>;
	private updateNavSubject: Subject<boolean>;

	constructor() {
		this.showLoginSubject = new Subject<boolean>();
		this.showLogin = this.showLoginSubject.asObservable();

		this.updateNavSubject = new Subject<boolean>();
		this.updateNav = this.updateNavSubject.asObservable();
	}

	showLoginModal() {
		this.showLoginSubject.next(true);
	}

	showSignUpModal() {
		this.showSignUp = true;
	}

	update() {
		this.updateNavSubject.next(true);
	}

}