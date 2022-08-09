// import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

// @Entity({
//     name: 'users'
// })
// export class User extends BaseEntity {
//     @PrimaryGeneratedColumn()
//     readonly id!: number 

//     @Column()
//     nickname!: string
    
//     @Column()
//     avatar!: string

//     @Column()
//     job!: string

//     @Column()
//     introduce!: string

// }


import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    readonly id!: number 

    @Column()
    nickname!: string
    
    @Column()
    avatar!: string

    @Column()
    job!: string

    @Column()
    introduce!: string

}

