import { Outlet } from "react-router-dom";
import MemberDashboard from "../components/MemberDashboard.jsx"
function MemberLayout() {
  return (
    <div>
      <MemberDashboard></MemberDashboard>
      <Outlet /> {/* This will render the child routes */}
    </div>
  );
}

export default MemberLayout;