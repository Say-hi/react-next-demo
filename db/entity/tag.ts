import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article";
import { User } from "./user";
@Entity({
    name: 'tags'
})
export class Tag {
    @PrimaryGeneratedColumn()
    readonly id!: number

    @Column()
    title!: string

    @Column()
    icon!: string

    @ManyToMany(() => User, {
        cascade: true
    })
    @JoinTable({
        name: 'tags_users_rel',
        joinColumn: {
            name: 'tag_id'
        },
        inverseJoinColumn: {
            name: 'user_id'
        }
    })
    users!: User

    @ManyToMany(() => Article, {
        cascade: true
    })
    @JoinTable({
        name: 'tags_articles_rel',
        joinColumn: {
            name: 'tag_id'
        },
        inverseJoinColumn: {
            name: 'article_id'
        }
    })
    articles!: Article

    @Column()
    follow_count!: number

    @Column()
    article_count!: number
}