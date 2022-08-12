import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import styles from './index.module.scss'
import { ChangeEventHandler, useEffect, useState } from "react";
import { Button, Input, message, Select } from "antd";
import request from "service/fetch";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { useStore } from "store";
import { Tag } from "db/entity";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
  );

const EditorNew: { (): JSX.Element; layout: any; } = () => {
    const {push} = useRouter()
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [allTags, setAllTags] = useState<Tag[]>([])
    const [userChooseTags, setUserChooseTags] = useState([])
    const { user } = useStore()
    useEffect(() => {
        getAllTags()
    }, [])
    const getAllTags = () => {
        request.get('/api/tag/get').then((res: any) => {
            if (!res.code) {
                setAllTags(res.data.allTags)
            } else {
                message.error(res.msg)
            }
        })
    }
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
            content,
            tagIds: userChooseTags
         }).then((res: any) => {
            if (!res.code) {
                message.destroy()
                message.success('文章发布成功')
                push(`/user/${user?.userInfo?.userId}`)
            } else {
                message.error(res.msg)
            }
         })
    }
    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setTitle(e.target.value)
    }

    const handleTagChange = (value: any) => {
        setUserChooseTags(value)
    }
    return (
        <div className={styles.container}>
            <div className={styles.operation}>
                <Input value={title} onChange={handleTitleChange} className={styles.title} placeholder='请输入标题' />
                <Select className={styles.tag} mode='multiple' allowClear placeholder='请选择标签' onChange={handleTagChange}>
                    { allTags?.map(tag => (
                        <Select.Option key={tag.id} value={tag.id}>
                            {tag.title}
                        </Select.Option>
                    )) }
                </Select>
                <Button className={styles.button} onClick={handlePublish} type='primary'>发布</Button>
            </div>
            <MDEditor height={1080} value={content} onChange={handleSetContent} />
        </div>
    )
}

EditorNew.layout = null

export default observer(EditorNew)
export { getServerSideProps } from 'help/getServerSideProps'