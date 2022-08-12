import 'reflect-metadata'

import { DataSource, DataSourceOptions } from 'typeorm'
import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { Article, User, UserAuth, Comment, Tag } from './entity'


const conncetionConfig: DataSourceOptions = {
    entities: [User, UserAuth, Comment, Article, Tag ],
    synchronize: false,
    logging: true,
    type: process.env.DATABASE_TYPE as MysqlConnectionOptions['type'],
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
}

// export const prepareConnection = () => {
//     if (!connectionReadyPromise) {
//         connectionReadyPromise = (async () => {
//             try {
//                 const staleConnection = getConnection()
//                 await staleConnection.close()
//             } catch (e) {
//                 console.log(e)
//             }
//             const connection = await createConnection(conncetionConfig)
//             return connection
//         })()
//     }
//     return connectionReadyPromise
// }

export const AppDataSource = new DataSource(conncetionConfig)

let app: DataSource

export const getDB: () => Promise<DataSource> = async () => {
    if (!app) {
        app = (await AppDataSource.initialize().catch(console.log)) as DataSource
    }
    return Promise.resolve(app)
}
