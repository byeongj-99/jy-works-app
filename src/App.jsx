import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB_0Y93Z0H4ZJ-N9halHzh1yBofmyqCHNk",
  authDomain: "jy-works.firebaseapp.com",
  databaseURL: "https://jy-works-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jy-works",
  storageBucket: "jy-works.firebasestorage.app",
  messagingSenderId: "1017729980232",
  appId: "1:1017729980232:web:39300a2d05c8bcaf6ac57d"
};

const firebaseApp = initializeApp(firebaseConfig);
const db_firebase = getDatabase(firebaseApp);
const DB_REF = "wpapp_v6";

const T = {
  ko:{ app:"현장 업무 관리", setup:"관리자 초기 설정", setupSub:"처음 사용하시는군요! 관리자 정보를 설정해주세요.",
    login:"이름과 초대코드를 입력하세요", name:"이름", code:"초대코드", enter:"입장하기",
    adminEnter:"👑 관리자로 바로 입장", wrongCode:"초대코드가 올바르지 않습니다",
    home:"홈", contacts:"연락망", settings:"설정",
    addSite:"+ 현장", addTeam:"+ 팀", addTask:"+ 업무", allSites:"전체", allTeams:"전체",
    overall:"전체 진척도", total:"전체", done:"완료", going:"진행중", noTask:"업무 없음",
    progress:"진척도", assignee:"담당자", none:"미지정", due:"마감일",
    status:"상태", edit:"수정", del:"삭제", save:"저장", cancel:"취소", req:" *",
    sName:"현장명", sColor:"현장색상", tName:"팀이름", tColor:"팀색상",
    taskName:"업무명", overdue:"⚠기한초과",
    adminCode:"관리자코드", memberCode:"일반코드", codes:"초대코드 관리",
    copy:"복사", copied:"복사됨!", logout:"로그아웃", admin:"관리자", member:"일반",
    translate:"AI번역", translating:"번역중...",
    sl:["대기중","진행중","검토중","완료"],
    perm:"접근권한 관리", permDesc:"직원에게 관리자 권한 부여 또는 현장 담당자를 지정합니다.",
    grantA:"관리자 권한 부여", revokeA:"권한 박탈", assignM:"담당", mgrBadge:"담당자",
    noContact:"연락처를 먼저 등록해주세요.", youLabel:"(나)", adminBadge:"관리자",
    addContact:"+ 연락처", phone:"전화번호", role:"직책", noContacts:"연락처 없음",
    codeMin:"최소 4자리", codeSame:"두 코드가 같으면 안됩니다", codeSaved:"✅ 저장됨!",
    regen:"🔄 재생성", codeEdit:"✏️수정", rand:"🔄 랜덤", reset:"⚠ 전체 초기화",
    resetConfirm:"모든 데이터를 초기화할까요?", hintQ:"관리자코드를 잊으셨나요?",
    memo:"메모", memoPh:"진척 상황, 특이사항 등 자유롭게 입력", updatedLabel:"수정됨",
  },
  my:{ app:"လုပ်ငန်းခွင် စီမံ", setup:"ပထမဆုံးတပ်ဆင်", setupSub:"ပထမဆုံးအသုံးပြုမှု!",
    login:"နာမည်နှင့် ဖိတ်ကြားကုဒ် ထည့်ပါ", name:"နာမည်", code:"ဖိတ်ကြားကုဒ်", enter:"ဝင်ရောက်ရန်",
    adminEnter:"👑 စီမံ အဖြစ် ဝင်", wrongCode:"ဖိတ်ကြားကုဒ် မှားယွင်း",
    home:"ပင်မ", contacts:"ဆက်သွယ်ရန်", settings:"ဆက်တင်",
    addSite:"+ လုပ်ငန်းခွင်", addTeam:"+ အဖွဲ့", addTask:"+ လုပ်ငန်း", allSites:"အားလုံး", allTeams:"အားလုံး",
    overall:"စုစုပေါင်း", total:"စုစုပေါင်း", done:"ပြီး", going:"လုပ်ဆောင်နေ", noTask:"လုပ်ငန်းမရှိ",
    progress:"တိုးတက်မှု", assignee:"တာဝန်ခံ", none:"မသတ်မှတ်", due:"သတ်မှတ်ရက်",
    status:"အခြေအနေ", edit:"ပြင်", del:"ဖျက်", save:"သိမ်း", cancel:"ပယ်", req:" *",
    sName:"လုပ်ငန်းခွင်အမည်", sColor:"အရောင်", tName:"အဖွဲ့အမည်", tColor:"အဖွဲ့အရောင်",
    taskName:"လုပ်ငန်းအမည်", overdue:"⚠ရက်လွန်",
    adminCode:"စီမံကုဒ်", memberCode:"ဝင်ကုဒ်", codes:"ကုဒ်စီမံ",
    copy:"ကူးယူ", copied:"ကူးယူပြီး!", logout:"ထွက်", admin:"စီမံ", member:"ဝင်",
    translate:"AI ဘာသာပြန်", translating:"ဘာသာပြန်နေ...",
    sl:["စောင့်","လုပ်ဆောင်နေ","စစ်ဆေးနေ","ပြီး"],
    perm:"ဝင်ရောက်ခွင့်", permDesc:"ဝန်ထမ်းများကို စီမံ ခွင့်ပြုနိုင်သည်",
    grantA:"စီမံ ခွင့်ပြု", revokeA:"ရုပ်သိမ်း", assignM:"တာဝန်ခံ", mgrBadge:"တာဝန်ခံ",
    noContact:"ဆက်သွယ်ရန် ဦးစွာ ထည့်ပါ", youLabel:"(ကိုယ်)", adminBadge:"စီမံ",
    addContact:"+ ဆက်သွယ်ရန်", phone:"ဖုန်း", role:"တာဝန်", noContacts:"ဆက်သွယ်ရန်မရှိ",
    codeMin:"အနည်းဆုံး ၄", codeSame:"ကုဒ်တူမဖြစ်ရ", codeSaved:"✅ သိမ်းပြီး!",
    regen:"🔄 ပြန်ဖန်တီး", codeEdit:"✏️ပြင်", rand:"🔄 ကျပန်း", reset:"⚠ ဖျက်",
    resetConfirm:"ဒေတာအားလုံး ဖျက်မည်လား?", hintQ:"ကုဒ်မေ့သွားလား?",
    memo:"မှတ်စု", memoPh:"တိုးတက်မှု အခြေအနေ မှတ်တမ်း", updatedLabel:"ပြင်ဆင်ပြီး",
  },
  uz:{ app:"Qurilish boshqaruvi", setup:"Admin sozlash", setupSub:"Birinchi foydalanish!",
    login:"Ism va taklif kodini kiriting", name:"Ism", code:"Taklif kodi", enter:"Kirish",
    adminEnter:"👑 Admin sifatida kirish", wrongCode:"Taklif kodi noto'g'ri",
    home:"Bosh", contacts:"Kontaktlar", settings:"Sozlamalar",
    addSite:"+ Ob'yekt", addTeam:"+ Jamoa", addTask:"+ Vazifa", allSites:"Barchasi", allTeams:"Barchasi",
    overall:"Umumiy", total:"Jami", done:"Tugallangan", going:"Jarayonda", noTask:"Vazifa yo'q",
    progress:"Jarayon", assignee:"Mas'ul", none:"Belgilanmagan", due:"Muddat",
    status:"Holat", edit:"Tahrir", del:"O'chirish", save:"Saqlash", cancel:"Bekor", req:" *",
    sName:"Ob'yekt nomi", sColor:"Rang", tName:"Jamoa nomi", tColor:"Jamoa rangi",
    taskName:"Vazifa nomi", overdue:"⚠Muddati o'tgan",
    adminCode:"Admin kodi", memberCode:"A'zo kodi", codes:"Kodlar",
    copy:"Nusxa", copied:"Nusxalandi!", logout:"Chiqish", admin:"Admin", member:"A'zo",
    translate:"AI tarjima", translating:"Tarjima...",
    sl:["Kutilmoqda","Jarayonda","Ko'rib chiqilmoqda","Tugallangan"],
    perm:"Kirish huquqlari", permDesc:"Xodimlarga admin huquqi yoki ob'yekt mas'ulini belgilash",
    grantA:"Admin qil", revokeA:"Huquqni ol", assignM:"Mas'ul", mgrBadge:"Mas'ul",
    noContact:"Avval kontakt qo'shing", youLabel:"(men)", adminBadge:"Admin",
    addContact:"+ Kontakt", phone:"Telefon", role:"Lavozim", noContacts:"Kontakt yo'q",
    codeMin:"Kamida 4 ta", codeSame:"Kodlar bir xil bo'lmasligi kerak", codeSaved:"✅ Saqlandi!",
    regen:"🔄 Qayta", codeEdit:"✏️Tahrir", rand:"🔄 Tasodifiy", reset:"⚠ Tozalash",
    resetConfirm:"Barcha ma'lumotlar o'chirilsinmi?", hintQ:"Kodni unutdingizmi?",
    memo:"Izoh", memoPh:"Jarayon holati va eslatmalar", updatedLabel:"Yangilandi",
  },
  vi:{ app:"Quản lý công trường", setup:"Cài đặt quản trị", setupSub:"Lần đầu sử dụng!",
    login:"Nhập tên và mã mời", name:"Tên", code:"Mã mời", enter:"Vào",
    adminEnter:"👑 Vào với tư cách quản trị", wrongCode:"Mã mời không đúng",
    home:"Trang chủ", contacts:"Danh bạ", settings:"Cài đặt",
    addSite:"+ Công trường", addTeam:"+ Nhóm", addTask:"+ Việc", allSites:"Tất cả", allTeams:"Tất cả",
    overall:"Tổng tiến độ", total:"Tổng", done:"Xong", going:"Đang làm", noTask:"Chưa có việc",
    progress:"Tiến độ", assignee:"Phụ trách", none:"Chưa giao", due:"Hạn chót",
    status:"Trạng thái", edit:"Sửa", del:"Xóa", save:"Lưu", cancel:"Hủy", req:" *",
    sName:"Tên công trường", sColor:"Màu", tName:"Tên nhóm", tColor:"Màu nhóm",
    taskName:"Tên việc", overdue:"⚠Quá hạn",
    adminCode:"Mã admin", memberCode:"Mã thành viên", codes:"Quản lý mã",
    copy:"Sao chép", copied:"Đã sao chép!", logout:"Đăng xuất", admin:"Quản trị", member:"Thành viên",
    translate:"Dịch AI", translating:"Đang dịch...",
    sl:["Chờ","Đang làm","Đang xem","Hoàn thành"],
    perm:"Quản lý quyền", permDesc:"Cấp quyền admin hoặc chỉ định người phụ trách",
    grantA:"Cấp quyền admin", revokeA:"Thu hồi", assignM:"Chỉ định", mgrBadge:"Phụ trách",
    noContact:"Hãy thêm nhân viên vào danh bạ trước", youLabel:"(tôi)", adminBadge:"Quản trị",
    addContact:"+ Liên lạc", phone:"Điện thoại", role:"Chức vụ", noContacts:"Chưa có liên lạc",
    codeMin:"Tối thiểu 4 ký tự", codeSame:"Hai mã không được giống nhau", codeSaved:"✅ Đã lưu!",
    regen:"🔄 Tạo lại", codeEdit:"✏️Sửa", rand:"🔄 Ngẫu nhiên", reset:"⚠ Xóa dữ liệu",
    resetConfirm:"Xóa tất cả dữ liệu?", hintQ:"Quên mã admin?",
    memo:"Ghi chú", memoPh:"Tình trạng tiến độ và ghi chú", updatedLabel:"Đã cập nhật",
  },
};

