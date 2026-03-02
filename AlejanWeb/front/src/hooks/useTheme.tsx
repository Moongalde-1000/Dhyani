import { ConfigProvider, ThemeConfig } from "antd";

import { createContext, ReactNode, useContext } from "react";
import { useAuth } from "./useAuth";
import { antdAdminThemeConfig, antdUserThemeConfig } from "../config";

const ThemeContext = createContext<ThemeConfig | undefined>(undefined);
interface ThemeProviderProps {
  children: ReactNode;
}
const ThemeProvider: React.FC<ThemeProviderProps>=({children}) => {
  const { currentAuth } = useAuth();
  const themeConfig = currentAuth?.user.role === 'ADMIN' ? antdAdminThemeConfig : antdUserThemeConfig;
  return (
    <>
       <ThemeContext.Provider value={themeConfig}>
        <ConfigProvider theme={themeConfig}>
          {children}
        </ConfigProvider>
        </ThemeContext.Provider>
    </>
  );
}
export const useTheme = (): ThemeConfig | undefined => useContext(ThemeContext);

export default ThemeProvider ;
