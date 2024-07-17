import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { NavModulesComponent } from '../../../../components/shared/nav/nav-modules/nav-modules.component';
import { NavModulesService } from '../../../../components/shared/nav/nav-modules/nav-modules.service';
import { NavTopComponent } from '../../../../components/shared/nav/nav-top/nav-top.component';
import { TokenManagerService } from '../../../../infra/services/token/token-manager.service';

@Component({
	selector: 'app-restricted-page',
	standalone: true,
	imports: [RouterOutlet, NavTopComponent, NavModulesComponent],
	template: `
		<app-nav-top />
		@if (navModulesService.opened()) {
			<app-nav-modules />
		}
		<router-outlet />
	`,
	host: {
		'(document:keydown.Control.;)': 'navLeftService.handleOpened()',
	},
})
export class RestrictedPageComponent implements OnInit, OnDestroy {
	/**
	 * SERVICES
	 */
	private readonly tokenManagerService = inject(TokenManagerService);
	private readonly routerService = inject(Router);
	protected readonly navModulesService = inject(NavModulesService);

	/**
	 * SIGNALS AND OBSERVABLES
	 */
	private tokenExpLeftSubscription: Subscription | undefined;
	private clearTimeoutProcessToken: ReturnType<typeof setTimeout> | undefined;

	ngOnInit(): void {
		this.tokenExpLeftSubscription = this.tokenManagerService.tokenExpLeft$.subscribe((expLeft: number) => {
			if (expLeft > 0) {
				this.clearTimeoutProcessToken = setTimeout(() => {
					if (!this.tokenManagerService.processToken()) this.routerService.navigate(['/gate']);
				}, environment.token.interval);
			} else this.routerService.navigate(['/gate']);
		});
	}

	ngOnDestroy(): void {
		this.tokenExpLeftSubscription?.unsubscribe();
		clearTimeout(this.clearTimeoutProcessToken);
	}
}
