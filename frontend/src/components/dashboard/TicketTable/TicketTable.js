import React from "react";
import "./TicketTable.css";

const TicketTable = ({ tickets = [] }) => {
  return (
    <div className="ticket-table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length ? (
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td className={`status ${ticket.status}`}>{ticket.status}</td>
                <td>{ticket.assignedTo || "-"}</td>
                <td>{new Date(ticket.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-tickets">
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
