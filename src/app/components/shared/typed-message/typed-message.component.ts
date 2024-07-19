import { Component, ElementRef, input, OnDestroy, OnInit, output, viewChild } from '@angular/core';
import Typed from 'typed.js';

@Component({
	selector: 'app-typed-message',
	standalone: true,
	imports: [],
	template: ` <span #messageRef></span> `,
})
/**
 * Facade for Typed.js, additional documentation on: https://mattboldt.github.io/typed.js/docs/
 */
export class TypedMessageComponent implements OnInit, OnDestroy {
	/**
	 * INPUT SIGNALS
	 */
	strings = input.required<string[]>();
	typeSpeed = input<number>(0);
	startDelay = input<number>(0);
	backSpeed = input<number>(0);
	backDelay = input<number>(700);
	fadeOut = input<boolean>(false);
	showCursor = input<boolean>(true);
	callbackOnComplete = output<Typed>();
	callbackOnDestroy = output<Typed>();

	/**
	 * SIGNALS
	 */
	protected messageRef = viewChild<ElementRef>('messageRef');
	private typedInstance: Typed | undefined;

	ngOnInit(): void {
		this.typedInstance = new Typed(this.messageRef()?.nativeElement, {
			strings: this.strings(),
			typeSpeed: this.typeSpeed(),
			startDelay: this.startDelay(),
			backSpeed: this.backSpeed(),
			backDelay: this.backDelay(),
			fadeOut: this.fadeOut(),
			showCursor: this.showCursor(),
			onComplete: (self: Typed) => {
				this.callbackOnComplete.emit(self);
			},
			onDestroy: (self: Typed) => {
				this.callbackOnDestroy.emit(self);
			},
		});
	}

	ngOnDestroy(): void {
		this.typedInstance?.destroy();
	}
}
