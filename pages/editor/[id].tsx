import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import styles from './index.module.scss'
import { ChangeEventHandler, useState } from "react";
import { Button, Input, message } from "antd";
import request from "service/fetch";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
  );
import { ArtilceType } from 'interface';

export {articleDetailGetServerSideProps as getServerSideProps } from 'help/getServerSideProps'

interface IProps {
    article: ArtilceType
}

const UpdateEditor: { (props: IProps): JSX.Element; layout: any } = ({ article }) => {
    const { push } = useRouter()
    const [content, setContent] = useState(article?.content || '')
    const [title, setTitle] = useState(article?.title || '')
    const handleSetContent = (context?: string) => {
        setContent(context + '')
    }

    const handlePublish = () => {
         if (!title) {
            message.warn('请输入标题')
            return
         }
         request.post('/api/article/update', {
            title,
            content,
            articleId: article?.id
         }).then((res: any) => {
            if (!res.code) {
                message.destroy()
                message.success('文章更新成功')
                push(`/article/${article?.id}`)
            } else {
                message.error(res.msg)
            }
         })
    }
    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setTitle(e.target.value)
    }

    return (
        <div className={styles.container}>
            <div className={styles.operation}>
                <Input value={title} onChange={handleTitleChange} className={styles.title} placeholder='请输入标题' />
                <Button className={styles.button} onClick={handlePublish} type='primary'>更新</Button>
            </div>
            <MDEditor height={1080} value={content} onChange={handleSetContent} />
        </div>
    )
}

UpdateEditor.layout= null

export default observer(UpdateEditor)



