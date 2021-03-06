import React from "react";
import request from "../../services/index";
import { InputItem, List, Button } from "antd-mobile";
import { createForm } from "rc-form";
import { connect } from "react-redux";
import Storage from "../../utils/storage";
import "./index.scss";

const Cookies = require("js-cookie");

function Login(props) {
  const { getFieldDecorator, getFieldsValue } = props.form;
  const { dispatch, history } = props;

  const Login = () => {
    const params = getFieldsValue();
    request.login(params).then((res) => {
      Storage.set("user", res);
      Cookies.set("cookie", res.cookie);
      dispatch({ type: "SET_USER", user: res });
      dispatch({ type: "SET_TAB_BAR", showTabBar: true });
      history.push("/find");
    });
  };

  return (
    <div className="login-wrapper">
      <List>
        {getFieldDecorator("email", {
          initialValue: "ljmissir@163.com"
        })(<InputItem type="text" placeholder="输入用户名" />)}
        {getFieldDecorator("password")(
          <InputItem type="password" placeholder="输入密码" />
        )}
      </List>
      <Button onClick={Login}>登录</Button>
    </div>
  );
}

const LoginForm = createForm()(Login);

export default connect(({ user, song }) => ({ user, song }))(LoginForm);
