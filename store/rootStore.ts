import userStore, { IUserStore } from "./userStore."

export interface IInitiavlVal {
    user?: IUserStore
}

export default function createStore (initiavlVal: IInitiavlVal): () => IInitiavlVal {
    return () => {
        return {
            user: {...userStore(), ...initiavlVal?.user}
        }
    }
}