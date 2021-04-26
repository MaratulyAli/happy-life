import firebase from 'firebase';

export interface ICirculation {
    id: string;
    nextDeadlineAt: firebase.firestore.FieldValue;
    nextId: string;
    periodicalId: string;
    filePath: string;
    queue: string[];
}
