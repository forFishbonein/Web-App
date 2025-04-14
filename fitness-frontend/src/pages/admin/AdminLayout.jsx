import { Outlet } from "react-router-dom";
import AdminDashboard from "../../components/dashboard/AdminDashboard.jsx"
function MemberLayout() {
  return (
    <div>
      <AdminDashboard></AdminDashboard>
      <Outlet /> {/* This will render the child routes */}
    </div>
  );
}

export default MemberLayout;