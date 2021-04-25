export interface IUser {
    authId: string;
    firstName: string;
    lastName: string;
    location: IGeoPoint;
    role: 'employee' | 'librarian';
}

export interface IGeoPoint {
    latitude: string;
    longitude: string;
}
