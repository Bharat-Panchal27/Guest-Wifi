import { useEffect, useState } from "react";
import { Table, Button, message, Tag, Input, DatePicker } from "antd";
import axios from "axios";
import { API_URL } from "../../utils/config";
import { CheckOutlined } from "@ant-design/icons";
import DetailsModal from "../DetailsModal/DetailsModal";
import moment from "moment";

const { RangePicker } = DatePicker;
const DATE_FORMAT = "DD-MMM-YY";

const SystemAdmin = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [emailFilter, setEmailFilter] = useState("");
  const [currUserEmail, setCurrUserEmail] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = localStorage.getItem("token");
    if (!token || currentUser.Role !== "System Admin") {
      localStorage.clear();
      window.location.href = "/private/login";
      return;
    }

    setCurrUserEmail(currentUser.email.toLowerCase());

    if (currentUser.email) {
      fetchData(currentUser.email);
    }
  }, []);

  const fetchData = async (headEmail) => {
    setLoading(true);
    const payload = { 
      headEmail: headEmail.toLowerCase(),
      Role: "System Admin"
    };
    try {
      const response = await axios.post(`${API_URL}/form/getall`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.status === "200") {
        const approvedData = response.data.data.filter(
          (item) => item.isApproved.split(" ")[0] === "Approved"
        );
        setData(approvedData);
        setFilteredData(approvedData);
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

  const handleWifiProvided = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/form/update`, {
        id,
        formData: { isWifiProvided: "Wifi Provided" },
      });
      if (response.data.status === "200") {
        message.success("Wifi Provided successfully");
        updateRequestStatus(id, "Wifi Provided");
        fetchData(currUserEmail);
      } else {
        message.error("Failed to mark as Wifi Provided");
      }
    } catch (error) {
      message.error("Error updating status");
      console.error("API call error:", error);
    }
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
    if(!dateRange && !emailFilter){
      setFilteredData(data);
      return;
    }
    const [startDate, endDate] = dateRange;
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
        return moment(b.date, DATE_FORMAT) - moment(a.date, DATE_FORMAT);
      });

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Wifi Status",
      dataIndex: "isWifiProvided",
      key: "isWifiProvided",
      sorter: (a, b) => a.isWifiProvided.localeCompare(b.isWifiProvided),
      render: (isWifiProvided) => (
        <div className="flex items-center">
          {isWifiProvided === "Wifi Provided" && (
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          )}
          <Tag color={isWifiProvided === "Wifi Provided" ? "green" : "yellow"}>
            {isWifiProvided}
          </Tag>
        </div>
      ),
    },
    {
      title: "Requester Email ID",
      dataIndex: "requesterEmail",
      key: "requesterEmail",
      sorter: (a, b) => a.requesterEmail.localeCompare(b.requesterEmail),
    },
    {
      title: "Status",
      dataIndex: "isApproved",
      key: "isApproved",
      sorter: (a, b) => a.isApproved.localeCompare(b.isApproved),
      render: (isApproved) => (
        <div className="flex items-center">
          {isApproved.split(" ")[0] === "Approved" && (
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          )}
          <Tag
            color={isApproved.split(" ")[0] === "Approved" ? "green" : "yellow"}
          >
            {isApproved}
          </Tag>
        </div>
      ),
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
      title: "Action",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-4">
          {record.isWifiProvided !== "Wifi Provided" &&
          record.isApproved.split(" ")[0] === "Approved" ? (
            <Button
              icon={<CheckOutlined />}
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleWifiProvided(record._id);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white border-none"
            >
              Wifi Provided
            </Button>
          ) : (
            <span style={{ color: "grey" }}></span>
          )}
        </div>
      ),
    },
  ];

  const handleLogout = () => {
    // Clear localStorage and redirect to login page
    localStorage.clear();
    window.location.href = "/private/login";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-7xl p-6 bg-white shadow-lg rounded-xl flex flex-col justify-between">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Guest Wifi Access Report - System Admin
        </h2>

        {/* Filter Section */}
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

        {/* Table Section */}
        <div className="flex-grow">
          <Table
            dataSource={filteredData.sort((a, b) => {
              if (
                a.isWifiProvided === "Pending" &&
                b.isWifiProvided !== "Pending"
              )
                return -1;
              if (
                a.isWifiProvided !== "Pending" &&
                b.isWifiProvided === "Pending"
              )
                return 1;
              return moment(b.date, DATE_FORMAT) - moment(a.date, DATE_FORMAT);
            })}
            columns={columns}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style:
                record.isWifiProvided === "Wifi Provided"
                  ? { color: "gray" }
                  : {},
            })}
          />
        </div>

        {/* Logout Button */}
        <div className="flex justify-center mt-4">
          <Button
            type="default"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>
        </div>
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

export default SystemAdmin;
