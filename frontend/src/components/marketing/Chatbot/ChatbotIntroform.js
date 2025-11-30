import React, { useState } from 'react';
import './Chatbot.css';
import chatIcon from '../../Assets/chatbot-icon.png';
import api from '../../services/api';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', initialMessage: '' });

  const toggle = () => setOpen(s => !s);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // backend expects /tickets/create per your setup
      await api.post('/tickets/create', form);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Unable to create ticket. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div className="hb-chat-panel" role="dialog" aria-modal="true">
          <div className="hb-chat-header">
            <div className="hb-chat-title">Hubly</div>
            <button className="hb-chat-close" onClick={toggle} aria-label="Close chat">✕</button>
          </div>

          <div className="hb-chat-body">
            {!submitted ? (
              <form className="hb-chat-form" onSubmit={submit}>
                <label className="hb-chat-label">Introduction Yourself</label>
                <input name="name" value={form.name} onChange={onChange} placeholder="Your name" required />
                <input name="phone" value={form.phone} onChange={onChange} placeholder="Your phone" required />
                <input name="email" value={form.email} onChange={onChange} placeholder="Your email" required />
                <textarea name="initialMessage" value={form.initialMessage} onChange={onChange} placeholder="How can we help?" rows="3" />
                <button className="hb-chat-submit" type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Thank You'}
                </button>
              </form>
            ) : (
              <div className="hb-chat-thanks">
                <h4>Thank you</h4>
                <p>Our team will get back to you soon.</p>
                <button onClick={() => { setOpen(false); setSubmitted(false); setForm({ name:'', email:'', phone:'', initialMessage:'' }); }}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button className="hb-fab" onClick={toggle} aria-label="Open chat">
        <img src={chatIcon} alt="chat" style={{ width: 22, height: 22 }} />
      </button>
    </>
  );
}
