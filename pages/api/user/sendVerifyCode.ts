import { NextApiRequest, NextApiResponse } from "next"
import { withIronSessionApiRoute } from 'iron-session/next'
import { IronSession } from 'iron-session'
import dayjs from 'dayjs'
import md5 from 'md5'
import { encode } from 'js-base64'
import request from "service/fetch"
import { ironOptions } from "config"

const ACCOUNT_SID = '8a216da8827c888b0182808a9f83009f'
const AUTH_TOKEN = '01a57b13c84d405cabcf4606d456e359'
const APPID = '8a216da8827c888b0182808aa08100a6'
const MSG_BASEURL = 'https://app.cloopen.com:8883'

function getSigParameter(time: string) {
    return md5(`${ACCOUNT_SID}${AUTH_TOKEN}${time}`)
}

function getAuthorization(time: string) {
    return encode(`${ACCOUNT_SID}:${time}`)
}

interface IData {
    statusCode: string
    templateSMS: Object
    statusMsg: string
}

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
    const session = req.session
    const verifyCode = Math.floor(Math.random() * 8999 + 1000)
    const expireMinute = 5
    const { to = '', templateId = 1 } = req.body
    const nowDateStr = dayjs().format('YYYYMMDDHHmmss')
    const url = `${MSG_BASEURL}/2013-12-26/Accounts/${ACCOUNT_SID}/SMS/TemplateSMS?sig=${getSigParameter(nowDateStr)}`

    const data = await request.post(url, {
        to,
        templateId,
        appId: APPID,
        datas: [
            verifyCode,
            expireMinute
        ]
    }, {
        headers: {
            Authorization: getAuthorization(nowDateStr)
        }
    }) as IData
    const { statusCode, templateSMS, statusMsg } = data
    console.log(data)
    if (statusCode === '000000') {
        session['verifyCode'] = verifyCode
        await session.save()
        return res.status(200).json({
            code: 0,
            msg: statusMsg,
            data: {
                verifyCode,
                ...templateSMS
            }
        })
    } else {
        return res.status(200).json({
            code: statusCode,
            data: null,
            msg: statusMsg
        })
    }
    
}

export default withIronSessionApiRoute(sendVerifyCode, ironOptions)
