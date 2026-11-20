# Recapitulare din greșeli și scor de pregătire (1.53.0).
#   - Întrebările greșite revin la 1, 3 și 7 zile (state.qreview); ies din listă după a treia
#     recapitulare corectă. Cardul „De recapitulat azi” e pe ecranul Azi.
#   - Scor de pregătire pe certificare: precizia pe fiecare domeniu oficial, înmulțită cu acoperirea
#     (câte întrebări ai încercat) și cântărită după vechimea răspunsurilor și ponderea domeniului.
#     Recomandă sesiunea următoare pe domeniul cu cel mai mare câștig.
# Folosire: python3 tools/patch_review.py app/assets
import os, sys

assets = sys.argv[1]
p = os.path.join(assets, "app.js")
s = open(p, encoding="utf-8", newline="").read()
if "qReview162" in s:
    sys.exit("app.js e deja modificat")
crlf = "\r\n" in s

FUNCS = r'''
  // ---------------------------------------------------------------- recapitulare din greșeli (1.53.0)
  var REVIEW_DAYS162=[1,3,7],REVIEW_MAX162=20;
  function startOfDay162(t){var d=new Date(t);d.setHours(0,0,0,0);return d.getTime();}
  function qReviewState162(){
    if(state.qreview && typeof state.qreview==="object" && !Array.isArray(state.qreview))return state.qreview;
    // Prima pornire: greșelile de până acum intră direct în recapitulare.
    var q={},today=startOfDay162(Date.now());
    Object.keys(state.assessments || {}).forEach(function(id){var a=state.assessments[id];if(a && a.correct===false && !/-q-(understand|apply|debug|design)$/.test(id))q[id]={box:1,due:today,last:a.last || 0,exam:a.exam || null};});
    state.qreview=q;return q;
  }
  function qReview162(id,correct,exam){
    var q=qReviewState162(),r=q[id],now=Date.now();
    if(!correct){q[id]={box:1,due:startOfDay162(now)+REVIEW_DAYS162[0]*DAY,last:now,exam:exam || (r && r.exam) || null};return;}
    if(!r)return;
    if(r.box>=REVIEW_DAYS162.length){delete q[id];return;}
    r.box++;r.due=startOfDay162(now)+REVIEW_DAYS162[r.box-1]*DAY;r.last=now;
  }
  function qReviewDue162(){
    var q=qReviewState162(),now=Date.now();
    return Object.keys(q).filter(function(id){return q[id].due<=now && questionById(id);})
      .sort(function(a,b){return q[a].due-q[b].due || q[a].last-q[b].last;});
  }
  function qReviewNext162(){
    var q=qReviewState162(),now=Date.now(),next=null,n=0;
    Object.keys(q).forEach(function(id){if(!questionById(id))return;n++;if(q[id].due>now && (next===null || q[id].due<next))next=q[id].due;});
    return {total:n,next:next};
  }
  function startReview162(){
    var q=qReviewState162(),ids=qReviewDue162().slice(0,REVIEW_MAX162);if(!ids.length)return false;
    var items=ids.map(function(id){return {type:"exam",q:questionById(id),exam:q[id].exam || null};});
    prepareRelatedRun129();return startRun(items,{titlu:"Recapitulare din greșeli"});
  }
  function appendReview162(root){
    var due=qReviewDue162(),info=qReviewNext162();if(!info.total)return;
    var card=el("section","unit review162");card.id="review-card162";
    card.appendChild(el("p","cozy-eyebrow","RECAPITULARE DIN GREȘELI"));
    if(due.length){
      card.appendChild(el("h2",null,"De recapitulat azi ("+due.length+")"));
      card.appendChild(el("p","muted","Întrebările greșite revin după 1, 3 și 7 zile. Una iese din listă când o nimerești la a treia recapitulare."+(due.length>REVIEW_MAX162?" Sesiunea are primele "+REVIEW_MAX162+".":"")));
      var b=el("button","btn primary big","Recapitulează");b.id="review-start162";b.onclick=startReview162;card.appendChild(b);
    }else{
      card.appendChild(el("h2",null,"Nimic de recapitulat azi"));
      card.appendChild(el("p","muted",info.total+" întrebări în listă · următoarea recapitulare: "+new Date(info.next).toLocaleDateString("ro-RO",{weekday:"long",day:"numeric",month:"long"})+"."));
    }
    root.appendChild(card);
  }

  // ---------------------------------------------------------------- scor de pregătire (1.53.0)
  var READY_TARGET162=12;
  function weight162(p){var n=String(p || "").match(/\d+(?:[.,]\d+)?/g);if(!n)return null;n=n.map(function(x){return parseFloat(x.replace(",","."));});return n.reduce(function(a,b){return a+b;},0)/n.length;}
  function examResult162(q){
    var r=state.assessments[q.id];
    if(q.competency && q.level){var shared=state.assessments[q.competency+"-q-"+q.level];if(shared && (!r || (shared.last || 0)>(r.last || 0)))r=shared;}
    return r || null;
  }
  // Eticheta de sus cere și ca niciun domeniu să nu fie sub 50%.
  function readinessLabel162(pct,minRow){return pct>=80 && minRow>=50?"Pregătit pentru o simulare":pct>=65?"Aproape gata":pct>=40?"În progres":"La început";}
  function readiness162(examId){
    var exam=examenById(examId);if(!exam)return null;
    var m=examDomainMastery(examId),now=Date.now(),byId={};testExamen(examId).forEach(function(q){byId[q.id]=q;});
    var rows=m.rows.filter(function(r){return r.questionIds.length;}).map(function(row){
      var w=0,c=0,answered=0,right=0;
      row.questionIds.forEach(function(id){var q=byId[id],r=q && examResult162(q);if(!r)return;answered++;if(r.correct)right++;
        var age=(now-(r.last || 0))/DAY,k=age<=30?1:age<=90?0.6:0.3;w+=k;if(r.correct)c+=k;});
      var accuracy=(c+0.5)/(w+1),coverage=Math.min(1,w/Math.min(READY_TARGET162,row.questionIds.length)),score=answered?accuracy*coverage:0;
      return {index:row.index,name:row.name,weight:weight162(row.weight),score:score,pct:Math.round(score*100),correct:right,answered:answered,total:row.questionIds.length};
    });
    if(!rows.length)return null;
    var known=rows.every(function(r){return r.weight;}),sw=0,sx=0;
    rows.forEach(function(r){var w=known?r.weight:1;sw+=w;sx+=w*r.score;});
    var pct=Math.round(sx/sw*100),weak=null;
    rows.forEach(function(r){var gain=(known?r.weight:1)*(1-r.score);if(!weak || gain>weak.gain)weak={row:r,gain:gain};});
    return {exam:exam,pct:pct,label:readinessLabel162(pct,Math.min.apply(null,rows.map(function(r){return r.pct;}))),rows:rows,weak:weak && weak.row,answered:rows.reduce(function(a,r){return a+r.answered;},0),weighted:known};
  }
  function startReadiness162(examId,index){
    var row=examDomainMastery(examId).rows[index];if(!row)return false;
    var byId={};testExamen(examId).forEach(function(q){byId[q.id]=q;});
    // Întâi greșelile (cele mai vechi primele), apoi întrebările neîncercate, apoi cele corecte, de la cea mai veche.
    var wrong=[],fresh=[],right=[];
    row.questionIds.forEach(function(id){var q=byId[id];if(!q)return;var r=examResult162(q);if(!r)fresh.push(q);else (r.correct?right:wrong).push({q:q,t:r.last || 0});});
    var seed=dayKey();fresh.sort(function(a,b){return hash162(a.id+seed)-hash162(b.id+seed);});
    function old(a,b){return a.t-b.t;}
    var list=wrong.sort(old).map(function(x){return x.q;}).concat(fresh,right.sort(old).map(function(x){return x.q;})).slice(0,15);
    if(!list.length)return false;
    prepareRelatedRun129();return startRun(list.map(function(q){return {type:"exam",q:q,exam:examId};}),{titlu:examenById(examId).cod+" · "+row.name});
  }
  function hash162(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h;}
  function readinessBlock162(r,compact){
    var box=el("div","readiness162");box.setAttribute("data-exam",r.exam.id);
    box.appendChild(el(compact?"h3":"h3",null,(compact?r.exam.cod+" · ":"Pregătire: ")+r.pct+"% · "+r.label));
    var bar=el("progress");bar.style.width="100%";bar.max=100;bar.value=r.pct;bar.setAttribute("aria-label","Pregătire "+r.exam.cod+": "+r.pct+"%");box.appendChild(bar);
    if(!compact){
      box.appendChild(el("p","muted","Estimare locală din răspunsurile tale: precizia pe fiecare domeniu, înmulțită cu cât de mult din domeniu ai exersat (cel puțin "+READY_TARGET162+" întrebări), cântărită după "+(r.weighted?"ponderea oficială a domeniului":"domenii egale")+". Răspunsurile mai vechi de 30 de zile contează mai puțin. Nu e o probabilitate de promovare."));
      var list=el("ul","readiness-rows162");
      r.rows.forEach(function(row){list.appendChild(el("li",null,row.name+": "+row.pct+"%"+(row.answered?" · "+row.correct+" din "+row.answered+" încercate sunt corecte":" · neînceput")));});
      box.appendChild(list);
    }
    if(r.weak){
      box.appendChild(el("p",null,(r.answered?"Cel mai mare câștig: ":"Începe cu: ")+r.weak.name+(r.weak.weight?" ("+r.weak.weight.toLocaleString("ro-RO")+"% din examen)":"")+"."));
      var b=el("button","btn "+(compact?"secondary":"primary"),"Sesiune de 15 pe "+r.weak.name);b.setAttribute("data-readiness-start",r.exam.id);
      b.onclick=function(){startReadiness162(r.exam.id,r.weak.index);};box.appendChild(b);
    }
    return box;
  }
  function appendReadiness162(root){
    var list=(SEED.certificari || []).map(function(e){return readiness162(e.id);}).filter(function(r){return r && r.answered;})
      .sort(function(a,b){return b.answered-a.answered;}).slice(0,3);
    if(!list.length)return;
    var card=el("section","unit readiness-card162");card.id="readiness-card162";
    card.appendChild(el("p","cozy-eyebrow","PREGĂTIRE PENTRU EXAMENE"));
    list.forEach(function(r){card.appendChild(readinessBlock162(r,true));});
    card.appendChild(el("p","muted","Estimare locală, ponderată după domeniile oficiale. Detaliile sunt în pagina fiecărei certificări."));
    root.appendChild(card);
  }

'''

