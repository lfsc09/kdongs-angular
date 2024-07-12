import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { NavLeftComponent } from '../../../../components/shared/nav/nav-left/nav-left.component';
import { NavLeftService } from '../../../../components/shared/nav/nav-left/nav-left.service';
import { NavTopComponent } from '../../../../components/shared/nav/nav-top/nav-top.component';
import { TokenManagerService } from '../../../../infra/services/token/token-manager.service';

@Component({
	selector: 'app-restricted-page',
	standalone: true,
	imports: [RouterOutlet, NavTopComponent, NavLeftComponent],
	template: `
		<app-nav-top />
		@if (navLeftService.opened()) {
			<app-nav-left />
		}
		<router-outlet />
	`,
	host: {
		'(document:keydown.Control.;)': 'handleOpenNavLeft()',
	},
})
export class RestrictedPageComponent implements OnInit, OnDestroy {
	/**
	 * SERVICES
	 */
	private readonly tokenManagerService = inject(TokenManagerService);
	private readonly routerService = inject(Router);
	protected readonly navLeftService = inject(NavLeftService);

	/**
	 * SIGNALS AND OBSERVABLES
	 */
	private tokenExpLeftSubscription: Subscription | undefined;
	private clearTimeoutProcessToken: ReturnType<typeof setTimeout> | undefined;

	ngOnInit(): void {
		this.tokenExpLeftSubscription = this.tokenManagerService.tokenExpLeft$.subscribe((expLeft: number) => {
			this.clearTimeoutProcessToken = setTimeout(() => {
				if (!this.tokenManagerService.processToken()) this.routerService.navigate(['/gate']);
			}, environment.token.interval);
		});
	}

	ngOnDestroy(): void {
		this.tokenExpLeftSubscription!.unsubscribe();
		clearTimeout(this.clearTimeoutProcessToken);
	}

	handleOpenNavLeft() {
		this.navLeftService.handleOpened();
	}
}
