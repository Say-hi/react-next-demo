// import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
// import { User } from './user'

// @Entity({
//     name: 'user_auths'
// })
// export class UserAuth extends BaseEntity {
//     @PrimaryGeneratedColumn()
//     readonly id!: number

//     @ManyToOne(() => User, {
//         cascade: true
//     })
//     @JoinColumn({
//         name: 'user_id '
//     })
//     user!: User


//     @Column()
//     identity_type!: string

//     @Column()
//     identifier!: string

//     @Column()
//     credential!: string

// }


import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Users } from './users'

@Entity()
export class UserAuths {
    @PrimaryGeneratedColumn()
    readonly id!: number

    @ManyToOne(() => Users, {
        cascade: true
    })
    @JoinColumn({
        name: 'user_id '
    })
    user!: Users


    @Column()
    identity_type!: string

    @Column()
    identifier!: string

    @Column()
    credential!: string

}