pairs = [
    ("    appendRepairCard159(root);", "    appendRepairCard159(root);\n    appendReview162(root);\n    appendReadiness162(root);"),
    ('      exam: it.exam || null, dom: q.dom || "", competency: q.competency || null };',
     '      exam: it.exam || null, dom: q.dom || "", competency: q.competency || null };\n    qReview162(q.id, corect, it.exam || null);'),
    ('last:a.finished,exam:examForm(a.formId).examen,dom:q.dom || "",competency:q.competency || null};',
     'last:a.finished,exam:examForm(a.formId).examen,dom:q.dom || "",competency:q.competency || null};qReview162(id,ok,examForm(a.formId).examen);'),
    ("    s=applyLessonRevision144(s);",
     "    if(s.qreview!==undefined && (!s.qreview || typeof s.qreview!==\"object\" || Array.isArray(s.qreview)))delete s.qreview;\n"
     "    if(s.qreview)Object.keys(s.qreview).forEach(function(id){var r=s.qreview[id];if(!r || !Number.isFinite(r.due) || !(r.box>=1 && r.box<=3))delete s.qreview[id];});\n"
     "    s=applyLessonRevision144(s);"),
    ("window.DECARDS = {", "window.DECARDS = {\n    qReviewDue162: qReviewDue162, qReviewState162: qReviewState162, startReview162: startReview162, readiness162: readiness162, startReadiness162: startReadiness162,"),
    ("    var mastery=examDomainMastery(examId);if(!mastery.rows.length)return;",
     "    var mastery=examDomainMastery(examId);if(!mastery.rows.length)return;\n    var ready162=readiness162(examId);if(ready162){var rb=readinessBlock162(ready162,false);rb.id=\"readiness162\";host.appendChild(rb);}"),
    ("  // ---------------------------------------------------------------- colectie", FUNCS.strip("\n") + "\n\n  // ---------------------------------------------------------------- colectie"),
]
for old, new in pairs:
    if crlf:
        old, new = old.replace("\n", "\r\n"), new.replace("\n", "\r\n")
    if s.count(old) != 1:
        sys.exit("textul de înlocuit apare de %d ori: %s" % (s.count(old), old[:80]))
    s = s.replace(old, new)
open(p, "w", encoding="utf-8", newline="").write(s)
print("app.js modificat")
