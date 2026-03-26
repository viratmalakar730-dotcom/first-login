// 🔐 ADMIN PANEL
function openAdmin(){
let pass = prompt("Enter Password");
if(pass==="8563"){
document.getElementById("adminPanel").style.display="block";
}else{
alert("Wrong Password");
}
}

function closeAdmin(){
document.getElementById("adminPanel").style.display="none";
}

// 💾 SAVE AGENT (MANUAL)
function saveAgent(){
let agents = JSON.parse(localStorage.getItem("agents")||"[]");

agents.push({
id:aid.value,
name:aname.value,
shift:shift.value,
weekoff:weekoff.value
});

localStorage.setItem("agents",JSON.stringify(agents));
alert("Agent Saved");
}

// 📂 BULK UPLOAD (SMART FIX)
function bulkUpload(){
const file = document.getElementById('bulkFile').files[0];
if(!file) return alert("Upload roster file");

const reader = new FileReader();

reader.onload = function(e){
const data = new Uint8Array(e.target.result);
const wb = XLSX.read(data,{type:'array'});
const sheet = wb.Sheets[wb.SheetNames[0]];

let json = XLSX.utils.sheet_to_json(sheet);

let agents = [];

json.forEach(row=>{

// 🔍 SMART MATCH
let id = row["Employee ID"] || row["Agent ID"] || row["UserName"];
let name = row["Agent Name"] || row["Name"];
let shift = row["Shift"] || row["Updated Shift"];
let weekoff = row["Week Off"] || row["WeekOff"];

if(id){
agents.push({
id: id,
name: name || "",
shift: shift || "07:00",
weekoff: weekoff || ""
});
}

});

localStorage.setItem("agents", JSON.stringify(agents));

alert("Bulk Upload Success ✅");
showAgents();
};

reader.readAsArrayBuffer(file);
}

// 📋 SHOW AGENTS LIST
function showAgents(){
let agents = JSON.parse(localStorage.getItem("agents")||"[]");

let html = "<table><tr><th>ID</th><th>Name</th><th>Shift</th><th>Week Off</th><th>Edit</th><th>Delete</th></tr>";

agents.forEach((a,i)=>{
html += `<tr>
<td>${a.id}</td>
<td contenteditable="true" onblur="updateAgent(${i}, 'name', this.innerText)">${a.name}</td>
<td contenteditable="true" onblur="updateAgent(${i}, 'shift', this.innerText)">${a.shift}</td>
<td contenteditable="true" onblur="updateAgent(${i}, 'weekoff', this.innerText)">${a.weekoff}</td>
<td>✏️</td>
<td><button onclick="deleteAgent(${i})">Delete</button></td>
</tr>`;
});

html += "</table>";

tableContainer.innerHTML = html;
}

// ✏️ UPDATE AGENT
function updateAgent(index, field, value){
let agents = JSON.parse(localStorage.getItem("agents"));
agents[index][field] = value;
localStorage.setItem("agents", JSON.stringify(agents));
}

// ❌ DELETE AGENT
function deleteAgent(index){
let agents = JSON.parse(localStorage.getItem("agents"));
agents.splice(index,1);
localStorage.setItem("agents", JSON.stringify(agents));
showAgents();
}

// 📂 LOGIN FILE PROCESS
function processFile(){
const file = document.getElementById('fileInput').files[0];
if(!file) return alert("Upload file");

const reader = new FileReader();

reader.onload = function(e){
const data = new Uint8Array(e.target.result);
const wb = XLSX.read(data,{type:'array'});
const sheet = wb.Sheets[wb.SheetNames[0]];

let raw = XLSX.utils.sheet_to_json(sheet,{header:1});

// REMOVE FIRST ROW
raw.shift();

// HEADER NORMALIZE
let headers = raw[0].map(h => h.toString().toLowerCase().replace(/ /g,''));

let idIndex = headers.findIndex(h => h.includes("user"));
let dateIndex = headers.findIndex(h => h.includes("date"));
let typeIndex = headers.findIndex(h => h.includes("event"));

let result = {};

raw.slice(1).forEach(r=>{
let id = r[idIndex];
let dt = new Date(r[dateIndex]);
let type = (r[typeIndex] || "").toLowerCase();

if(type.includes("login")){
let d = dt.toISOString().split('T')[0];
let t = dt.toTimeString().split(" ")[0];

if(!result[id]) result[id] = {};
if(!result[id][d]) result[id][d] = t;
}
});

renderTable(result);
};

reader.readAsArrayBuffer(file);
}

// 📊 FINAL TABLE
function renderTable(data){

let agents = JSON.parse(localStorage.getItem("agents")||"[]");

let dates = new Set();
Object.values(data).forEach(d=>{
Object.keys(d).forEach(x=>dates.add(x));
});
dates = Array.from(dates).sort();

let html = "<table><tr><th>ID</th><th>Name</th><th>Shift</th><th>WO</th>";

dates.forEach(d=>html += "<th>"+d+"</th>");
html += "</tr>";

agents.forEach(a=>{
html += "<tr>";
html += `<td>${a.id}</td><td>${a.name}</td><td>${a.shift}</td><td>${a.weekoff}</td>`;

dates.forEach(d=>{
let val = data[a.id]?.[d] || "";

if(val){
let [sh,sm] = a.shift.split(":").map(Number);
let shiftMin = sh*60 + sm + 5;

let [lh,lm] = val.split(":").map(Number);
let loginMin = lh*60 + lm;

if(loginMin > shiftMin){
html += `<td class="late">${val}</td>`;
}else{
html += `<td>${val}</td>`;
}
}else{
html += `<td></td>`;
}
});

html += "</tr>";
});

html += "</table>";
tableContainer.innerHTML = html;
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
