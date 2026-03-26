
// 🔥 AUTO LOAD ROSTER
const defaultAgents = [
{ id:"160251", name:"Rupali Vishwakarma", shift:"07:00", weekoff:"Tuesday"},
{ id:"160312", name:"Poonam Dwivedi", shift:"07:00", weekoff:"Sunday"},
{ id:"160386", name:"Nafisa", shift:"08:30", weekoff:"Friday"},
{ id:"160417", name:"Summer Singh Ghosh", shift:"07:00", weekoff:"Wednesday"},
{ id:"160431", name:"Neha Jat", shift:"07:00", weekoff:"Saturday"}
];

// LOAD
window.onload = function(){
localStorage.setItem("agents", JSON.stringify(defaultAgents));
};

// 🔐 ROSTER PANEL
function openRoster(){
let pass = prompt("Enter Password");
if(pass==="8563"){
rosterPanel.style.display="block";
}else{
alert("Wrong Password");
}
}

function closeRoster(){
rosterPanel.style.display="none";
}

// ➕ ADD AGENT
function saveAgent(){
let agents = JSON.parse(localStorage.getItem("agents")||"[]");

agents.push({
id:aid.value,
name:aname.value,
shift:shift.value,
weekoff:weekoff.value
});

localStorage.setItem("agents",JSON.stringify(agents));
alert("Agent Added");
}

// 📂 BULK UPLOAD
function bulkUpload(){
const file = bulkFile.files[0];
if(!file) return alert("Upload file");

const reader = new FileReader();

reader.onload = function(e){
const data = new Uint8Array(e.target.result);
const wb = XLSX.read(data,{type:'array'});
const sheet = wb.Sheets[wb.SheetNames[0]];

let json = XLSX.utils.sheet_to_json(sheet);

let agents = [];

json.forEach(r=>{
agents.push({
id: r["Employee ID"] || r["Agent ID"],
name: r["Agent Name"] || r["Name"],
shift: (r["Shift"] || r["Updated Shift"] || "07:00").toString().slice(0,5),
weekoff: r["Week Off"] || r["WeekOff"]
});
});

localStorage.setItem("agents", JSON.stringify(agents));

alert("Bulk Upload Done");
};

reader.readAsArrayBuffer(file);
}

// 👀 VIEW AGENTS
function showAgents(){
let agents = JSON.parse(localStorage.getItem("agents")||"[]");

let html = "<table><tr><th>ID</th><th>Name</th><th>Shift</th><th>Week Off</th></tr>";

agents.forEach(a=>{
html += `<tr>
<td>${a.id}</td>
<td>${a.name}</td>
<td>${a.shift}</td>
<td>${a.weekoff}</td>
</tr>`;
});

html += "</table>";
tableContainer.innerHTML = html;
}

// 📂 LOGIN PROCESS
function processFile(){
const file = fileInput.files[0];
if(!file) return alert("Upload file");

const reader = new FileReader();

reader.onload = function(e){
const data = new Uint8Array(e.target.result);
const wb = XLSX.read(data,{type:'array'});
const sheet = wb.Sheets[wb.SheetNames[0]];

let raw = XLSX.utils.sheet_to_json(sheet,{header:1});
raw = raw.filter(r => r.some(c => c));

let headerRow = raw.find(r => r.some(c => c && c.toString().toLowerCase().includes("user")));
let headers = headerRow.map(h => h.toString().toLowerCase());

let idIndex = headers.findIndex(h => h.includes("user"));
let dateIndex = headers.findIndex(h => h.includes("date"));
let typeIndex = headers.findIndex(h => h.includes("event"));

let startIndex = raw.indexOf(headerRow) + 1;

let result = {};

raw.slice(startIndex).forEach(r=>{
let id = r[idIndex];
let dt = new Date(r[dateIndex]);
let type = (r[typeIndex]||"").toLowerCase();

if(type.includes("login")){
let d = dt.toISOString().split('T')[0];
let t = dt.toTimeString().split(" ")[0];

if(!result[id]) result[id]={};
if(!result[id][d]) result[id][d]=t;
}
});

renderTable(result);
};

reader.readAsArrayBuffer(file);
}

// 📊 TABLE
function renderTable(data){
let agents = JSON.parse(localStorage.getItem("agents")||"[]");

let dates = new Set();
Object.values(data).forEach(d=>{
Object.keys(d).forEach(x=>dates.add(x));
});
dates = Array.from(dates).sort();

let html = "<table><tr><th>ID</th><th>Name</th><th>Shift</th><th>WO</th>";
dates.forEach(d=>html+="<th>"+d+"</th>");
html+="</tr>";

agents.forEach(a=>{
html+="<tr>";
html+=`<td>${a.id}</td><td>${a.name}</td><td>${a.shift}</td><td>${a.weekoff}</td>`;

dates.forEach(d=>{
let val = data[a.id]?.[d] || "";

if(val){
let [sh,sm]=a.shift.split(":").map(Number);
let shiftMin=sh*60+sm+5;

let [lh,lm]=val.split(":").map(Number);
let loginMin=lh*60+lm;

if(loginMin>shiftMin){
html+=`<td class="late">${val}</td>`;
}else{
html+=`<td>${val}</td>`;
}
}else{
html+=`<td></td>`;
}
});

html+="</tr>";
});

html+="</table>";
tableContainer.innerHTML=html;
}

// 🔍 SEARCH
function filterTable(){
let v = search.value.toLowerCase();
document.querySelectorAll("table tr").forEach((r,i)=>{
if(i===0)return;
r.style.display = r.innerText.toLowerCase().includes(v)?"":"none";
});
}

// 🔄 RESET
function resetPage(){
location.reload();
}
