const PRAYERS = [
  {key:"Fajr", name:"Subuh", emoji:"🌙", icon:"fajr"},
  {key:"Sunrise", name:"Terbit", emoji:"🌅"},
  {key:"Dhuhr", name:"Dzuhur", emoji:"☀️"},
  {key:"Asr", name:"Ashar", emoji:"🌤️"},
  {key:"Maghrib", name:"Maghrib", emoji:"🌇"},
  {key:"Isha", name:"Isya", emoji:"🌌"}
];
let prayerTimes={}, timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||"Asia/Jakarta", city="Lokasi perangkat";

const $=id=>document.getElementById(id);
function fmtTime(date=new Date()){return new Intl.DateTimeFormat("id-ID",{hour:"2-digit",minute:"2-digit",hour12:false}).format(date)}
function fmtDate(date=new Date()){return new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(date)}
function clockTick(){ $("clock").textContent=fmtTime(); $("date").textContent=fmtDate(); $("lastUpdated").textContent="Live • "+fmtTime(); updateNext(); }
function localDateParts(){const d=new Date();const p=new Intl.DateTimeFormat("en-CA",{timeZone:timezone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(d);return Object.fromEntries(p.filter(x=>x.type!=="literal").map(x=>[x.type,x.value]))}
async function getLocation(){
  $("locationPill").textContent="📍 Mencari lokasi...";
  if(!navigator.geolocation){await useDefault();return}
  navigator.geolocation.getCurrentPosition(async pos=>{
    try{
      const {latitude,longitude}=pos.coords;
      const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=id`);
      const j=await r.json(); const a=j.address||{};
      city=a.city||a.town||a.village||a.municipality||"Lokasi Anda";
      timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||timezone;
      $("locationPill").textContent=`📍 ${city}`;
      await loadPrayerTimes(latitude,longitude);
    }catch(e){await useDefault()}
  },useDefault,{enableHighAccuracy:false,timeout:7000});
}
async function useDefault(){
  // Fallback approximate central Indonesia location; replace via "Gunakan lokasi saya".
  city="Lokasi Anda"; $("locationPill").textContent="📍 Lokasi belum dipilih";
  const {latitude,longitude}= {latitude:-2.991,longitude:104.756};
  await loadPrayerTimes(latitude,longitude);
}
async function loadPrayerTimes(lat,lon){
  try{
    const date=localDateParts();
    const url=`https://api.aladhan.com/v1/timings/${date.day}-${date.month}-${date.year}?latitude=${lat}&longitude=${lon}&method=11`;
    const r=await fetch(url); const j=await r.json();
    prayerTimes=j.data.timings||{};
    renderPrayers(); updateNext();
    $("kajianStatus").textContent=(j.data.meta&&j.data.meta.timezone)? "Jadwal mengikuti waktu lokal":"Cek papan pengumuman";
  }catch(e){fallbackTimes()}
}
function fallbackTimes(){prayerTimes={Fajr:"04:45",Sunrise:"06:00",Dhuhr:"12:05",Asr:"15:20",Maghrib:"18:05",Isha:"19:15"};renderPrayers()}
function minutes(t){const [h,m]=t.split(":").map(Number);return h*60+m}
function renderPrayers(){
  const now=new Date(), cur=now.getHours()*60+now.getMinutes();
  $("prayerGrid").innerHTML=PRAYERS.map(p=>{
    const t=prayerTimes[p.key]||"--:--"; const active=t!=="--:--" && cur>=minutes(t) && cur<minutes(t)+90;
    return `<div class="prayer ${active?"active":""}"><div class="emoji">${p.emoji}</div><div class="prayer-name">${p.name}</div><div class="prayer-time">${t}</div></div>`
  }).join("");
}
function updateNext(){
  if(!Object.keys(prayerTimes).length)return;
  const now=new Date(), cur=now.getHours()*60+now.getMinutes();
  let next=PRAYERS.filter(p=>p.key!=="Sunrise").map(p=>({p,t:prayerTimes[p.key]})).filter(x=>x.t).find(x=>minutes(x.t)>cur);
  if(!next){next={p:PRAYERS[0],t:prayerTimes.Fajr};}
  $("nextPrayer").textContent=`${next.p.name} • ${next.t}`;
  let diff=minutes(next.t)-cur;if(diff<0)diff+=1440;
  $("countdown").textContent=`${String(Math.floor(diff/60)).padStart(2,"0")}j ${String(diff%60).padStart(2,"0")}m lagi`;
  renderPrayers();
}
$("locateBtn").addEventListener("click",getLocation);
$("fullscreenBtn").addEventListener("click",()=>document.documentElement.requestFullscreen?.());
$("themeBtn").addEventListener("click",()=>document.body.classList.toggle("soft"));
setInterval(clockTick,1000); clockTick(); getLocation();
