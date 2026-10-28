import React from 'react';
import { IEProvider, useIE } from './context/IEContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';
import { MotherOperationMaster } from './components/MotherOperationMaster';
import { GSDOperationMaster } from './components/GSDOperationMaster';
import { StyleMasterScreen } from './components/StyleMasterScreen';
import { StyleGSDMappingScreen } from './components/StyleGSDMappingScreen';
import { LineLayoutScreen } from './components/LineLayoutScreen';
import { SkillMatrixStudyScreen } from './components/SkillMatrixStudyScreen';
import { SkillMatrixReportScreen } from './components/SkillMatrixReportScreen';
import { IEDashboard } from './components/IEDashboard';
import { HRISMachineExplorer } from './components/HRISMachineExplorer';
import { Check } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentScreen, toastMessage, isAuthenticated } = useIE();

  // If user is not logged in, render the Login Screen (default admin / 123)
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Bar Contract (1 row, 3 zones) */}
      <Navbar />

      {/* Workspace Canvas: Sidebar + Viewport */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
        <Sidebar />

        <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-y-auto">
          {currentScreen === 'dashboard' && <IEDashboard />}
          {currentScreen === 'mother-ops' && <MotherOperationMaster />}
          {currentScreen === 'gsd-ops' && <GSDOperationMaster />}
          {currentScreen === 'style-master' && <StyleMasterScreen />}
          {currentScreen === 'style-mapping' && <StyleGSDMappingScreen />}
          {currentScreen === 'line-layout' && <LineLayoutScreen />}
          {currentScreen === 'skill-study' && <SkillMatrixStudyScreen />}
          {currentScreen === 'skill-report' && <SkillMatrixReportScreen />}
          {currentScreen === 'hris-machines' && <HRISMachineExplorer />}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-slate-900 bg-slate-950 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <IEProvider>
      <MainContent />
    </IEProvider>
  );
}
