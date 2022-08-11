import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article";
import { User } from "./user";

@Entity({
    name: 'comments'
})
export class Comment {
    @PrimaryGeneratedColumn()
    readonly id!: number

    @Column({
        type: 'text'
    })
    content!: string

    @Column()
    create_time!: Date

    @Column()
    update_time!: Date

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'user_id'
    })
    user!: User

    @ManyToOne(() => Article)
    @JoinColumn({
        name: 'article_id'
    })
    article!: Article
}