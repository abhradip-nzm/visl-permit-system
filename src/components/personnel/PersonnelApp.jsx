import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import MyTasks from './MyTasks.jsx';
import TaskDetail from './TaskDetail.jsx';
import RequestTask from './RequestTask.jsx';
import PrecautionsDeclaration from './PrecautionsDeclaration.jsx';
import CriticalLiftChecklist from './CriticalLiftChecklist.jsx';
import ConfinedSpaceMonitoring from './ConfinedSpaceMonitoring.jsx';
import PermitTransfer from './PermitTransfer.jsx';
import ClosePermit from './ClosePermit.jsx';
import LotoTaskList from './LotoTaskList.jsx';
import LotoExecution from './LotoExecution.jsx';
import Inventory from './Inventory.jsx';
import Profile from '../shared/Profile.jsx';

const TITLES = {
  mytasks: 'My Tasks',
  detail: 'Task Detail',
  create: 'Request Task',
  declare: 'Precautions & Declaration',
  criticallift: 'Critical Lift Checklist',
  confinedspace: 'Confined Space Monitoring',
  transfer: 'Transfer Permit',
  closepermit: 'Close Permit',
  loto: 'LOTO',
  execution: 'LOTO Execution',
  inventory: 'Inventory',
  profile: 'Profile'
};

export default function PersonnelApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'detail':
        return <TaskDetail navigate={navigate} params={params} />;
      case 'create':
        return <RequestTask navigate={navigate} />;
      case 'declare':
        return <PrecautionsDeclaration navigate={navigate} params={params} />;
      case 'criticallift':
        return <CriticalLiftChecklist navigate={navigate} params={params} />;
      case 'confinedspace':
        return <ConfinedSpaceMonitoring navigate={navigate} params={params} />;
      case 'transfer':
        return <PermitTransfer navigate={navigate} params={params} />;
      case 'closepermit':
        return <ClosePermit navigate={navigate} params={params} />;
      case 'loto':
        return <LotoTaskList navigate={navigate} />;
      case 'execution':
        return <LotoExecution navigate={navigate} params={params} />;
      case 'inventory':
        return <Inventory navigate={navigate} />;
      case 'profile':
        return <Profile />;
      default:
        return <MyTasks navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'My Tasks'} />;
}
