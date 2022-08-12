import { Form } from "antd"
import { observer } from "mobx-react-lite"
import styles from './index.module.scss'

const UserProfile = () => {

    const [form] = Form.useForm()

    return (
        <div className="content-layout">
            <div className={styles.userProfile}>
                <h2>个人资料</h2>
            </div>
        </div>
    )
}

export default observer(UserProfile)