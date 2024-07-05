import { Component, ElementRef, NgZone, OnInit, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faAnglesRight, faEye, faEyeSlash, faGamepad, faLightbulb, faMoon, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { NgParticlesService, NgxParticlesModule } from '@tsparticles/angular';
import { Engine, MoveDirection, OutMode } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { KdsLoadingSpinnerComponent } from '../../../../components/shared/kds/kds-loading-spinner/kds-loading-spinner.component';
import { AuthenticationFakerService } from '../../../../infra/fakers/authentication/authentication-faker.service';
import { ThemeManagerService } from '../../../../infra/services/theme/theme-manager.service';
import { TokenManagerService } from '../../../../infra/services/token/token-manager.service';
import { ViewportMatchDirective } from '../../../../infra/services/viewport/viewport-match.directive';
import { ViewportSizes } from '../../../../infra/services/viewport/viewport.model';
import { RandomParticlesProps } from './landing-page.model';

@Component({
	selector: 'app-landing-page',
	standalone: true,
	imports: [ViewportMatchDirective, FontAwesomeModule, NgxParticlesModule, ReactiveFormsModule, KdsLoadingSpinnerComponent],
	providers: [AuthenticationFakerService],
	templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit {
	/**
	 * SERVICES
	 */
	readonly ngParticlesService = inject(NgParticlesService);
	readonly formBuilderService = inject(FormBuilder);
	readonly authenticationService = inject(AuthenticationFakerService);
	readonly tokenManagerService = inject(TokenManagerService);
	readonly themeManagerService = inject(ThemeManagerService);
	readonly zone = inject(NgZone);

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
	protected viewports = signal(ViewportSizes);
	protected useDarkTheme = this.themeManagerService.darkTheme;
	private inputLoginUsername = viewChild<ElementRef>('inputLoginUsername');

	ngOnInit(): void {
		this.zone.runOutsideAngular(() => {
			this.ngParticlesService.init(async (engine: Engine) => {
				await loadSlim(engine);
			});
		});
	}

	/**
	 * LOGIN FORM
	 */

	/**
	 * Show/Hide Password
	 */
	showPassword = signal(false);
	protected handlePasswordShow() {
		this.showPassword.update((value) => !value);
	}

	protected loadingLoginForm = signal(false);
	protected loginForm = this.formBuilderService.group({
		username: ['', Validators.required],
		password: ['', Validators.required],
	});
	protected async handleLoginFormSubmit(submittedForm: any) {
		if (this.loginForm.valid) {
			this.loadingLoginForm.set(true);
			try {
				const userToken = await this.authenticationService.findUserByEmailAndPassword(this.loginForm.value.username, this.loginForm.value.password);
				if (userToken) {
					if (this.tokenManagerService.processToken(userToken)) console.warn('GO');
					else console.warn('showLogError');
				} else {
					this.loginForm.reset();
                    submittedForm.resetForm();
					this.inputLoginUsername()?.nativeElement.focus();
					console.warn('showLogError');
				}
			} catch (err: any) {
				// TODO: Make service for LogManagement
				console.error(err.message);
			}
			this.loadingLoginForm.set(false);
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
