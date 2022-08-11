import userStore, { IUserStore } from "./userStore"

export interface IInitivalVal {
    user?: IUserStore
}

export default function createStore (initiavlVal: IInitivalVal): () => IInitivalVal {
    return () => {
        return {
            user: {...userStore(), ...initiavlVal?.user}
        }
    }
}