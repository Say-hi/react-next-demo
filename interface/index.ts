import { Article } from "db/entity";

export enum IDENTITY_TYPE {
    'phone',
    'github'
}

export interface ArtilceType extends Omit<Article, 'update_time'> {
    update_time: string
}
