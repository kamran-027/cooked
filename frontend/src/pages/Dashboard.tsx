import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import Main from "@/components/Main";
import UnAuthorizedTemplate from "@/components/UnAuthorizedTemplate";

const Dashboard = () => {
  const isAuthenticated = sessionStorage.getItem("token");

  return (
    <>
      {isAuthenticated ? (
        <div className="flex flex-col h-screen">
          <AppBar />
          <Main />
          <Footer />
        </div>
      ) : (
        <UnAuthorizedTemplate />
      )}
    </>
  );
};

export default Dashboard;
