import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import HodDashboard from './HodDashboard.jsx';
import DepartmentalClearance from './DepartmentalClearance.jsx';
import ReviewAndSign from './ReviewAndSign.jsx';
import VerifyIssue from './VerifyIssue.jsx';
import MyTeam from './MyTeam.jsx';
import TaskManagement from './TaskManagement.jsx';
import ActiveTasksLoto from './ActiveTasksLoto.jsx';
import Compliance from './Compliance.jsx';
import Instruments from './Instruments.jsx';
import ShiftCalendar from '../shared/ShiftCalendar.jsx';

const TITLES = {
  dashboard: 'HOD Dashboard',
  clearance: 'Departmental Clearance',
  review: 'Review & Sign',
  verify: 'Closure Verification',
  myteam: 'My Team',
  shiftcalendar: 'Shift Calendar',
  taskmanagement: 'Task Management',
  activeloto: 'Active Tasks & LOTO',
  compliance: 'Compliance',
  instruments: 'Instruments'
};

export default function HodApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'clearance':
        return <DepartmentalClearance navigate={navigate} params={params} />;
      case 'review':
        return <ReviewAndSign navigate={navigate} params={params} />;
      case 'verify':
        return <VerifyIssue navigate={navigate} params={params} />;
      case 'myteam':
        return <MyTeam />;
      case 'shiftcalendar':
        return <ShiftCalendar scopeLabel="Your Department" />;
      case 'taskmanagement':
        return <TaskManagement />;
      case 'activeloto':
        return <ActiveTasksLoto />;
      case 'compliance':
        return <Compliance />;
      case 'instruments':
        return <Instruments />;
      default:
        return <HodDashboard navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'HOD Dashboard'} />;
}
