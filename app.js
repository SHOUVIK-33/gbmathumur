const $=s=>document.querySelector(s);let P=[],cur=0,view=[];
$("#ch").innerHTML=CH.map((c,i)=>`<article class="chap"><span class="num">${String(i+1).padStart(2,"0")}</span><div><h3>${c[0]}</h3><small>${c[1]}</small>${c[2].split("\n\n").map(p=>`<p>${p}</p>`).join("")}</div></article>`).join("");
$("#cl").innerHTML=COLOURS.map(c=>`<span><i style="background:${c[1]}"></i>${c[0]}</span>`).join("");
$("#sg").innerHTML=SONGS.map(s=>`<span>${s}</span>`).join("");
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("in")),{threshold:.2});document.querySelectorAll(".chap").forEach(c=>io.observe(c));
const L={axomiya:"Axomiya",hindi:"Hindi",bangla:"Bangla"};let lang="axomiya";
async function load(){
 const r=await fetch("/api/poems");if(r.status===401){$("#lock").hidden=false;return}
 P=await r.json();tabs();show()}
function tabs(){$("#tabs").innerHTML=Object.entries(L).map(([k,v])=>`<button data-l="${k}" aria-pressed="${k===lang}">${v} (${P.filter(p=>p.lang===k).length})</button>`).join("")}
function show(){view=P.filter(p=>p.lang===lang);$("#pg").innerHTML=view.map((p,i)=>`<button class="thumb" data-i="${i}"><img src="${p.image}" alt="${p.title}" loading="lazy"></button>`).join("");$("#pe").textContent=view.length?"":"No poems found. Run npm run seed."}
$("#tabs").onclick=e=>{if(e.target.dataset.l){lang=e.target.dataset.l;tabs();show()}};
$("#pg").onclick=e=>{const b=e.target.closest(".thumb");if(b)lb(+b.dataset.i)};
function lb(i){cur=(i+view.length)%view.length;$("#li").src=view[cur].image;$("#li").alt=view[cur].title;$("#lb").hidden=false}
$("#x").onclick=()=>$("#lb").hidden=true;$("#pv").onclick=()=>lb(cur-1);$("#nx").onclick=()=>lb(cur+1);
document.onkeydown=e=>{if($("#lb").hidden)return;if(e.key==="Escape")$("#x").click();if(e.key==="ArrowLeft")lb(cur-1);if(e.key==="ArrowRight")lb(cur+1)};
$("#go").onclick=async()=>{const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({passcode:$("#pc").value})});
 if(r.ok){$("#lock").hidden=true;load()}else $("#err").textContent="That passcode is not right."};
load();
