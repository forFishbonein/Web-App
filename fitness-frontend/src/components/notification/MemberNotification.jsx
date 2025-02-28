import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Pagination, IconButton, Tooltip, Popover, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InboxIcon from "@mui/icons-material/Inbox";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CancelIcon from "@mui/icons-material/Cancel";
function MemberNotification({ getNotificationList, markNotificationAsRead, setBadgeContent, badgeContent, deleteNotification }) {
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // 打开确认删除 Popover
  const handleOpenPopover = (event, notificationId) => {
    setAnchorEl(event.currentTarget);
    setDeletingId(notificationId);
  };

  // 关闭 Popover
  const handleClosePopover = () => {
    setAnchorEl(null);
    setDeletingId(null);
  };
  // 确认删除
  const handleConfirmDelete = () => {
    deleteNotification(deletingId).then((res) => {
      setNotificationList(notificationList.filter(e => e.notificationId !== deletingId));
    })
    handleClosePopover();
  };
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
  return (
    <>
      <Box sx={{ maxWidth: 400, minWidth: 200, mx: "auto", mt: 2, pb: 1 }}>
        {notificationList?.length > 0 ? (
          <>
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
                  backgroundColor: notification.isRead ? "#f9f9f9" : "#fffbea",
                  transition: "background-color 0.3s ease",
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
                <Tooltip title={notification.isRead ? "Click to Delete" : "Mark as Read"} arrow>
                  {/* <IconButton
              onClick={() => markAsRead(notification.notificationId)}
              color={notification.isRead ? "success" : "primary"}
              sx={{ ml: 2 }}
            >
              {notification.isRead ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
            </IconButton> */}
                  <IconButton
                    onClick={notification.isRead ? (event) => handleOpenPopover(event, notification.notificationId) : () => markAsRead(notification.notificationId)}
                    color={notification.isRead ? "error" : "primary"}
                  >
                    {notification.isRead ? <CancelIcon /> : <RadioButtonUncheckedIcon />}
                  </IconButton>
                </Tooltip>
                <Popover
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClosePopover}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  {/* <Box sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Confirm deletion?</Typography>
              <Button size="small" onClick={handleClosePopover}>Cancel</Button>
              <Button size="small" color="error" onClick={handleConfirmDelete}>Delete</Button>
            </Box> */}
                  <Box
                    sx={{
                      p: 1,
                      pl: 2,
                      pr: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch", // Let Typography fill the line
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ textAlign: "left", fontWeight: "bold" }}>Confirm deletion?</Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Button size="small" variant="outlined" onClick={handleClosePopover} color="primary">
                        Cancel
                      </Button>
                      <Button size="small" variant="outlined" color="error" onClick={handleConfirmDelete}>
                        Delete
                      </Button>
                    </Box>
                  </Box>

                </Popover>
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
          </>
        ) : <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            textAlign: "center",
            color: "gray",
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            p: 3,
          }}
        >
          <InboxIcon sx={{ fontSize: 50, color: "lightgray" }} />

          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
            No Notifications
          </Typography>
          <Typography variant="body2">You're all caught up!</Typography>
        </Box>}

      </Box>
    </>);
}

export default MemberNotification;