import { BreakpointObserver } from '@angular/cdk/layout';
import {
	Directive,
	Input,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewportSizes } from './viewport.model';

@Directive({
	selector: '[kdsViewportMatch]',
	standalone: true,
})
export class ViewportMatchDirective implements OnDestroy {
	private breakpointObserverSubscription!: Subscription;
	private shown: boolean = false;

	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private breakpointObserver: BreakpointObserver
	) {}

	ngOnDestroy(): void {
		if (this.breakpointObserverSubscription)
			this.breakpointObserverSubscription.unsubscribe();
	}

	@Input() set kdsViewportMatch(
		breakpoints: 'All' | ViewportSizes | ViewportSizes[]
	) {
		if (breakpoints === 'All') {
			this.render(true);
			return;
		}
		if (this.breakpointObserverSubscription) return;

		this.breakpointObserverSubscription = this.breakpointObserver
			.observe(breakpoints)
			.subscribe(({ matches }) => this.render(matches));
	}

	private render(renderElement: boolean): void {
		if (!this.shown && renderElement) {
			this.viewContainer.createEmbeddedView(this.templateRef);
			this.shown = true;
		} else {
			this.viewContainer.clear();
			this.shown = false;
		}
	}
}
