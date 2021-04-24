export interface IPeriodical {
    id: string;
    title: string;
    description: string;
    photoUrl: string;
    subscribers: ISubscriber[];
}

export interface ISubscriber {
    userId: string;
    subscribedAt: number;
}
