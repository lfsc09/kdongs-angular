import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
	IconDefinition,
	faAngleRight,
	faChartPie,
	faCircleHalfStroke,
	faCreditCard,
	faHouse,
	faMagnifyingGlassChart,
	faPowerOff,
	faUsersGear,
} from '@fortawesome/free-solid-svg-icons';
import { ViewportMatchDirective } from '../../../infra/directives/viewport/viewport-match.directive';
import { ThemeManagerService } from '../../../infra/services/theme/theme-manager.service';
import { TokenManagerService } from '../../../infra/services/token/token-manager.service';
import { NavModulesService } from './nav-modules.service';

@Component({
	selector: 'app-nav-modules',
	standalone: true,
	imports: [RouterLink, RouterLinkActive, ViewportMatchDirective, FontAwesomeModule, ReactiveFormsModule],
	host: {
		'(document:keyup.Escape)': 'navModulesService.handleClose()',
		'(document:keyup.Control.;)': 'handleInputFocus()',
	},
	templateUrl: './nav-modules.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavModulesComponent implements AfterViewInit {
	/**
	 * SERVICES
	 */
	protected readonly tokenManagerService = inject(TokenManagerService);
	protected readonly themeManagerService = inject(ThemeManagerService);
	protected readonly navModulesService = inject(NavModulesService);
	private readonly router = inject(Router);

	/**
	 * SIGNALS AND OBSERVABLES
	 */
	protected icons = signal<{ [key: string]: IconDefinition }>({
		faPowerOff: faPowerOff,
		faCircleHalfStroke: faCircleHalfStroke,
		faAngleRight: faAngleRight,
		faHouse: faHouse,
		faUsersGear: faUsersGear,
		faChartPie: faChartPie,
		faCreditCard: faCreditCard,
		faMagnifyingGlassChart: faMagnifyingGlassChart,
	});
	protected useDarkTheme = this.themeManagerService.darkTheme;
	protected runInput = new FormControl('');
	protected runInputRef = viewChild<ElementRef<HTMLInputElement>>('runInputRef');
	protected runError = signal<string>('');

	ngAfterViewInit(): void {
		this.runInputRef()?.nativeElement.focus();
	}

	/**
	 * FUNCTIONS
	 */
	handleInputFocus() {
		this.runInputRef()?.nativeElement.focus();
	}

	handleEnter() {
		if (!this.runInput.value) return;

		const segments = (this.runInput.value ?? '')
			.trim()
			.split(' ')
			.filter((v) => !!v);
		if (segments.length === 1 && segments[0] === 'logout') {
			this.tokenManagerService.clear();
			return;
		} else if (segments.length === 1 && segments[0] === 'light') {
			this.themeManagerService.goLight();
			this.runInput.reset('');
			this.runError.set('');
		} else if (segments.length === 1 && segments[0] === 'dark') {
			this.themeManagerService.goDark();
			this.runInput.reset('');
			this.runError.set('');
		} else {
			const execRoute = ['/r!', ...segments];
			if (this.navModulesService.isExecutableRoute(this.router.createUrlTree(execRoute).toString())) {
				this.router.navigate(execRoute);
				this.navModulesService.handleClose();
			} else this.runError.set('Invalid Command!');
		}
	}
}
