
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FFF5F7]">
      <div className="w-full">{children}</div>
    </div>
  );
};

export default AuthLayout;
