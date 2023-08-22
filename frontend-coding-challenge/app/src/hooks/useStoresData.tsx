import { useEffect, useContext } from "react";
import StoresDataContext from "../utils/StoresDataProvider";

export default function useStoresData() {
  const { setStoresData } = useContext(StoresDataContext);

  useEffect(() => {
    fetchStoresData();
  }, []);

  const fetchStoresData = async () => {
    try {
      const response = await fetch("http://localhost:3000/stores");
      const storesData = await response.json();
      if (storesData && setStoresData) {
        setStoresData(storesData);
      }
    } catch (err) {
      let message;
      if (err instanceof Error) message = err.message;
      else message = String(err);
      console.log(message);
    }
  };

  return useContext(StoresDataContext);
}
