import { ironOptions } from "config"
import { getDB } from "db"
import { Users } from "db/entity"
import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiHandler } from "next"

const login: NextApiHandler = async (req, res) => {
    const {phone, verify} = req.body
    if (!phone || !verify || phone.length !== 11) {
        return res.status(200).json({
            code: -1,
            data: null,
            msg: '请填写正确的手机号和验证码'
        })
    }

    const session = req.session
    const db = await getDB()

    const userRepo = db.getRepository(Users)
    const users = await userRepo.find()
    console.log(users, 'userRepo')

    if (session.verifyCode)
    

    return res.status(200).json({
        code: 0,
        data: '123123123'
    })
}
export default withIronSessionApiRoute(login, ironOptions)