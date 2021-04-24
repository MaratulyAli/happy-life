export interface ICirculation {
    id: number;
    startsAt: Date;
    periodical_id: number;
    items: ICirculationItem[];
}

export interface ICirculationItem {
    id: number;
    user_id: number;
    deadline: Date;
}
