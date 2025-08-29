const Footer = () => {
  return (
    <footer className="bg-[#fdf3e9] text-white py-4 shadow-2xl mt-auto">
      <div className="container mx-auto px-6 text-center">
        <p className="text-gray-800 text-sm">
          &copy; {new Date().getFullYear()} Cooked. All rights reserved.
        </p>
        <p className="text-gray-800 text-sm">Kamran Khan</p>
      </div>
    </footer>
  );
};

export default Footer;
