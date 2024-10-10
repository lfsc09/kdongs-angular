import { AfterViewInit, Component, ElementRef, InjectionToken, NgZone, OnDestroy, OnInit, Signal, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faAnglesRight, faEye, faEyeSlash, faGamepad, faLightbulb, faMoon, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { NgParticlesService, NgxParticlesModule } from '@tsparticles/angular';
import { Engine, MoveDirection, OutMode } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { KdsLoadingSpinnerComponent } from '../../../components/shared/kds/kds-loading-spinner/kds-loading-spinner.component';
import { ViewportMatchDirective } from '../../../infra/directives/viewport/viewport-match.directive';
import { IAuthenticationGatewayService } from '../../../infra/gateways/authentication/authentication-gateway.model';
import { ThemeManagerService } from '../../../infra/services/theme/theme-manager.service';
import { RandomParticlesProps } from './landing-page.model';

const tokenIAuthenticationGatewayService = new InjectionToken<IAuthenticationGatewayService>('IAuthenticationGatewayService');

@Component({
	selector: 'app-landing-page',
	standalone: true,
	imports: [ViewportMatchDirective, FontAwesomeModule, NgxParticlesModule, ReactiveFormsModule, KdsLoadingSpinnerComponent],
	providers: [
		{
			provide: tokenIAuthenticationGatewayService,
			useClass: environment.authenticationGatewayService,
		},
	],
	templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
	/**
	 * SERVICES
	 */
	private readonly routerService = inject(Router);
	private readonly formBuilderService = inject(FormBuilder);
	private readonly zone = inject(NgZone);
	private readonly ngParticlesService = inject(NgParticlesService);
	protected readonly themeManagerService = inject(ThemeManagerService);
	private readonly authenticationService = inject(tokenIAuthenticationGatewayService);

	/**
	 * SIGNALS
	 */
	protected year = signal(new Date().getFullYear());
	protected icons = signal({
		faRightToBracket: faRightToBracket,
		faAnglesRight: faAnglesRight,
		faLinkedin: faLinkedin,
		faGithub: faGithub,
		faEye: faEye,
		faEyeSlash: faEyeSlash,
		faLightbulb: faLightbulb,
		faMoon: faMoon,
		faGamepad: faGamepad,
	});
	protected useDarkTheme = this.themeManagerService.darkTheme;
	protected emailInputRef = viewChild<ElementRef<HTMLInputElement>>('emailInputRef');
	protected showPassword = signal(false);
	protected gatewayLoading: Signal<boolean> = this.authenticationService.loading;
	private authenticationSubscription: Subscription | undefined;

	/**
	 * FORM VARS
	 */
	protected loginForm = this.formBuilderService.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', Validators.required],
	});

	ngOnInit(): void {
		this.zone.runOutsideAngular(() => {
			this.ngParticlesService.init(async (engine: Engine) => {
				await loadSlim(engine);
			});
		});
	}

	ngAfterViewInit(): void {
		this.emailInputRef()?.nativeElement.focus();
	}

	ngOnDestroy(): void {
		this.authenticationSubscription?.unsubscribe;
	}

	/**
	 * LOGIN FORM
	 */
	protected handlePasswordShow() {
		this.showPassword.update((value) => !value);
	}

	protected handleLoginFormSubmit(submittedForm: any) {
		if (this.loginForm.valid) {
			let userTimezoneN = -(new Date().getTimezoneOffset() / 60);
			let userTimezone = `${userTimezoneN < 0 ? '-' : '+'}${Math.abs(userTimezoneN).toString().padStart(2, '0')}:00`;
			this.authenticationSubscription = this.authenticationService
				.loginUser({ email: this.loginForm.value.email, password: this.loginForm.value.password, timezone: userTimezone })
				.subscribe({
					next: (response) => {
						switch (response) {
							case 'accept':
								this.routerService.navigate(['/r!/home'], { replaceUrl: true });
								break;
							case 'deny':
								this.loginForm.reset();
								submittedForm.resetForm();
								this.emailInputRef()?.nativeElement.focus();
								break;
						}
					},
					error: (error: Error) => {
						console.error(error.message);
					},
				});
		} else this.loginForm.markAllAsTouched();
	}

	/**
	 * TSPARTICLES
	 */
	private randomizeParticles(): RandomParticlesProps {
		let windyChance = Math.trunc(Math.random() * 10);
		if (windyChance > 5) {
			let newDirection = Math.trunc(Math.random() * 10);
			return {
				speedMin: 3.5,
				speedMax: 5,
				direction: newDirection >= 5 ? MoveDirection.bottomRight : MoveDirection.bottomLeft,
			};
		} else {
			return {
				speedMin: 1.5,
				speedMax: 2,
				direction: MoveDirection.bottom,
			};
		}
	}

	private randomParticleProps: RandomParticlesProps = this.randomizeParticles();
	particlesOptions = {
		fpsLimit: 120,
		particles: {
			number: {
				value: 80,
				density: {
					enable: true,
					value_area: 631.3280775270874,
				},
			},
			color: {
				value: '#999',
			},
			shape: {
				type: 'circle',
			},
			opacity: {
				value: { min: 0.1, max: 0.5 },
			},
			size: {
				value: { min: 2, max: 4 },
			},
			move: {
				enable: true,
				speed: { min: this.randomParticleProps.speedMin, max: this.randomParticleProps.speedMax },
				direction: this.randomParticleProps.direction,
				straight: false,
				outModes: {
					default: OutMode.out,
				},
				bounce: false,
			},
		},
		detectRetina: true,
	};
}
