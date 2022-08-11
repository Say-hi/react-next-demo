import { EyeOutlined } from "@ant-design/icons"
import { Avatar } from "antd"
import { mdToTxt } from "help/mdToTxt"
import { fromnow } from "help/time"
import { ArtilceType } from "interface"
import Link from "next/link"
import styles from './index.module.scss'

interface IProps {
    article: ArtilceType
}

const ListItem = ({ article }: IProps) => {
    return (
        <Link target={'_blank'} href={`/article/${article.id}`}>
            <div className={styles.container}>
                <div className={styles.article}>
                    <div className={styles.userInfo}>
                        <span className={styles.name}>
                            { article.user.nickname }
                        </span>
                        <span className={styles.date}>
                            { fromnow(article.update_time) }
                        </span>
                    </div>
                    <h4 className={styles.title}>{ article.title }</h4>
                    <p className={styles.content}>{ mdToTxt(article.content) }</p>
                    <div className={styles.statistics}>
                        <EyeOutlined />
                        <span>{ article.views }</span>
                    </div>
                </div>
                <Avatar size={48} src={article.user.avatar} />
            </div>
        </Link>
    )
}

export default ListItem
