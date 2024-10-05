import { delay, Observable, of, throwError } from 'rxjs';
import { GetInvestmentsPerformanceResponse } from '../app/infra/gateways/investments/investments-gateway.model';
import { InvestmentsFakerData } from './investments-faker.data';
import { Faker } from './_default-faker';

export class InvestmentsFaker extends Faker {
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
