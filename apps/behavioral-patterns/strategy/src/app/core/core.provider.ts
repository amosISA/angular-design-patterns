import { EnvironmentProviders, InjectionToken, Provider } from "@angular/core";

export const API_URL = new InjectionToken<string>('API_URL');

export const provideCore = (): (Provider[] | EnvironmentProviders[]) => {
    return [
        { provide: API_URL, useValue: 'https://picsum.photos/200/300' }
    ]
}