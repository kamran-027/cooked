import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import Main from "@/components/Main";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <AppBar />
      <Main />
      <Footer />
    </div>
  );
};

export default Dashboard;
