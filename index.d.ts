import { IronSession } from 'iron-session'

declare type IronSession = IronSession & {
    verifyCode: string
}