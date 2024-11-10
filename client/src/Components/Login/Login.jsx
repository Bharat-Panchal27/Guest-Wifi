import React from 'react';
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from 'antd';
import axios from "axios"
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { API_URL } from '../../utils/config';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/user/loginuser`, {
        emailId: values.email,
        password: values.password,
      });

      if (response.data.status === "200") {
        localStorage.setItem("currentUser", values.yourEmailID);
        localStorage.setItem("token", response.data.token);
        message.success("Login successful!");
        setTimeout(() => {
          const Role = response.data.role;
          if (Role === 'Admin') {
            navigate('/private/admin');
          } else if (Role === 'System Admin') {
            navigate('/private/systemadmin');
          }
        }, 800);
      } else {
        message.error(response.data.message || "Login failed.");
      }
    } catch (error) {
      message.error("An error occurred during login.");
      console.error("Login error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <Title level={2} className="text-blue-600">Login</Title>
          <p className="text-gray-500">Please enter your login credentials and email ID</p>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          className="space-y-4"
        >
          {/* Email ID */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Enter your email" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Enter your password" />
          </Form.Item>

          {/* Additional Email ID Field at the Bottom */}
          <Form.Item
            label="Your Email ID"
            name="yourEmailID"
            rules={[
              { required: true, message: 'Please input your email ID!' },
              { type: 'email', message: 'Please enter a valid email ID!' },
            ]}
          >
            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Enter your email ID" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
