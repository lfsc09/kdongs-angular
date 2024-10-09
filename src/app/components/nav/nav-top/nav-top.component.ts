import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { Subscription, filter, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ViewportMatchDirective } from '../../../infra/directives/viewport/viewport-match.directive';
import { TokenManagerService } from '../../../infra/services/token/token-manager.service';
import { KdsCircularProgressComponent } from '../../shared/kds/kds-circular-progress/kds-circular-progress.component';
import { NavModulesService } from '../nav-modules/nav-modules.service';

@Component({
	selector: 'app-nav-top',
	standalone: true,
	imports: [FontAwesomeModule, RouterLink, KdsCircularProgressComponent, AsyncPipe, CommonModule, ViewportMatchDirective],
	templateUrl: './nav-top.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTopComponent implements OnInit, OnDestroy {
	/**
	 * SERVICES
	 */
	protected readonly tokenManagerService = inject(TokenManagerService);
	protected readonly navModulesService = inject(NavModulesService);
	private readonly router = inject(Router);

	/**
	 * SIGNALS AND OBSERVABLES
	 */
	protected icons = signal({
		faBarsStaggered: faBarsStaggered,
	});
	protected tokenExpLeftPercentage$ = this.tokenManagerService.tokenExpLeft$.pipe(map((value: number) => (value / environment.token.lifespan) * 100));
	private routerEventSubscription: Subscription | undefined;
	protected breadcrumbs = signal<string[]>(this.urlToBreadcrumbs(this.router.url));

	ngOnInit(): void {
		this.routerEventSubscription = this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((navigation) => {
			if (navigation instanceof NavigationEnd) {
				let segments = this.urlToBreadcrumbs(navigation.urlAfterRedirects);
				this.breadcrumbs.set(segments.length > 2 ? [segments.at(0) ?? '??', '..', segments.at(-1) ?? '??'] : segments);
			}
		});
	}

	ngOnDestroy(): void {
		this.routerEventSubscription?.unsubscribe();
	}

	/**
	 * FUNCTIONS
	 */
	private urlToBreadcrumbs(url: string): string[] {
		return url
			.split('/')
			.splice(2)
			.filter((v) => v !== 'home');
	}
}
