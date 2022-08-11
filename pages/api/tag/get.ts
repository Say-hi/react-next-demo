import { ironOptions } from "config"
import { getDB } from "db"
import { Tag } from "db/entity"
import { responseJson } from "help/response-json"
import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiHandler } from "next"

const tagGet: NextApiHandler = async (req, res) => {
    const db = await getDB()
    const {userId = 0} = req.cookies
    const tagRep = db.getRepository(Tag)
    const followTags = await tagRep.find({
        relations: ['users'],
        where: {
            users: {
                id: Number(userId)
            }
        }
    })
    console.log(followTags, 'followTags')

    const allTags = await tagRep.find({
        relations: ['users']
    })

    responseJson(res, {followTags, allTags})
}

export default withIronSessionApiRoute(tagGet, ironOptions)