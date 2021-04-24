export interface IUser {
    id: number;
    auth_id: string;
    first_name: string;
    last_name: string;
    location: IGeoPoint;
}

export interface IGeoPoint {
    lat: string;
    lon: string;
}
