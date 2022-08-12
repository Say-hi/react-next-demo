import { getDB } from "db"
import { User } from "db/entity"
import { responseJson } from "help/response-json"
import { NextApiHandler } from "next"

const userUpdate: NextApiHandler = async (req, res) => {
    const {nickname, job, introduce} = (req.body as User)
    if (!nickname?.length) {
        return responseJson(res, false, '请填写用户名')
    }
    const id = Number(req.cookies.userId || 0)
    if (!id) {
        return responseJson(res, false, '用户不存在')
    }
    const db = await getDB()
    const userRep = db.getRepository(User)
    const user = await userRep.findOne({
        where: {
            id: id
        }
    })
    if (!user) {
        return responseJson(res, false, '用户不存在')
    }
    user.nickname = nickname
    user.job = job
    user.introduce = introduce
    const updateRes = await userRep.save(user)
    if (!updateRes) {
        responseJson(res, false, '更新失败')
    } else {
        responseJson(res, updateRes)
    }

}

export default userUpdate