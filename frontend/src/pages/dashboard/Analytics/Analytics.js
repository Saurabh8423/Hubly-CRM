import React, { useEffect, useState, useRef } from "react";
import "./Analytics.css";
import axios from "axios";

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler 
);

Chart.register(Filler);

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const chartRef = useRef();
  const chartInstance = useRef();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await axios.get("/api/tickets/analytics");

      // FIX: Correct response structure
      setStats({
        missedPerWeek: res.data.missedPerWeek || Array(10).fill(0),
        avgReplyMs: res.data.avgReplyMs || 0,
        resolvedPercent: res.data.resolvedPercent || 0,
        totalChats: res.data.totalChats || 0,
      });
    } catch (err) {
      console.log("Stats error", err);
    }
  };

  // ---------- RENDER MISSED CHATS CHART ----------
  useEffect(() => {
    if (!stats || !chartRef.current) return;

    const missed = stats.missedPerWeek.map(Number);
    const labels = missed.map((_, i) => `Week-${i + 1}`);

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Missed Chats",
            data: missed,
            borderColor: "green",
            backgroundColor: "rgba(0,255,0,0.15)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
          y: {
            min: 0,
            max: 25,
            ticks: { stepSize: 5 },
          },
        },
      },
    });
  }, [stats]);

  // ---------- FORMAT REPLY TIME ----------
  const formatReplyTime = (ms) => {
    if (!ms) return "0 secs";

    const sec = Math.round(ms / 1000);
    if (sec < 60) return `${sec} secs`;

    const min = Math.round(sec / 60);
    if (min < 60) return `${min} mins`;

    const hrs = Math.round(min / 60);
    return `${hrs} hrs`;
  };

  return (
    <div className="hb-analytics">
      <h2>Analytics</h2>

      {/* =================== MISSED CHATS GRAPH =================== */}
      <div className="hb-analytics-section">
        <h3 className="green-title">Missed Chats</h3>
        <canvas ref={chartRef}></canvas>
      </div>

      {/* =================== AVERAGE REPLY TIME =================== */}
      <div className="hb-analytics-box">
        <div className="box-text">
          <h4>Average Reply time</h4>
          <p>
            For highest customer satisfaction rates you should aim to reply to
            an incoming customer's message in 15 seconds or less. Quick
            responses will get you more conversations, help you earn customers
            trust and make more sales.
          </p>
        </div>
        <div className="box-value green-text">
          {stats ? formatReplyTime(stats.avgReplyMs) : "0 secs"}
        </div>
      </div>

      {/* =================== RESOLVED TICKETS CHART =================== */}
      <div className="hb-analytics-box">
        <div className="box-text">
          <h4>Resolved Tickets</h4>
          <p>
            A callback system on a website, as well as proactive invitations,
            help to attract even more customers. A separate round button for
            ordering a call with a small animation helps to motivate more
            customers to make calls.
          </p>
        </div>

        <div className="circle-progress">
          <svg width="70" height="70">
            <circle
              cx="35"
              cy="35"
              r="30"
              stroke="#e9f8ee"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="35"
              cy="35"
              r="30"
              stroke="#00c853"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${(stats?.resolvedPercent || 80) * 1.88} 188`}
              strokeLinecap="round"
            />
          </svg>
          <div className="circle-text">
            {stats ? `${stats.resolvedPercent}%` : "80%"}
          </div>
        </div>
      </div>

      {/* =================== TOTAL CHATS =================== */}
      <div className="hb-analytics-box">
        <h4>Total Chats</h4>
        <p>
          This metric shows the total number of chats for all channels for the
          selected period.
        </p>
        <div className="green-text total-chats">
          {stats ? `${stats.totalChats} Chats` : "0 Chats"}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
