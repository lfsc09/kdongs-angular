import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faCircleHalfStroke, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ViewportMatchDirective } from '../../../../infra/directives/viewport/viewport-match.directive';
import { ThemeManagerService } from '../../../../infra/services/theme/theme-manager.service';
import { TokenManagerService } from '../../../../infra/services/token/token-manager.service';
import { KdsCircularProgressComponent } from '../../kds/kds-circular-progress/kds-circular-progress.component';
import { NavLeftService } from '../nav-left/nav-left.service';

@Component({
	selector: 'app-nav-top',
	standalone: true,
	imports: [ViewportMatchDirective, FontAwesomeModule, KdsCircularProgressComponent, AsyncPipe, CommonModule],
	templateUrl: './nav-top.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTopComponent {
	/**
	 * SERVICES
	 */
	protected readonly themeManagerService = inject(ThemeManagerService);
	protected readonly tokenManagerService = inject(TokenManagerService);
	private readonly navLeftService = inject(NavLeftService);

	/**
	 * SIGNALS AND OBSERVABLES
	 */
	protected icons = signal({
		faBars: faBars,
		faPowerOff: faPowerOff,
		faCircleHalfStroke: faCircleHalfStroke,
	});
	protected useDarkTheme = this.themeManagerService.darkTheme;
	protected tokenExpLeftPercentage$ = this.tokenManagerService.tokenExpLeft$.pipe(map((value: number) => (value / environment.token.lifespan) * 100));
	protected userMenuShow = signal(false);

	/**
	 * USER MENU
	 */
	handleUserMenuOpen() {
		this.userMenuShow.update((previous) => !previous);
	}

	handleLogout() {
		this.tokenManagerService.clear();
	}

	/**
	 * NAV LEFT
	 */
	handleNavLeftOpen() {
		this.navLeftService.handleOpened();
	}
}
