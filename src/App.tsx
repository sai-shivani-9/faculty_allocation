import React, { useState, useEffect } from 'react';
import { User } from './types';
import { AuthService } from './services/auth';
import { InitService } from './services/initService';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { AdminLoginForm } from './components/AdminLoginForm';
import { RegisterForm } from './components/RegisterForm';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { FacultyDashboard } from './components/Dashboard/FacultyDashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin-login') {
      setIsAdminLogin(true);
    }
  }, []);

  useEffect(() => {
    const initApp = async () => {
      await InitService.initialize();

      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false);
    };

    initApp();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Update URL based on user type
    if (loggedInUser.userType === 'Admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/dashboard');
    }
  };

  const handleRegister = (registeredUser: User) => {
    setUser(registeredUser);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdminLogin(false);
    window.history.pushState({}, '', '/');
  };

  const handleSwitchToAdminLogin = () => {
    setIsAdminLogin(true);
    window.history.pushState({}, '', '/admin-login');
  };

  const handleSwitchToRegularLogin = () => {
    setIsAdminLogin(false);
    setShowLogin(true);
    window.history.pushState({}, '', '/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <img 
            src="https://www.nitj.ac.in/public/assets/images/logo_250.png" 
            alt="NIT Jalandhar Logo" 
            className="mx-auto h-16 w-16 object-contain animate-pulse"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (isAdminLogin) {
      return (
        <AdminLoginForm 
          onLogin={handleLogin} 
          onSwitchToRegularLogin={handleSwitchToRegularLogin}
        />
      );
    }

    return (
      <>
        {showLogin ? (
          <LoginForm 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setShowLogin(false)}
            onSwitchToAdminLogin={handleSwitchToAdminLogin}
          />
        ) : (
          <RegisterForm 
            onRegister={handleRegister} 
            onSwitchToLogin={() => setShowLogin(true)}
          />
        )}
      </>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      {user.userType === 'Admin' ? (
        <AdminDashboard user={user} />
      ) : (
        <FacultyDashboard user={user} />
      )}
    </Layout>
  );
}

export default App;