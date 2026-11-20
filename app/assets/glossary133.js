/* Offline glossary search. Scores rank explicit matches, never learning credit. */
(function(){"use strict";
 function norm(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[–—_-]/g," ").replace(/\s+/g," ").trim();}
 function tokens(s){return (String(s||"").replace(/[„“”«»]/g,'"').match(/"[^"]+"|[^\s"]+/g)||[]).map(function(x){return norm(x.replace(/^"|"$/g,""));}).filter(Boolean).slice(0,20);}
 function contains(s,q){if(!q)return true;if(q.length<=3 && /^[a-z0-9]+$/.test(q))return s.split(/[^a-z0-9]+/).indexOf(q)>=0;return s.indexOf(q)>=0;}
 function distance(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;var row=Array.from({length:b.length+1},function(_,i){return i;});for(var i=1;i<=a.length;i++){var next=[i],best=i;for(var j=1;j<=b.length;j++){next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1));best=Math.min(best,next[j]);}if(best>max)return max+1;row=next;}return row[b.length];}
 function create(terms,getNote){
  var rows=terms.map(function(t){var o=t.origin||{},fields={title:t.t,alias:(t.aliases||[]).concat((o.expansions||[]).map(function(x){return x.short+" "+x.full;})).join(" "),definition:[t.d,t.detail,t.example,t.check&&t.check.q,t.check&&t.check.a].filter(Boolean).join(" "),context:[o.concept,o.technology,o.context,o.note].filter(Boolean).join(" ")};var normalized={};Object.keys(fields).forEach(function(k){normalized[k]=norm(fields[k]);});return {term:t,raw:fields,fields:normalized};});
  var vocabulary={};rows.forEach(function(r){[r.term.t].concat(r.term.aliases||[]).forEach(function(s){norm(s).split(/[^a-z0-9]+/).filter(function(w){return w.length>=4;}).forEach(function(w){vocabulary[w]=true;});});});
  function search(query,options){options=options||{};var parts=tokens(query),q=parts.join(" "),labels={title:"denumire",alias:"sinonim / acronim",definition:"explicație / exemplu",context:"tehnologie / context",notes:"notița ta"};
   return rows.filter(function(r){return !options.accept||options.accept(r.term);}).map(function(r){var fields=Object.assign({},r.fields,{notes:norm(getNote?getNote(r.term.id):"")}),keys=options.field==="name"?["title","alias"]:options.field==="definition"?["definition"]:options.field==="context"?["context"]:options.field==="notes"?["notes"]:["title","alias","definition","context","notes"];
    if(!parts.every(function(t){return keys.some(function(k){return contains(fields[k],t);});}))return null;
    var why=[],score=0;keys.forEach(function(k){var hits=parts.filter(function(t){return contains(fields[k],t);}).length;if(hits){why.push(labels[k]);score+=hits*({title:25,alias:18,definition:3,context:2,notes:1}[k]);}});
    if(parts.length && keys.indexOf("title")>=0){if(fields.title===q)score+=1000;else if(fields.title.indexOf(q)===0)score+=200;}
    if(parts.length&&keys.indexOf("alias")>=0&&(r.term.aliases||[]).some(function(a){return norm(a)===q;}))score+=500;
    var snippet="";if(parts.length && !why.some(function(x){return x==="denumire"||x==="sinonim / acronim";})){var raw=r.raw[keys.find(function(k){return parts.some(function(t){return contains(fields[k],t);});})]||String(getNote?getNote(r.term.id):"");var at=norm(raw).indexOf(parts[0]);snippet=raw.slice(Math.max(0,at-55),Math.max(0,at-55)+240);}
    return {term:r.term,score:score,why:parts.length?why:[],snippet:snippet};
   }).filter(Boolean).sort(function(a,b){return (options.sort==="alpha"?0:b.score-a.score)||a.term.t.localeCompare(b.term.t,"ro")||a.term.id.localeCompare(b.term.id);});
  }
  function suggest(query){var parts=tokens(query);if(parts.length!==1||parts[0].length<4||parts[0].length>40)return [];var q=parts[0],max=q.length>=8?2:1;return Object.keys(vocabulary).map(function(w){return {word:w,d:distance(q,w,max)};}).filter(function(x){return x.d>0&&x.d<=max;}).sort(function(a,b){return a.d-b.d||a.word.localeCompare(b.word);}).slice(0,4).map(function(x){return x.word;});}
  return {search:search,suggest:suggest};
 }
 window.GLOSSARY133={create:create,normalize:norm,tokens:tokens};
})();
