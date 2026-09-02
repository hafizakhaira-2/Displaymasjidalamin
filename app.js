const prayerData=[
 {name:"Subuh",time:"04:40",icon:"🌙"},{name:"Dzuhur",time:"11:58",icon:"☀️"},
 {name:"Ashar",time:"15:18",icon:"🌤️"},{name:"Maghrib",time:"17:55",icon:"🌇"},
 {name:"Isya",time:"19:08",icon:"✨"}
];
let count=Number(localStorage.getItem("masjidTasbih")||0);
const $=id=>document.getElementById(id);
function renderPrayer(){
 $("prayerGrid").innerHTML=prayerData.map(p=>`<div class="prayer" data-time="${p.time}"><span class="icon">${p.icon}</span><b>${p.name}</b><strong>${p.time}</strong><small>Waktu shalat</small></div>`).join("");
 $("dateText").textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
}
function updateClock(){
 const now=new Date(); $("liveClock").textContent=now.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
 let next=null;
 for(const p of prayerData){const [h,m]=p.time.split(":").map(Number);const d=new Date();d.setHours(h,m,0,0);if(d>now){next={...p,date:d};break}}
 if(!next){const p=prayerData[0];const d=new Date();d.setDate(d.getDate()+1);d.setHours(4,40,0,0);next={...p,date:d}}
 const diff=next.date-now;const hh=Math.floor(diff/36e5),mm=Math.floor(diff%36e5/6e4),ss=Math.floor(diff%6e4/1e3);
 $("nextName").textContent=next.name;$("countdown").textContent=[hh,mm,ss].map(x=>String(x).padStart(2,"0")).join(":");$("nextInfo").textContent=`Menuju waktu ${next.name} · ${next.time}`;
 document.querySelectorAll(".prayer").forEach(x=>x.classList.toggle("active",x.dataset.time===next.time));
}
function toggleDua(){$("duaModal").classList.toggle("show")}
$("plusBtn").onclick=()=>{count++;saveCount()};$("minusBtn").onclick=()=>{count=Math.max(0,count-1);saveCount()};$("resetBtn").onclick=()=>{count=0;saveCount()};
function saveCount(){localStorage.setItem("masjidTasbih",count);$("counter").textContent=count}
$("themeBtn").onclick=()=>{document.documentElement.classList.toggle("light");localStorage.setItem("masjidTheme",document.documentElement.classList.contains("light")?"light":"dark")};
if(localStorage.getItem("masjidTheme")==="light")document.documentElement.classList.add("light");
renderPrayer();saveCount();updateClock();setInterval(updateClock,1000);
