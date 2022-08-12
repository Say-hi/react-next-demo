import { Button, Form, FormItemProps, FormProps, Input, message } from "antd";
import { User } from "db/entity";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { type } from "os";
import { useEffect } from "react";
import request from "service/fetch";
import styles from "./index.module.scss";

const layout: FormProps = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout: FormItemProps = {
  wrapperCol: {
    offset: 4,
  },
};

const UserProfile = () => {
  const [ form ] = Form.useForm();
  useEffect(() => {
    getUserDetail()
  }, [])
  const getUserDetail = () => {
    request.get('/api/user/detail').then((res: any) => {
        if (!res.code) {
            form.setFieldsValue(res.data)
        } else {
            message.error(res.msg)
        }
    })
  }
  const handleSubmit = () => {
    request.post('/api/user/update', {
        ...form.getFieldsValue()
    }).then((res: any) => {
        if (!res.code) {
            message.success('更新资料成功')
        } else {
            message.error(res.msg)
        }
    })
  };
  return (
    <div className="content-layout">
      <div className={styles.userProfile}>
        <h2>个人资料</h2>
      </div>
      <div>
        <Form
          {...layout}
          form={form}
          className={styles.form}
          onFinish={handleSubmit}
        >
          <Form.Item rules={[
            {
                message: '请输入用户名',
                required: true
            }
          ]} label="用户名" name="nickname">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="职位" name="job">
            <Input placeholder="请输入您的职位" />
          </Form.Item>
          <Form.Item label="个人介绍" name="introduce">
            <Input placeholder="请输入个人介绍" />
          </Form.Item>
          <Form.Item {...tailLayout}>
                <Button type='primary' htmlType="submit" >提交</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default observer(UserProfile);
