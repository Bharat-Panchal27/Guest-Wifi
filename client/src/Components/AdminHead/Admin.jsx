import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tag } from 'antd';
import axios from 'axios';
import { API_URL } from '../../utils/config';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import DetailsModal from '../DetailsModal/DetailsModal';

const Admin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // Retrieve current user from localStorage
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    const payload = {
      headEmail: currentUser,
    };
    try {
      const response = await axios.post(`${API_URL}/form/getall`, payload, {
        headers: {
          "Content-Type": 'application/json',
        },
      });
      if (response.data.status === '200') {
        setData(response.data.data);
      } else {
        message.error(response.data.message || 'Failed to fetch data');
      }
    } catch (error) {
      message.error('An error occurred while fetching data');
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Approve and Reject Handlers
  const handleApprove = (id) => {
    message.success(`Approved request with ID: ${id}`);
  };

  const handleReject = (id) => {
    message.error(`Rejected request with ID: ${id}`);
  };

  // Show details modal
  const handleRowClick = (record) => {
    setSelectedData(record);
    setModalVisible(true);
  };

  // Close details modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedData(null);
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Status',
      dataIndex: 'isApproved',
      key: 'isApproved',
      sorter: (a, b) => a.isApproved.localeCompare(b.isApproved),
      render: (isApproved) => (
        <div className="flex items-center">
          {isApproved === 'Pending' && <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />}
          <Tag color={isApproved === 'Approved' ? 'green' : isApproved === 'Rejected' ? 'red' : 'yellow'}>
            {isApproved}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Requester Email ID',
      dataIndex: 'requesterEmail',
      key: 'requesterEmail',
      sorter: (a, b) => a.requesterEmail.localeCompare(b.requesterEmail),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-4">
          <Button
            icon={<CheckOutlined />}
            type="primary"
            onClick={() => handleApprove(record._id)}
            className="bg-green-500 hover:bg-green-600 text-white border-none"
          >
            Approve
          </Button>
          <Button
            icon={<CloseOutlined />}
            type="danger"
            onClick={() => handleReject(record._id)}
            className="bg-red-500 hover:bg-red-600 text-white border-none"
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-7xl p-6 bg-white shadow-lg rounded-xl">
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>

      {/* Details Modal */}
      <DetailsModal
        visible={modalVisible}
        data={selectedData}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Admin;
