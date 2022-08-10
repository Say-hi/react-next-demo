import type { NextPage } from "next";
import { ChangeEventHandler, useState } from "react";
import CountDown from "components/CountDown";
import styles from "./index.module.scss";
import { message } from "antd";
import request from "service/fetch";
import { IDENTITY_TYPE } from "interface";
import { useStore } from "store";
import { observer } from "mobx-react-lite";
import { github_id } from "config";

interface PropsType {
  isShow: boolean;
  onClose(): void;
}

const initForm = {
  phone: "",
  verify: "",
};

const Login: NextPage<PropsType> = ({ isShow = false, onClose }) => {
  const [form, setForm] = useState(initForm);
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  const store = useStore();
  const handleClose = () => {
    setIsShowVerifyCode(false);
    onClose && onClose();
    setForm(initForm);
  };

  const handleLogin = () => {
    if (!form.phone) {
      message.warn("请填写您的手机号码");
      return;
    }
    if (!form.verify) {
      message.warn("请填写验证码");
      return;
    }
    request
      .post("/api/user/login", {
        ...form,
        identity_type: IDENTITY_TYPE.phone,
      })
      .then((res: any) => {
        if (res.code) {
          return message.error(res.msg);
        }
        onClose();
        store.user?.setUserInfo(res.data);
        // console.log(store);
      });
  };
  const hanldeOAuthGithub = () => {
    window.open(`https://github.com/login/oauth/authorize?client_id=${github_id}&redirect_url=http://localhost:3000/api/oauth/redirect`, '_blank')
    // '_blank', 'height=600, width=600, toolbar=no, scrollbars=no, resizable=no, location=no, status=no'
  };
  const handleGetVerifyCode = () => {
    if (!form.phone) {
      message.warn("请填写您的手机号码");
      return;
    }
    request
      .post("/api/user/sendVerifyCode", {
        to: form.phone,
        templateId: 1,
      })
      .then((res: any) => {
        if (res.code) {
          message.error(res.msg);
          return;
        }
        setIsShowVerifyCode(true);
      });
    // setIsShowVerifyCode(true)
  };
  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false);
  };
  const handleFormChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登录</div>
          <div className={styles.close} onClick={handleClose}>
            ×
          </div>
        </div>
        <input
          value={form.phone}
          name="phone"
          placeholder="请输入手机号"
          type="text"
          onChange={handleFormChange}
          maxLength={11}
        />
        <div className={styles.verifyCodeArea}>
          <input
            value={form.verify}
            name="verify"
            placeholder="请输入验证码"
            type="text"
            maxLength={6}
            onChange={handleFormChange}
          />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? (
              <CountDown time={10} onEnd={handleCountDownEnd} />
            ) : (
              "获取验证码"
            )}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={hanldeOAuthGithub}>
          使用Git Hub登录
        </div>
        <div className={styles.loginPrivacy}>
          注册登录即表示同意
          <a
            href="https://moco.imooc.com/privacy.html"
            rel="noreferrer"
            target="_blank"
          >
            协议
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default observer(Login);
