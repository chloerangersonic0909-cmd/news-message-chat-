import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  MessageCircle, Phone, Video, Users, CircleUserRound, Search, Plus,
  Send, Image as ImageIcon, Mic, MoreHorizontal, ArrowLeft, CheckCheck,
  Settings, Bell, ShieldCheck, Clock3, CreditCard, X, Camera, Smile
} from 'lucide-react';
import './style.css';

const initialChats = [
  { id: 1, name: 'Mild 🌷', initials: 'M', color: 'pink', message: 'โอเค ไว้คุยกันนะ', time: '09:41', unread: 2, online: true },
  { id: 2, name: 'กลุ่มเพื่อนสนิท', initials: 'เพ', color: 'blue', message: 'Beam: ส่งรูปมาแล้ว 📷', time: '09:30', unread: 4, group: true },
  { id: 3, name: 'Kaito', initials: 'K', color: 'purple', message: 'ขอบคุณมาก!', time: 'เมื่อวาน', unread: 0, online: false },
  { id: 4, name: 'Nina', initials: 'N', color: 'green', message: 'เห็นข่าวนี้หรือยัง', time: 'เมื่อวาน', unread: 0, online: true },
  { id: 5, name: 'Study room', initials: '📚', color: 'orange', message: 'You: เจอกันพรุ่งนี้', time: 'จ.', unread: 0, group: true },
];

