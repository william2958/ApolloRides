import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'longdate'})

export class LongDatePipe implements PipeTransform {

	transform(date: Date): any {
		console.log("Transforming date: ", date);

		let returned_date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
		
		console.log("Transformed date: ", returned_date);

		return returned_date


	}

}