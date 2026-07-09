import { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('stadium_pulse_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(user?.isStaff ? 'staff' : 'fan');

  useEffect(() => {
    if (user) {
      setRole(user.isStaff ? 'staff' : 'fan');
    } else {
      setRole('fan');
    }
  }, [user]);

  const login = async (email, password, isStaff, passcode) => {
    if (isStaff) {
      if (passcode !== 'FIFA2026') {
        throw new Error('Invalid Staff Passcode');
      }
      const staffUser = { name: 'Staff Operator', email, isStaff: true };
      setUser(staffUser);
      localStorage.setItem('stadium_pulse_user', JSON.stringify(staffUser));
      return staffUser;
    } else {
      const fanUser = { name: email.split('@')[0], email, isStaff: false };
      setUser(fanUser);
      localStorage.setItem('stadium_pulse_user', JSON.stringify(fanUser));
      return fanUser;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stadium_pulse_user');
  };

  return (
    <RoleContext.Provider value={{
      user,
      role,
      login,
      logout,
      isStaff: user?.isStaff || false,
      isFan: !user?.isStaff,
      isAuthenticated: !!user
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
export default RoleContext;
