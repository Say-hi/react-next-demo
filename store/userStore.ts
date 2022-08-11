import { User } from "db/entity";

export interface IUserStore {
    userInfo: Partial<Omit<User, 'id'>> & {
        userId?: number
    },
    setUserInfo: (value: IUserStore['userInfo']) => void
}

const userStore = (): IUserStore => {
    return {
        userInfo: {},
        setUserInfo (value) {
            this.userInfo = value
        }
    }
}

export default userStore