const COLORS=["#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#8b5cf6","#06b6d4","#84cc16","#f97316"];
const SS={0:{background:"#f1f5f9",color:"#64748b"},1:{background:"#dbeafe",color:"#1d4ed8"},2:{background:"#fef9c3",color:"#a16207"},3:{background:"#dcfce7",color:"#15803d"}};
const I={width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"inherit"};
const gId=()=>Date.now().toString(36)+Math.random().toString(36).substr(2);
const gCode=()=>Math.random().toString(36).substr(2,6).toUpperCase();
const load=()=>new Promise((resolve)=>{
  try{
    const r=ref(db_firebase,DB_REF);
    onValue(r,(snap)=>{resolve(snap.val());},{onlyOnce:true});
  }catch{resolve(null);}
});
const save=async(d)=>{
  try{await set(ref(db_firebase,DB_REF),d);}catch(e){console.error("save error",e);}
};
async function tx(text,lang,retry=true){
  if(lang==="ko")return text;
  const ln={my:"Burmese",uz:"Uzbek",vi:"Vietnamese"}[lang];
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:150,messages:[{role:"user",content:"Translate to "+ln+". Only the translation, nothing else:\n"+text}]})});
    const d=await r.json();
    return(d.content&&d.content[0]&&d.content[0].text)||text;
  }catch{if(retry){await new Promise(r=>setTimeout(r,800));return tx(text,lang,false);}return text;}
}

function Modal({onClose,children,w=420}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:14,padding:22,width:w,maxWidth:"100%",maxHeight:"88vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
        {children}
      </div>
    </div>
  );
}
function Langs({lang,set}){
  const L={ko:"한국어",my:"မြန်မာ",uz:"O'zbek",vi:"Tiếng Việt"};
  return(
    <div style={{display:"flex",gap:5,marginBottom:18,flexWrap:"wrap"}}>
      {Object.entries(L).map(([k,v])=>(
        <button key={k} onClick={()=>set(k)} style={{flex:1,padding:"6px 4px",borderRadius:7,border:"none",cursor:"pointer",fontSize:11,background:lang===k?"#6366f1":"#f1f5f9",color:lang===k?"white":"#64748b"}}>{v}</button>
      ))}
    </div>
  );
}
function Dots({color}){return(<div style={{width:10,height:10,borderRadius:"50%",background:color,display:"inline-block",marginRight:5}}/>);}

