
// 🔥 AUTO LOAD FULL ROSTER
const defaultAgents = [
{ id:"160251", name:"Rupali Vishwakarma", shift:"07:00", weekoff:"Tuesday"},
{ id:"160312", name:"Poonam Dwivedi", shift:"07:00", weekoff:"Sunday"},
{ id:"160386", name:"Nafisa", shift:"08:30", weekoff:"Friday"},
{ id:"160417", name:"Summer Singh Ghosh", shift:"07:00", weekoff:"Wednesday"},
{ id:"160431", name:"Neha Jat", shift:"07:00", weekoff:"Saturday"},
{ id:"160432", name:"Baldev Singh", shift:"07:00", weekoff:"Thursday"},
{ id:"160435", name:"Pankaj Saket", shift:"07:00", weekoff:"Wednesday"},
{ id:"160437", name:"Dinesh Kumar Ahirwar", shift:"07:00", weekoff:"Monday"},
{ id:"160438", name:"Sunil Baghel", shift:"08:30", weekoff:"Saturday"},
{ id:"170010", name:"Sanju Jatav", shift:"07:00", weekoff:"Wednesday"},
{ id:"160366", name:"Golu Yadav", shift:"07:00", weekoff:"Sunday"},
{ id:"160368", name:"Swati Barman", shift:"07:00", weekoff:"Friday"},
{ id:"TDAH1671", name:"Sonu Waghde", shift:"08:30", weekoff:"Sunday"},
{ id:"160299", name:"Savita Uikey", shift:"07:00", weekoff:"Saturday"},
{ id:"160401", name:"Pooja Sisodiya", shift:"07:00", weekoff:"Saturday"},
{ id:"160433", name:"Megha Rani Parmar", shift:"07:00", weekoff:"Sunday"},
{ id:"160458", name:"Harshit Patidar", shift:"08:00", weekoff:"Sunday"},
{ id:"160459", name:"Umashankar Kumawat", shift:"08:00", weekoff:"Thursday"},
{ id:"TDAH2899", name:"Sunita Jadhaw", shift:"08:30", weekoff:"Wednesday"},
{ id:"160250", name:"Arti Vishwakarma", shift:"07:00", weekoff:"Tuesday"},
{ id:"160272", name:"Sheetal Osari", shift:"08:30", weekoff:"Wednesday"},
{ id:"160300", name:"Anupma Mishra", shift:"08:30", weekoff:"Friday"},
{ id:"160304", name:"Varsha Dhakad", shift:"07:00", weekoff:"Monday"},
{ id:"160367", name:"Mukesh Sastiya", shift:"08:30", weekoff:"Monday"},
{ id:"160418", name:"Shiva Rai", shift:"07:00", weekoff:"Monday"},
{ id:"160427", name:"Ashish Gadhekar", shift:"08:30", weekoff:"Tuesday"},
{ id:"160434", name:"Gourav Mishra", shift:"08:30", weekoff:"Saturday"},
{ id:"160461", name:"Ritik Kourav", shift:"08:00", weekoff:"Friday"},
{ id:"160472", name:"Priyanka Sharma", shift:"08:30", weekoff:"Thursday"},
{ id:"160473", name:"Nilesh", shift:"08:30", weekoff:"Monday"},
{ id:"160478", name:"Vaishali Patle", shift:"08:00", weekoff:"Wednesday"},
{ id:"TDAH2932", name:"Deepika Jhade", shift:"07:00", weekoff:"Tuesday"},
{ id:"160493", name:"Tosif", shift:"08:30", weekoff:"Friday"},
{ id:"160494", name:"Mahendra Pal", shift:"08:00", weekoff:"Saturday"},
{ id:"TDAH2939", name:"Sanju Pal", shift:"08:30", weekoff:"Wednesday"},
{ id:"160491", name:"Shireesh Katare", shift:"07:00", weekoff:"Saturday"},
{ id:"170085", name:"Diksha Shriwastav", shift:"08:30", weekoff:"Sunday"},
{ id:"TDAH1613", name:"Vaishali Nandeshwar", shift:"09:30", weekoff:"Sunday"},
{ id:"160261", name:"Pankaj Chidar", shift:"09:30", weekoff:"Tuesday"},
{ id:"160385", name:"Vaishnavi Saner", shift:"08:30", weekoff:"Sunday"},
{ id:"170049", name:"Shivangi Verma", shift:"08:30", weekoff:"Friday"},
{ id:"170092", name:"Swadesh Singhasiya", shift:"09:30", weekoff:"Thursday"},
{ id:"170109", name:"Mastram Patel", shift:"09:30", weekoff:"Wednesday"},
{ id:"170111", name:"Ritika Tiwari", shift:"08:30", weekoff:"Saturday"},
{ id:"160503", name:"Tameshwari Patle", shift:"08:30", weekoff:"Friday"},
{ id:"160502", name:"Khushi Thakur", shift:"07:00", weekoff:"Tuesday"},
{ id:"160504", name:"Manish Joshi", shift:"08:00", weekoff:"Tuesday"},
{ id:"160462", name:"Sonali Kushre", shift:"07:00", weekoff:"Thursday"},
{ id:"160508", name:"Hemant Singh Sisodiya", shift:"08:30", weekoff:"Thursday"},
{ id:"160509", name:"Ankita Sakwar", shift:"07:00", weekoff:"Monday"},
{ id:"160510", name:"Sangeeta Chouhan", shift:"08:00", weekoff:"Thursday"},
{ id:"160511", name:"Jyotsna Patel", shift:"08:30", weekoff:"Friday"},
{ id:"160512", name:"Shiv Kumar", shift:"08:30", weekoff:"Monday"},
{ id:"160513", name:"Shraddha Tripathi", shift:"07:00", weekoff:"Thursday"},
{ id:"160514", name:"Sakshi Nagre", shift:"08:30", weekoff:"Tuesday"}
];

// AUTO LOAD
window.onload = function(){
localStorage.setItem("agents", JSON.stringify(defaultAgents));
};

// 🔐 ADMIN PANEL
function openAdmin(){
let pass = prompt("Enter Password");
if(pass==="8563"){
adminPanel.style.display="block";
}else{
alert("Wrong Password");
}
}

function closeAdmin(){
adminPanel.style.display="none";
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

// 📊 FINAL TABLE
function renderTable(data){
let agents = JSON.parse(localStorage.getItem("agents"));

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
