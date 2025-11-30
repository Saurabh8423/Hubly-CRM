// src/pages/Analytics/Analytics.jsx
import React, { useEffect, useState, useRef } from "react";
import "./Analytics.css";
import axios from "axios";

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const chartRef = useRef();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await axios.get("/api/tickets/stats");
      if (res.data?.stats) setStats(res.data.stats);
    } catch (err) {
      console.error("load stats", err);
    }
  };

  // Draw a simple line for missed chats over 10 weeks - we will synthesize small sample if not present
  useEffect(() => {
    const ctx = chartRef.current;
    if (!ctx) return;
    const c = ctx.getContext("2d");
    c.clearRect(0,0,ctx.width, ctx.height);
    // simple decorative green curve (no library)
    c.beginPath();
    c.strokeStyle = "#00c853";
    c.lineWidth = 3;
    const w = ctx.width, h = ctx.height;
    const points = [12,9,14,8,10,13,6,9,16,12]; // sample shape
    for (let i=0;i<points.length;i++){
      const x = (i/(points.length-1))*(w-40)+20;
      const y = h - (points[i]/25)*(h-40) - 20;
      if(i===0) c.moveTo(x,y); else c.lineTo(x,y);
    }
    c.stroke();
  }, [stats]);

  return (
    <div className="hb-analytics">
      <h1>Analytics</h1>
      <div className="hb-analytics-chart">
        <h3 style={{color:"#00c853"}}>Missed Chats</h3>
        <canvas ref={chartRef} width={800} height={260} style={{background:"#fff",borderRadius:8}} />
      </div>

      <div className="hb-analytics-row">
        <div className="hb-analytics-box">
          <h4>Average Reply time</h4>
          <p>For highest customer satisfaction rates you should aim to reply to an incoming customer's message in 15 seconds or less. Quick responses will get you more conversations, help you earn customers trust and make more sales.</p>
          <div className="hb-big">{stats ? `${Math.round(stats.avgReplyMs/1000)} secs` : "0 secs"}</div>
        </div>

        <div className="hb-analytics-box">
          <h4>Resolved Tickets</h4>
          <p>A callback system on a website, as well as proactive invitations, help to attract even more customers. A separate round button for ordering a call with a small animation helps to motivate more customers to make calls.</p>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <div style={{width:60, height:60, borderRadius:30, border:"6px solid #e9f8ee", position:"relative"}}>
              <div style={{position:"absolute", inset:6, borderRadius:24, background:"#fff"}} />
              <div style={{position:"absolute", left:6, top:6, width:(stats ? stats.resolvedPercent : 80) + "%", height:"100%", background:"#00c853", opacity:0.9}} />
            </div>
            <div style={{fontWeight:600, color:"#00c853"}}>{stats ? `${stats.resolvedPercent}%` : "80%"}</div>
          </div>
        </div>
      </div>

      <div style={{marginTop:20}}>
        <h4>Total Chats</h4>
        <p>This metric Shows the total number of chats for all Channels for the selected the selected period</p>
        <div style={{fontSize:20,color:"#00c853", fontWeight:700}}>{stats ? `${stats.totalChats} Chats` : "0 Chats"}</div>
      </div>
    </div>
  );
};

export default Analytics;
