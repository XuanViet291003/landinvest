import './Login.scss';
import { Button, Form, Input, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { callLogin } from '../../../services/api';
import { doLoginAction, doLoginDataUser } from '../../../redux/account/accountSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Login = () => {
    const dispatch = useDispatch();
    const [isSubmit, setIsSubmit] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const getLastLoginIP = async () => {
        try {
            const response = await axios.get('https://api64.ipify.org?format=json');
            return response.data.ip;
        } catch (error) {
            console.error('Lỗi khi lấy địa chỉ IP:', error);
            return null;
        }
    };

    const onFinish = async (values) => {
        setIsSubmit(true);
        try {
            const { Username, Password } = values;
            const LastLoginIP = await getLastLoginIP();

            const res = await callLogin(Username, Password, LastLoginIP);

            if (res && res.data && res.data.msg === 'login successful') {
                localStorage.setItem('access_token', res.data.access_token);
                localStorage.setItem('refresh_token', res.data.refreshtoken);
                localStorage.setItem('user_id', res.data.UserID);
                document.cookie = `access_token_cookie=${res.data.access_token}; path=/`;

                dispatch(doLoginAction({ userData: res.data, Password: Password }));
                dispatch(doLoginDataUser(res.data));

                message.success('Đăng nhập tài khoản thành công!');
                navigate('/');
            } else {
                message.error(res?.data?.message || 'Đăng nhập không thành công, vui lòng thử lại.'); // Hiển thị lỗi từ API
            }
        } catch (error) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: error.message, 
                duration: 5,
            });
        } finally {
            setIsSubmit(false); 
        }
    };

    return (
        <>
            {contextHolder}
            <div className="login">
                <Form
                    form={form}
                    name="basic"
                    className="login-form"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    style={{
                        maxWidth: 400,
                        margin: '0 auto',
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <h2 style={{ marginBottom: '10px' }}>Đăng nhập</h2>

                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        label="Username"
                        name="Username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input
                            style={{
                                height: '40px',
                                marginTop: '-6px',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        label="Password"
                        name="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password
                            style={{
                                height: '40px',
                                marginTop: '-10px',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            span: 24,
                        }}
                        style={{
                            marginTop: '30px',
                        }}
                    >
                        <Button
                            style={{
                                height: '40px',
                                width: '120px',
                                left: '74px',
                            }}
                            type="primary"
                            htmlType="submit" // Sửa thành submit
                            loading={isSubmit}
                        >
                            Đăng nhập
                        </Button>

                        <Button
                            style={{
                                height: '40px',
                                width: '120px',
                                marginLeft: '74px',
                            }}
                            htmlType="button" // Sửa thành button
                            onClick={() => {
                                navigate('/forgotPassword');
                            }}
                        >
                            Quên mật khẩu
                        </Button>
                    </Form.Item>

                    <p style={{ textAlign: 'center' }}>
                        Bạn chưa có tài khoản{' '}
                        <button
                            style={{
                                marginLeft: '3px',
                                textDecoration: 'underline',
                                background: 'none',
                                border: 'none',
                                color: 'blue',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                navigate('/register');
                            }}
                        >
                            Đăng ký
                        </button>
                    </p>
                </Form>
            </div>
        </>
    );
};

export default Login;