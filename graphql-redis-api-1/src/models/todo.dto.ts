export interface GetToDoByIdDTO {
    id: string;
}

export interface NewToDoDTO {
    title: string;
}

export interface UpdateToDoDTO {
    id: string;
    title: string;
    done: boolean;
}

export interface DeleteToDoDTO {
    id: string;
}
