/* Run with node --test tests/admin-feedback.test.cjs. No browser dependencies required. */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../static/js/admin-feedback.js'),'utf8');

function harness(){
  let now = 0, nextId = 0;
  const tasks = new Map();
  class Element {
    constructor(){ this.children=[]; this.attributes={}; this.events={}; this.style={}; }
    append(...children){ children.forEach(child=>{child.parent=this;this.children.push(child);}); }
    setAttribute(name,value){ this.attributes[name]=value; }
    addEventListener(name,handler){ this.events[name]=handler; }
    remove(){ this.parent.children=this.parent.children.filter(child=>child!==this); }
  }
  const box = new Element();
  const window = {};
  vm.runInNewContext(source,{
    window, performance:{now:()=>now},
    document:{getElementById:()=>box,createElement:()=>new Element(),querySelectorAll:()=>[],documentElement:{classList:{add(){}}}},
    setTimeout:(callback,delay)=>{const id=++nextId;tasks.set(id,{at:now+delay,callback});return id;},
    clearTimeout:id=>tasks.delete(id)
  });
  const advance = duration => {
    const target=now+duration;
    while(true){
      const next=[...tasks].filter(([,task])=>task.at<=target).sort((a,b)=>a[1].at-b[1].at||a[0]-b[0])[0];
      if(!next) break;
      tasks.delete(next[0]);now=next[1].at;next[1].callback();
    }
    now=target;
  };
  return {box,tasks,advance,toast:window.CKFeedback.toast};
}

for(const [level,duration] of [['success',1500],['error',2500],['danger',2500],['warning',3000],['info',4000],['debug',4000]]){
  test(`${level} dismisses at ${duration} ms and cleans up its countdown`,()=>{
    const h=harness();h.toast('Saved message',level);
    assert.equal(h.box.children.length,1);
    const item=h.box.children[0];
    assert.equal(item.children[3].children[0].style.animationDuration,`${duration}ms`);
    h.advance(duration-1);assert.equal(h.box.children.length,1);
    h.advance(1);assert.equal(h.box.children.length,0);
    assert.equal(h.tasks.size,0);
  });
}

test('overlapping notifications keep independent deadlines',()=>{
  const h=harness();h.toast('Long message','info');h.advance(1000);h.toast('Quick message','success');
  h.advance(1500);assert.equal(h.box.children.length,1);
  assert.equal(h.box.children[0].children[1].children[1].textContent,'Long message');
  h.advance(1500);assert.equal(h.box.children.length,0);
});

test('manual dismissal cancels the timer and countdown updates',()=>{
  const h=harness();h.toast('Message','error');
  h.box.children[0].children[2].events.click();
  assert.equal(h.box.children.length,0);assert.equal(h.tasks.size,0);
});

test('unknown levels receive the info timer and visible countdown text',()=>{
  const h=harness();h.toast('Message','other');
  const countdown=h.box.children[0].children[1].children[0].children[1];
  assert.equal(countdown.textContent,'4.0s');assert.equal(countdown.attributes['aria-hidden'],'true');
  h.advance(1000);assert.equal(countdown.textContent,'3.0s');
  h.advance(3000);assert.equal(h.box.children.length,0);
});
