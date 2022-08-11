import { getDB } from "db"
import { NextApiHandler } from "next"
import { Article, Comment, User } from 'db/entity'
import { responseJson } from "help/response-json"

const publish: NextApiHandler = async (req, res) => {
    const {
        content = '',
        articleId = 0
    } = req.body
    const { userId } = req.cookies
    if (!content.length || !articleId || !userId) {
        return responseJson(res, false, '请输入评论内容')
    }
    const db = await getDB()
    const commentRep = db.getRepository(Comment)
    const articleRep = db.getRepository(Article)
    const userRep = db.getRepository(User)
    const targetArticle = await articleRep.findOne({
        where: {
            id: articleId
        }
    })
    const commentUser = await userRep.findOne({
        where: {
            id: Number(req.cookies.userId)
        }
    })
    if (!targetArticle || !commentUser) {
        responseJson(res, false, '没有查询到相关文章或用户未注册')
        return
    }
    const comment = new Comment()
    comment.content = content
    comment.create_time = new Date()
    comment.update_time = new Date()
    comment.article = targetArticle
    comment.user = commentUser
    let msg
    const saveComment = await commentRep.save(comment).catch(e => (msg = e))
    if (saveComment) {
        delete saveComment.article.is_delete
        responseJson(res, saveComment)
        return
    }
    responseJson(res, false, msg)
}

export default publish