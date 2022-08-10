import { User } from "db/entity"
import { Cookie } from "next-cookie"

export const setCookie = (cookies: Cookie, {
    id: userId,
    nickname,
    avatar
}: Partial<User>) => {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const path = '/'
    cookies.set('userId', userId, {
        path,
        expires
    })
    cookies.set('nickname', nickname, {
        path,
        expires
    })
    cookies.set('avatar', avatar, {
        path,
        expires
    })
}

export const clearCookie = (cookies: Cookie, target: string[] = ['avatar', 'nickname', 'userId']) => {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const path = '/'
    for (let key of target) {
        cookies.set(key, '', {
            expires,
            path
        })
    }
}