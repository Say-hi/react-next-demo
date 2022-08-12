import { getDB } from "db"
import { User } from "db/entity"
import { responseJson } from "help/response-json"
import { NextApiHandler } from "next"

const userDetail: NextApiHandler = async (req, res) => {
    const userId = Number(req.cookies?.userId || 0)
    if (!userId) {
        return responseJson(res, false, '请先登录')
    }
    const user = await (await getDB()).getRepository(User).findOne({
        where: {
            id: userId
        }
    })
    if (!user) {
        return responseJson(res, false, '当前用户不存在')
    }
    responseJson(res, user)
}

export default userDetail