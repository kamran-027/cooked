import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import Main from "@/components/Main";
import ShellLayout from "@/components/ShellLayout";

const Dashboard = () => {
  return (
    <ShellLayout>
      <div className="flex min-h-screen flex-col">
        <AppBar />
        <Main />
        <Footer />
      </div>
    </ShellLayout>
  );
};

export default Dashboard;
