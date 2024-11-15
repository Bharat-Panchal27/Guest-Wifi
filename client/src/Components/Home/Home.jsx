/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Form,
  Input,
  Checkbox,
  Button,
  Row,
  Col,
  Card,
  Typography,
  message,
  Divider,
} from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../../utils/config";

const { Title,Text } = Typography;

const Home = () => {
  const [form] = Form.useForm();
  const [deviceType, setDeviceType] = useState([]);
  const [purpose, setPurpose] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOtherDevice, setIsOtherDevice] = useState(false);
  const [isOtherPurpose, setIsOtherPurpose] = useState(false);

  const onFinish = async (values) => {
    const currentDate = new Date();
    const date = `${currentDate.getDate()}-${currentDate.toLocaleString(
      "default",
      { month: "short" }
    )}-${currentDate.getFullYear().toString().slice(-2)}`;
    const time = currentDate.toLocaleTimeString("en-US", { hour12: false });

    values.email = values.email?.toLowerCase();
    values.requesterEmail = values.requesterEmail?.toLowerCase();
    values.headEmail = values.headEmail?.toLowerCase();

    if (isOtherDevice && values.otherDevice) {
      values.deviceType.push(values.otherDevice);
    }

    if (isOtherPurpose && values.otherPurpose) {
      values.purpose.push(values.otherPurpose);
    }

    const payload = {
      formData: {
        ...values,
        date,
        time,
        isApproved: "Pending",
        isWifiProvided: "Pending",
      },
    };

    try {
      setLoading(true);
      // Make the API call
      const response = await axios.post(`${API_URL}/form/create`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check for successful response
      if (response.status === 200) {
        console.log("Form submitted successfully:", response.data);
        message.success("Form submitted successfully!"); // Success message
        // Reset form fields after successful submission
        form.resetFields();
        setDeviceType([]);
        setPurpose([]);
        setIsOtherDevice(false);
        setIsOtherPurpose(false);
      } else {
        console.error("Failed to submit form:", response.data);
        message.error("Failed to submit form. Please try again."); // Error message
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(
        "Error submitting form. Please check your network or try again later."
      ); // Error message
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceTypeChange = (checkedValues) => {
    setDeviceType(checkedValues);
    setIsOtherDevice(checkedValues.includes("Other"));
  };

  const handlePurposeChange = (checkedValues) => {
    setPurpose(checkedValues);
    setIsOtherPurpose(checkedValues.includes("Other"));
  };

  const TermsAndConditions = () => (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
      <Title level={4} className="mb-4">Terms and Conditions</Title>
      <Text className="text-gray-700">
        By using the guest Wi-Fi network, you agree to the following terms and conditions:
      </Text>
      <ul className="list-disc ml-6 mt-4 space-y-2">
        <li>The Wi-Fi network is for legitimate business purposes only.</li>
        <li>Unauthorized access to internal resources is prohibited.</li>
        <li>Downloading or distributing illegal content is prohibited.</li>
        <li>The organization is not responsible for any loss or damage to personal devices or data.</li>
        <li>Use of the guest network is at your own risk.</li>
        <li>Compliance with the organization's IT policies and procedures is required.</li>
        <li>The organization reserves the right to monitor and restrict access as needed.</li>
        <li>Data transmitted over the guest network is not encrypted. Sensitive information should be transmitted using secure methods.</li>
        <li>Access may be terminated at any time at the discretion of the organization.</li>
      </ul>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <Card>
        <Title level={2} className="text-center text-blue-600">
          RF-Guest Wi-Fi Access Form
        </Title>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
          initialValues={{
            accessRequired: "Internet Only",
          }}
        >
          {/* Full Name */}
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              { required: true, message: "Full Name is required" },
              {
                pattern: /^[A-Za-z\s']+$/,
                message: "Full Name must only contain letters, spaces",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your full name"
            />
          </Form.Item>

          {/* Email and Mobile Number */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email ID"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Invalid email address" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mobile Number"
                name="mobileNumber"
                rules={[
                  { required: true, message: "Mobile Number is required" },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Enter your mobile number"
                />
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
                  if (value === undefined || value === null || value === "") {
                    return Promise.reject("Number of devices is required");
                  }
                  if (value <= 0) {
                    return Promise.reject("Must be a positive number");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" placeholder="Enter number of devices" />
          </Form.Item>

          {/* Device Type */}
          <Form.Item
            label="Device Type"
            name="deviceType"
            rules={[
              {
                required: true,
                message: "Please select at least one device type",
              },
            ]}
          >
            <Checkbox.Group onChange={handleDeviceTypeChange}>
              <Row gutter={8} align="middle" style={{ alignItems: "center" }}>
                {["Laptop", "Desktop", "Mobile", "Tablet"].map((type) => (
                  <Col key={type}>
                    <Checkbox value={type}>{type}</Checkbox>
                  </Col>
                ))}
                <Col>
                  <Checkbox value="Other">Other</Checkbox>
                </Col>
                {isOtherDevice && (
                  <Col>
                    <Form.Item
                      name="otherDevice"
                      rules={[{ required: true }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        name="otherDevice"
                        placeholder="Enter other device"
                        style={{
                          width: "200px",
                          marginLeft: "8px",
                          marginTop: "4px", // Aligns input with checkbox group
                        }}
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          {/* Whom to Meet */}
          <Form.Item
            label="Whom to Meet"
            name="whomToMeet"
            rules={[{ required: true, message: "Whom to Meet is required" }]}
          >
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
                        if (
                          value === undefined ||
                          value === null ||
                          value === ""
                        ) {
                          return Promise.reject(
                            "Duration in hours is required"
                          );
                        }
                        if (value <= 0) {
                          return Promise.reject("Must be a positive number");
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
          <Form.Item
            label="Purpose of Visit"
            name="purpose"
            rules={[{ required: true, message: "Select at least one purpose" }]}
          >
            <Checkbox.Group onChange={handlePurposeChange}>
              <Row gutter={8} align="middle" style={{ alignItems: "center" }}>
                {["Meeting", "Training", "Interview"].map((purposeOption) => (
                  <Col key={purposeOption}>
                    <Checkbox value={purposeOption}>{purposeOption}</Checkbox>
                  </Col>
                ))}
                <Col>
                  <Checkbox value="Other">Other</Checkbox>
                </Col>
                {isOtherPurpose && (
                  <Col>
                    <Form.Item
                      name="otherPurpose"
                      rules={[{ required: true }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        name="otherPurpose"
                        placeholder="Enter other purpose"
                        style={{
                          width: "200px",
                          marginLeft: "8px",
                          marginTop: "4px", // Aligns input with checkbox group
                        }}
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          {/* Requester Email */}
          <Form.Item
            label="Requester Email ID"
            name="requesterEmail"
            rules={[
              { required: true, message: "Requester Email is required" },
              { type: "email", message: "Invalid email address" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter the requester email"
            />
          </Form.Item>

          {/* Head Email ID */}
          <Form.Item
            label="Head Email ID"
            name="headEmail"
            rules={[
              { required: true, message: "Head Email is required" },
              { type: "email", message: "Invalid email address" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter Your head email"
            />
          </Form.Item>

          {/* Access Required (Disabled Field) */}
          <Form.Item label="Access Required" name="accessRequired">
            <Input value="Internet Only" disabled />
          </Form.Item>

          <Divider />
          <TermsAndConditions />
          
          <Form.Item
            name="acceptTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        'Please accept the terms and conditions'
                      ),
              },
            ]}
          >
            <Checkbox className="font-medium">
              I have read and agree to the terms and conditions
            </Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
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
