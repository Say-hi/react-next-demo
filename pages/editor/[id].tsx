import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import styles from './index.module.scss'
import { ChangeEventHandler, useEffect, useState } from "react";
import { Button, Input, message, Select } from "antd";
import request from "service/fetch";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
  );
import { ArtilceType } from 'interface';
import { Tag } from "db/entity";

export {articleDetailGetServerSideProps as getServerSideProps } from 'help/getServerSideProps'

interface IProps {
    article: ArtilceType
}

const UpdateEditor: { (props: IProps): JSX.Element; layout: any } = ({ article }) => {
    const { push } = useRouter()
    const [content, setContent] = useState(article?.content || '')
    const [title, setTitle] = useState(article?.title || '')

    const [allTags, setAllTags] = useState<Tag[]>([])
    const [userChooseTags, setUserChooseTags] = useState<number[]>([])
    useEffect(() => {
        console.log(article)
        setUserChooseTags(article.tags?.map(i => i.id))
        getAllTags()
    }, [article])
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
         request.post('/api/article/update', {
            title,
            content,
            articleId: article?.id,
            tagsId: userChooseTags
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
    const handleTagChange = (value: any) => {
        setUserChooseTags(value)
    }

    return (
        <div className={styles.container}>
            <div className={styles.operation}>
                <Input value={title} onChange={handleTitleChange} className={styles.title} placeholder='请输入标题' />
                <Select className={styles.tag} mode='multiple' allowClear value={userChooseTags} placeholder='请选择标签' onChange={handleTagChange}>
                    { allTags?.map(tag => (
                        <Select.Option key={tag.id} value={tag.id}>
                            {tag.title}
                        </Select.Option>
                    )) }
                </Select>
                <Button className={styles.button} onClick={handlePublish} type='primary'>更新</Button>
            </div>
            
            <MDEditor height={1080} value={content} onChange={handleSetContent} />
        </div>
    )
}

UpdateEditor.layout= null

export default observer(UpdateEditor)