function App() {
  const [tab, setTab] = useState('แชท');
  const [chats, setChats] = useState(initialChats);
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => chats.filter(c => c.name.toLowerCase().includes(query.toLowerCase())), [chats, query]);
  const activeChat = chats.find(c => c.id === active);
  const activeMessages = messages[active] || [
    { id: 1, from: 'them', text: 'หวัดดี 😊 วันนี้เป็นยังไงบ้าง', time: '09:35' },
    { id: 2, from: 'me', text: 'สบายดีเลย แล้วเธอล่ะ', time: '09:37' },
    { id: 3, from: 'them', text: 'โอเค ไว้คุยกันนะ', time: '09:41' },
  ];

  function sendMessage(e) {
    e.preventDefault();
    if (!draft.trim() || !active) return;
    const next = [...activeMessages, { id: Date.now(), from: 'me', text: draft.trim(), time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) }];
    setMessages({ ...messages, [active]: next });
    setChats(chats.map(c => c.id === active ? { ...c, message: draft.trim(), time: 'ตอนนี้' } : c));
    setDraft('');
  }
  function actionNotice(text) {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 2800);
  }

  return <div className="app-shell">
    <header className="topbar">
      {active ? <button className="icon-btn back" onClick={() => setActive(null)} aria-label="กลับ"><ArrowLeft size={22}/></button> : <div className="brand-mark"><MessageCircle size={22} fill="currentColor"/></div>}
      <div className="brand-copy"><strong>News message chat</strong><span>{activeChat ? (activeChat.online ? '● ออนไลน์' : 'แชทส่วนตัว') : 'เชื่อมต่อทุกช่วงเวลา'}</span></div>
      {activeChat ? <div className="top-actions"><button className="icon-btn" onClick={() => actionNotice('ระบบโทรเสียงจะเปิดใช้เมื่อเชื่อมต่อบริการโทร')} aria-label="โทรเสียง"><Phone size={20}/></button><button className="icon-btn" onClick={() => actionNotice('ระบบวิดีโอคอลต้องตั้งค่า WebRTC ก่อน')} aria-label="วิดีโอคอล"><Video size={21}/></button><button className="icon-btn" onClick={() => actionNotice('ตัวเลือกเพิ่มเติมจะเพิ่มในเวอร์ชันถัดไป')} aria-label="เพิ่มเติม"><MoreHorizontal size={21}/></button></div> : <button className="icon-btn" onClick={() => setShowSettings(true)} aria-label="ตั้งค่า"><Settings size={21}/></button>}
    </header>

    {activeChat ? <section className="conversation">
      <div className="chat-person"><div className={'avatar ' + activeChat.color}>{activeChat.initials}</div><div><strong>{activeChat.name}</strong><small>{activeChat.online ? 'ออนไลน์อยู่' : 'แชทส่วนตัว'}</small></div></div>
      <div className="secure-note"><ShieldCheck size={14}/> แชทตัวอย่างบนอุปกรณ์นี้ · ยังไม่ใช่แชทออนไลน์จริง</div>
      <div className="messages">
        <div className="date-label">วันนี้</div>
        {activeMessages.map(m => <div key={m.id} className={'message-row ' + (m.from === 'me' ? 'mine' : '')}><div className="bubble">{m.text}<div className="bubble-meta">{m.time} {m.from === 'me' && <CheckCheck size={13}/>}</div></div></div>)}
      </div>
      <form className="composer" onSubmit={sendMessage}>
        <button type="button" className="icon-btn" onClick={() => actionNotice('การส่งรูปต้องเชื่อมต่อพื้นที่จัดเก็บไฟล์')} aria-label="ส่งรูป"><Plus size={23}/></button>
        <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="พิมพ์ข้อความ..." aria-label="ข้อความ" />
        {draft.trim() ? <button className="send-btn" type="submit" aria-label="ส่งข้อความ"><Send size={19}/></button> : <><button type="button" className="icon-btn" onClick={() => actionNotice('เพิ่มสติกเกอร์ได้ในเวอร์ชันถัดไป')} aria-label="อีโมจิ"><Smile size={20}/></button><button type="button" className="icon-btn" onClick={() => actionNotice('ระบบส่งเสียงต้องเชื่อมต่อบริการจัดเก็บไฟล์')} aria-label="เสียง"><Mic size={20}/></button></>}
      </form>
    </section> : <>
      <main className="main-content">
        {tab === 'แชท' && <>
          <section className="welcome-card"><div className="welcome-text"><span className="eyebrow">YOUR SPACE, YOUR PEOPLE</span><h1>คุยกันได้<br/>ทุกช่วงเวลา 💙</h1><p>พื้นที่สำหรับข้อความและคนสำคัญของคุณ</p></div><div className="welcome-icon"><MessageCircle size={44}/></div></section>
          <div className="searchbox"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาการสนทนา..." /></div>
          <div className="section-heading"><h2>ข้อความ</h2><button className="text-action" onClick={() => actionNotice('การสร้างแชทใหม่จะพร้อมใช้เมื่อมีระบบบัญชี')}>+ เริ่มแชท</button></div>
          <div className="chat-list">{filtered.map(c => <button key={c.id} className="chat-item" onClick={() => setActive(c.id)}><div className={'avatar ' + c.color}>{c.initials}{c.online && <i className="online-dot"/>}</div><div className="chat-summary"><div className="chat-title"><strong>{c.name}</strong><span>{c.time}</span></div><div className="chat-preview"><span>{c.group && <Users size={13}/>} {c.message}</span>{c.unread > 0 && <b className="unread">{c.unread}</b>}</div></div></button>)}</div>
        </>}
        {tab === 'สตอรี่' && <section className="feature-page"><div className="feature-icon"><Camera size={32}/></div><h1>สตอรี่ของคุณ</h1><p>แชร์ช่วงเวลาดี ๆ กับเพื่อนของคุณ</p><button className="primary-btn" onClick={() => actionNotice('สตอรี่ต้องเชื่อมต่อระบบอัปโหลดรูปและวิดีโอ')}>＋ เพิ่มสตอรี่</button><div className="info-panel">ฟีเจอร์สตอรี่ในขณะนี้เป็นหน้าต้นแบบ ยังไม่ได้อัปโหลดหรือแชร์จริง</div></section>}
        {tab === 'โทร' && <section className="feature-page"><div className="feature-icon"><Video size={32}/></div><h1>การโทร</h1><p>โทรเสียงและวิดีโอคอลกับเพื่อน</p><div className="call-option" onClick={() => actionNotice('ต้องตั้งค่า WebRTC และเซิร์ฟเวอร์สัญญาณก่อนโทรได้')}><Phone size={21}/><div><b>โทรด้วยเสียง</b><small>โทรหาเพื่อนแบบส่วนตัว</small></div></div><div className="call-option" onClick={() => actionNotice('ต้องตั้งค่า WebRTC และเซิร์ฟเวอร์สัญญาณก่อนโทรได้')}><Video size={21}/><div><b>วิดีโอคอล</b><small>พูดคุยแบบเห็นหน้า</small></div></div></section>}
        {tab === 'กลุ่ม' && <section className="feature-page"><div className="feature-icon"><Users size={32}/></div><h1>กลุ่มแชท</h1><p>สร้างพื้นที่พูดคุยกับหลายคน</p><button className="primary-btn" onClick={() => actionNotice('กลุ่มแชทจริงต้องมีฐานข้อมูลและระบบสมาชิก')}>＋ สร้างกลุ่ม</button><div className="info-panel">กลุ่มที่แสดงในหน้าแชทเป็นข้อมูลตัวอย่าง</div></section>}
        {tab === 'บัญชี' && <section className="feature-page account-page"><div className="profile-avatar"><CircleUserRound size={46}/></div><h1>บัญชีของคุณ</h1><p>เข้าสู่ระบบเพื่อซิงก์ข้อความทุกอุปกรณ์</p><button className="primary-btn" onClick={() => actionNotice('ระบบสมัครด้วยอีเมลต้องเชื่อมต่อระบบยืนยันตัวตน')} >สมัครด้วยอีเมล</button><button className="secondary-btn" onClick={() => actionNotice('ระบบเข้าสู่ระบบจะเปิดใช้หลังตั้งค่าฐานข้อมูล')}>เข้าสู่ระบบ</button><div className="plan-card"><div className="plan-icon"><Clock3 size={21}/></div><div><b>แพ็กเกจการใช้งาน</b><p>ใช้ฟรี 1 ชั่วโมง · 4 ชั่วโมง ราคา 4 บาท</p><small>ราคาเป็นตัวอย่าง ยังไม่มีการรับชำระเงินจริง</small></div><CreditCard size={22}/></div><div className="info-panel">การจัดการแพ็กเกจและราคาโดยแอดมินต้องใช้ระบบหลังบ้านที่ปลอดภัย</div></section>}
      </main>
      <nav className="bottom-nav">{[{name:'แชท',Icon:MessageCircle},{name:'สตอรี่',Icon:CircleUserRound},{name:'โทร',Icon:Phone},{name:'กลุ่ม',Icon:Users},{name:'บัญชี',Icon:CircleUserRound}].map(({name,Icon})=><button key={name} onClick={() => setTab(name)} className={tab===name?'nav-item selected':'nav-item'}><Icon size={21}/><span>{name}</span></button>)}</nav>
    </>}
    {showSettings && <div className="modal-backdrop" onClick={() => setShowSettings(false)}><section className="settings-modal" onClick={e => e.stopPropagation()}><div className="modal-title"><h2>ตั้งค่า</h2><button className="icon-btn" onClick={() => setShowSettings(false)}><X size={20}/></button></div><div className="setting-row"><Bell size={19}/><div><b>การแจ้งเตือน</b><small>ต้องตั้งค่า Push Notification</small></div></div><div className="setting-row"><ShieldCheck size={19}/><div><b>ความเป็นส่วนตัว</b><small>ระบบความปลอดภัยยังอยู่ระหว่างพัฒนา</small></div></div><div className="info-panel">อย่าใช้ข้อมูลสำคัญในแอปต้นแบบนี้ เพราะข้อความยังเก็บอยู่ในสถานะของหน้าเว็บเท่านั้น</div></section></div>}
    {notice && <div className="toast" role="status">{notice}</div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
