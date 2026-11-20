(function () {
  "use strict";
  window.Courses145 = {create: function (api) {
    var S=window.SEED, data=S.courses145 || {courses:[],units:[]}, courses={},units={},legacy={},active=null,catalogQuery="",practiceReturn=null;
    var levels={junior:"Junior",mid:"Intermediar",senior:"Avansat / Senior"};
    data.courses.forEach(function(c){courses[c.id]=c;c.levels.forEach(function(l){(l.legacyLessonIds || []).forEach(function(id){if(!legacy[id])legacy[id]={courseId:c.id,level:l.id};});});});
    data.units.forEach(function(u){units[u.id]=u;});
    function node(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
    function button(text,fn,cls){var b=node("button",cls || "btn secondary",text);b.type="button";b.onclick=fn;return b;}
    async function copyCode146(text) {
      if (window.Android && typeof window.Android.copiaza === "function") {
        try { if (window.Android.copiaza(text) === true) return; } catch (e) {}
      }
      if (navigator.clipboard && window.isSecureContext) {
        try { await navigator.clipboard.writeText(text); return; } catch (e) {}
      }
      var previous = document.activeElement, tmp = node("textarea");
      tmp.value = text; tmp.readOnly = true; tmp.tabIndex = -1;
      tmp.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none";
      (document.querySelector('[aria-modal="true"]') || document.body).appendChild(tmp);
      try {
        tmp.focus({ preventScroll: true }); tmp.select();
        if (!document.execCommand("copy")) throw Error("copy");
      } finally {
        tmp.remove();
        if (previous && previous.isConnected && !previous.closest("[inert],[hidden]")) {
          try { previous.focus({ preventScroll: true }); } catch (e) { previous.focus(); }
        }
      }
    }
    function md(host,text){if(!text)return;var n=node("div","md");n.innerHTML=api.renderMd(String(text));n.querySelectorAll("pre code").forEach(function(code){var copy=button("Copiază codul",async function(){try{await copyCode146(code.textContent);copy.textContent="Cod copiat";}catch(e){copy.textContent="Nu s-a copiat. Selectează codul";}},"btn mini ghost");code.parentNode.insertAdjacentElement("afterend",copy);});host.appendChild(n);return n;}
    function localRunner(host,kind,editor,label,onExecuted){
      var revision=0,running=false,area=node("section","course-result147"),status=node("p"),output=node("pre","code"),run;
      host.appendChild(node("p","course-runtime147",kind==="sql"?"Rulare în aplicație: SQLite, într-o bază temporară nouă la fiecare rulare. Include CREATE / INSERT dacă ai nevoie de tabele.":"Rulare în aplicație: Brython, în WebView. Nu este CPython; bibliotecile instalate pe calculator și serviciile cloud nu sunt disponibile aici."));
      area.setAttribute("aria-label","Rezultatul execuției locale");area.setAttribute("role","region");status.setAttribute("role","status");status.setAttribute("aria-live","polite");status.setAttribute("aria-atomic","true");status.textContent="Încă nu ai rulat codul. Rularea nu verifică automat corectitudinea.";output.hidden=true;area.appendChild(status);area.appendChild(output);
      function stale(){revision++;output.textContent="";output.hidden=true;status.textContent=running?"Cod modificat în timpul rulării. Rulează din nou pentru rezultatul curent.":"Cod modificat. Rulează din nou pentru a vedea rezultatul curent.";}
      editor.addEventListener("input",stale);
      run=button(label,async function(){
        var startedRevision=revision,code=editor.value;running=true;run.disabled=true;area.setAttribute("aria-busy","true");output.textContent="";output.hidden=true;status.textContent="Se execută local…";
        try{
          var response=await api.run(kind,code),result=response&&typeof response==="object"?String(response.output===undefined?"":response.output):String(response),failed=!!(response&&typeof response==="object"&&response.error);
          if(startedRevision!==revision||editor.value!==code){status.textContent="Cod modificat. Rulează din nou pentru a vedea rezultatul curent.";return;}
          output.textContent=result;output.hidden=false;
          status.textContent=failed?"Eroare la execuție. Corectează codul și rulează din nou.":"Cod executat local. Compară rezultatul cu cerințele; corectitudinea nu a fost verificată automat.";
          if(!failed&&onExecuted)onExecuted(code,result);
        }catch(e){
          if(startedRevision!==revision||editor.value!==code){status.textContent="Cod modificat. Rulează din nou pentru a vedea rezultatul curent.";return;}
          output.textContent=e.message||String(e);output.hidden=false;status.textContent="Eroare la execuție. Corectează codul și rulează din nou.";
        }finally{running=false;run.disabled=false;area.removeAttribute("aria-busy");}
      });host.appendChild(run);host.appendChild(area);
    }
    function object(v){return v&&typeof v==="object"&&!Array.isArray(v);}
    function exampleCodes(text){var found=[],pattern=/```[^\n]*\n([\s\S]*?)```/g,match;while((match=pattern.exec(text || "")))found.push(match[1].replace(/\r\n/g,"\n").trim());return found;}
    function list(v){return Array.isArray(v)?v:v?[v]:[];}
    function searchKey(v){return String(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
    function ensure(s){
      if(!object(s.courses145))s.courses145={};var p=s.courses145;
      ["courses","units","practice","projects","history"].forEach(function(k){if(!object(p[k]))p[k]={};});
      ["courses","units","practice","projects"].forEach(function(k){Object.keys(p[k]).forEach(function(id){if(!object(p[k][id]))delete p[k][id];});});
      if(!p.migrated){
        var reads=Object.assign({},s.settings&&s.settings.careerRead142 || {},s.settings&&s.settings.courseRead143 || {});
        Object.keys(reads).forEach(function(id){if(legacy[id])p.units[id]={readAt:reads[id],revision:"1.44.0",inherited:true};});
        p.migrated=true;
      }
      Object.keys(p.practice).forEach(function(id){
        var r=p.practice[id];if(!object(r)){delete p.practice[id];return;}
        var material=(data.practiceRevisions148 || {})[id];
        if(material&&r.materialRevision148!==material){
          p.history[id]=Object.assign({},r,{historyReason148:"material-updated"});
          p.practice[id]={draft:r.draft || "",contract:data.contractVersion,materialRevision148:material,previousMaterial148:true};
        }else if(r.passed&&r.contract!==data.contractVersion){p.history[id]=r;p.practice[id]={draft:r.draft || "",previousContract:true};}
      });
      if(p.lastCourse&&!courses[p.lastCourse])p.lastCourse=null;
      return p;
    }
    function state(){return ensure(api.state());}
    function record(id){var p=state();return p.units[id] || {};}
    function sequence(c){var ids=[];c.levels.forEach(function(l){(l.unitIds || []).concat(l.legacyLessonIds || []).forEach(function(id){if(ids.indexOf(id)<0)ids.push(id);});});return ids;}
    function courseFor(id){return courses[id] || data.courses.filter(function(c){return (c.certIds || []).indexOf(id)>=0 || (c.deckIds || []).indexOf(id)>=0;})[0];}
    function unitFor(id){if(units[id])return units[id];var l=(S.lectii || []).filter(function(x){return x.id===id;})[0];if(!l||!legacy[id])return null;var owner=legacy[id];return {id:id,courseId:owner.courseId,level:owner.level,title:l.titlu,objective:l.obiectiv,understand:l.explicatie,detail:null,workedExample:l.exemplu?{context:l.exemplu.enunt,language:"",code:"",expected:"",explanation:l.exemplu.rezolvare}:null,practice:(l.autoevaluare || []).map(function(q,i){return {id:id+"-check-"+i,kind:"reasoning",prompt:q.q,solution:q.a,expected:"",hints:[],checks:[],environment:"Raționament și comparație cu explicația"};}),sources:l.sources || [],legacy:l};}
    function surface(title){api.enter();var body=document.querySelector("#lab-body");body.innerHTML="";body.classList.remove("study-page132");body.classList.add("course-reader145");document.querySelector("#lab-cap").textContent=title;return body;}
    function save(){api.save();}
    function sources(host,rows){var box=node("details","unit course-sources145");box.appendChild(node("summary",null,"Surse și aprofundare"));(rows || []).forEach(function(s){if(!Array.isArray(s)||!/^https:\/\//.test(s[1]))return;var a=node("a",null,s[0]);a.href=s[1];a.target="_blank";a.rel="noopener noreferrer";var p=node("p");p.appendChild(a);box.appendChild(p);});host.appendChild(box);}
    function progress(c){var ids=sequence(c);return {read:ids.filter(function(id){return !!record(id).readAt;}).length,total:ids.length};}
    function intro(c){var body=surface("Curs · "+c.name);active={courseId:c.id,unitId:null};body.appendChild(node("h2",null,c.name));md(body,c.intro);body.appendChild(node("p","muted","Nivelurile sunt accesibile liber. Lectura, probele locale și practica externă au evidențe separate."));
      if(c.status==="historical")body.appendChild(node("p","course-notice145","Materie istorică. Acest parcurs nu reprezintă un examen activ."));
      var p=progress(c);body.appendChild(node("p",null,p.read+" / "+p.total+" lecții parcurse"));
      c.levels.forEach(function(l){var section=node("section","unit course-level145");section.appendChild(node("h3",null,levels[l.id]));md(section,l.goal);(l.unitIds || []).concat(l.legacyLessonIds || []).forEach(function(id){var u=unitFor(id);if(!u)return;var b=button((record(id).readAt?"✓ ":"")+u.title,function(){open(c.id,id);},"mat-row");b.dataset.courseUnit145=id;section.appendChild(b);});body.appendChild(section);});
      body.appendChild(button("Proiectul traseului",function(){project(c.id);}));coverage(body,c);sources(body,c.sources);api.footer("Începe / continuă lecțiile",true,function(){start(c.id);});
    }
    function coverage(host,c){var rows=(data.certificationCoverage || []).filter(function(x){return (c.certIds || []).indexOf(x.certId)>=0;});if(!rows.length)return;var box=node("details","unit");box.appendChild(node("summary",null,"Programa și pregătirea pentru certificare"));rows.forEach(function(row){md(box,row.guideVersion || row.certId);md(box,row.scope);if(row.reviewedOn)md(box,"Referințe verificate la "+row.reviewedOn);sources(box,[["Ghidul oficial",row.guideUrl]]);list(row.domains).forEach(function(domain){var d=node("details","unit");d.appendChild(node("summary",null,domain.name));list(domain.unitIds).concat(list(domain.legacyLessonIds)).forEach(function(id){var u=unitFor(id);if(u)d.appendChild(button(u.title,function(){open(sequence(c).indexOf(id)>=0?c.id:u.courseId,id);},"mat-row"));});list(domain.remaining).forEach(function(text){md(d,text);});box.appendChild(d);});});host.appendChild(box);}
    function markRead(c,u){var p=state();p.units[u.id]=Object.assign({},record(u.id),{readAt:Date.now(),revision:data.contractVersion});if(u.legacy){var s=api.state();s.settings.courseRead143=s.settings.courseRead143||{};s.settings.courseRead143[u.id]=Date.now();}p.courses[c.id]=Object.assign({},p.courses[c.id] || {},{lastUnitId:u.id,scroll:0});save();}
    function start(id){var c=courseFor(id);if(!c)return false;var p=state(),seq=sequence(c),cursor=p.courses[c.id],target=cursor&&seq.indexOf(cursor.lastUnitId)>=0&&!record(cursor.lastUnitId).readAt?cursor.lastUnitId:seq.filter(function(x){return !record(x).readAt;})[0];if(!target)target=seq[0];return open(c.id,target);}
    function open(id,unitId){var c=courseFor(id);if(!c)return false;if(!unitId){intro(c);return true;}var u=unitFor(unitId),seq=sequence(c);if(!u||seq.indexOf(unitId)<0)return false;var p=state(),old=p.courses[c.id] || {},scroll=old.lastUnitId===unitId?old.scroll || 0:0;
      practiceReturn=null;active={courseId:c.id,unitId:unitId};p.lastCourse=c.id;p.courses[c.id]=Object.assign({},old,{lastUnitId:unitId});var body=surface("Curs · "+c.name);body.dataset.course145=c.id;body.dataset.unit145=unitId;
      var top=node("div","course-reader-nav145");top.appendChild(button("Cuprins",function(){intro(c);},"btn mini secondary"));top.appendChild(button("Proiect",function(){project(c.id);},"btn mini secondary"));top.appendChild(button("Toate cursurile",function(){leave();},"btn mini ghost"));body.appendChild(top);
      body.appendChild(node("p","study-breadcrumb132",c.name+" · "+levels[u.level]+" · "+(seq.indexOf(unitId)+1)+"/"+seq.length));body.appendChild(node("h2",null,u.title));md(body,u.objective);
      var sectionsNav=node("nav","course-section-nav147");sectionsNav.setAttribute("aria-label","Secțiunile lecției");[["understand","Înțelegere"],["detail","Exemplu și detalii"],["practice","Exersează"]].forEach(function(pair){var jump=button(pair[1],function(){var target=body.querySelector('[data-course-section="'+pair[0]+'"]');if(!target)return;var sc=document.querySelector("#lab-scroll");sc.scrollTop+=target.getBoundingClientRect().top-sc.getBoundingClientRect().top-12;target.querySelector("h3").focus({preventScroll:true});},"btn mini secondary");jump.dataset.courseJump147=pair[0];sectionsNav.appendChild(jump);});body.appendChild(sectionsNav);
      if(u.legacy)body.appendChild(node("p","course-notice145","Aprofundare din biblioteca existentă. Fundamentele și exemplul introductiv sunt în lecțiile anterioare din cuprins."));
      var understanding=node("section","course-section145");understanding.dataset.courseSection="understand";understanding.appendChild(node("h3",null,"Înțelegere"));md(understanding,u.understand);body.appendChild(understanding);
      var detail=node("section","course-section145");detail.dataset.courseSection="detail";detail.appendChild(node("h3",null,"În detaliu"));md(detail,u.detail);var ex=u.workedExample;
      if(ex){md(detail,ex.context);if(ex.code)md(detail,"```"+(ex.language || "text")+"\n"+ex.code+"\n```");if(ex.expected){detail.appendChild(node("h4",null,"Rezultat așteptat"));md(detail,ex.expected);}md(detail,ex.explanation);}
      if(u.legacy){var mainExample=ex&&ex.explanation || "",shownCodes=exampleCodes(mainExample);(u.legacy.examples135 || []).forEach(function(x){var code=String(x.code || "").replace(/\r\n/g,"\n").trim();if(shownCodes.indexOf(code)<0){md(detail,"```"+x.language+"\n"+x.code+"\n```");shownCodes.push(code);}if(x.expected&&mainExample.indexOf(x.expected)<0)md(detail,x.expected);md(detail,(x.execution || {}).status==="executed"?"Verificare locală consemnată: "+(x.execution.engine || "")+" "+(x.execution.version || "")+". Nu dovedește execuție cloud.":"Exemplu documentar, fără execuție cloud.");});if(u.legacy.supplement140){var sp=u.legacy.supplement140;md(detail,sp.text+"\n\n```"+sp.language+"\n"+sp.code+"\n```\n\n"+sp.expected);}if(u.legacy.greseli)md(detail,"### Greșeli frecvente\n"+u.legacy.greseli.map(function(x){return "- "+x;}).join("\n"));}
      body.appendChild(detail);[understanding,detail].forEach(function(section){section.querySelector("h3").tabIndex=-1;});
      var practice=node("section","course-section145");practice.dataset.courseSection="practice";practice.appendChild(node("h3",null,"Exersează"));practice.querySelector("h3").tabIndex=-1;practice.appendChild(node("p","muted","Încearcă înainte să deschizi indiciile și soluția. Compararea cu modelul este autoevaluare, nu probă automată."));(u.practice || []).forEach(function(task){practice.appendChild(practiceBox(task,u));});body.appendChild(practice);
      if(["sql","python","spark"].indexOf(c.id)>=0)practice.appendChild(button(c.id==="spark"?"Cazuri PySpark · analiză offline":"Exerciții "+(c.id==="sql"?"SQL":"Python")+" · verificare automată",function(){
        var sc=document.querySelector("#lab-scroll");p.courses[c.id].scroll=sc.scrollTop;practiceReturn={courseId:c.id,unitId:u.id,scroll:sc.scrollTop,progress:p};sc.onscroll=null;active=null;save();api.gradedPractice(c.id);
      }));
      if(u.projectStep){var ps=node("section","course-section145");ps.appendChild(node("h3",null,"Pasul din proiect"));md(ps,u.projectStep);body.appendChild(ps);}
      sources(body,u.sources);api.personal(body,u.id);var nav=node("div","course-reader-nav145"),pos=seq.indexOf(unitId);
      if(pos>0)nav.appendChild(button("← Lecția precedentă",function(){open(c.id,seq[pos-1]);}));nav.appendChild(button("Cuprins și niveluri",function(){intro(c);}));body.appendChild(nav);
      api.footer(record(unitId).readAt?"Parcursă · continuă":"Am parcurs · continuă",true,function(){markRead(c,u);if(pos+1<seq.length)open(c.id,seq[pos+1]);else summary(c);});
      var sc=document.querySelector("#lab-scroll");sc.onscroll=function(){if(active&&active.unitId===unitId){p.courses[c.id].scroll=sc.scrollTop;api.save(false);}};sc.scrollTop=scroll;save();return true;
    }
    function practiceBox(t,u){var box=node("article","unit course-practice145");box.dataset.practice145=t.id;md(box,t.prompt);box.appendChild(node("p","course-environment145",t.environment || (t.kind==="external"?"Laborator extern; nu rulează pe telefon.":"Raționament și verificare proprie")));
      if(t.expected||(t.checks&&t.checks.length)){var contract=node("section","course-contract147");contract.appendChild(node("h4",null,"Ce trebuie să obții"));if(t.expected)md(contract,t.expected);if(t.checks&&t.checks.length)md(contract,"### Criterii de verificare\n"+t.checks.map(function(x){return "- "+x;}).join("\n"));box.appendChild(contract);}
      var p=state(),r=p.practice[t.id] || {},input=node("textarea","course-code145");input.setAttribute("aria-label","Încercarea ta");input.value=r.draft!==undefined?r.draft:(t.starter || "");input.placeholder=t.kind==="external"?"Păstrează codul, comenzile și observațiile tale…":"Scrie soluția sau explicația ta…";
      function stamp(row){row.contract=data.contractVersion;var material=(data.practiceRevisions148 || {})[t.id];if(material)row.materialRevision148=material;return row;}
      var status=node("p","muted");status.setAttribute("role","status");function statusText(){var x=state().practice[t.id] || {};status.textContent=x.passed?"Probă locală trecută pe contractul acestei lecții.":x.compared?"Soluție comparată personal; competența nu a fost validată automat.":x.previousMaterial148?"Materialul exercițiului a fost corectat. Încercarea ta este păstrată; compară din nou cu soluția actuală.":x.draft?"Încercare salvată.":"Încă nu ai o probă pentru acest exercițiu.";}statusText();input.oninput=function(){var prior=state().practice[t.id] || {};if(prior.passed||prior.compared){state().history[t.id]=prior;}state().practice[t.id]=stamp({draft:input.value.slice(0,60000),previousMaterial148:!!prior.previousMaterial148});statusText();api.save(false);};box.appendChild(input);box.appendChild(status);
      (t.hints || []).forEach(function(h,i){var d=node("details");d.appendChild(node("summary",null,"Indiciul "+(i+1)));md(d,h);d.addEventListener("toggle",function(){if(d.open){var row=state().practice[t.id] || {};row.hintsViewed=row.hintsViewed || [];if(row.hintsViewed.indexOf(i)<0)row.hintsViewed.push(i);state().practice[t.id]=stamp(row);save();}});box.appendChild(d);});
      if(t.kind==="sql"||t.kind==="python"){
        localRunner(box,t.kind,input,"Rulează încercarea local");
      }
      var solution=node("details","course-solution145");solution.appendChild(node("summary",null,"Compară cu soluția explicată"));md(solution,["sql","python"].indexOf(t.kind)>=0&&t.solution.indexOf("```")<0?"```"+t.kind+"\n"+t.solution+"\n```":t.solution);md(solution,t.explanation);solution.addEventListener("toggle",function(){if(solution.open){var row=state().practice[t.id] || {};row.solutionViewed=true;state().practice[t.id]=stamp(row);save();}});box.appendChild(solution);
      box.appendChild(button("Am comparat rezultatul și explicația",function(){if(!input.value.trim()){status.textContent="Scrie mai întâi încercarea sau observațiile tale.";return;}var row=state().practice[t.id] || {};row.draft=input.value.slice(0,60000);row.compared=true;row.previousMaterial148=false;state().practice[t.id]=stamp(row);statusText();save();},"btn mini secondary"));return box;
    }
    function project(id){var c=courseFor(id);if(!c)return false;var body=surface("Proiect · "+c.name),pr=c.project,p=state();active={courseId:c.id,unitId:null};body.appendChild(button("Înapoi la curs",function(){intro(c);},"btn mini secondary"));body.appendChild(node("h2",null,pr.title));md(body,pr.context);md(body,"```json\n"+JSON.stringify(pr.dataset,null,2)+"\n```");body.appendChild(node("p","course-notice145","Acest proiect folosește o rubrică de autoevaluare. O bifă sau o notiță nu dovedește executarea laboratorului extern."));
      if(c.id==="sql" || c.id==="python")projectRunner(body,c);
      if(pr.guide){body.appendChild(node("h3",null,"Pașii de implementare"));md(body,pr.guide);}pr.milestones.forEach(function(m){var section=node("section","unit");section.appendChild(node("h3",null,levels[m.level]));md(section,m.deliverable);md(section,m.environment);md(section,"### Criterii\n"+(m.acceptance || []).map(function(x){return "- "+x;}).join("\n"));md(section,"### Cazuri de eșec\n"+(m.failureCases || []).map(function(x){return "- "+x;}).join("\n"));var key=c.id+":"+m.level,r=p.projects[key] || {},note=node("textarea","course-code145");note.setAttribute("aria-label","Dovezi și observații proiect "+levels[m.level]);note.value=r.note || "";note.placeholder="Mediu și versiuni, rezultate, teste, limitări…";note.oninput=function(){p.projects[key]={note:note.value.slice(0,60000),status:"self-reported",at:Date.now()};api.save(false);};section.appendChild(note);body.appendChild(section);});if(pr.referenceImplementation){var model=node("details","unit"),ref=pr.referenceImplementation;model.appendChild(node("summary",null,"Compară cu implementarea proiectului"));md(model,"```"+(ref.language || "text")+"\n"+ref.code+"\n```");md(model,ref.expected);body.appendChild(model);}api.footer("Înapoi la curs",true,function(){intro(c);});return true;
    }
    function projectRunner(body,c){var key=c.id+":implementation",section=node("section","unit"),saved=state().projects[key] || {};section.appendChild(node("h3",null,"Implementează proiectul"));section.appendChild(node("p","muted","Poți rula codul aici și compara rezultatul cu datele și criteriile proiectului. Rularea singură nu validează automat soluția."));var editor=node("textarea","course-code145");editor.setAttribute("aria-label","Implementarea proiectului "+c.name);editor.value=saved.code || "";editor.oninput=function(){state().projects[key]={code:editor.value.slice(0,60000),status:"draft"};api.save(false);};section.appendChild(editor);localRunner(section,c.id,editor,"Rulează proiectul local",function(code,result){state().projects[key]={code:code.slice(0,60000),status:"executed-ungraded",output:result.slice(0,20000),at:Date.now()};save();});body.appendChild(section);}
    function summary(c){
      var p=state(),seq=sequence(c),next=seq.filter(function(id){return !record(id).readAt;})[0],complete=!next;
      p.courses[c.id]={lastUnitId:next || null,scroll:0};if(complete)p.courses[c.id].completedAt=Date.now();
      active={courseId:c.id,unitId:null};var body=surface(complete?"Curs parcurs":"Progres în curs");
      body.appendChild(node("h2",null,(complete?"Ai parcurs materialele · ":"Ai ajuns la finalul traseului · ")+c.name));
      body.appendChild(node("p",null,complete?"Lectura este încheiată. Poți reveni la explicații, continua proiectul sau alege explicit practica de examen.":"Ai parcurs "+progress(c).read+" din "+seq.length+" lecții. Celelalte rămân disponibile; poți continua cu prima lecție neparcursă."));
      if(next)body.appendChild(button("Continuă prima lecție neparcursă",function(){open(c.id,next);},"btn primary"));
      body.appendChild(button("Continuă proiectul",function(){project(c.id);},"btn secondary"));body.appendChild(button("Recapitulează cursul",function(){intro(c);}));
      (c.certIds || []).filter(function(id){return c.status!=="historical"&&(S.teste[id] || []).length;}).forEach(function(id){body.appendChild(button("Alege practica pentru examen",function(){api.examPractice(id);}));});
      api.footer("Toate cursurile",true,leave);save();
    }
    function leave(){active=null;document.querySelector("#lab-scroll").onscroll=null;api.leave();}
    function renderCatalog(root){root.appendChild(node("h2",null,"Cursuri · învață pas cu pas"));root.appendChild(node("p","muted","Alege tehnologia și nivelul. Fiecare traseu are explicații, exemple, practică și un proiect cumulativ."));var search=node("input");search.type="search";search.placeholder="Caută un curs sau o tehnologie…";search.setAttribute("aria-label","Caută un curs");search.id="course-search145";search.value=catalogQuery;root.appendChild(search);var list=node("div","course-catalog145");root.appendChild(list);
      function render(){list.innerHTML="";var q=searchKey(search.value),matches=data.courses.filter(function(c){return searchKey(c.name+" "+c.deckIds.join(" ")+" "+(c.certIds||[]).join(" ")).indexOf(q)>=0;});if(!matches.length){var empty=node("section","unit course-empty147");empty.appendChild(node("p",null,"Niciun curs găsit. Încearcă numele unei tehnologii sau șterge căutarea."));empty.appendChild(button("Arată toate cursurile",function(){search.value="";catalogQuery="";render();search.focus();}));list.appendChild(empty);}matches.forEach(function(c){var card=node("article","unit course-card145"),p=progress(c);card.dataset.course145=c.id;card.appendChild(node("h3",null,c.name));card.appendChild(node("p","muted",p.read+"/"+p.total+" lecții parcurse · 3 niveluri · proiect"));if(c.status==="historical")card.appendChild(node("p","course-notice145","Materie istorică; examen retras"));card.appendChild(button(p.read===p.total?"Recapitulează cursul":p.read?"Continuă cursul":"Începe cursul",function(){start(c.id);},"btn primary"));card.appendChild(button("Cuprins",function(){intro(c);},"btn mini secondary"));var choices=node("div","course-reader-nav145");c.levels.forEach(function(level){var b=button(levels[level.id],function(){open(c.id,level.unitIds[0]);},"btn mini ghost");b.dataset.courseLevel145=level.id;choices.appendChild(b);});card.appendChild(choices);list.appendChild(card);});}search.oninput=function(){catalogQuery=search.value;render();};render();
    }
    function appendReference(host,m){if(!m)return;var c=courseFor(m.course145 || m.examen || m.deck || m.careerDeck);if(!c)return;var box=node("section","course-reference145"),specific=(m.courseUnits145 || []).map(unitFor).filter(Boolean);box.appendChild(node("p","muted",specific.length?"Explicații, exemple și exerciții pentru acest concept:":"Predare și practică în cursul domeniului:"));specific.forEach(function(u){box.appendChild(button(u.title,function(){api.closeModal();open(sequence(c).indexOf(u.id)>=0?c.id:u.courseId,u.id);},"btn secondary"));});box.appendChild(button(c.name+" · deschide cursul",function(){api.closeModal();start(c.id);},"btn secondary"));host.appendChild(box);}
    function resumeBanner(root){var p=state(),c=courses[p.lastCourse];if(!c)return;var box=node("section","unit course-continue145");box.appendChild(node("h3",null,"Continuă cursul · "+c.name));box.appendChild(button("Revino la explicații",function(){start(c.id);},"btn primary"));root.appendChild(box);}
    function returnBanner(root){
      if(!practiceReturn)return false;if(practiceReturn.progress!==state()){practiceReturn=null;return false;}var back=practiceReturn,c=courses[back.courseId],u=unitFor(back.unitId);if(!c||!u)return false;
      var box=node("section","unit course-return147");box.appendChild(node("h3",null,"Continuă lecția · "+c.name));box.appendChild(node("p",null,u.title));box.appendChild(button("Înapoi la lecție",function(){if(back.progress!==state()){practiceReturn=null;box.remove();return;}state().courses[c.id]=Object.assign({},state().courses[c.id]||{},{lastUnitId:u.id,scroll:back.scroll});open(c.id,u.id);},"btn primary"));root.appendChild(box);return true;
    }
    function projectCatalog(root){var section=node("details","unit");section.appendChild(node("summary",null,"Proiectele cursurilor · "+data.courses.length));data.courses.forEach(function(c){section.appendChild(button(c.project.title+" · "+c.name,function(){project(c.id);},"mat-row"));});root.appendChild(section);}
    function stats(root){var section=node("section","unit");section.appendChild(node("h3",null,"Învățare prin cursuri"));var p=state(),read=Object.keys(p.units).filter(function(id){return !!p.units[id].readAt;}).length,drafts=Object.keys(p.practice).filter(function(id){return !!p.practice[id].draft;}).length,compared=Object.keys(p.practice).filter(function(id){return !!p.practice[id].compared;}).length;section.appendChild(node("p",null,read+(read===1?" lecție parcursă":" lecții parcurse")+" · "+drafts+(drafts===1?" exercițiu încercat":" exerciții încercate")+" · "+compared+(compared===1?" soluție comparată personal":" soluții comparate personal")));section.appendChild(node("p","muted","Lectura și autoevaluarea sunt separate de probele automate SQL/Python și de practica documentată într-un mediu extern."));root.appendChild(section);}
    return {ensure:ensure,start:start,open:open,intro:function(id){var c=courseFor(id);if(c)intro(c);return !!c;},project:project,render:renderCatalog,reference:appendReference,resumeBanner:resumeBanner,returnBanner:returnBanner,courseFor:courseFor,unitFor:unitFor,legacy:legacy,get active(){return active;},progress:progress,projectCatalog:projectCatalog,stats:stats};
  }};
})();
