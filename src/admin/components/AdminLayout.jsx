import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 lg:pt-0">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
