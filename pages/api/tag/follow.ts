import { ironOptions } from "config"
import { getDB } from "db"
import { Tag, User } from "db/entity"
import { responseJson } from "help/response-json"
import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiHandler } from "next"

const follow: NextApiHandler = async (req, res) => {
    const db = await getDB()
    const userId = Number(req.cookies?.userId || 0)
    const type = req.body.type
    const tagId = Number(req.body.tagId || 0)
    if (!tagId) {
        return responseJson(res, false, '选择要关注的标签')
    }
    if (!userId) {
        return responseJson(res, false, '请登录后操作')
    }
    const userRep = db.getRepository(User)
    const user = await userRep.findOne({
        where: {
            id: userId
        }
    })
    if (!user) {
        return responseJson(res, false, '用户不存在')
    }
    const tagRep = db.getRepository(Tag)
    const followTags = await tagRep.findOne({
        relations: ['users'],
        where: {
            id: tagId
        }
    }) as any

    if (!followTags) {
        return responseJson(res, false, '标签不存在')
    }

    const tagHasUser = followTags?.users?.find((i: any) => i.id === userId)

    if (tagHasUser && type === 'follow') {
        return responseJson(res, false, '已关注标签，请勿重复关注')
    }
    if (!tagHasUser && type === 'unFollow') {
        return responseJson(res, false, '尚未关注标签，无法取关')
    }

    if (type === 'follow') {
        followTags.users = (followTags.users || []).concat([user])
        followTags.follow_count++
    } else {
        followTags.users = followTags.users.filter((i: any) => i.id !== userId)
        followTags.follow_count = Math.max(0, followTags.follow_count - 1)
    }
    let msg
    const temp = await tagRep.save(followTags).catch(e => (msg = e))
    if (temp) {
        responseJson(res, temp)
    } else {
        responseJson(res, false, msg)
    }
}

export default withIronSessionApiRoute(follow, ironOptions)