function processFile(){
const file = document.getElementById('fileInput').files[0];
if(!file) return alert("Upload file");

const reader = new FileReader();
reader.onload = function(e){
const data = new Uint8Array(e.target.result);
const workbook = XLSX.read(data, {type:'array'});
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = XLSX.utils.sheet_to_json(sheet);

let result = {};

json.forEach(row=>{
let id = row["UserName"];
let dt = new Date(row["DateTime"]);
let type = row["Event Type"];

if(type === "LOGIN"){
let date = dt.toISOString().split('T')[0];
let time = dt.toTimeString().split(" ")[0];

if(!result[id]) result[id] = {};
if(!result[id][date]) result[id][date] = time;
}
});

renderTable(result);
};
reader.readAsArrayBuffer(file);
}

function renderTable(data){
let dates = new Set();
Object.values(data).forEach(d=>{
Object.keys(d).forEach(date=>dates.add(date));
});
dates = Array.from(dates).sort();

let html = "<table><tr><th>Agent ID</th>";
dates.forEach(d=>html += "<th>"+d+"</th>");
html += "</tr>";

for(let agent in data){
html += "<tr><td>"+agent+"</td>";
dates.forEach(d=>{
let val = data[agent][d] || "";
html += "<td>"+val+"</td>";
});
html += "</tr>";
}

html += "</table>";
document.getElementById("tableContainer").innerHTML = html;
}

function filterTable(){
let input = document.getElementById("search").value.toLowerCase();
let rows = document.querySelectorAll("table tr");

rows.forEach((row,i)=>{
if(i===0) return;
let text = row.innerText.toLowerCase();
row.style.display = text.includes(input) ? "" : "none";
});
}

function resetPage(){
location.reload();
}
