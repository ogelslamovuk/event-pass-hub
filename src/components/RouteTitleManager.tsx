import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTitleForPath } from "@/lib/pageTitles";

export default function RouteTitleManager() {
  const location = useLocation();

  useEffect(() => {
    document.title = getTitleForPath(location.pathname);
  }, [location.pathname]);

  return null;
}
