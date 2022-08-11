import { ironOptions } from "config";
import { getDB } from "db";
import { Article, User } from "db/entity";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

const publish: NextApiHandler = async (req, res) => {
    const session = req.session
    const { title, content } = req.body
    const db = await getDB()
    const userRep = db.getRepository(User)
    const publishUser = await userRep.findOne({
        where: {
            id: session.userId
        }
    })

    console.log(publishUser, 'publishUser')

    if (publishUser) {
        const ArticleRep = db.getRepository(Article)

        const newArticle = new Article()
        newArticle.title = title
        newArticle.content = content
        newArticle.create_time = new Date()
        newArticle.update_time = new Date()
        newArticle.is_delete = 0
        newArticle.views = 0
        newArticle.user = publishUser
        let msg
        const articleAdd = await ArticleRep.save(newArticle).catch(e => msg = e)

        res.status(200).send({
            code: articleAdd ? 0 : -1,
            data: articleAdd ? '发布文章成功' : '发布文章失败',
            msg
        })
    } else {
        res.status(200).send({
            code: -1,
            msg: '用户未注册'
        })
    }



}

export default withIronSessionApiRoute(publish, ironOptions)