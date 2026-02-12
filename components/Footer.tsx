const Footer = () => {
  return (
    <footer className="w-full bg-gray-950 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="mt-12 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
