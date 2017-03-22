import { Directive, OnInit, Inject, ElementRef, Input } from '@angular/core';
import { JQ_TOKEN } from './jQuery.service';

@Directive({
	// selector must have []
	selector: '[modal-trigger]'
})

export class ModalTriggerDirective implements OnInit {

	private el: HTMLElement;
	@Input('modal-trigger') modalId: string;

	// the el tells angular that when this is constructed, also attach
	// an object to the element that it was created on
	constructor(ref: ElementRef, @Inject(JQ_TOKEN) private $: any) {
		// Assigns the private variable to the nativeElement 
		// this directive was assigned to
		this.el = ref.nativeElement;
	}

	ngOnInit() {
		// Call our modal every time the button is clicked
		this.el.addEventListener('click', e => {
			// this.$(`#${this.modalId}`).modal({});
		})
	}

}