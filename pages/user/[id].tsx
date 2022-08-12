import { CodeOutlined, FireOutlined, FundOutlined } from '@ant-design/icons'
import { Avatar, Button, Divider } from 'antd'
import ListItem from 'components/ListItem'
import { User } from 'db/entity'
import { ArtilceType } from 'interface'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import styles from './index.module.scss'

export interface IUserDetail {
    userInfo: User & {
        articles: ArtilceType[]
    }
}

const UserDetail = ({userInfo}: IUserDetail) => {
    console.log(userInfo, 'userInfo')
    const artilces = userInfo?.articles || []
    const viewCount = artilces.reduce((sum, artilce) => {
        return sum = sum + Number(artilce.views || 0)
    }, 0)
    return (
        <div className={[styles.userDetail].join(' ')}>
            <div className={styles.left}>
                <div className={styles.userInfo}>
                    <Avatar className={styles.avatar} size={90} src={userInfo.avatar}></Avatar>
                    <div>
                        <div className={styles.nickname}>
                            {userInfo.nickname}
                        </div>
                        <div className={styles.desc}><CodeOutlined />{userInfo.job || '暂无'}</div>
                        <div className={styles.desc}><FireOutlined />{userInfo.introduce || '暂无'}</div>
                    </div>
                    <Link href='/user/profile'><Button>编辑个人资料</Button></Link>
                </div>
                <Divider></Divider>
                <div className={styles.article}>
                    {
                        artilces?.map(article => (
                            <div key={article.id}>
                                <ListItem article={article}></ListItem>
                                <Divider />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.achievement}>
                    <div className={styles.header}>个人成就</div>
                    <div className={styles.number}>
                        <div className={styles.wrapper}>
                            <FundOutlined/>
                            <span>共发布了<span className={styles.wNumber}>{artilces.length}</span>篇文章</span>
                        </div>
                        <div className={styles.wrapper}>
                            <FundOutlined/>
                            <span>文章被阅读<span className={styles.wNumber}>{viewCount}</span>次</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(UserDetail)
export { getUserServerSideProps as getServerSideProps } from 'help/getServerSideProps'