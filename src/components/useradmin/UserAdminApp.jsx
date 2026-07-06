import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import UserManagement from './UserManagement.jsx';
import RoleAccess from './RoleAccess.jsx';
import TaskOverview from './TaskOverview.jsx';
import Certifications from './Certifications.jsx';
import Announcements from './Announcements.jsx';
import MasterData from './MasterData.jsx';
import ShiftCalendar from '../shared/ShiftCalendar.jsx';

const TITLES = {
  dashboard: 'Admin Dashboard',
  users: 'User Management',
  access: 'Role & Access',
  taskoverview: 'Task Overview',
  shiftcalendar: 'Shift Calendar',
  certifications: 'Certifications',
  announcements: 'Announcements',
  masterdata: 'Master Data'
};

export default function UserAdminApp() {
  function renderScreen(screen) {
    switch (screen) {
      case 'users':
        return <UserManagement />;
      case 'access':
        return <RoleAccess />;
      case 'taskoverview':
        return <TaskOverview />;
      case 'shiftcalendar':
        return <ShiftCalendar scopeLabel="All Departments" />;
      case 'certifications':
        return <Certifications />;
      case 'announcements':
        return <Announcements />;
      case 'masterdata':
        return <MasterData />;
      default:
        return <AdminDashboard />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'Admin Dashboard'} />;
}
