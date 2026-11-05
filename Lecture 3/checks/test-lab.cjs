// Node.js smoke checks for journal state and report logic. No dependencies.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.resolve(__dirname,'../lab.html'),'utf8');
const script=html.split('<script>')[1].split('</script>')[0];
const nodes=new Map();
function node(id){if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',addEventListener(type,fn){this[type]=fn;}});return nodes.get(id);}
const buttons=[1,2,3,4].map(i=>({dataset:{snapshot:String(i)}}));
const saved=new Map();
const ctx=vm.createContext({document:{getElementById:node,querySelectorAll:()=>buttons},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},confirm:()=>true,console});
vm.runInContext(script,ctx);
node('p1').value='Початковий P1';node('p1').input();buttons[1].onclick();
node('p1').value='Змінений P1';node('p1').input();node('show').onclick();
assert(node('report').value.includes('Початковий P1'));assert(node('report').value.includes('Змінений P1'));
node('check').onclick();assert(node('feedback').textContent.startsWith('Не заповнено'));
vm.runInContext('for(const k of keys)el(k).value="Заповнено";',ctx);node('check').onclick();assert(node('feedback').textContent.startsWith('Усі поля'));
const backup=saved.get('problem-solving-lab03-v1');
(async()=>{
 await node('restore').onchange({target:{files:[{text:async()=>backup}],value:'x'}});
 assert.equal(node('p1').value,'Змінений P1');
 await node('restore').onchange({target:{files:[{text:async()=>'{"version":99}'}],value:'x'}});
 assert(node('feedback').textContent.startsWith('Не вдалося'));assert.equal(node('p1').value,'Змінений P1');
 vm.runInContext('localStorage.setItem=()=>{throw new Error("blocked")};persist();',ctx);
 assert(node('status').textContent.includes('недоступне'));
 assert(!/<script[^>]+src=|\bfetch\(|XMLHttpRequest/.test(html));
 console.log('PASS: snapshot preservation, report content, completeness, JSON restoration/rejection, blocked storage notice, no remote scripts or fetches. Browser rendering not tested.');
})().catch(e=>{console.error(e);process.exit(1)});
