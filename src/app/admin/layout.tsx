import React, { ReactNode } from 'react';

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className='admin-layout'>
      {/* Add any layout-specific components or styling here */}
      {children}
    </div>
  );
};

export default AdminLayout;