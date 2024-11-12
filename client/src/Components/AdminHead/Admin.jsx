/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Table, Button, message, Tag, Input, DatePicker } from "antd";
import axios from "axios";
import { API_URL } from "../../utils/config";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import DetailsModal from "../DetailsModal/DetailsModal";
import moment from "moment";

const { RangePicker } = DatePicker;
const DATE_FORMAT = "DD-MMM-YY";

const Admin = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApproveId, setLoadingApproveId] = useState(null); // Loading state for Approve buttons
  const [loadingRejectId, setLoadingRejectId] = useState(null); // Loading state for Reject buttons
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [emailFilter, setEmailFilter] = useState("");
  const [currUserName, setCurrUserName] = useState("");
  const [currUserEmail, setCurrUserEmail] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!token || currentUser.Role !== "Admin") {
      localStorage.clear();
      window.location.href = "/private/login";
      return;
    }

    setCurrUserName(currentUser.name);
    setCurrUserEmail(currentUser.email.toLowerCase());

    if (currentUser.email) {
      fetchData(currentUser.email);
    }
  }, []);

  const fetchData = async (headEmail) => {
    setLoading(true);
    const payload = { headEmail, Role: "Admin" };

    try {
      const response = await axios.post(`${API_URL}/form/getall`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "200") {
        setData(response.data.data);
        setFilteredData(response.data.data);
        setIsDataFetched(true);
      } else {
        message.error(response.data.message || "Failed to fetch data");
      }
    } catch (error) {
      message.error("An error occurred while fetching data");
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatusInBackend = async (id, status) => {
    // Use separate loading states for Approve and Reject actions
    if (status === "Approved") setLoadingApproveId(id);
    else setLoadingRejectId(id);

    try {
      const response = await axios.put(`${API_URL}/form/update`, {
        id,
        formData: { isApproved: `${status} by ${currUserName}` },
      });

      if (response.data.status === "200") {
        message.success(`Request ${status} successfully`);
        updateRequestStatus(id, status);
        fetchData(currUserEmail);
      } else {
        message.error("Failed to update request status");
      }
    } catch (error) {
      message.error("Error updating status");
      console.error("API call error:", error);
    } finally {
      // Reset both loading states after completion
      setLoadingApproveId(null);
      setLoadingRejectId(null);
    }
  };

  const handleApprove = (id) => {
    updateRequestStatusInBackend(id, "Approved");
  };

  const handleReject = (id) => {
    updateRequestStatusInBackend(id, "Rejected");
  };

  const updateRequestStatus = (id, status) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, isApproved: status } : item
      )
    );
    handleFilter();
  };

  const handleRowClick = (record) => {
    setSelectedData(record);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedData(null);
  };

  const handleFilter = () => {
    if (!dateRange && !emailFilter) {
      setFilteredData(data);
      return;
    }
    const [startDate, endDate] = dateRange;

    // Filter data based on date range and email filter
    const filtered = data
      .filter((item) => {
        const itemDate = moment(item.date, DATE_FORMAT);
        const isWithinDateRange =
          !dateRange.length ||
          (startDate &&
            endDate &&
            itemDate.isBetween(startDate, endDate, "days", "[]"));
        const matchesEmail =
          !emailFilter || item.requesterEmail.includes(emailFilter);
        return isWithinDateRange && matchesEmail;
      })
      .sort((a, b) => {
        if (a.isApproved === "Pending" && b.isApproved !== "Pending") return -1;
        if (a.isApproved !== "Pending" && b.isApproved === "Pending") return 1;

        return moment(b.date, DATE_FORMAT) - moment(a.date, DATE_FORMAT);
      });

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "isApproved",
      key: "isApproved",
      sorter: (a, b) => a.isApproved.localeCompare(b.isApproved),
      render: (isApproved) => {
        const status = isApproved.split(" ")[0];

        return (
          <div className="flex items-center">
            {status === "Pending" && (
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
            )}
            <Tag
              color={
                status === "Approved"
                  ? "green"
                  : status === "Rejected"
                  ? "red"
                  : "yellow"
              }
            >
              {status}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Requester Email ID",
      dataIndex: "requesterEmail",
      key: "requesterEmail",
      sorter: (a, b) => a.requesterEmail.localeCompare(b.requesterEmail),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) =>
        moment(a.date, DATE_FORMAT) - moment(b.date, DATE_FORMAT),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-4">
          {record.isApproved.split(" ")[0] === "Pending" ? (
            <>
              <Button
                icon={<CheckOutlined />}
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(record._id);
                }}
                className="bg-green-500 hover:bg-green-600 text-white border-none"
                loading={loadingApproveId === record._id} // Load only the clicked Approve button
              >
                Approve
              </Button>
              <Button
                icon={<CloseOutlined />}
                type="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(record._id);
                }}
                className="bg-red-500 hover:bg-red-600 text-white border-none"
                loading={loadingRejectId === record._id} // Load only the clicked Reject button
              >
                Reject
              </Button>
            </>
          ) : (
            <span style={{ color: "grey" }}>
              {record.isApproved.split(" ")[0]}
            </span>
          )}
        </div>
      ),
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/private/login";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-7xl p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Guest Wifi Access Report
        </h2>

        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search by Requester Email ID"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            style={{ width: "30%" }}
          />
          <RangePicker
            format="YYYY-MM-DD"
            onChange={(dates) => setDateRange(dates)}
            style={{ width: "50%" }}
          />
          <Button type="primary" onClick={handleFilter}>
            Search
          </Button>
        </div>

        <div className="flex-grow">
          <Table
            dataSource={filteredData.sort((a, b) => {
              if (
                a.isApproved.split(" ")[0] === "Pending" &&
                b.isApproved.split(" ")[0] !== "Pending"
              ) {
                return -1;
              }
              if (
                a.isApproved.split(" ")[0] !== "Pending" &&
                b.isApproved.split(" ")[0] === "Pending"
              ) {
                return 1; 
              }

              return moment(b.date, DATE_FORMAT) - moment(a.date, DATE_FORMAT);
            })}
            columns={columns}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            rowClassName={(record) =>
              record.isApproved.split(" ")[0] !== "Pending"
                ? "text-gray-400"
                : ""
            }
          />

          <div className="flex justify-center mt-4">
            <Button
              type="danger"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white !important"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <DetailsModal
        visible={modalVisible}
        data={selectedData}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Admin;
