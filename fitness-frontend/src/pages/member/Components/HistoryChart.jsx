import React, { useEffect, useState } from "react";
import { TextField, Button, Box, CircularProgress, Popover, Typography } from "@mui/material";
import dayjs from "dayjs";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
// For example, using English (USA)
import enUS from 'date-fns/locale/en-US';
// Or Chinese
// import zhCN from 'date-fns/locale/zh-CN';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, ComposedChart } from "recharts";
function HistoryChart({ getDynamicAppointmentStatistics }) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectionRange, setSelectionRange] = useState({
    startDate: dayjs().subtract(7, 'day').toDate(),
    endDate: dayjs().toDate(),
    key: "selection",
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const getData = async () => {
    const res = await getDynamicAppointmentStatistics(
      dayjs(selectionRange.startDate).format("YYYY-MM-DD"),
      dayjs(selectionRange.endDate).format("YYYY-MM-DD")
    );
    setStatisticsData(res?.data?.dailyStatistics || []);
  }
  useEffect(() => {
    getData();
  }, []);
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };
  const [loading, setLoading] = useState(false);
  const [statisticsData, setStatisticsData] = useState([]);
  const handleGetStatisticData = async () => {
    if (!selectionRange.startDate || !selectionRange.endDate) return;
    setLoading(true);
    await getData();
    setLoading(false);
  };
  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };
  const today = dayjs();
  const thirtyDaysAgo = today.subtract(30, 'day');
  return (<>
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mx: "auto", mt: 3 }}>
      <TextField
        label="Select Date Range"
        value={`${dayjs(selectionRange.startDate).format("MMM D, YYYY")} - ${dayjs(selectionRange.endDate).format("MMM D, YYYY")}`}
        sx={{
          width: 300,
        }}
        onClick={handleClick}
        fullWidth
        readOnly
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <DateRange
          locale={enUS}
          ranges={[selectionRange]}
          onChange={(ranges) => handleSelect(ranges)}
          moveRangeOnFirstSelection={false}
          minDate={thirtyDaysAgo.toDate()}  // Minimum optional date
          maxDate={today.toDate()}  // Maximum optional date
        />
      </Popover>
      <Button
        variant="contained"
        onClick={handleGetStatisticData}
        disabled={loading}
        size="small"
        // color="primary"
        sx={{
          backgroundColor: "#002D56",
          color: "white",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            backgroundColor: "#001F3F",
            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {loading ? <CircularProgress size={24} /> : "Get Statistics"}
      </Button>
    </Box>
    {statisticsData.length > 0 && (
      <>
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
          <Typography align="center" sx={{ mb: 2 }}>
            From {dayjs(selectionRange.startDate).format("MMM D, YYYY")} to {dayjs(selectionRange.endDate).format("MMM D, YYYY")},
            you have trained for <strong>{statisticsData.reduce((sum, item) => sum + item.hours, 0)}</strong> hours.
          </Typography>
        </Box>
        <Box sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Typography variant="h6" align="center">
            Daily Training Statistics
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={statisticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(tick) => dayjs(tick).format("MM-DD")}
                angle={-45}
                height={60}
                tickMargin={10}
              />
              <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    // Keep only the bar chart data
                    const filteredData = payload.filter(item => item.dataKey === "hours" && item.fill);
                    return (
                      <Box sx={{ background: "#fff", p: 1.5, borderRadius: 1, boxShadow: 3 }}>
                        <Typography variant="body2" color="text.primary">
                          {label}
                        </Typography>
                        {filteredData.map((entry, index) => (
                          <Typography key={index} variant="body2" color={entry.color}>
                            {entry.name} : {entry.value}
                          </Typography>
                        ))}
                      </Box>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                payload={
                  [
                    {
                      value: "Hours",
                      type: "rect",
                      color: "#007FFF",
                    }
                  ]
                }
              />
              <Bar dataKey="hours" fill="#007FFF" barSize={40} name="Hours" />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#FF5733"
                dot={false}
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </>

    )}
  </>);
}

export default HistoryChart;