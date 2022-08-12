import { ironOptions } from "config";
import { getDB } from "db";
import { User, UserAuth } from "db/entity";
import { IDENTITY_TYPE } from "interface";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { Cookie } from "next-cookie";
import request from "service/fetch";
import { setCookie } from "utils";

const redirect: NextApiHandler = async (req, res) => {
    const session = req.session
    const { code } = req.query
    console.log(code, 'github_code')
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
    let msg
    const url = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`
    console.log('----------开始请求github authorize')
    const githubAuthorizeData = await request.post(url, {}, {
        headers: {
            accept: 'application/json'
        }
    }).catch(e => (msg = e)) as any
    if (msg) {
        res.writeHead(302, {
            location: `/?msg=${msg}`
        }).end()
    }
    console.log('----------结束请求github authorize')
    const { access_token } = githubAuthorizeData
    console.log('----------开始请求github user')
    const githubuserInfo = await request.get('https://api.github.com/user', {
        headers: {
            accept: 'application/json',
            Authorization: `token ${access_token}`
        }
    }) as any
    console.log('----------结束请求github user')
    console.log(githubuserInfo, 'githubuserInfo')


    const cookies = Cookie.fromApiRoute(req, res)
    const db = await getDB()
    const userAuth = await db.getRepository(UserAuth).findOne({
        where: {
            identity_type: IDENTITY_TYPE.github,
            identifier: GITHUB_CLIENT_ID
        },
        relations: ['user']
    })

    console.log(userAuth, 'userAuth')

    if (userAuth) {
        // 已注册用户
        const user = userAuth.user
        const { id, nickname, avatar } = user

        userAuth.credential = access_token

        session.userId = id
        session.nickname = nickname
        session.avatar = avatar

        await session.save()
        setCookie(cookies, {id, nickname, avatar})
    } else {
        // 未注册用户
        const { login: nickname, avatar_url: avatar, } = githubuserInfo
        const newUser = new User()
        newUser.nickname = nickname
        newUser.avatar = avatar

        const newUserAuth = new UserAuth()
        newUserAuth.identity_type = IDENTITY_TYPE.github
        newUserAuth.identifier = GITHUB_CLIENT_ID + ''
        newUserAuth.credential = access_token
        newUserAuth.user = newUser

        const resUserAuth = await db.getRepository(UserAuth).save(newUserAuth)
        console.log(resUserAuth, 'resUserAuth')

        const { id: userId } = resUserAuth.user
        session.userId = userId
        session.nickname = nickname
        session.avatar = avatar

        await session.save()
        setCookie(cookies, {id: userId, nickname, avatar})
    }
    console.log('github 登录结束')
    res.writeHead(302, {
        location: '/'
    }).end()
}

export default withIronSessionApiRoute(redirect, ironOptions)