
import { Outlet } from "react-router-dom";
function Applications() {
  return (<div>
    <Outlet /> {/* This will render the child routes */}
  </div>);
}

export default Applications;