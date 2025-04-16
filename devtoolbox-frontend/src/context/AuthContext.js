import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Tạo context
const AuthContext = createContext();

// Custom hook để sử dụng auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('anonymous');
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái xác thực khi component được mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCurrentUser(null);
        setUserRole('anonymous');
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token đã hết hạn
          logout();
          return;
        }

        setCurrentUser({
          email: decodedToken.sub,
          role: decodedToken.role
        });
        setUserRole(decodedToken.role || 'user');
      } catch (error) {
        console.error('Lỗi khi giải mã token:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Hàm đăng nhập
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        const decodedToken = jwtDecode(data.token);
        
        const userRoleFromToken = decodedToken.role || 'user';
        
        setCurrentUser({
          email: decodedToken.sub,
          role: userRoleFromToken
        });
        setUserRole(userRoleFromToken);
        
        return { 
          success: true, 
          message: 'Đăng nhập thành công',
          role: userRoleFromToken
        };
      } else {
        return { 
          success: false, 
          message: data.message || 'Đăng nhập thất bại',
          needVerification: data.message === "Please verify your email before logging in!"
        };
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      return { success: false, message: 'Đã xảy ra lỗi, vui lòng thử lại sau' };
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setCurrentUser(null);
    setUserRole('anonymous');
  };

  // Hàm kiểm tra quyền truy cập
  const hasPermission = (requiredRole) => {
    console.log("Current userRole:", userRole); // Debug
    console.log("Required role:", requiredRole); // Debug
    
    // Chuyển cả hai giá trị về lowercase để so sánh không phân biệt hoa thường
    const normalizedUserRole = userRole?.toLowerCase();
    const normalizedRequiredRole = requiredRole?.toLowerCase();
    
    if (!normalizedRequiredRole) return true; // Không yêu cầu quyền cụ thể
    
    if (normalizedRequiredRole === 'anonymous') return true; // Mọi người đều có quyền anonymous
    
    if (normalizedRequiredRole === 'user') {
      return normalizedUserRole === 'user' || normalizedUserRole === 'admin';
    }
    
    if (normalizedRequiredRole === 'admin') {
      return normalizedUserRole === 'admin';
    }
    
    return false;
  };

  const value = {
    currentUser,
    userRole,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};