export default function App(){
  const [lang,setLang]=useState("ko");
  const t=T[lang],ko=T.ko;
  const b=(k)=>lang==="ko"?t[k]:t[k]+" ("+ko[k]+")";
  const bs=(i)=>lang==="ko"?t.sl[i]:t.sl[i]+" ("+ko.sl[i]+")";

  const [db,setDb]=useState(null);
  const [loading,setLoading]=useState(true);
  const [page,setPage]=useState("login"); // setup|login|main
  const [user,setUser]=useState(null);
  const [nav,setNav]=useState("home");
  const [sSite,setSSite]=useState("all");
  const [sTeam,setSTeam]=useState("all");
  const [modal,setModal]=useState(null); // null|site|team|task|contact
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState({});
  const [txCache,setTxCache]=useState({});
  const [txing,setTxing]=useState({});
  const [lName,setLName]=useState("");
  const [lCode,setLCode]=useState("");
  const [lErr,setLErr]=useState("");
  const [sName,setSName]=useState("");
  const [sAC,setSAC]=useState(()=>gCode());
  const [sMC,setSMC]=useState(()=>gCode());
  const [sErr,setSErr]=useState("");
  const [hint,setHint]=useState(false);
  const [logoTap,setLogoTap]=useState(0);
  const [showAdminBtn,setShowAdminBtn]=useState(false);
  const [eA,setEA]=useState("");
  const [eM,setEM]=useState("");
  const [edA,setEdA]=useState(false);
  const [edM,setEdM]=useState(false);
  const [cMsg,setCMsg]=useState("");
  const [cpd,setCpd]=useState("");

  useEffect(()=>{(async()=>{const d=await load();if(!d)setPage("setup");else{setDb(d);setPage("login");}setLoading(false);})();},[]);
  useEffect(()=>{
    if(!user)return;
    const r=ref(db_firebase,DB_REF);
    const unsub=onValue(r,(snap)=>{
      if(window._sv)return;
      const d=snap.val();
      if(d)setDb(d);
    });
    return()=>unsub();
  },[user]);
  useEffect(()=>{setTxCache({});},[lang]);
  useEffect(()=>{if(nav==="settings"&&db){setEA(db.adminCode);setEM(db.memberCode);}},[nav]);

  const upd=async(nd)=>{setDb(nd);window._sv=true;try{await save(nd);}catch{await new Promise(r=>setTimeout(r,800));try{await save(nd);}catch{}}finally{setTimeout(()=>{window._sv=false;},1500);}};
  const isAdm=()=>user&&(user.role==="admin"||(db&&(db.admins||[]).includes(user.name)));
  const isMgr=(sid)=>db&&(db.siteManagers||{})[sid]===user.name;
  const canEdit=(task)=>isAdm()||isMgr(task.siteId)||(task.assignee===user.name);
  const openModal=(m,id=null,f={})=>{setModal(m);setEditId(id);setForm(f);};
  const closeModal=()=>{setModal(null);setEditId(null);setForm({});};
  const showMsg=(m)=>{setCMsg(m);setTimeout(()=>setCMsg(""),2500);};

  const handleSetup=async()=>{
    if(!sName.trim()){setSErr("이름 입력");return;}
    const a=sAC.trim().toUpperCase(),m=sMC.trim().toUpperCase();
    if(a.length<4||m.length<4){setSErr(t.codeMin);return;}
    if(a===m){setSErr(t.codeSame);return;}
    const d={adminCode:a,memberCode:m,admins:[],siteManagers:{},
      sites:[{id:"s1",name:"1공장",color:"#6366f1"},{id:"s2",name:"2공장",color:"#ec4899"},{id:"s3",name:"현장A",color:"#f59e0b"}],
      teams:[{id:"t1",name:"시공팀",color:"#10b981",siteId:"s1"},{id:"t2",name:"전기팀",color:"#3b82f6",siteId:"s1"},{id:"t3",name:"설비팀",color:"#8b5cf6",siteId:"s2"}],
      tasks:[],contacts:[]};
    await save(d);setDb(d);setUser({name:sName.trim(),role:"admin"});setPage("main");
  };

  const handleLogin=()=>{
    if(!lName.trim()){setLErr("이름 입력");return;}
    const c=lCode.trim().toUpperCase(),nm=lName.trim();
    if(c===db.adminCode){setUser({name:nm,role:"admin"});setPage("main");}
    else if(c===db.memberCode){setUser({name:nm,role:(db.admins||[]).includes(nm)?"admin":"member"});setPage("main");}
    else setLErr(t.wrongCode);
  };

  const doTx=async(task)=>{
    const k=task.id+"_"+lang;
    if(txCache[k]||txing[task.id])return;
    setTxing(p=>({...p,[task.id]:true}));
    const r=await tx(task.title,lang);
    setTxCache(p=>({...p,[k]:r}));
    setTxing(p=>({...p,[task.id]:false}));
  };

  const saveSite=async()=>{
    if(!form.name||!form.name.trim())return;
    const color=form.color||"#6366f1";
    const sites=editId?db.sites.map(s=>s.id===editId?{...s,name:form.name,color}:s):[...db.sites,{id:gId(),name:form.name,color}];
    await upd({...db,sites});closeModal();
  };
  const delSite=async(id)=>{
    const sm={...(db.siteManagers||{})};delete sm[id];
    await upd({...db,sites:db.sites.filter(s=>s.id!==id),teams:db.teams.filter(tm=>tm.siteId!==id),tasks:db.tasks.filter(tk=>tk.siteId!==id),siteManagers:sm});
    if(sSite===id){setSSite("all");setSTeam("all");}
  };
  const saveTeam=async()=>{
    if(!form.name||!form.name.trim())return;
    const color=form.color||"#6366f1";
    const siteId=form.siteId||sSite;
    const teams=editId?db.teams.map(tm=>tm.id===editId?{...tm,name:form.name,color,siteId}:tm):[...db.teams,{id:gId(),name:form.name,color,siteId}];
    await upd({...db,teams});closeModal();
  };
  const delTeam=async(id)=>{
    await upd({...db,teams:db.teams.filter(tm=>tm.id!==id),tasks:db.tasks.filter(tk=>tk.teamId!==id)});
    if(sTeam===id)setSTeam("all");
  };
  const saveTask=async()=>{
    if(!form.title||!form.title.trim())return;
    const now=new Date().toLocaleString("ko-KR",{year:"2-digit",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});
    const tasks=editId?db.tasks.map(tk=>tk.id===editId?{...form,id:editId,updatedAt:now}:tk):[...db.tasks,{...form,id:gId(),updatedAt:now}];
    await upd({...db,tasks});closeModal();
  };
  const delTask=async(id)=>upd({...db,tasks:db.tasks.filter(tk=>tk.id!==id)});
  const saveContact=async()=>{
    if(!form.name||!form.name.trim())return;
    const contacts=editId?(db.contacts||[]).map(c=>c.id===editId?{...form,id:editId}:c):[...(db.contacts||[]),{...form,id:gId()}];
    await upd({...db,contacts});closeModal();
  };
  const delContact=async(id)=>upd({...db,contacts:(db.contacts||[]).filter(c=>c.id!==id)});
  const grantAdm=async(name)=>upd({...db,admins:[...(db.admins||[]).filter(x=>x!==name),name]});
  const revokeAdm=async(name)=>upd({...db,admins:(db.admins||[]).filter(x=>x!==name)});
  const assignMgr=async(sid,name)=>upd({...db,siteManagers:{...(db.siteManagers||{}),[sid]:name}});
  const removeMgr=async(sid)=>{const sm={...(db.siteManagers||{})};delete sm[sid];upd({...db,siteManagers:sm});};
  const saveCode=async(type)=>{
    const val=(type==="admin"?eA:eM).trim().toUpperCase();
    if(val.length<4){showMsg(t.codeMin);return;}
    if(type==="admin"&&val===db.memberCode){showMsg(t.codeSame);return;}
    if(type==="member"&&val===db.adminCode){showMsg(t.codeSame);return;}
    await upd({...db,...(type==="admin"?{adminCode:val}:{memberCode:val})});
    if(type==="admin"){setEA(val);setEdA(false);}else{setEM(val);setEdM(false);}
    showMsg(t.codeSaved);
  };

  if(loading)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><div style={{width:32,height:32,border:"3px solid #e2e8f0",borderTop:"3px solid #6366f1",borderRadius:"50%",animation:"sp 1s linear infinite"}}/><style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style></div>);

  if(page==="setup")return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1e293b,#334155)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:14,padding:28,width:420,maxWidth:"100%"}}>
        <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:36}}>⚙️</div><div style={{fontSize:18,fontWeight:800}}>{t.setup}</div><div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>{t.setupSub}</div></div>
        <Langs lang={lang} set={setLang}/>
        <label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4}}>👤 {t.name}{t.req}</label>
        <input value={sName} onChange={e=>setSName(e.target.value)} style={{...I,marginBottom:12}}/>
        {[{l:"👑 "+t.adminCode,v:sAC,s:setSAC},{l:"🪪 "+t.memberCode,v:sMC,s:setSMC}].map(f=>(
          <div key={f.l} style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4}}>{f.l}{t.req}</label>
            <div style={{display:"flex",gap:6}}><input value={f.v} onChange={e=>f.s(e.target.value.toUpperCase())} style={{...I,flex:1,fontFamily:"monospace",letterSpacing:3,fontWeight:800}}/><button onClick={()=>f.s(gCode())} style={{padding:"10px 10px",borderRadius:7,border:"1px solid #e2e8f0",background:"#f8fafc",cursor:"pointer",fontSize:11}}>{t.rand}</button></div>
          </div>
        ))}
        {sErr&&<div style={{color:"#ef4444",fontSize:12,marginBottom:10}}>{sErr}</div>}
        <button onClick={handleSetup} style={{width:"100%",padding:13,borderRadius:9,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,marginTop:4}}>설정 완료 & 시작</button>
      </div>
    </div>
  );

  if(page==="login")return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1e293b,#334155)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:14,padding:28,width:380,maxWidth:"100%"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:36,cursor:"default",userSelect:"none"}} onClick={()=>{const next=logoTap+1;setLogoTap(next);if(next>=5){setShowAdminBtn(true);setLogoTap(0);}}}>🏗️</div>
          <div style={{fontSize:18,fontWeight:800}}>{t.app}</div>
          <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>{t.login}</div>
        </div>
        <Langs lang={lang} set={setLang}/>
        <label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4}}>{t.name}{t.req}</label>
        <input value={lName} onChange={e=>{setLName(e.target.value);setLErr("");}} style={{...I,marginBottom:10}}/>
        {showAdminBtn&&(
          <button onClick={()=>{if(!lName.trim()){setLErr("이름 입력");return;}setUser({name:lName.trim(),role:"admin"});setPage("main");setShowAdminBtn(false);}} style={{width:"100%",padding:10,borderRadius:8,border:"2px solid #f59e0b",background:"#fffbeb",color:"#92400e",cursor:"pointer",fontSize:12,fontWeight:700,marginBottom:10}}>{t.adminEnter}</button>
        )}

        <label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4}}>{t.code}</label>
        <input value={lCode} onChange={e=>{setLCode(e.target.value.toUpperCase());setLErr("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{...I,fontFamily:"monospace",letterSpacing:3,fontWeight:800,marginBottom:4}}/>
        {lErr&&<div style={{color:"#ef4444",fontSize:12,marginBottom:6}}>{lErr}</div>}
        <button onClick={handleLogin} style={{width:"100%",padding:12,borderRadius:9,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,marginTop:6}}>{t.enter}</button>
        <div style={{marginTop:14,textAlign:"center"}}>
          <button onClick={()=>setHint(p=>!p)} style={{background:"none",border:"none",color:"#94a3b8",fontSize:11,cursor:"pointer",textDecoration:"underline"}}>{t.hintQ}</button>
          {hint&&db&&(
            <div style={{marginTop:10,padding:"10px 14px",borderRadius:9,background:"#fef9c3",border:"1px solid #fde68a"}}>
              <div style={{display:"flex",gap:20,justifyContent:"center",marginBottom:8}}>
                {[{l:"👑 관리자",v:db.adminCode},{l:"🪪 일반",v:db.memberCode}].map(x=>(
                  <div key={x.l} style={{textAlign:"center"}}><div style={{fontSize:10,color:"#92400e"}}>{x.l}</div><div style={{fontFamily:"monospace",fontWeight:800,fontSize:16,letterSpacing:3}}>{x.v}</div></div>
                ))}
              </div>
              <button onClick={async()=>{if(!window.confirm(t.resetConfirm))return;try{await remove(ref(db_firebase,DB_REF));}catch{}setDb(null);setUser(null);setPage("setup");setSName("");setSAC(gCode());setSMC(gCode());}} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #fca5a5",background:"#fff",cursor:"pointer",fontSize:11,color:"#ef4444"}}>{t.reset}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── MAIN ──
  const contacts=db.contacts||[];
  const sTeams=db.teams.filter(tm=>tm.siteId===sSite);
  const getSite=(id)=>db.sites.find(s=>s.id===id);
  const getTeam=(id)=>db.teams.find(tm=>tm.id===id);
  const filtered=db.tasks.filter(tk=>(sSite==="all"||tk.siteId===sSite)&&(sTeam==="all"||tk.teamId===sTeam));
  const sPct=(sid)=>{const ts=db.tasks.filter(tk=>tk.siteId===sid);return ts.length?Math.round(ts.reduce((s,tk)=>s+tk.progress,0)/ts.length):0;};
  const sCnt=(sid)=>({total:db.tasks.filter(tk=>tk.siteId===sid).length,done:db.tasks.filter(tk=>tk.siteId===sid&&tk.status===3).length});
  const ovPct=db.tasks.length?Math.round(db.tasks.reduce((s,tk)=>s+tk.progress,0)/db.tasks.length):0;
  const isOD=(d)=>d&&new Date(d)<new Date();

  return(
    <div style={{fontFamily:"system-ui,sans-serif",minHeight:"100vh",background:"#f0f4f8",paddingBottom:68}}>
      <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
      <div style={{background:"linear-gradient(135deg,#1e293b,#334155)",padding:"11px 14px",color:"#fff",position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <div><div style={{fontSize:15,fontWeight:700}}>🏗️ {t.app}</div></div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <select value={lang} onChange={e=>setLang(e.target.value)} style={{padding:"3px 6px",borderRadius:6,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:"#fff",cursor:"pointer",fontSize:11}}>
              {Object.entries({ko:"한국어",my:"မြန်မာ",uz:"O'zbek",vi:"Tiếng Việt"}).map(([k,v])=><option key={k} value={k} style={{color:"#1e293b"}}>{v}</option>)}
            </select>
            <div style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:"rgba(255,255,255,0.1)"}}>{user.name} · <span style={{color:isAdm()?"#fbbf24":"#a5f3fc"}}>{isAdm()?t.admin:t.member}</span></div>
            <button onClick={()=>{setUser(null);setPage("login");setLName("");setLCode("");setNav("home");setSSite("all");setSTeam("all");}} style={{padding:"3px 8px",borderRadius:6,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.65)",cursor:"pointer",fontSize:11}}>{b("logout")}</button>
          </div>
        </div>
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",zIndex:100}}>
        {[{id:"home",ic:"🏠",lb:t.home},{id:"contacts",ic:"📋",lb:t.contacts},{id:"settings",ic:"⚙️",lb:t.settings}].map(n=>(
          <button key={n.id} onClick={()=>setNav(n.id)} style={{flex:1,padding:"8px 4px 6px",border:"none",background:"none",cursor:"pointer",color:nav===n.id?"#6366f1":"#94a3b8",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
            <span style={{fontSize:18}}>{n.ic}</span>
            <span style={{fontSize:10,fontWeight:nav===n.id?700:400}}>{n.lb}</span>
            {nav===n.id&&<div style={{width:16,height:2,background:"#6366f1",borderRadius:99}}/>}
          </button>
        ))}
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"12px 10px"}}>

        {nav==="home"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
              <span style={{fontSize:11,fontWeight:700,color:"#64748b"}}>📍 작업환경 선택</span>
              <div style={{display:"flex",gap:5}}>
                {isAdm()&&<button onClick={()=>openModal("site",null,{name:"",color:"#6366f1"})} style={{padding:"4px 9px",borderRadius:6,border:"none",background:"#6366f1",color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600}}>{b("addSite")}</button>}
                <button onClick={()=>{const ds=sSite!=="all"?sSite:(db.sites[0]&&db.sites[0].id)||"";const dt=(sTeam!=="all"?sTeam:null)||(db.teams.find(tm=>tm.siteId===ds)&&db.teams.find(tm=>tm.siteId===ds).id)||"";openModal("task",null,{siteId:ds,teamId:dt,title:"",assignee:user.name,status:0,progress:0,dueDate:""});}} style={{padding:"4px 9px",borderRadius:6,border:"none",background:"#10b981",color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600}}>{b("addTask")}</button>
              </div>
            </div>

            <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:5,marginBottom:10,scrollbarWidth:"thin"}}>
              <div onClick={()=>{setSSite("all");setSTeam("all");}} style={{flexShrink:0,minWidth:76,padding:"9px 12px",borderRadius:9,cursor:"pointer",textAlign:"center",background:sSite==="all"?"#1e293b":"#fff",color:sSite==="all"?"#fff":"#475569",border:sSite==="all"?"none":"1px solid #e2e8f0"}}>
                <div style={{fontSize:11,fontWeight:700}}>{b("allSites")}</div>
                <div style={{fontSize:10,opacity:0.7,marginTop:1}}>{db.tasks.length}건</div>
              </div>
              {db.sites.map(site=>{
                const sel=sSite===site.id;
                const sc=sCnt(site.id);
                return(
                  <div key={site.id} style={{flexShrink:0,minWidth:110,padding:"9px 11px",borderRadius:9,cursor:"pointer",position:"relative",background:sel?site.color:"#fff",color:sel?"#fff":"#1e293b",border:"2px solid "+(sel?site.color:"#e2e8f0")}}>
                    <div onClick={()=>{setSSite(sel?"all":site.id);setSTeam("all");}}>
                      <div style={{fontSize:11,fontWeight:700,paddingRight:28}}>
                        {lang!=="ko"&&txCache["site_"+site.id+"_"+lang]?txCache["site_"+site.id+"_"+lang]:site.name}
                        {lang!=="ko"&&!txCache["site_"+site.id+"_"+lang]&&<span style={{fontSize:9,color:sel?"rgba(255,255,255,0.6)":"#94a3b8",marginLeft:3,cursor:"pointer"}} onClick={e=>{e.stopPropagation();(async()=>{const r=await tx(site.name,lang);setTxCache(p=>({...p,["site_"+site.id+"_"+lang]:r}));})();}}>[번역]</span>}
                      </div>
                      <div style={{fontSize:10,opacity:0.75,marginTop:1}}>{sc.total}건·완료{sc.done}</div>
                      <div style={{marginTop:4,height:3,background:"rgba(0,0,0,0.1)",borderRadius:99}}><div style={{height:"100%",width:sPct(site.id)+"%",background:sel?"rgba(255,255,255,0.85)":site.color,borderRadius:99}}/></div>
                      <div style={{fontSize:10,marginTop:1,opacity:0.7}}>{sPct(site.id)}%</div>
                    </div>
                    {isAdm()&&(
                      <div style={{position:"absolute",top:4,right:4,display:"flex"}}>
                        <button onClick={e=>{e.stopPropagation();openModal("site",site.id,{name:site.name,color:site.color});}} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,padding:"1px",opacity:0.8}}>✏️</button>
                        <button onClick={e=>{e.stopPropagation();delSite(site.id);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,lineHeight:1,padding:"1px",opacity:0.6,color:sel?"#fff":"#64748b"}}>×</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {sSite!=="all"&&(
              <div style={{marginBottom:9}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontSize:10,fontWeight:600,color:"#94a3b8"}}>🔧 작업팀 선택</span>
                  {isAdm()&&<button onClick={()=>openModal("team",null,{name:"",color:"#6366f1",siteId:sSite})} style={{padding:"3px 7px",borderRadius:6,border:"none",background:"#6366f1",color:"#fff",cursor:"pointer",fontSize:10,fontWeight:600}}>{b("addTeam")}</button>}
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  <button onClick={()=>setSTeam("all")} style={{padding:"3px 10px",borderRadius:99,border:"none",cursor:"pointer",fontSize:10,background:sTeam==="all"?"#475569":"#e2e8f0",color:sTeam==="all"?"#fff":"#475569"}}>{b("allTeams")}</button>
                  {sTeams.map(tm=>(
                    <div key={tm.id} style={{display:"flex",alignItems:"center",gap:1}}>
                      <button onClick={()=>setSTeam(sTeam===tm.id?"all":tm.id)} style={{padding:"3px 10px",borderRadius:99,border:"none",cursor:"pointer",fontSize:10,background:sTeam===tm.id?tm.color:"#e2e8f0",color:sTeam===tm.id?"#fff":"#475569"}}>{tm.name}</button>
                      {isAdm()&&<><button onClick={()=>openModal("team",tm.id,{name:tm.name,color:tm.color,siteId:tm.siteId})} style={{background:"none",border:"none",cursor:"pointer",fontSize:9,color:"#94a3b8",padding:"0 1px"}}>✏️</button><button onClick={()=>delTeam(tm.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#cbd5e1",padding:"0 1px",lineHeight:1}}>×</button></>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{background:"#fff",borderRadius:9,padding:"9px 12px",marginBottom:9}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:"#64748b"}}>{b("overall")}</span><span style={{fontSize:13,fontWeight:700}}>{ovPct}%</span></div>
              <div style={{height:5,background:"#f1f5f9",borderRadius:99}}><div style={{height:"100%",width:ovPct+"%",background:"linear-gradient(90deg,#6366f1,#a855f7)",borderRadius:99}}/></div>
              <div style={{display:"flex",gap:10,marginTop:4,fontSize:10,color:"#94a3b8"}}>
                <span>{b("total")} {db.tasks.length}</span>
                <span>{b("done")} {db.tasks.filter(tk=>tk.status===3).length}</span>
                <span>{b("going")} {db.tasks.filter(tk=>tk.status===1).length}</span>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {filtered.length===0&&<div style={{textAlign:"center",padding:28,color:"#94a3b8",background:"#fff",borderRadius:9}}>{b("noTask")}</div>}
              {filtered.map(task=>{
                const site=getSite(task.siteId);
                const team=getTeam(task.teamId);
                const ss=SS[task.status]||SS[0];
                const od=isOD(task.dueDate)&&task.status!==3;
                const editable=canEdit(task);
                const txK=task.id+"_"+lang;
                const txT=txCache[txK];
                return(
                  <div key={task.id} style={{background:"#fff",borderRadius:9,padding:"10px 12px",borderLeft:"3px solid "+(team?team.color:site?site.color:"#ccc")}}>
                    <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"flex-start"}}>
                      <div style={{flex:1,minWidth:120}}>
                        <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",marginBottom:2}}>
                          <span style={{fontWeight:600,fontSize:12}}>
                            {txing[task.id]?<span style={{color:"#94a3b8",fontSize:10}}>{t.translating}</span>:lang!=="ko"&&txT?<span>{txT}<span style={{color:"#94a3b8",fontSize:10,marginLeft:4}}>({task.title})</span></span>:task.title}
                          </span>
                          {site&&<span style={{fontSize:9,color:site.color,background:site.color+"18",padding:"1px 5px",borderRadius:99}}>{site.name}</span>}
                          {team&&<span style={{fontSize:9,color:team.color,background:team.color+"18",padding:"1px 5px",borderRadius:99}}>{team.name}</span>}
                          {od&&<span style={{fontSize:9,color:"#ef4444",background:"#fef2f2",padding:"1px 5px",borderRadius:99}}>{b("overdue")}</span>}
                          {lang!=="ko"&&!txT&&!txing[task.id]&&<button onClick={()=>doTx(task)} style={{fontSize:9,padding:"1px 5px",borderRadius:99,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",color:"#6366f1"}}>{t.translate}</button>}
                        </div>
                        <div style={{fontSize:10,color:"#94a3b8"}}>
                          👤 {task.assignee||t.none}{task.dueDate?" · 📅 "+task.dueDate:""}
                          {task.updatedAt&&<span style={{marginLeft:4,color:"#c4b5fd"}}>· 🕐 {task.updatedAt}</span>}
                        </div>
                        {task.memo&&<div style={{fontSize:10,color:"#64748b",marginTop:2,background:"#f8fafc",borderRadius:5,padding:"3px 6px"}}>📝 {task.memo}</div>}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <div style={{width:90}}>
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#94a3b8",marginBottom:1}}><span>{b("progress")}</span><span style={{fontWeight:700,color:"#475569"}}>{task.progress}%</span></div>
                          <input type="range" min={0} max={100} value={task.progress} disabled={!editable} onChange={e=>editable&&upd({...db,tasks:db.tasks.map(tk=>tk.id===task.id?{...tk,progress:Number(e.target.value),updatedAt:new Date().toLocaleString("ko-KR",{year:"2-digit",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}:tk)})} style={{width:"100%",accentColor:team?team.color:site?site.color:"#6366f1",cursor:editable?"pointer":"not-allowed"}}/>
                        </div>
                        <select value={task.status} disabled={!editable} onChange={e=>editable&&(()=>{const si=Number(e.target.value);const p=si===3?100:si===0?0:undefined;upd({...db,tasks:db.tasks.map(tk=>tk.id===task.id?{...tk,status:si,...(p!==undefined?{progress:p}:{})}:tk)});})()}
                          style={{padding:"2px 5px",borderRadius:6,border:"none",fontSize:9,fontWeight:600,...ss,cursor:editable?"pointer":"not-allowed"}}>
                          {t.sl.map((s,i)=><option key={i} value={i}>{bs(i)}</option>)}
                        </select>
                        {editable&&(
                          <div style={{display:"flex",gap:3}}>
                            <button onClick={()=>openModal("task",task.id,{...task})} style={{padding:"2px 7px",borderRadius:5,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:10,color:"#475569"}}>{b("edit")}</button>
                            {isAdm()&&<button onClick={()=>delTask(task.id)} style={{padding:"2px 7px",borderRadius:5,border:"none",background:"#fef2f2",cursor:"pointer",fontSize:10,color:"#ef4444"}}>{b("del")}</button>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {nav==="contacts"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700}}>{b("contacts")}</div>
              {isAdm()&&<button onClick={()=>openModal("contact",null,{name:"",phone:"",role:""})} style={{padding:"5px 12px",borderRadius:7,border:"none",background:"#6366f1",color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600}}>{b("addContact")}</button>}
            </div>
            {contacts.length===0?<div style={{textAlign:"center",padding:36,color:"#94a3b8",background:"#fff",borderRadius:9}}>{b("noContacts")}</div>:(
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {contacts.map(c=>{
                  const isA=(db.admins||[]).includes(c.name);
                  const mgs=db.sites.filter(s=>(db.siteManagers||{})[s.id]===c.name);
                  return(
                    <div key={c.id} style={{background:"#fff",borderRadius:9,padding:"11px 13px",display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:isA?"#fbbf24":"#6366f1",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14,flexShrink:0}}>{c.name[0]}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                          <span style={{fontWeight:600,fontSize:12}}>{c.name}</span>
                          {c.name===user.name&&<span style={{fontSize:9,color:"#6366f1"}}>{t.youLabel}</span>}
                          {isA&&<span style={{fontSize:9,background:"#fef3c7",color:"#92400e",padding:"1px 5px",borderRadius:99}}>👑 {t.adminBadge}</span>}
                          {mgs.map(s=><span key={s.id} style={{fontSize:9,background:s.color+"18",color:s.color,padding:"1px 5px",borderRadius:99}}>📍 {s.name}</span>)}
                        </div>
                        <div style={{fontSize:10,color:"#94a3b8",marginTop:1}}>
                          {c.role&&<span>{c.role}</span>}{c.role&&c.phone&&<span> · </span>}
                          {c.phone&&<a href={"tel:"+c.phone} style={{color:"#6366f1",textDecoration:"none"}}>📞 {c.phone}</a>}
                        </div>
                      </div>
                      {isAdm()&&(
                        <div style={{display:"flex",gap:3}}>
                          <button onClick={()=>openModal("contact",c.id,{name:c.name,phone:c.phone||"",role:c.role||""})} style={{padding:"3px 7px",borderRadius:5,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:10}}>{b("edit")}</button>
                          <button onClick={()=>delContact(c.id)} style={{padding:"3px 7px",borderRadius:5,border:"none",background:"#fef2f2",cursor:"pointer",fontSize:10,color:"#ef4444"}}>{b("del")}</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {nav==="settings"&&(
          <div>
            <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>⚙️ {b("settings")}</div>
            <div style={{background:"#fff",borderRadius:10,padding:16,marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:700,marginBottom:4}}>🔐 {b("perm")}</div>
              <div style={{fontSize:10,color:"#94a3b8",marginBottom:12}}>{t.permDesc}</div>
              {contacts.length===0?<div style={{fontSize:11,color:"#94a3b8",textAlign:"center",padding:10,background:"#f8fafc",borderRadius:7}}>{t.noContact}</div>:contacts.map(c=>{
                const isA=(db.admins||[]).includes(c.name);
                const isMe=c.name===user.name;
                return(
                  <div key={c.id} style={{marginBottom:8,padding:"10px 12px",borderRadius:8,background:"#f8fafc",border:"1px solid #e9ecef"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:isAdm()&&!isMe?8:0}}>
                      <div style={{width:30,height:30,borderRadius:"50%",background:isA?"#fbbf24":"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12}}>{c.name[0]}</div>
                      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{c.name}{isMe&&<span style={{marginLeft:4,fontSize:9,color:"#6366f1"}}>{t.youLabel}</span>}</div><div style={{fontSize:10,color:"#94a3b8"}}>{c.role||""}</div></div>
                      <div style={{fontSize:10,fontWeight:600,color:isA?"#d97706":"#94a3b8"}}>{isA?"👑 "+t.adminBadge:"일반"}</div>
                    </div>
                    {isAdm()&&!isMe&&(
                      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                        {isA?<button onClick={()=>revokeAdm(c.name)} style={{padding:"3px 8px",borderRadius:6,border:"1px solid #fca5a5",background:"#fff",cursor:"pointer",fontSize:10,color:"#ef4444"}}>{t.revokeA}</button>:<button onClick={()=>grantAdm(c.name)} style={{padding:"3px 8px",borderRadius:6,border:"none",background:"#fef3c7",cursor:"pointer",fontSize:10,color:"#92400e",fontWeight:600}}>{t.grantA}</button>}
                        {db.sites.map(site=>{
                          const cur=(db.siteManagers||{})[site.id]===c.name;
                          return(<button key={site.id} onClick={()=>cur?removeMgr(site.id):assignMgr(site.id,c.name)} style={{padding:"3px 8px",borderRadius:6,cursor:"pointer",fontSize:10,border:"1px solid "+(cur?site.color+"60":"#e2e8f0"),background:cur?site.color+"18":"#fff",color:cur?site.color:"#64748b",fontWeight:cur?600:400}}>{cur?"✓ ":"📍 "}{site.name}{cur?" "+t.mgrBadge:""}</button>);
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isAdm()&&(
              <div style={{background:"#fff",borderRadius:10,padding:16,marginBottom:10}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>🔑 {b("codes")}</div>
                {[{lb:"👑 "+t.adminCode,val:eA,setV:setEA,ed:edA,setEd:setEdA,key:"admin"},{lb:"🪪 "+t.memberCode,val:eM,setV:setEM,ed:edM,setEd:setEdM,key:"member"}].map(f=>(
                  <div key={f.key} style={{background:"#f8fafc",borderRadius:8,padding:12,marginBottom:8}}>
                    <div style={{fontSize:10,color:"#64748b",fontWeight:600,marginBottom:6}}>{f.lb}</div>
                    {f.ed?(
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <input value={f.val} onChange={e=>f.setV(e.target.value.toUpperCase())} autoFocus onKeyDown={e=>e.key==="Enter"&&saveCode(f.key)} style={{...I,flex:1,fontFamily:"monospace",letterSpacing:3,fontWeight:800,padding:"7px 10px"}}/>
                        <button onClick={()=>saveCode(f.key)} style={{padding:"7px 10px",borderRadius:6,border:"none",background:"#6366f1",color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{t.codeSave||"저장"}</button>
                        <button onClick={()=>f.setEd(false)} style={{padding:"7px 8px",borderRadius:6,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:11}}>✕</button>
                      </div>
                    ):(
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                        <span style={{fontFamily:"monospace",fontSize:18,fontWeight:800,letterSpacing:4}}>{f.val}</span>
                        <div style={{display:"flex",gap:4}}>
                          <button onClick={()=>f.setEd(true)} style={{padding:"3px 7px",borderRadius:5,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:10,color:"#6366f1",fontWeight:600}}>{t.codeEdit}</button>
                          <button onClick={()=>{navigator.clipboard.writeText(f.val).catch(()=>{});setCpd(f.key);setTimeout(()=>setCpd(""),2000);}} style={{padding:"3px 7px",borderRadius:5,border:"none",background:cpd===f.key?"#dcfce7":"#e2e8f0",color:cpd===f.key?"#15803d":"#475569",cursor:"pointer",fontSize:10,fontWeight:600}}>{cpd===f.key?t.copied:t.copy}</button>
                        </div>
                      </div>
                    )}
                    <button onClick={async()=>{const c=gCode();await upd({...db,...(f.key==="admin"?{adminCode:c}:{memberCode:c})});f.setV(c);showMsg(t.codeSaved);}} style={{marginTop:6,width:"100%",padding:"5px",borderRadius:6,border:"1px dashed #d1d5db",background:"#fff",cursor:"pointer",fontSize:10,color:"#9ca3af"}}>{t.regen}</button>
                  </div>
                ))}
                {cMsg&&<div style={{padding:"7px 12px",borderRadius:7,textAlign:"center",fontSize:11,background:cMsg.includes("✅")?"#dcfce7":"#fef2f2",color:cMsg.includes("✅")?"#15803d":"#ef4444"}}>{cMsg}</div>}
              </div>
            )}
            {isAdm()&&<div style={{background:"#fff",borderRadius:10,padding:14}}><button onClick={async()=>{if(!window.confirm(t.resetConfirm))return;try{await remove(ref(db_firebase,DB_REF));}catch{}setDb(null);setUser(null);setPage("setup");setSName("");setSAC(gCode());setSMC(gCode());}} style={{width:"100%",padding:"9px",borderRadius:7,border:"1px solid #fca5a5",background:"#fff",cursor:"pointer",fontSize:12,color:"#ef4444"}}>{t.reset}</button></div>}
          </div>
        )}
      </div>

      {modal==="site"&&(
        <Modal onClose={closeModal} w={310}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>{editId?"현장 수정":"현장 추가"}</div>
          <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:4}}>{t.sName}{t.req}</label>
          <input value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={{...I,marginBottom:12}} autoFocus/>
          <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:7}}>{t.sColor}</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>{COLORS.map(c=><div key={c} onClick={()=>setForm(p=>({...p,color:c}))} style={{width:26,height:26,borderRadius:"50%",background:c,cursor:"pointer",border:(form.color||"#6366f1")===c?"3px solid #1e293b":"3px solid transparent"}}/>)}</div>
          <div style={{display:"flex",gap:7,justifyContent:"flex-end"}}>
            <button onClick={closeModal} style={{padding:"7px 14px",borderRadius:7,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:12}}>{t.cancel}</button>
            <button onClick={saveSite} style={{padding:"7px 14px",borderRadius:7,border:"none",background:"#6366f1",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>{t.save}</button>
          </div>
        </Modal>
      )}

      {modal==="team"&&(
        <Modal onClose={closeModal} w={310}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>{editId?"팀 수정":"팀 추가"}</div>
          <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:4}}>{t.tName}{t.req}</label>
          <input value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={{...I,marginBottom:12}} autoFocus/>
          <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:7}}>{t.tColor}</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>{COLORS.map(c=><div key={c} onClick={()=>setForm(p=>({...p,color:c}))} style={{width:26,height:26,borderRadius:"50%",background:c,cursor:"pointer",border:(form.color||"#6366f1")===c?"3px solid #1e293b":"3px solid transparent"}}/>)}</div>
          <div style={{display:"flex",gap:7,justifyContent:"flex-end"}}>
            <button onClick={closeModal} style={{padding:"7px 14px",borderRadius:7,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:12}}>{t.cancel}</button>
            <button onClick={saveTeam} style={{padding:"7px 14px",borderRadius:7,border:"none",background:"#6366f1",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>{t.save}</button>
          </div>
        </Modal>
      )}

      {modal==="task"&&(
        <Modal onClose={closeModal}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>{editId?"업무 수정":"업무 추가"}</div>
          {[{l:t.taskName+t.req,k:"title",ph:"업무명 입력"},{l:t.assignee,k:"assignee",ph:t.none},{l:t.due,k:"dueDate",ph:"",type:"date"}].map(f=>(
            <div key={f.k} style={{marginBottom:10}}>
              <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:4}}>{f.l}</label>
              <input type={f.type||"text"} value={form[f.k]||""} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={I}/>
            </div>
          ))}
          <div style={{marginBottom:10}}>
            <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:4}}>📍 {t.sName}</label>
            <select value={form.siteId||""} onChange={e=>{const sid=e.target.value;const ft=db.teams.find(tm=>tm.siteId===sid);setForm(p=>({...p,siteId:sid,teamId:ft?ft.id:""}));}} style={{...I,cursor:"pointer"}}>
              {db.sites.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div style={{marginBottom:10}}>
            <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:4}}>🔧 팀</label>
            <select value={form.teamId||""} onChange={e=>setForm(p=>({...p,teamId:e.target.value}))} style={{...I,cursor:"pointer"}}>
              <option value="">-- 팀 선택 --</option>
              {db.teams.filter(tm=>tm.siteId===form.siteId).map(tm=><option key={tm.id} value={tm.id}>{tm.name}</option>)}
            </select>
          </div>
          <div style={{marginBottom:10}}>
            <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:4}}>{t.status}</label>
            <select value={form.status!=null?form.status:0} onChange={e=>setForm(p=>({...p,status:Number(e.target.value)}))} style={{...I,cursor:"pointer"}}>
              {t.sl.map((s,i)=><option key={i} value={i}>{s}</option>)}
            </select>
          </div>
          <div style={{marginBottom:10}}>
            <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:4}}>{t.progress}</label>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <input type="range" min={0} max={100} value={form.progress||0} onChange={e=>setForm(p=>({...p,progress:Number(e.target.value)}))} style={{flex:1,accentColor:"#6366f1"}}/>
              <div style={{display:"flex",alignItems:"center",gap:2}}>
                <input type="number" min={0} max={100} value={form.progress||0} onChange={e=>setForm(p=>({...p,progress:Math.min(100,Math.max(0,Number(e.target.value)))}))} style={{width:52,padding:"5px 6px",borderRadius:6,border:"1px solid #e2e8f0",fontSize:13,fontWeight:700,textAlign:"center"}}/>
                <span style={{fontSize:12,color:"#64748b"}}>%</span>
              </div>
            </div>
          </div>
          <div style={{marginBottom:6}}>
            <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:4}}>📝 {t.memo||"메모"}</label>
            <textarea value={form.memo||""} onChange={e=>setForm(p=>({...p,memo:e.target.value}))} placeholder={t.memoPh||"진척 상황, 특이사항 등 자유롭게 입력"} style={{...I,height:72,resize:"vertical",lineHeight:1.5}}/>
          </div>
          <div style={{display:"flex",gap:7,justifyContent:"flex-end",marginTop:14}}>
            <button onClick={closeModal} style={{padding:"7px 14px",borderRadius:7,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:12}}>{t.cancel}</button>
            <button onClick={saveTask} style={{padding:"7px 14px",borderRadius:7,border:"none",background:"#6366f1",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>{t.save}</button>
          </div>
        </Modal>
      )}

      {modal==="contact"&&(
        <Modal onClose={closeModal} w={340}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>{editId?"연락처 수정":"연락처 추가"}</div>
          {[{l:t.name+t.req,k:"name",ph:"홍길동"},{l:t.phone,k:"phone",ph:"010-0000-0000"},{l:t.role,k:"role",ph:"예: 현장주임"}].map(f=>(
            <div key={f.k} style={{marginBottom:10}}>
              <label style={{fontSize:11,color:"#64748b",display:"block",marginBottom:4}}>{f.l}</label>
              <input value={form[f.k]||""} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={I}/>
            </div>
          ))}
          <div style={{display:"flex",gap:7,justifyContent:"flex-end",marginTop:14}}>
            <button onClick={closeModal} style={{padding:"7px 14px",borderRadius:7,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:12}}>{t.cancel}</button>
            <button onClick={saveContact} style={{padding:"7px 14px",borderRadius:7,border:"none",background:"#6366f1",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>{t.save}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
