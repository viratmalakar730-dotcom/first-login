// 🔐 Admin Panel
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

// 💾 Save Agent
function saveAgent(){
let agents = JSON.parse(localStorage.getItem("agents")||"[]");

agents.push({
id:document.getElementById("aid").value,
name:document.getElementById("aname").value,
shift:document.getElementById("shift").value,
weekoff:document.getElementById("weekoff").value
});

localStorage.setItem("agents",JSON.stringify(agents));
alert("Agent Saved");
}

// 📂 Excel Processing
function processFile(){
const file = document.getElementById('fileInput').files[0];
if(!file) return alert("Upload file");

const reader = new FileReader();

reader.onload = function(e){
const data = new Uint8Array(e.target.result);
const wb = XLSX.read(data,{type:'array'});
const sheet = wb.Sheets[wb.SheetNames[0]];

let raw = XLSX.utils.sheet_to_json(sheet,{header:1});

// ❗ First row remove
raw.shift();

// Header normalize
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

// 📊 Render Table
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

document.getElementById("tableContainer").innerHTML = html;
}

// 🔍 Search
function filterTable(){
let input = document.getElementById("search").value.toLowerCase();
let rows = document.querySelectorAll("table tr");

rows.forEach((row,i)=>{
if(i===0) return;
row.style.display = row.innerText.toLowerCase().includes(input) ? "" : "none";
});
}

// 🔄 Reset
function resetPage(){
location.reload();
}
