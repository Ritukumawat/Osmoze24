"use client";

import React from "react";
import Page from "../dashBoard2/Page.jsx";
import Cookies from "js-cookie";
import UserDataService from "../Services/services.js";
import EventDataService from "../Services/event.js";
import Image from "next/image";
import "../styles/globals.css";
import Event from "./Event.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useEffect, useState } from "react";
import { UserAuth } from "../firebase/firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
const Dashboard = () => {
  const {
    userId,
    setUserId,
    users,
    setUsers,
    events,
    setEvents,
    userEvents,
    setUserEvents,
    isModalOpen,
    setIsModalOpen,
  } = UserAuth();

  const userID = Cookies.get("User");

  useEffect(() => {
    const getUserEvents = async () => {
      const userRef = doc(db, "users", userID);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const registeredEvents = userData.registeredEvents;
      const updatedEvents = [...userEvents, ...registeredEvents];
      setUserEvents(updatedEvents);
    };
    getUserEvents();
  }, []);
  // console.log(userEvents);
  // console.log(userEvents.length);
  useEffect(() => {
    const getEvent = async () => {
      const data = await EventDataService.getAllEvents();
      setEvents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getEvent();
  }, []);
  useEffect(() => {
    const getUser = async () => {
      const data = await UserDataService.getAllUser();
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUser();
  }, []);

  const url = Cookies.get("Photo");

  return (
    <>
      <div className=" font-serif flex m-0">
        <Page />

        <section className="w-4/5 h-[100vh] bg-[#86B6F6] flex flex-col my-auto justify-center">
          <div className="p-6 ">
            <div className="flex justify-between lg:flex-col items-center">
              <div className=" ml-2">
                <h1 className=" text-5xl ">Profile</h1>
              </div>

              <div className="border rounded-full h-32 w-32 mt-4">
                <Image
                  src={url}
                  alt="Image"
                  width={128}
                  height={128}
                  className="rounded-full"
                  // className=" h-32 w-32 "
                />
              </div>
              <div className="ml-14 mt-8">
                {users.map((doc, index) => {
                  if (doc.id == Cookies.get("User")) {
                    return (
                      <div key={index + 1} className="grid grid-cols-2 gap-4 ">
                        <div className="p-2 ml-10 mr-0.5 text-xl bg-[#07000B] text-[#BDE8F6] text-center rounded-md  bg-opacity-70">
                          Full Name
                        </div>
                        <div className="p-2  mr-4 text-xl bg-[#13237A] bg-opacity-70 text-[#BDE8F6] text-center rounded-md  ">
                          {doc.userName}
                        </div>
                        <div className="p-2 ml-10 mr-0.5 text-xl bg-[#07000B] text-[#BDE8F6]  text-center rounded-md  bg-opacity-70">
                          Email
                        </div>
                        <div className="p-2  mr-4 text-xl bg-[#13237A] text-[#BDE8F6] text-center rounded-md  bg-opacity-70">
                          {doc.email}
                        </div>
                        <div className="p-2 ml-10 mr-0.5 text-xl bg-[#07000B] text-[#BDE8F6]  text-center rounded-md  bg-opacity-70">
                          Contact Number
                        </div>
                        <div className="p-2  mr-4 text-xl bg-[#13237A] text-[#BDE8F6] text-center rounded-md  bg-opacity-70">
                          {doc.phone}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            {userEvents?.length > 0 ? (
              <>
                <div className="p-2 ml-10 mr-10 text-xl bg-[#07000B] text-[#BDE8F6] mt-10 mx-auto text-center">
                  <h2>Registered events</h2>
                </div>

                <div className=" flex overflow-x-scroll pb-0 hide-scroll-bar mt-14 mb-5  w-4/5 m-auto">
                  <div className="flex flex-nowrap lg:ml-16 md:ml-20 ml-10 ">
                    {events.map((doc) => {
                      if (userEvents.includes(doc.id)) {
                        return (
                          // <div className="inline-block px-3" key={doc.id}>
                          //   <div className="max-w-xs overflow-hidden rounded-xl shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                          //     {doc.name}
                          //   </div>
                          // </div>
                          <>
                            <div
                              className="inline-block mx-5 px-3 border border-gray-200/15 rounded-2xl bg-gray-200/15  w-[200px]   lg:w-11/12"
                              key={doc.id}
                            >
                              <div className=" max-w-xs overflow-hidden rounded-xl shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out h-300px w-[200px] m-auto my-4 placeholder-opacity-100 grid place-items-center lg:p-2 lg:m-4">
                                <Image
                                  className=" border rounded-2xl inline-block h-[100px] w-[200px]"
                                  src={doc.display_picture}
                                  width={300}
                                  height={300}
                                  alt="events"
                                />
                              </div>
                              <p className="text-xl text-center m-auto text-white mb-2 ">
                                {doc.name}
                              </p>
                            </div>
                          </>
                        );
                      }
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-2 ml-10 mr-10 text-xl bg-[#07000B] text-[#BDE8F6] mt-10 mx-auto text-center">
                <h2> Not registered for any events</h2>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
