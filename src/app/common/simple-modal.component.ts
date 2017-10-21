import { Component, Input, ViewChild, ElementRef, Inject } from '@angular/core';
import { JQ_TOKEN } from './jQuery.service';

@Component({
	selector: 'simple-modal',
	templateUrl: './simple-modal.component.html',
	styleUrls: ['./simple-modal.component.css']
})

export class SimpleModalComponent {
	@Input() title: string;
	@Input() elementId: string;
	@Input() closeOnBodyClick: string;
	@Input() bodyHeight: string;
	@Input() color: string;
	// This allows this class to find the element with the parameter id
	// This points to the #modalcontainer element in the template
	@ViewChild('modalcontainer') containerEl: ElementRef;

	constructor (@Inject(JQ_TOKEN) private $: any) {

	}

	getHeight() {
		if (this.bodyHeight == 'large') {
			return '400px';
		} else if (this.bodyHeight == 'medium') {
			return '340px';
		} else if (this.bodyHeight =='small') {
			return '200px';
		} else if (this.bodyHeight == 'extralarge') {
			return '550px';
		} else {
			return '280px';
		}
	}

	getHeaderBackground() {
		if (this.color == 'blue') {
			return '#005FB5';
		} else if (this.color == 'red') {
			return '#E53935';
		} else {
			return '#9CCC65';
		}
	}

	closeModal() {
		if(this.closeOnBodyClick.toLocaleLowerCase() === 'false') {
			this.$( this.containerEl.nativeElement ).modal('hide');
		}
		
	}

}