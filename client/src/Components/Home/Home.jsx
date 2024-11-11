/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, Row, Col, Card, Typography,message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from "axios";
import { API_URL } from '../../utils/config';

const { Title } = Typography;

const Home = () => {
    const [form] = Form.useForm();
    const [deviceType, setDeviceType] = useState([]);
    const [purpose, setPurpose] = useState([]);
    const [isOtherDevice, setIsOtherDevice] = useState(false);
    const [isOtherPurpose, setIsOtherPurpose] = useState(false);

    const onFinish = async (values) => {
        const currentDate = new Date();
        const date = `${currentDate.getDate()}-${currentDate.toLocaleString('default', { month: 'short' })}-${currentDate.getFullYear().toString().slice(-2)}`;
        const time = currentDate.toLocaleTimeString('en-US', { hour12: false });
    
        const payload = {
            formData: {
                ...values,
                date,
                time,
                isApproved: "Pending",
                isWifiProvided: "Pending"
            }
        };
    
        try {
            // Make the API call
            const response = await axios.post(`${API_URL}/form/create`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Check for successful response
            if (response.status === 200) {
                console.log('Form submitted successfully:', response.data);
                message.success('Form submitted successfully!');  // Success message
                // Reset form fields after successful submission
                form.resetFields();
                setDeviceType([]);
                setPurpose([]);
                setIsOtherDevice(false);
                setIsOtherPurpose(false);
            } else {
                console.error('Failed to submit form:', response.data);
                message.error('Failed to submit form. Please try again.');  // Error message
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            message.error('Error submitting form. Please check your network or try again later.');  // Error message
        }
    };

    const handleDeviceTypeChange = (checkedValues) => {
        setDeviceType(checkedValues);
        setIsOtherDevice(checkedValues.includes('Other'));
    };

    const handlePurposeChange = (checkedValues) => {
        setPurpose(checkedValues);
        setIsOtherPurpose(checkedValues.includes('Other'));
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <Card>
                <Title level={2} className="text-center text-blue-600">RF-Guest Wi-Fi Access Form</Title>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    className="space-y-4"
                    initialValues={{
                        accessRequired: 'Internet Only',
                    }}
                >
                    {/* Full Name */}
                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Full Name is required' }, { pattern: /^[A-Za-z\s']+$/, message: 'Full Name must only contain letters, spaces' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
                    </Form.Item>

                    {/* Email and Mobile Number */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Email ID"
                                name="email"
                                rules={[{ required: true, message: 'Email is required' }, { type: 'email', message: 'Invalid email address' }]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="Enter your email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Mobile Number"
                                name="mobileNumber"
                                rules={[{ required: true, message: 'Mobile Number is required' }]}
                            >
                                <Input prefix={<PhoneOutlined />} placeholder="Enter your mobile number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Number of Devices */}
                    <Form.Item
                        label="Number of Devices"
                        name="noOfDevices"
                        required={true}
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (value === undefined || value === null || value === '') {
                                        return Promise.reject('Number of devices is required');
                                    }
                                    if (value <= 0) {
                                        return Promise.reject('Must be a positive number');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input type="number" placeholder="Enter number of devices" />
                    </Form.Item>

                    {/* Device Type */}
                    <Form.Item label="Device Type" name="deviceType" rules={[{ required: true, message: 'Please select at least one device type' }]}>
                        <Checkbox.Group onChange={handleDeviceTypeChange}>
                            <Row gutter={8} align="middle">
                                {['Laptop', 'Desktop', 'Mobile', 'Tablet'].map((type) => (
                                    <Col key={type}>
                                        <Checkbox value={type}>{type}</Checkbox>
                                    </Col>
                                ))}
                                <Col>
                                    <Checkbox value="Other">Other</Checkbox>
                                </Col>
                                {isOtherDevice && (
                                    <Col>
                                        <Input
                                            name="otherDevice"
                                            placeholder="Enter other device"
                                            style={{ width: '200px', marginLeft: '8px' }}
                                        />
                                    </Col>
                                )}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>

                    {/* Whom to Meet */}
                    <Form.Item label="Whom to Meet" name="whomToMeet" rules={[{ required: true, message: 'Whom to Meet is required' }]}>
                        <Input placeholder="Enter the name of the person to meet" />
                    </Form.Item>

                    {/* Duration */}
                    <Form.Item label="Duration of Access Required">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="durationHours"
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (value === undefined || value === null || value === '') {
                                                    return Promise.reject('Duration in hours is required');
                                                }
                                                if (value <= 0) {
                                                    return Promise.reject('Must be a positive number');
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <Input type="number" placeholder="Hours" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="durationDays">
                                    <Input type="number" placeholder="Days" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>

                    {/* Purpose of Visit */}
                    <Form.Item label="Purpose of Visit" name="purpose" rules={[{ required: true, message: 'Select at least one purpose' }]}>
                        <Checkbox.Group onChange={handlePurposeChange}>
                            <Row gutter={8} align="middle">
                                {['Meeting', 'Training', 'Interview'].map((purposeOption) => (
                                    <Col key={purposeOption}>
                                        <Checkbox value={purposeOption}>{purposeOption}</Checkbox>
                                    </Col>
                                ))}
                                <Col>
                                    <Checkbox value="Other">Other</Checkbox>
                                </Col>
                                {isOtherPurpose && (
                                    <Col>
                                        <Input
                                            name="otherPurpose"
                                            placeholder="Enter other purpose"
                                            style={{ width: '200px', marginLeft: '8px' }}
                                        />
                                    </Col>
                                )}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>

                    {/* Requester Email */}
                    <Form.Item
                        label="Requester Email ID"
                        name="requesterEmail"
                        rules={[{ required: true, message: 'Requester Email is required' }, { type: 'email', message: 'Invalid email address' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Enter the requester email" />
                    </Form.Item>

                    {/* Head Email ID */}
                    <Form.Item
                        label="Head Email ID"
                        name="headEmail"
                        rules={[{ required: true, message: 'Head Email is required' }, { type: 'email', message: 'Invalid email address' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Enter Your head email" />
                    </Form.Item>

                    {/* Access Required (Disabled Field) */}
                    <Form.Item label="Access Required" name="accessRequired">
                        <Input value="Internet Only" disabled />
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            className="bg-blue-500 text-white"
                        >
                            Submit for Approval
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Home;
