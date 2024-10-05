import { delay, Observable, of, throwError } from 'rxjs';
import { GetInvestmentsPerformanceResponse } from '../app/infra/gateways/investments/investments-gateway.model';
import { InvestmentsFakerData } from './investments-faker.data';

export class InvestmentsFaker {
	private static readonly defaultRequestTime: [number, number] = [500, 2500];
	private static readonly requestFailProbability: number = 0.05;

	private static randomVariables(): { failRequest: boolean; requestTime: number } {
		return {
			failRequest: Math.trunc(Math.random() * 100) <= this.requestFailProbability * 100,
			requestTime: Math.floor(Math.random() * (this.defaultRequestTime[1] - this.defaultRequestTime[0] + 1)) + this.defaultRequestTime[0],
		};
	}

	static getInvestmentsPerformance_Query1(failRequest?: boolean): Observable<GetInvestmentsPerformanceResponse> {
		const generateRandomness = this.randomVariables();
		// Fail the Request
		if ((failRequest !== undefined && failRequest) || generateRandomness.failRequest) {
			return throwError(() => new Error('Request Failed')).pipe(delay(generateRandomness.requestTime));
		}
		return of(InvestmentsFakerData.performanceDataQuery1).pipe(delay(generateRandomness.requestTime));
	}

	static getInvestmentsPerformance_Query2(failRequest?: boolean): Observable<GetInvestmentsPerformanceResponse> {
		const generateRandomness = this.randomVariables();
		// Fail the Request
		if ((failRequest !== undefined && failRequest) || generateRandomness.failRequest) {
			return throwError(() => new Error('Request Failed')).pipe(delay(generateRandomness.requestTime));
		}
		return of(InvestmentsFakerData.performanceDataQuery2).pipe(delay(generateRandomness.requestTime));
	}
}
