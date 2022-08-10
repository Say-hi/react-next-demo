import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import styles from './index.module.scss'
import { ChangeEventHandler, useState } from "react";
import { Button, Input, message } from "antd";
import request from "service/fetch";
import userStore from "store/userStore.";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
  );

const EditorNew: { (): JSX.Element; layout: any; } = () => {
    const {push} = useRouter()
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const store = userStore()
    console.log(store, 'store')
    const handleSetContent = (context?: string) => {
        setContent(context + '')
    }


    const handlePublish = () => {
         if (!title) {
            message.warn('请输入标题')
            return
         }
         request.post('/api/article/publish', {
            title,
            content
         }).then((res: any) => {
            if (!res.code) {
                message.success('文章发布成功')
                push(`/user/${store.userInfo.userId}`)
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
                <Button className={styles.button} onClick={handlePublish} type='primary'>发布</Button>
            </div>
            <MDEditor height={1080} value={content} onChange={handleSetContent} />
        </div>
    )
}

EditorNew.layout = null

export default observer(EditorNew)