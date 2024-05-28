export type PackingItem = {
    name: string;
    dayMultiplier?: number;
    dayThreshold?: number;
    relevantForWeather?: string[];
    onlyIfWeekday?: boolean;
    // positive / negative number of days relative to trip begin date
    dueShift?: number;
    additionalLabels?: string[];
    addTripNameToTask?: boolean;
}