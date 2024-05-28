export type PackingItem = {
    name: string;
    dayMultiplier?: number;
    dayThreshold?: number;
    relevantForWeather?: string[];
    onlyIfWeekday?: boolean;
    onlyIfAbroad?: boolean;
    // positive / negative number of days relative to trip begin date
    dueShift?: number;
    afterReturn?: boolean;
    additionalLabels?: string[];
    addTripNameToTask?: boolean;
}