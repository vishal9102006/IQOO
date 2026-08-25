/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { FocusModeView } from './components/FocusModeView';
import { FocusDnaView } from './components/FocusDnaView';
import { AiCoachView } from './components/AiCoachView';
import { SettingsView } from './components/SettingsView';
import { SessionReviewModal } from './components/SessionReviewModal';
import { RespirationModal } from './components/RespirationModal';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="flex-1 min-w-0 pb-20 md:pb-8 overflow-y-auto">
      {activeView === 'dashboard' && <DashboardView />}
      {activeView === 'tasks' && <TasksView />}
      {activeView === 'focus' && <FocusModeView />}
      {activeView === 'focus-dna' && <FocusDnaView />}
      {activeView === 'coach' && <AiCoachView />}
      {activeView === 'settings' && <SettingsView />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row relative">
        <Navigation />
        <MainContent />
        <SessionReviewModal />
        <RespirationModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
