import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'phone'})

export class PhoneNumberPipe implements PipeTransform {

	transform(number: string): string {
		if (number) {
			if (number.length == 10) {
				let phone_number = "";
				phone_number = "("+number.substring(0, 3)+") "+number.substring(3, 6) + " - " + number.substring(6, 10);
				return phone_number;
			} else {
				return number;
			}
		}
		
	}

}