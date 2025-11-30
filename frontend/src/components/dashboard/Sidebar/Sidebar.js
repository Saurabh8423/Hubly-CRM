import React from "react";
import { NavLink } from "react-router-dom";

import {
  Users,
  Settings,
  User
} from "lucide-react";

import { MdOutlineMessage } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { BiBarChart } from "react-icons/bi";
import { RiRobot3Line } from "react-icons/ri";
import { IoPeopleOutline } from "react-icons/io5";

import logo from "../../../Assets/bi_cloud-haze2.png";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="logo" />
      </div>

      {/* Menu */}
      <div className="sidebar-menu">

        {/* Dashboard → Home.js */}
        <NavLink to="/dashboard" className="sidebar-item">
          <GoHome className="icon" />
          <span>Dashboard</span>
        </NavLink>

        {/* Contact Center */}
        <NavLink to="/dashboard/contact-center" className="sidebar-item">
          <MdOutlineMessage className="icon" />
          <span>Contact Center</span>
        </NavLink>

        {/* Analytics */}
        <NavLink to="/dashboard/analytics" className="sidebar-item">
          <BiBarChart className="icon" />
          <span>Analytics</span>
        </NavLink>

        {/* Chatbot */}
        <NavLink to="/dashboard/chatbot" className="sidebar-item">
          <RiRobot3Line className="icon" />
          <span>Chatbot</span>
        </NavLink>

        {/* Team */}
        <NavLink to="/dashboard/team" className="sidebar-item">
          <Users className="icon" />
          <span>Team</span>
        </NavLink>

        {/* Settings */}
        <NavLink to="/dashboard/settings" className="sidebar-item">
          <Settings className="icon" />
          <span>Settings</span>
        </NavLink>

      </div>

      {/* Bottom User */}
      <div className="sidebar-bottom">
        <User className="icon user-icon" />
      </div>
    </div>
  );
};

export default Sidebar;
