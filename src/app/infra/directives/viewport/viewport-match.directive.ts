import { Directive, effect, inject, input, signal, TemplateRef, untracked, ViewContainerRef } from '@angular/core';
import { ViewportSize } from '../../services/viewport/viewport-manager.model';
import { ViewportManagerService } from '../../services/viewport/viewport-manager.service';

@Directive({
	selector: '[viewportMatch]',
	standalone: true,
})
export class ViewportMatchDirective {
	/**
	 * SERVICES
	 */
	private readonly templateRef = inject(TemplateRef);
	private readonly viewContainer = inject(ViewContainerRef);
	private readonly viewportManagerService = inject(ViewportManagerService);

	/**
	 * SIGNALS
	 */
	viewportMatch = input.required<ViewportSize | ViewportSize[]>();
	private shown = signal<boolean>(false);

	constructor() {
		effect(() => {
			if (Array.isArray(this.viewportMatch())) {
				if (this.viewportManagerService.currentViewport() === undefined) {
					this.viewContainer.clear();
					untracked(() => this.shown.set(false));
				} else if ((<ViewportSize[]>this.viewportMatch()).includes(this.viewportManagerService.currentViewport() as ViewportSize)) {
					if (!this.shown()) {
						this.viewContainer.createEmbeddedView(this.templateRef);
						untracked(() => this.shown.set(true));
					}
				} else {
					if (this.shown()) {
						this.viewContainer.clear();
						untracked(() => this.shown.set(false));
					}
				}
			} else if (typeof this.viewportMatch() === 'string') {
				if (this.viewportManagerService.currentViewport() === undefined) {
					this.viewContainer.clear();
					untracked(() => this.shown.set(false));
				}
				if (this.viewportMatch() === this.viewportManagerService.currentViewport()) {
					if (!this.shown()) {
						this.viewContainer.createEmbeddedView(this.templateRef);
						untracked(() => this.shown.set(true));
					}
				} else {
					if (this.shown()) {
						this.viewContainer.clear();
						untracked(() => this.shown.set(false));
					}
				}
			}
		});
	}
}
