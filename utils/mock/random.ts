import { Random } from 'mockjs'

export function getArrayRandom(random: string, count: number, ...args: any) {
    const out = []
    for (let i = 0; i < count; i++) {
        out.push(Random[random](...args))
    }
    return out
}