import { NextApiResponse } from "next";

export function responseJson (res: NextApiResponse, data: any, msg?: any) {
    res.status(200).json({
        code: data ? 0 : -1,
        data,
        msg
    })
}