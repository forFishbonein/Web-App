import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Pagination, IconButton, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // ✅ 已读图标
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"; // ⭕ 未读图标
function MemberNotification({ getNotificationList, markNotificationAsRead, setBadgeContent, badgeContent }) {
  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const numPerPage = 3;
  const [notificationList, setNotificationList] = useState([]);
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  const markAsRead = (notificationId) => {
    markNotificationAsRead(notificationId).then((res) => {
      setNotificationList(notificationList.map(e => {
        if (e.notificationId === notificationId) {
          return {
            ...e,
            isRead: true
          }
        }
        return e;
      }));
      setBadgeContent(badgeContent - 1)
    })
    //test logic
    // setNotificationList(notificationList.map(e => {
    //   if (e.notificationId === notificationId) {
    //     return {
    //       ...e,
    //       isRead: true
    //     }
    //   }
    //   return e;
    // }));
  }
  useEffect(() => {
    getNotificationList(currentPage, numPerPage).then((res) => {
      setCount(res.data.total);
      setNotificationList(res.data.records);
    });
    getNotificationList(1, 10000).then((res) => {
      setBadgeContent(res.data.records.filter(e => e.isRead === false).length)
    });
    //test data
    // setNotificationList([
    //   {
    //     "notificationId": 1,
    //     "userId": 101,
    //     "title": "申请结果通知",
    //     "message": "您的教练申请已被接受",
    //     "type": "INFO",
    //     "isRead": false,
    //     "createdAt": "2025-02-27T14:00:00",
    //     "updatedAt": "2025-02-27T15:00:00"
    //   },
    //   {
    //     "notificationId": 2,
    //     "userId": 102,
    //     "title": "系统警告",
    //     "message": "您的账户存在异常登录行为",
    //     "type": "ALERT",
    //     "isRead": true,
    //     "createdAt": "2025-02-26T10:30:00",
    //     "updatedAt": "2025-02-26T12:00:00"
    //   },
    //   {
    //     "notificationId": 3,
    //     "userId": 103,
    //     "title": "系统更新",
    //     "message": "新功能已上线，快来体验！",
    //     "type": "SYSTEM",
    //     "isRead": false,
    //     "createdAt": "2025-02-25T09:00:00",
    //     "updatedAt": "2025-02-25T09:30:00"
    //   }
    // ]
    // )
  }, [currentPage])
  return (<>
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 2, pb: 1 }}>
      {notificationList.map((notification, index) => (
        <Card
          key={notification.notificationId}
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 2,
            boxShadow: "none",
            borderRadius: 2,
            mb: 1.5,
            backgroundColor: "#f9f9f9",

          }}
        >
          {/* <NotificationsIcon /> */}
          <CardContent sx={{ padding: "0", flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {notification.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {notification.message}
            </Typography>
            <Typography variant="caption" color="gray">
              {dayjs(notification.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
            </Typography>
          </CardContent>
          <Tooltip title={notification.isRead ? "Already Read" : "Mark as Read"} arrow>
            <IconButton
              onClick={() => markAsRead(notification.notificationId)}
              color={notification.isRead ? "success" : "primary"}
              sx={{ ml: 2 }}
            >
              {notification.isRead ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
            </IconButton>
          </Tooltip>
        </Card>
      ))}
      {(count > numPerPage) && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
          <Pagination
            count={Math.ceil(count / numPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
            // variant="outlined"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  </>);
}

export default MemberNotification;