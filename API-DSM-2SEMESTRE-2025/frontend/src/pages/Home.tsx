import { useEffect } from "react";
import { HomeLayout } from "../components/HomeLayout"

export const Home = () => {
  useEffect(() => {
    document.title = "Newe Log";
    document.body.classList.add("home-page");
    
    return () => {
    document.body.classList.remove("home-page");
  };
  }, []);

  return (
    <HomeLayout>
    </HomeLayout>
  )
}