import { markdownToTxt } from 'markdown-to-txt'

export const mdToTxt = (md = '暂无内容') => {
    return markdownToTxt(md)
}