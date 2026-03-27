// 🔐 OPEN ROSTER
function openRoster(){
let p = prompt("Password");
if(p==="8563"){
rosterPanel.style.display="block";
}else{
alert("Wrong Password");
}
}

function closeRoster(){
rosterPanel.style.display="none";
}

// 📥 GET ROSTER
function getRoster(){
return JSON.parse(localStorage.getItem("roster")||"{}");
}

// 💾 SAVE ROSTER
function setRoster(data){
localStorage.setItem("roster", JSON.stringify(data));
}

// ➕ ADD AGENT
function addRoster(){
let r = getRoster();

r[rid.value] = {
name: rname.value,
shift: rshift.value.slice(0,5),
wo: rwo.value
};

setRoster(r);
alert("Added ✅");
viewRoster();
}

// 📂 BULK UPLOAD FIXED
function uploadRoster(){

let file = rosterFile.files[0];
if(!file) return alert("Select file");

let reader = new FileReader();

reader.onload = function(e){

let wb = XLSX.read(new Uint8Array(e.target.result), {type:'array'});
let json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

let r = getRoster();

// 🔥 FIX: correct column mapping
json.forEach(x => {

let id = x["Employee ID"] || x["Agent ID"];
let name = x["Agent Name"] || x["Name"];
let shift = (x["Shift"] || "").toString().slice(0,5);
let wo = x["Week Off"] || x["WeekOff"];

if(id){
r[id] = { name, shift, wo };
}

});

setRoster(r);

alert("Bulk Upload Done ✅");
viewRoster();
};

reader.readAsArrayBuffer(file);
}

// 👀 VIEW ROSTER (TABLE FORMAT)
function viewRoster(){

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

document.querySelector(".modal-content").innerHTML = html + `
<br><button onclick="closeRoster()">Close</button>
`;
}

// ✏️ EDIT
function editAgent(id){

let r = getRoster();
let a = r[id];

let name = prompt("Edit Name", a.name);
let shift = prompt("Edit Shift (07:00)", a.shift);
let wo = prompt("Edit Week Off", a.wo);

r[id] = {name, shift, wo};

setRoster(r);
viewRoster();
}

// ❌ DELETE
function deleteAgent(id){

let r = getRoster();

if(confirm("Delete this agent?")){
delete r[id];
setRoster(r);
viewRoster();
}
}
