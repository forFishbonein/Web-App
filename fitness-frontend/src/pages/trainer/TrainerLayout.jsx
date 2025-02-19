import { Outlet } from "react-router-dom";
import TrainerDasboard from "../../components/dashboard/TrainerDasboard.jsx"
function MemberLayout() {
  return (
    <div>
      <TrainerDasboard></TrainerDasboard>
      <Outlet /> {/* This will render the child routes */}
    </div>
  );
}

export default MemberLayout;