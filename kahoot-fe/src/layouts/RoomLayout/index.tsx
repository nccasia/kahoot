import { Outlet } from "react-router-dom";

const RoomLayout = () => {
  return (
    <div>
      <h1>Room Layout</h1>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default RoomLayout;
