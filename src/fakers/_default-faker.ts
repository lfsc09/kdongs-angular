export abstract class Faker {
    protected static readonly defaultRequestTime: [number, number] = [500, 2500];
	protected static readonly requestFailProbability: number = 0.05;

    protected static randomVariables(): { failRequest: boolean; requestTime: number } {
		return {
			failRequest: Math.trunc(Math.random() * 100) <= this.requestFailProbability * 100,
			requestTime: Math.floor(Math.random() * (this.defaultRequestTime[1] - this.defaultRequestTime[0] + 1)) + this.defaultRequestTime[0],
		};
	}
}