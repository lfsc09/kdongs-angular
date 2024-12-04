import { Injectable, signal, Signal } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { InvestmentsFaker } from '../../../../fakers/investments-faker';
import {
	GetInvestmentsBalanceHistoryRequest,
	GetInvestmentsBalanceHistoryResponse,
	GetInvestmentsPerformanceRequest,
	GetInvestmentsPerformanceResponse,
	IInvestmentsGatewayService,
} from './investments-gateway.model';

@Injectable()
export class InvestmentsGatewayFakeService implements IInvestmentsGatewayService {
	private _loading = signal<boolean>(false);
	loading: Signal<boolean> = this._loading.asReadonly();

	getInvestmentsPerformance(request: GetInvestmentsPerformanceRequest): Observable<GetInvestmentsPerformanceResponse> {
		console.log('Faker Request: getInvestmentsPerformance() with: ', request);
		this._loading.set(true);
		if (request?.wallets_info) {
			return InvestmentsFaker.getInvestmentsPerformance_Query1().pipe(
				tap(() => this._loading.set(false)),
				catchError((error) => {
					this._loading.set(false);
					throw error;
				}),
			);
		} else {
			return InvestmentsFaker.getInvestmentsPerformance_Query2().pipe(
				tap(() => this._loading.set(false)),
				catchError((error) => {
					this._loading.set(false);
					throw error;
				}),
			);
		}
	}

	getInvestmentsBalanceHistory(request: GetInvestmentsBalanceHistoryRequest): Observable<GetInvestmentsBalanceHistoryResponse> {
		console.log('Faker Request: getInvestmentsBalanceHistory() with: ', request);
		this._loading.set(true);
		if (request?.wallets_info) {
			return InvestmentsFaker.getInvesmentsBalanceHistory_Query1().pipe(
				tap(() => this._loading.set(false)),
				catchError((error) => {
					this._loading.set(false);
					throw error;
				}),
			);
		} else {
			return InvestmentsFaker.getInvestmentsBalanceHistory_Query2().pipe(
				tap(() => this._loading.set(false)),
				catchError((error) => {
					this._loading.set(false);
					throw error;
				}),
			);
		}
	}
}
