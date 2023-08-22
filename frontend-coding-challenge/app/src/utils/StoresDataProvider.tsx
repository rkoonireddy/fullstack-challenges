import { createContext, useState } from "react";

import {
  StoresDataProviderProps,
  StoresDataContextType,
} from "../classBlocks/dataTypes";

const StoresDataContext = createContext<StoresDataContextType>({});

export const StoresDataProvider = ({ children }: StoresDataProviderProps) => {
  const [storesData, setStoresData] = useState(null);

  return (
    <StoresDataContext.Provider value={{ storesData, setStoresData }}>
      {children}
      {/* console.log({children}) */}
    </StoresDataContext.Provider>
  );
};

export default StoresDataContext;
