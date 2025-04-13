import React from 'react';
import { Container } from 'react-bootstrap';
import AdminHeader from '../components/AdminHeader';
import AdminToolList from '../components/AdminToolList';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <Container fluid className="mt-4 px-4">
        <AdminToolList />
      </Container>
    </div>
  );
};

export default AdminLayout;