
import { Outlet } from "react-router-dom";
function Trainings() {
  return (<div>
    <Outlet /> {/* This will render the child routes */}
  </div>);
}

export default Trainings;