import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleHalfStroke, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { map, tap } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { ThemeManagerService } from '../../../../../infra/services/theme/theme-manager.service';
import { TokenManagerService } from '../../../../../infra/services/token/token-manager.service';
import { KdsCircularProgressComponent } from '../../../kds/kds-circular-progress/kds-circular-progress/kds-circular-progress.component';

@Component({
	selector: 'app-nav-top',
	standalone: true,
	imports: [FontAwesomeModule, KdsCircularProgressComponent, AsyncPipe, CommonModule],
	templateUrl: './nav-top.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTopComponent {
	/**
	 * SERVICES
	 */
	readonly themeManagerService = inject(ThemeManagerService);
	readonly tokenManagerService = inject(TokenManagerService);

	/**
	 * SIGNALS AND OBSERVABLES
	 */
	protected icons = signal({
		faPowerOff: faPowerOff,
		faCircleHalfStroke: faCircleHalfStroke,
	});
	protected useDarkTheme = this.themeManagerService.darkTheme;
	protected tokenExpLeftPercentage$ = this.tokenManagerService.tokenExpLeft$.pipe(
		map((value: number) => (value / environment.token.lifespan) * 100),
		tap((value) => console.log(value)),
	);
	protected userMenuShow = signal(false);

	/**
	 * USER MENU
	 */
	handleOpen() {
		this.userMenuShow.update((previous) => !previous);
	}

	handleLogout() {
		this.tokenManagerService.clear();
	}
}
