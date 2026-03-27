// 🔐 ROSTER PAGE NAV
function goRoster(){
let p = prompt("Enter Password");
if(p==="8563"){
window.location.href="roster.html";
}else{
alert("Wrong Password");
}
}

function goBack(){
window.location.href="index.html";
}

// 📥 GET / SAVE
function getRoster(){
return JSON.parse(localStorage.getItem("roster")||"{}");
}

function setRoster(data){
localStorage.setItem("roster", JSON.stringify(data));
}

// ➕ ADD
function addRoster(){

let r = getRoster();

r[rid.value] = {
name: rname.value,
shift: rshift.value.slice(0,5),
wo: rwo.value
};

setRoster(r);
alert("Added ✅");
loadRoster();
}

// 📂 BULK UPLOAD
function uploadRoster(){

let file = rosterFile.files[0];
if(!file) return alert("Select file");

let reader = new FileReader();

reader.onload = function(e){

let wb = XLSX.read(new Uint8Array(e.target.result), {type:'array'});
let json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

let r = {};

json.forEach(x => {

let id = x["Employee ID"];
let name = x["Agent Name"];
let shift = (x["Shift"] || "").toString().slice(0,5);
let wo = x["Week Off"];

if(id){
r[id] = { name, shift, wo };
}

});

setRoster(r);
alert("Bulk Upload Done ✅");
loadRoster();
};

reader.readAsArrayBuffer(file);
}

// 👀 LOAD TABLE
function loadRoster(){

let r = getRoster();

let html = `
<table>
<tr>
<th>ID</th>
<th>Name</th>
<th>Shift</th>
<th>Week Off</th>
<th>Edit</th>
<th>Delete</th>
</tr>
`;

Object.keys(r).forEach(id=>{

html += `
<tr>
<td>${id}</td>
<td>${r[id].name || ""}</td>
<td>${r[id].shift || ""}</td>
<td>${r[id].wo || ""}</td>

<td><button onclick="editAgent('${id}')">✏️</button></td>
<td><button onclick="deleteAgent('${id}')">❌</button></td>
</tr>
`;

});

html += "</table>";

document.getElementById("rosterTable").innerHTML = html;
}

// ✏️ EDIT
function editAgent(id){

let r = getRoster();
let a = r[id];

let name = prompt("Name", a.name);
let shift = prompt("Shift", a.shift);
let wo = prompt("Week Off", a.wo);

r[id] = {name, shift, wo};

setRoster(r);
loadRoster();
}

// ❌ DELETE
function deleteAgent(id){

let r = getRoster();

if(confirm("Delete agent?")){
delete r[id];
setRoster(r);
loadRoster();
}
}

// 📂 LOGIN PROCESS
function processFile(){

let file = fileInput.files[0];
if(!file) return alert("Upload file");

let reader = new FileReader();

reader.onload = function(e){

let wb = XLSX.read(new Uint8Array(e.target.result), {type:'array'});
let raw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});

raw = raw.filter(r=>r.some(c=>c));

let h = raw.find(r => r.join().toLowerCase().includes("user"));
let headers = h.map(x=>x.toLowerCase());

let idI = headers.findIndex(x=>x.includes("user"));
let nameI = headers.findIndex(x=>x.includes("name"));
let dateI = headers.findIndex(x=>x.includes("date"));
let typeI = headers.findIndex(x=>x.includes("event"));

let start = raw.indexOf(h)+1;

let data={}, names={};

raw.slice(start).forEach(r=>{

let id=r[idI];
let name=r[nameI];
let dt=new Date(r[dateI]);
let type=(r[typeI]||"").toLowerCase();

if(!id || !dt) return;

names[id]=name;

if(type.includes("login")){
let d=dt.toISOString().split('T')[0];
let t=dt.toTimeString().split(" ")[0];

if(!data[id]) data[id]={};
if(!data[id][d]) data[id][d]=t;
}

});

localStorage.setItem("loginData", JSON.stringify(data));
localStorage.setItem("agentNames", JSON.stringify(names));

window.location.href="dashboard.html";
};

reader.readAsArrayBuffer(file);
}

// 📊 TABLE
function renderTable(data, names){

let roster = getRoster();

let dates = new Set();
Object.values(data).forEach(d=>{
Object.keys(d).forEach(x=>dates.add(x));
});
dates = [...dates].sort();

let html = "<table><tr><th>ID</th><th>Name</th><th>Shift</th><th>WO</th>";

dates.forEach(d=>{

let dt=new Date(d);
let day=dt.toLocaleDateString('en-US',{weekday:'long'});

let dd=String(dt.getDate()).padStart(2,'0');
let mm=String(dt.getMonth()+1).padStart(2,'0');
let yyyy=dt.getFullYear();

html += `<th>${day}<br>${dd}-${mm}-${yyyy}</th>`;

});

html+="</tr>";

Object.keys(data).forEach(id=>{

let r=roster[id]||{};

html+=`<tr>
<td>${id}</td>
<td>${names[id]||""}</td>
<td>${r.shift||""}</td>
<td>${r.wo||""}</td>
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

let day=new Date(d).toLocaleDateString('en-US',{weekday:'long'});

if(r.wo===day){
html+=`<td class="wo">WO</td>`;
}else{
html+=`<td></td>`;
}

}

});

html+="</tr>";

});

html+="</table>";

document.getElementById("tableContainer").innerHTML=html;
}

// 🔍 SEARCH
function filterTable(){
let v = document.getElementById("search").value.toLowerCase();
document.querySelectorAll("table tr").forEach((r,i)=>{
if(i===0)return;
r.style.display = r.innerText.toLowerCase().includes(v)?"":"none";
});
}
