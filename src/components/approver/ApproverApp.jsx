import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import ApproverDashboard from './ApproverDashboard.jsx';
import ReviewAndSign from '../hod/ReviewAndSign.jsx';
import VerifyIssue from '../hod/VerifyIssue.jsx';
import MyTeam from '../hod/MyTeam.jsx';
import TaskManagement from '../hod/TaskManagement.jsx';
import ActiveTasksLoto from '../hod/ActiveTasksLoto.jsx';
import Compliance from '../hod/Compliance.jsx';
import Instruments from '../hod/Instruments.jsx';
import ShiftCalendar from '../shared/ShiftCalendar.jsx';
import Profile from '../shared/Profile.jsx';

// Phase 9: Approver takes over everything HOD used to do besides clearance —
// on-ground verification (Step "Approval"), final closure verification, and
// team/task oversight. Departmental Clearance itself stays with HodApp.jsx.
const TITLES = {
  dashboard: 'Approver Dashboard',
  review: 'Review & Sign',
  verify: 'Closure Verification',
  myteam: 'My Team',
  shiftcalendar: 'Shift Calendar',
  taskmanagement: 'Task Management',
  activeloto: 'Active Tasks & LOTO',
  compliance: 'Compliance',
  instruments: 'Instruments',
  profile: 'Profile'
};

export default function ApproverApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
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
      case 'profile':
        return <Profile />;
      default:
        return <ApproverDashboard navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'Approver Dashboard'} />;
}
