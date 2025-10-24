import { createContext, useContext, useEffect, useState } from "react"

export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    // دالة لتنظيف الدور
    const normalizeRole = (r) =>
        (r || "user").toString().trim().toLowerCase();
    
    // دالة التحقق من حالة التوثيق الحالية
    const checkAuthStatus = async () => {
        try {
            const response = await fetch("https://restaurant-backend-tawny.vercel.app/users/verify", {
                method: "GET",
                credentials: 'include',
            })
            if (response.ok) {
                const data = await response.json()
                const role = normalizeRole(data?.user?.role);
                setUser({ ...data.user, role });
            } else {
                setUser(null)
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuthStatus()
    }, [])

const login = async (credentials) => {
  try {
    const response = await fetch("https://restaurant-backend-tawny.vercel.app/users/signin", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (response.ok) {
      const role = normalizeRole(data?.user?.role);
      setUser({ ...data.user, role });

      // ✅ رجّع المستخدم كمان
      return { success: true, user: { ...data.user, role } };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error('Login request failed:', error);
    return { success: false };
  }
};


    const register = async (userData) => {
        try {
            const response = await fetch("https://restaurant-backend-tawny.vercel.app/users/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            })
            
            if (response.ok) {
                const data = await response.json()
                const role = normalizeRole(data?.user?.role);
                setUser({ ...data.user, role }); 
                return { success: true, data };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message };
            }
        } catch (error){
            // ✅ تم التصحيح: أصبح كل شيء داخل كتلة الـ catch
            console.error('Register request failed:', error);
            return { success: false };
        }
    }

    const logout = async () => {
        try {
            const response = await fetch("https://restaurant-backend-tawny.vercel.app/users/logout", {
                method: "POST",
                credentials: 'include',
            })
            // ✅ تعديل: لا نحتاج للتحقق من response.ok، لكن يمكننا تسجيل رسالة إذا لم تكن موافق
            if (!response.ok) {
                console.warn('Logout request completed, but server response was not OK.', await response.text());
            }
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            // ✅ أهم شيء في الخروج هو تنظيف حالة المستخدم محليا، بغض النظر عن استجابة الخادم
            setUser(null)
        }
    }

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        refreshAuth: checkAuthStatus
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}
