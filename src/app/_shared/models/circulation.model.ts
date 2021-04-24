import { ISubscriber } from './periodical.model';

export interface ICirculation {
    id: string;
    nextDeadlineAt: number;
    nextId: string;
    periodicalId: string;
    queue: ISubscriber[];
}
