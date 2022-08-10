import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity({
    name: 'articles'
})
export class Artilce {
    @PrimaryGeneratedColumn()
    readonly id!: number

    @Column()
    title!: string

    @Column({
        type: 'text'
    })
    content!: string

    @Column()
    views!:number

    @Column()
    create_time!: Date

    @Column()
    update_time!: Date

    @Column()
    is_delete!: number

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'user_id'
    })
    user!: User
}