import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faAnglesRight, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { NgParticlesService, NgxParticlesModule } from '@tsparticles/angular';
import { Engine, MoveDirection, OutMode } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { interval } from 'rxjs';
import { ViewportMatchDirective } from '../../../../infra/observables/viewport/viewport-match.directive';
import { ViewportSizes } from '../../../../infra/observables/viewport/viewport.model';

@Component({
	selector: 'app-landing-page',
	standalone: true,
	imports: [ViewportMatchDirective, FontAwesomeModule, NgxParticlesModule],
	templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit, OnDestroy {
	constructor(readonly ngParticlesService: NgParticlesService) {}

	year = signal(new Date().getFullYear());
	icons = signal({
		faRightToBracket: faRightToBracket,
		faAnglesRight: faAnglesRight,
		faLinkedin: faLinkedin,
		faGithub: faGithub,
	});
	viewports = signal(ViewportSizes);

	private randomParticleProps = {
		speedMin: 1.5,
		speedMax: 2,
		direction: MoveDirection.bottom,
	};
	private randomizeParticlesSubscription = interval(5000).subscribe(() => {
		let windyChance = Math.trunc(Math.random() * 10);
		if (windyChance > 5) {
			let newDirection = Math.trunc(Math.random() * 10);
			this.randomParticleProps.speedMin = 3;
			this.randomParticleProps.speedMin = 4.5;
			this.randomParticleProps.direction = newDirection >= 5 ? MoveDirection.bottomRight : MoveDirection.bottomLeft;
		} else {
			this.randomParticleProps.speedMin = 1.5;
			this.randomParticleProps.speedMin = 2;
			this.randomParticleProps.direction = MoveDirection.bottom;
		}
        console.log(this.randomParticleProps);
	});
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

	ngOnInit(): void {
		this.ngParticlesService.init(async (engine: Engine) => {
			await loadSlim(engine);
		});
	}

	ngOnDestroy(): void {
		this.randomizeParticlesSubscription.unsubscribe();
	}
}
