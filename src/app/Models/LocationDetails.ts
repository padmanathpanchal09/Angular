export interface LocationDetails {
    location: Location;
}

export interface Location {
    address:              string[];
    adminDistrict:        string[];
    adminDistrictCode:    null[];
    city:                 Array<null | string>;
    country:              string[];
    countryCode:          string[];
    displayName:          string[];
    displayContext:       string[];
    ianaTimeZone:         string[];
    latitude:             number[];
    locale:               Locale[];
    longitude:            number[];
    neighborhood:         null[];
    placeId:              string[];
    postalCode:           Array<null | string>;
    postalKey:            Array<null | string>;
    disputedArea:         boolean[];
    disputedCountries:    null[];
    disputedCountryCodes: null[];
    disputedCustomers:    null[];
    disputedShowCountry:  Array<boolean[]>;
    iataCode:             Array<null | string>;
    icaoCode:             string[];
    locId:                string[];
    locationCategory:     null[];
    pwsId:                Array<null | string>;
    type:                 Type[];
}

export interface Locale {
    locale1: null | string;
    locale2: null | string;
    locale3: null | string;
    locale4: null;
}

export enum Type {
    City = "city",
    Locality = "locality",
}
