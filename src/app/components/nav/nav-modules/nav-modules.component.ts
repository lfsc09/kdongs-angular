import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
	IconDefinition,
	faChartPie,
	faCircleHalfStroke,
	faCreditCard,
	faHouse,
	faMagnifyingGlass,
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
		faMagnifyingGlass: faMagnifyingGlass,
		faHouse: faHouse,
		faUsersGear: faUsersGear,
		faChartPie: faChartPie,
		faCreditCard: faCreditCard,
		faMagnifyingGlassChart: faMagnifyingGlassChart,
	});
	protected useDarkTheme = this.themeManagerService.darkTheme;
	protected gotoInput = new FormControl('');
	protected gotoInputRef = viewChild<ElementRef<HTMLInputElement>>('gotoInputRef');

	ngAfterViewInit(): void {
		this.gotoInputRef()?.nativeElement.focus();
	}

	/**
	 * FUNCTIONS
	 */
	handleInputFocus() {
		this.gotoInputRef()?.nativeElement.focus();
	}

	handleEnter() {
		if (this.gotoInput.value !== '') {
			const segments = (this.gotoInput.value ?? '')
				.trim()
				.split(' ')
				.filter((v) => !!v);
			this.gotoInput.reset();
			this.router.navigate(['/r!', ...segments]);
		}
	}
}
