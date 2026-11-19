/* Offline discovery over canonical content. Relationships carry explicit scope;
 * text matches never create a claimed teaching relationship or learned progress. */
(function(){"use strict";
  var NAMES={term:"Termen",card:"Card",path:"Traseu",competency:"Competență",scenario:"Scenariu",sql:"SQL",python:"Python",spark:"PySpark",lesson:"Lecție",exercise:"Atelier",case:"Studiu de caz",recap:"Recapitulare",project:"Proiect",certification:"Certificare",objective:"Obiectiv",domainModule:"Modul",domain:"Domeniu",library:"Bibliotecă",question:"Întrebare",miniTest:"Mini-test",examForm:"Test complet"};
  function normalize(s){return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim();}
  function textOf(value){if(value===null || value===undefined)return "";if(typeof value==="string" || typeof value==="number")return String(value);if(Array.isArray(value))return value.map(textOf).join(" ");if(typeof value==="object")return Object.keys(value).filter(function(k){return !/^(validation|solution|teste|expected|sources|surse|sourceSha256|sourceCardIds|learningLinks|provenance|handbook|technicalReview144|lessonReview144|execution144|executionProof144)$/.test(k);}).map(function(k){return textOf(value[k]);}).join(" ");return "";}
  // Solutions/expected test data remain searchable as explicitly chosen content.
  function contentText(m){return textOf(m)+" "+(m.variatie?contentText(m.variatie):"")+" "+textOf(m.solution)+" "+textOf(m.teste)+" "+textOf(m.expected)+" "+textOf(m.sources || m.surse);}
  function terms(query){var matches=String(query || "").replace(/[„”]/g,'"').match(/"[^"]+"|\S+/g) || [];return matches.map(function(s){return normalize(s.replace(/^"|"$/g,""));}).filter(Boolean);}
  function has(text,token){if(token.length>3)return text.indexOf(token)>=0;var escaped=token.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp("(^|[^a-z0-9_])"+escaped+"($|[^a-z0-9_])").test(text);}
  function create(api){
    var graph=api.seed.knowledgeGraph || {nodes:[],adjacency:{}},nodes={},index=null;
    graph.nodes.forEach(function(n){nodes[n.key]=n;});
    function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
    function button(text,fn,cls){var b=el("button",cls || "btn secondary",text);b.type="button";b.onclick=fn;return b;}
    function state(){return api.getState().discovery;}
    function node(key){return nodes[key] || null;}
    function edgesOf(key){var rows=(graph.adjacency || {})[key] || [];if(graph.encoding!=="adjacency-v1")return rows;return rows.map(function(e){return {to:graph.nodes[e[0]].key,type:graph.relations[e[1]],evidence:graph.evidenceTexts[e[2]],scope:e[3]===1?"subject":"context"};});}
    function corpus(n){var m=api.resolve(n.kind,n.id);return contentText(m || {})+" "+(n.text || "")+" "+(n.snippet || "");}
    function associatedText(n){if(["path","competency","certification","domainModule","objective","miniTest","examForm"].indexOf(n.kind)<0)return "";return edgesOf(n.key).filter(function(e){return e.scope==="subject";}).map(function(e){var target=nodes[e.to];return target?target.title+" "+(target.aliases || []).join(" "):"";}).join(" ");}
    function entries(){if(!index)index=graph.nodes.filter(function(n){return n.searchable!==false && n.active!==false;}).map(function(n){return {node:n,title:normalize(n.title),aliases:normalize((n.aliases || []).join(" ")),text:normalize(corpus(n)),associated:normalize(associatedText(n))};});return index;}
    function searchAll(query,filters){filters=filters || {};var tokens=terms(query),noteMap=api.getState().library.notes;
      var records=entries().concat((api.getState().custom || []).map(function(m){var n={key:"card:"+m.id,kind:"card",id:m.id,title:m.q,domains:[m.deck],certs:[],levels:[],aliases:[],snippet:m.a,personal:true};return {node:n,title:normalize(m.q),aliases:"",text:normalize(contentText(m))};}));
      return records.filter(function(r){var n=r.node;return (!filters.kind || n.kind===filters.kind) && (!filters.deck || (n.domains || []).indexOf(filters.deck)>=0) && (!filters.exam || (n.certs || []).indexOf(filters.exam)>=0) && (!filters.level || (n.levels || []).indexOf(filters.level)>=0);}).map(function(r){var n=r.node,note=noteMap[n.kind+":"+n.id],noteText=normalize(typeof note==="string"?note:note && note.text),own=r.title+" "+r.aliases+" "+r.text+" "+noteText,all=own+" "+(r.associated || "");if(!tokens.every(function(t){return has(all,t);} ))return null;
        var phrase=normalize(query).replace(/["„”]/g,""),score=40,type="Conținut";if(tokens.length && !tokens.every(function(t){return has(own,t);})){score=20;type="Material legat explicit";}else if(phrase && r.title===phrase){score=200;type="Titlu exact";}else if(tokens.length && tokens.every(function(t){return has(r.title,t);})){score=120;type="Titlu";}else if(tokens.length && tokens.every(function(t){return has(r.aliases,t);})){score=100;type="Alias";}else if(tokens.length && tokens.every(function(t){return has(noteText,t);})){score=60;type="Notița ta";}
        var related=edgesOf(n.key).map(function(e){return nodes[e.to];}).filter(function(x){return x && x.kind==="competency";}).map(function(x){return x.id;});
        var raw=corpus(n),at=tokens.length?normalize(raw).indexOf(tokens[0]):-1,snippet=at>=0?raw.slice(Math.max(0,at-70),at+190):String(n.snippet || raw).slice(0,240);
        return {key:n.key,kind:n.kind,id:n.id,title:n.title,matchType:type,competencyIds:related,domains:n.domains || [],certs:n.certs || [],levels:n.levels || [],snippet:snippet,score:score,personal:n.personal};
      }).filter(Boolean).sort(function(a,b){return b.score-a.score || a.title.localeCompare(b.title,"ro") || a.key.localeCompare(b.key);});
    }
    function modal(title){var body=document.querySelector("#modal-body");body.innerHTML="";body.removeAttribute("data-knowledge-node");body.scrollTop=0;document.querySelector("#modal-title").textContent=title;document.querySelector("#modal").hidden=false;return body;}
    function saveSearch(query,filters,shown){var s=state();s.query=query;s.filters=filters;s.shown=shown;s.nodeKey=null;api.save();}
    function openSearch(query){var s=state();if(typeof query==="string")s.query=query;var body=modal("Caută în toată aplicația");
      var input=el("input");input.type="search";input.id="global-search";input.maxLength=500;input.value=s.query || "";input.placeholder='Concept, tehnologie, cod sau „expresie exactă”…';input.setAttribute("aria-label","Caută în toate materialele");body.appendChild(input);
      body.appendChild(el("p","muted","Căutare offline în explicații, cod, scenarii, teste și notițele tale. Combină cuvintele sau folosește ghilimele. O potrivire de text nu înseamnă o competență acoperită."));
      var filters=el("div","discovery-filters"),controls={};body.appendChild(filters);
      function select(key,label,rows){var l=el("label",null,label),e=el("select");e.id="global-filter-"+key;e.setAttribute("aria-label",label);[["","Toate"]].concat(rows).forEach(function(r){var o=el("option",null,r[1]);o.value=r[0];e.appendChild(o);});e.value=(s.filters || {})[key] || "";l.appendChild(e);filters.appendChild(l);controls[key]=e;}
      select("kind","Tip",Object.keys(NAMES).filter(function(k){return ["domain","library"].indexOf(k)<0;}).map(function(k){return [k,NAMES[k]];}));select("deck","Domeniu",api.seed.decks.map(function(d){return [d.id,d.name];}));select("level","Nivel",api.levels);select("exam","Certificare",api.seed.certificari.map(function(e){return [e.id,e.cod];}));
      var count=el("p","muted");count.id="global-search-count";count.setAttribute("aria-live","polite");body.appendChild(count);var results=el("div");results.id="global-search-results";body.appendChild(results);var timer=null,shown=s.shown || 25;
      function render(){var f={};Object.keys(controls).forEach(function(k){f[k]=controls[k].value;});var rows=searchAll(input.value,f);results.innerHTML="";count.textContent=rows.length+" rezultate · "+Math.min(rows.length,shown)+" afișate";saveSearch(input.value,f,shown);
        rows.slice(0,shown).forEach(function(r){var box=el("section","unit discovery-result");box.setAttribute("data-search-kind",r.kind);box.setAttribute("data-search-id",r.id);box.appendChild(el("p","muted",(NAMES[r.kind] || r.kind)+" · "+r.matchType+(r.personal?" · personal":"")));box.appendChild(button(r.title,function(){openResult(r.kind,r.id);},"btn ghost discovery-title"));box.appendChild(el("p","discovery-snippet",r.snippet));results.appendChild(box);});
        if(shown<rows.length){var more=button("Mai multe rezultate",function(){shown+=25;render();});more.id="global-search-more";results.appendChild(more);}
        if(!rows.length){results.appendChild(el("p","muted","Niciun rezultat pentru căutarea și filtrele alese."));}
        var clear=button("Șterge căutarea și filtrele",function(){input.value="";Object.keys(controls).forEach(function(k){controls[k].value="";});shown=25;render();input.focus();});clear.id="global-search-clear";results.appendChild(clear);
      }
      input.oninput=function(){clearTimeout(timer);shown=25;timer=setTimeout(render,170);};Object.keys(controls).forEach(function(k){controls[k].onchange=function(){clearTimeout(timer);shown=25;render();};});render();return true;
    }
    function edgeLabel(e){var types=graph.relationLabels || {};return types[e.type] || ({contains:"Include",part_of:"Face parte din",context:"Context",prerequisite:"Prerechizit recomandat"}[e.type]) || "Legătură documentată";}
    function openNode(key){var n=nodes[key];if(!n)return false;state().nodeKey=key;api.save();var body=modal(n.title);body.setAttribute("data-knowledge-node",key);body.appendChild(button("Înapoi la rezultate",function(){openSearch();}));body.appendChild(el("p","muted",NAMES[n.kind] || n.kind));
      if(n.active===false)body.appendChild(el("p","muted","Material istoric, păstrat pentru progresul și testele vechi. Nu apare în căutarea curentă."));
      if(n.snippet)body.appendChild(el("p",null,n.snippet));var m=api.resolve(n.kind,n.id);
      if(m && api.courseReference && ["card","term","competency","path"].indexOf(n.kind)>=0)api.courseReference(body,m);
      if(n.kind==="term"){var recall=button("Verifică definiția termenului",function(){api.startTerm(n.id);});recall.id="knowledge-practice-term";body.appendChild(recall);}
      if(n.kind==="objective" && m){body.appendChild(el("p","muted","Acoperire: "+({direct:"directă",partial:"parțială",missing:"lipsă"}[m.coverage] || "neclasificată")));if(m.missing && m.missing.length)body.appendChild(el("p",null,"De aprofundat: "+m.missing.join("; ")));}
      if(n.kind==="competency" || n.kind==="path")api.levels.forEach(function(pair){var b=button(pair[1],function(){api.startSkill(n.kind,n.id,pair[0]);});b.setAttribute("data-skill-level",pair[0]);body.appendChild(b);});
      else if(m && ["domain","library","objective","domainModule"].indexOf(n.kind)<0){var go=button(n.kind==="question"?"Exersează întrebarea":"Deschide materialul",function(){api.openNative(n.kind,n.id);});go.id="knowledge-open-material";body.appendChild(go);}
      var rows=edgesOf(key);
      [["subject","Legături de învățare"],["context","Context și apartenență"]].forEach(function(group){var edges=rows.filter(function(e){return e.scope===group[0] && nodes[e.to];});if(!edges.length)return;var details=el("details","unit");details.open=group[0]==="subject";details.setAttribute("data-knowledge-scope",group[0]);details.appendChild(el("summary",null,group[1]+" · "+edges.length));if(group[0]==="context")details.appendChild(el("p","muted","Aceeași tehnologie sau apartenența la un domeniu oferă context; nu demonstrează că materialul explică integral conceptul."));var list=el("div");details.appendChild(list);var shown=0;
        function append(){Array.from(list.querySelectorAll("[data-edges-more]")).forEach(function(e){e.remove();});edges.slice(shown,shown+25).forEach(function(e){var target=nodes[e.to],b=button(edgeLabel(e)+" · "+target.title,function(){openNode(e.to);});b.setAttribute("data-knowledge-to",e.to);b.setAttribute("data-knowledge-relation",e.type);list.appendChild(b);var evidence=el("details","discovery-evidence");evidence.appendChild(el("summary",null,"De ce este legat"));evidence.appendChild(el("p","muted",typeof e.evidence==="string"?e.evidence:JSON.stringify(e.evidence)));list.appendChild(evidence);});shown+=25;if(shown<edges.length){var more=button("Mai multe legături",append);more.setAttribute("data-edges-more","true");list.appendChild(more);}}
        append();body.appendChild(details);
      });
      if(!rows.some(function(e){return e.scope==="subject";}))body.appendChild(el("p","muted","Acest material are deocamdată numai context documentat. Nu este prezentat ca un traseu complet de învățare."));return true;
    }
    function openResult(kind,id){var key=kind+":"+id;if(nodes[key])return openNode(key);if(kind==="card" && api.resolve(kind,id)){api.openNative(kind,id);return true;}return false;}
    function appendLink(host,id,kind){var n=kind?nodes[kind+":"+id]:graph.nodes.find(function(n){return n.id===id && n.kind!=="domain";});if(!n)return;var b=button("Vezi conceptul și materialele legate",function(){openNode(n.key);},"btn secondary knowledge-link");b.setAttribute("data-knowledge-link",n.key);host.appendChild(b);}
    return {searchAll:searchAll,openSearch:openSearch,openNode:openNode,openResult:openResult,appendLink:appendLink,node:node};
  }
  window.Discovery129={create:create,normalize:normalize,terms:terms};
})();
