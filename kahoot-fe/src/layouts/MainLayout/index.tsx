import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="bg-[url('/backgrounds/bg-home.png')] bg-cover bg-center h-screen w-screen flex items-center justify-center text-white">
      <Outlet />
    </div>
  );
};
export default MainLayout;
