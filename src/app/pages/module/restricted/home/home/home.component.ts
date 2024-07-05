import { Component } from '@angular/core';
import { NavTopComponent } from '../../../../../components/shared/nav/nav-top/nav-top/nav-top.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [NavTopComponent],
	templateUrl: './home.component.html',
})
export class HomeComponent {}
