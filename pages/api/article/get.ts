import { getDB } from "db"
import { Article } from "db/entity"
import { responseJson } from "help/response-json"
import { NextApiHandler } from "next"

const artilceGet: NextApiHandler = async (req, res) => {
    const tagId = Number(req.body?.tagId || 0)
    if (!tagId) {
        return responseJson(res, false, '请选择标签筛选文章')
    }
    const db = await getDB()
    const articleRep = db.getRepository(Article)
    const artilces = await articleRep.find({
        relations: ['user', 'tags'],
        where: {
            tags: {
                id: tagId
            }
        }
    }) || []
    responseJson(res, artilces)
}

export default artilceGet