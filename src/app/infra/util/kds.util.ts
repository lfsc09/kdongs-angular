export class KDS {
    /**
     * Returns today date in `yyyy-mm-dd` format, considering client's timezone.
     */
    static todayLocalTZ(): string {
        const today = new Date();
        return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds())).toISOString().split('T')[0];
    }

    /**
     * Return the client's timezone in `-00:00` format.
     */
    static localTimezone(): string {
        let userTimezoneN = -(new Date().getTimezoneOffset() / 60);
        return `${userTimezoneN < 0 ? '-' : '+'}${Math.abs(userTimezoneN).toString().padStart(2, '0')}:00`;
    }
}