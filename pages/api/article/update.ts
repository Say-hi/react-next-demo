import { ironOptions } from "config";
import { getDB } from "db";
import { Article } from "db/entity";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

const update: NextApiHandler = async (req, res) => {
    // const session = req.session
    const { title = '', content = '', articleId = 0} = req.body
    const { userId } = req.cookies
    if (!title.length || !content.length || !articleId) {
        res.status(200).send({
            code: -1,
            data: null,
            msg: '更新文章失败，请检查标题，内容是否填写'
        })
        return 
    }

    const db = await getDB()
    const articleRep = db.getRepository(Article)
    const articleInfo = await articleRep.findOne({
        where: {
            id: Number(articleId)
        },
        relations: ['user']
    })
    if (articleInfo?.user.id != userId) {
        res.status(200).send({
            code: -1,
            data: null,
            msg: '更新文章失败,这不是您的文章哦'
        })
        return 
    }
    if (articleInfo) {
        articleInfo.title = title
        articleInfo.content = content
        articleInfo.update_time = new Date()
        console.log(articleInfo, 'articleInfo ssr')
        let msg
        const articleAdd = await articleRep.save(articleInfo).catch(e => msg = e)

        res.status(200).send({
            code: articleAdd ? 0 : -1,
            data: articleAdd ? '更新文章成功' : '更新文章失败',
            msg
        })
    } else {
        res.status(200).send({
            code: -1,
            msg: '没有对应文章记录'
        })
    }



}

export default withIronSessionApiRoute(update, ironOptions)