// NAVIGATION
function goRoster(){
let p = prompt("Enter Password");
if(p==="8563") window.location="roster.html";
}

// STORAGE
function getRoster(){
return JSON.parse(localStorage.getItem("roster")||"{}");
}
function setRoster(d){
localStorage.setItem("roster",JSON.stringify(d));
}

// ADD AGENT
function addRoster(){
let r=getRoster();

r[rid.value]={
name:rname.value,
shift:rshift.value
};

setRoster(r);
loadRoster();
}

// BULK UPLOAD
function uploadRoster(){

let f=rosterFile.files[0];
let reader=new FileReader();

reader.onload=e=>{
let wb=XLSX.read(new Uint8Array(e.target.result),{type:'array'});
let json=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

let r={};

json.forEach(x=>{
let id=x["Employee ID"];

r[id]={
name:x["Agent Name"],
shift:x["Shift"]
};
});

setRoster(r);
loadRoster();
};

reader.readAsArrayBuffer(f);
}

// LOAD ROSTER
function loadRoster(){
let r=getRoster();

let html="<table><tr><th>ID</th><th>Name</th><th>Shift</th></tr>";

Object.keys(r).forEach(id=>{
html+=`<tr>
<td>${id}</td>
<td>${r[id].name}</td>
<td>${r[id].shift}</td>
</tr>`;
});

html+="</table>";
rosterTable.innerHTML=html;
}

// PROCESS LOGIN FILE
function processFile(){

let f=fileInput.files[0];
let reader=new FileReader();

reader.onload=e=>{

let wb=XLSX.read(new Uint8Array(e.target.result),{type:'array'});
let raw=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1});

let h=raw[0].map(x=>x.toLowerCase());

let idI=h.findIndex(x=>x.includes("user"));
let nameI=h.findIndex(x=>x.includes("name"));
let dateI=h.findIndex(x=>x.includes("date"));
let typeI=h.findIndex(x=>x.includes("event"));

let data={},names={};

raw.slice(1).forEach(r=>{

let id=r[idI];
let name=r[nameI];
let dt=new Date(r[dateI]);
let type=(r[typeI]||"").toLowerCase();

names[id]=name;

if(type.includes("login")){
let d=dt.toISOString().split('T')[0];
let t=dt.toTimeString().split(" ")[0];

if(!data[id]) data[id]={};
if(!data[id][d]) data[id][d]=t;
}

});

localStorage.setItem("loginData",JSON.stringify(data));
localStorage.setItem("agentNames",JSON.stringify(names));

window.location="dashboard.html";
};

reader.readAsArrayBuffer(f);
}

// RENDER TABLE
function renderTable(data,names){

let roster=getRoster();

let dates=new Set();
Object.values(data).forEach(d=>{
Object.keys(d).forEach(x=>dates.add(x));
});
dates=[...dates].sort();

let html="<table><tr><th>ID</th><th>Name</th><th>Shift</th>";

dates.forEach(d=>{
let dt=new Date(d);
let day=dt.toLocaleDateString('en-US',{weekday:'long'});
let dd=String(dt.getDate()).padStart(2,'0');
let mm=String(dt.getMonth()+1).padStart(2,'0');
let yyyy=dt.getFullYear();

html+=`<th>${day}<br>${dd}-${mm}-${yyyy}</th>`;
});

html+="</tr>";

Object.keys(data).forEach(id=>{

let r=roster[id]||{};

html+=`<tr>
<td>${id}</td>
<td>${r.name || names[id] || id}</td>
<td>${r.shift||""}</td>
`;

dates.forEach(d=>{

let val=data[id][d];

if(val){

let [sh,sm]=(r.shift||"07:00").split(":").map(Number);
let shiftMin=sh*60+sm+5;

let [lh,lm]=val.split(":").map(Number);
let loginMin=lh*60+lm;

html += loginMin>shiftMin
? `<td class="late">${val}</td>`
: `<td>${val}</td>`;

}else{
html+=`<td></td>`;
}

});

html+="</tr>";
});

html+="</table>";

document.getElementById("tableContainer").innerHTML=html;
}

// SEARCH
function filterTable(){
let v=document.getElementById("search").value.toLowerCase();
document.querySelectorAll("table tr").forEach((r,i)=>{
if(i===0)return;
r.style.display=r.innerText.toLowerCase().includes(v)?"":"none";
});
}

// COPY PNG
function copyPNG(){
html2canvas(document.getElementById("tableContainer")).then(canvas=>{
let link=document.createElement("a");
link.download="report.png";
link.href=canvas.toDataURL();
link.click();
});
}
