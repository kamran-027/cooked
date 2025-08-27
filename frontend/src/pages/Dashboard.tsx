import AppBar from "@/components/AppBar";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <AppBar />
      <div className="h-[80%]">Main</div>
      <div className="h-[10%]">Footer</div>
    </div>
  );
};

export default Dashboard;
