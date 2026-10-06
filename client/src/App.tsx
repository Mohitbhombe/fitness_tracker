import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DateProvider } from './context/DateContext';
import { FitnessDataProvider } from './context/FitnessDataContext';

import { Header } from './components/common/Header';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';

import { DailyActivityPage } from './pages/DailyActivityPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { WeightPage } from './pages/WeightPage';
import { NutritionPage } from './pages/NutritionPage';
import { ExercisePage } from './pages/ExercisePage';
import { RunningPage } from './pages/RunningPage';
import { WalkingPage } from './pages/WalkingPage';
import { WaterPage } from './pages/WaterPage';
import { SleepPage } from './pages/SleepPage';
import { GoalsPage } from './pages/GoalsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DailyHistoryPage } from './pages/DailyHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('daily_activity');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage
        onSwitchToRegister={() => setAuthView('register')}
        onLoginSuccess={() => setActiveTab('daily_activity')}
      />
    ) : (
      <RegisterPage
        onSwitchToLogin={() => setAuthView('login')}
        onRegisterSuccess={() => setActiveTab('daily_activity')}
      />
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'daily_activity':
        return <DailyActivityPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'weight':
        return <WeightPage />;
      case 'nutrition':
        return <NutritionPage />;
      case 'exercise':
        return <ExercisePage />;
      case 'running_walking':
        return (
          <div className="space-y-8">
            <RunningPage />
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <WalkingPage />
            </div>
          </div>
        );
      case 'water':
        return (
          <div className="space-y-8">
            <WaterPage />
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <SleepPage />
            </div>
          </div>
        );
      case 'goals':
        return <GoalsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'history':
        return <DailyHistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DailyActivityPage />;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActiveTab()}
        </main>
      </div>

      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMoreMenu={() => setIsMobileMenuOpen(true)}
      />
    </div>
  );
};

import { ErrorBoundary } from './components/common/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <DateProvider>
            <FitnessDataProvider>
              <MainLayout />
            </FitnessDataProvider>
          </DateProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
