import { useState, useEffect } from "react";
import CUSTOMERS_STORAGE_ID from "../App";

/** Customer hook for keeping data synced with localStorage */

const useLocalStorage = (key, firstValue = null) => {
  let INITIAL_VALUE;
  if (key === "bamboo-customers" || key === "bamboo-carts") {
    INITIAL_VALUE = JSON.parse(localStorage.getItem(key)) || null;
  } else {
    INITIAL_VALUE = localStorage.getItem(key) || null;
  }
  const [item, setItem] = useState(INITIAL_VALUE);

  useEffect(() => {
    if (item === null) {
      localStorage.removeItem(key);
    } else if (typeof item === "object") {
      localStorage.setItem(key, JSON.stringify(item));
    } else {
      localStorage.setItem(key, item);
    }
  }, [key, item]);

  return [item, setItem];
};

export default useLocalStorage;
