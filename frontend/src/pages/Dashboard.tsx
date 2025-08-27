import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import UnAuthorizedTemplate from "@/components/UnAuthorizedTemplate";

const Dashboard = () => {
  const isAuthenticated = sessionStorage.getItem("token");

  return (
    <>
      {isAuthenticated ? (
        <div className="flex flex-col h-screen">
          <AppBar />
          <div className="h-[80%]">Main</div>
          <Footer />
        </div>
      ) : (
        <UnAuthorizedTemplate />
      )}
    </>
  );
};

export default Dashboard;
