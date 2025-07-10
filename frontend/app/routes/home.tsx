import {useState, useEffect} from "react";
import type { Route } from "./+types/home";
import { ProfilePage } from "../components/profile-page";
import type { Profile } from "../types/profile";
import { MatchingBegin } from "./matching-begin";
import { useNavigate } from "react-router-dom";


 const dylan:Profile = {
    userFirstName: 'dylan',
    userLastName: "keck",
    userBio: 'new here',
    interests: ["baseball"],
    userImgUrl : null,
    userState:"New Mexico",
     userCity: "Albuquerque"
}

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login-signup");
    }
  }, [navigate]);
  return (
    <>
      <MatchingBegin />
    </>
  );
}
