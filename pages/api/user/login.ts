import { ironOptions } from "config"
import { getDB } from "db"
import { UserAuth, User } from "db/entity"
import { IDENTITY_TYPE } from "interface"
import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiHandler } from "next"

const login: NextApiHandler = async (req, res) => {
    const {phone, verify, identity_type = IDENTITY_TYPE.phone} = req.body
    if (!phone || !verify || phone.length !== 11) {
        return res.status(200).json({
            code: -1,
            data: null,
            msg: '请填写正确的手机号和验证码'
        })
    }

    const session = req.session
    const db = await getDB()

    // const userRepo = db.getRepository(Users)
    // const users = await userRepo.find()
    
    // console.log(users, 'userRepo')
    let data = '验证码不匹配'
    console.log({
        code1: session.verifyCode,
        verify
    })
    if (session.verifyCode === Number(verify)) {
        const userAuthRep = db.getRepository(UserAuth)
        const findOneUserAuth = await userAuthRep.findOne({
            where: {
                identity_type,
                identifier: phone
            },
            relations: ['user']
        })
        console.log(findOneUserAuth, 'findOneUserAuth')
        if (findOneUserAuth) {
            // 已注册用户
            data = '已注册用户'
        } else {
            // 新用户
            console.log('注册新用户')
            const newUser = new User()
            newUser.nickname = `用户_${Math.floor(Math.random() * 10000)}`
            newUser.avatar = '/images/avatar.jpg'
            newUser.job = '暂无'
            newUser.introduce = '暂无'
            const newUserAuth = new UserAuth()
            newUserAuth.identifier = phone
            newUserAuth.identity_type = Number(identity_type)
            newUserAuth.credential = session.verifyCode + ''
            newUserAuth.user = newUser
            
            const saveResult = await userAuthRep.save(newUserAuth)
            console.log(saveResult, 'saveResult')
            data = '注册新用户'
        }
    }
    

    return res.status(200).json({
        code: 0,
        data
    })
}
export default withIronSessionApiRoute(login, ironOptions)