import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
export const fromnow = (date: string | Date) => {
    if(!date) return '未知'
    return dayjs(date).fromNow()
}

export const formatTime = (date: string | Date, format: string = 'YYYY-MM-DD HH:mm:ss') => {
    if (!date) return '未知日期'
    return dayjs(date).format(format)
}