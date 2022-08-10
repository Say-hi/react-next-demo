import { ironOptions } from "config"
import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiHandler } from "next"
import { Cookie } from "next-cookie"
import { clearCookie } from "utils"

const logout: NextApiHandler = async (req, res) => {
    const session = req.session
    const cookies = Cookie.fromApiRoute(req, res)
    await session.destroy()
    clearCookie(cookies, ['userId', 'avatar', 'nickname'])
    return res.status(200).json({
        code: 0,
        msg: '登出成功',
        data: null
    })
}

export default withIronSessionApiRoute(logout, ironOptions)