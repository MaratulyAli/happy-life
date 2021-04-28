import firebase from 'firebase';

export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    location: IGeoPoint;
    role: 'employee' | 'librarian';
    subscriptions: firebase.firestore.FieldValue;
    circulations: firebase.firestore.FieldValue;
}

export interface IGeoPoint {
    latitude: string;
    longitude: string;
}
