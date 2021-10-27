!function(e){var t={};function n(r){if(t[r])return t[r].exports;var s=t[r]={i:r,l:!1,exports:{}};return e[r].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(r,s,function(t){return e[t]}.bind(null,s));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);class r{constructor(e,t,n,r){this.templateElement=document.getElementById(e),this.appElement=document.getElementById(t);const s=document.importNode(this.templateElement.content,!0);this.mainElement=s.firstElementChild,r&&(this.mainElement.id=r),this.attach(n)}attach(e){this.appElement.insertAdjacentElement(e?"afterbegin":"beforeend",this.mainElement)}}function s(e){let t=!0;return e.required&&(t=t&&0!==e.value.toString().trim().length),null!=e.minLength&&"string"==typeof e.value&&(t=t&&e.value.length>=e.minLength),null!=e.maxLength&&"string"==typeof e.value&&(t=t&&e.value.length<=e.maxLength),null!=e.minValue&&"number"==typeof e.value&&(t=t&&e.value>=e.minValue),null!=e.maxValue&&"number"==typeof e.value&&(t=t&&e.value<=e.maxValue),t}function i(e,t,n){const r=n.value;return{configurable:!0,enumerable:!1,get(){return r.bind(this)}}}var a;!function(e){e[e.Active=0]="Active",e[e.Finished=1]="Finished"}(a||(a={}));class l{constructor(e,t,n,r,s){this.id=e,this.title=t,this.description=n,this.team=r,this.status=s}}class o extends class{constructor(){this.listeners=[]}addListener(e){this.listeners.push(e)}}{constructor(){super(),this.projects=[]}static getInstance(){return this.instance||(this.instance=new o),this.instance}addProject(e,t,n,r){let s=Math.random().toString();const i=new l(s,e,t,n,a.Active);this.projects.push(i),this.callListeners()}deleteProject(e){this.projects.splice(this.projects.findIndex(t=>t.id===e),1),this.callListeners()}moveProject(e,t){const n=this.projects.find(t=>t.id===e);n&&n.status!=t&&(n.status=t,this.callListeners())}callListeners(){for(const e of this.listeners)e(this.projects.slice())}}const c=o.getInstance();var d=function(e,t,n,r){var s,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(a=(i<3?s(a):i>3?s(t,n,a):s(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a};class u extends r{constructor(){super("project-input","app",!0,"user-input"),this.titleInputElement=this.mainElement.querySelector("#title"),this.descInputElement=this.mainElement.querySelector("#description"),this.teamInputElement=this.mainElement.querySelector("#people"),this.configure()}fetchUserInput(){const e=this.titleInputElement.value,t=this.descInputElement.value,n=this.teamInputElement.value,r={value:t,required:!0,minLength:5},i={value:+n,required:!0,minValue:1,maxValue:5};return s({value:e,required:!0})&&s(r)&&s(i)?[e,t,+n]:void console.log("error, please check input")}clearUserInput(){this.titleInputElement.value="",this.descInputElement.value="",this.teamInputElement.value=""}submitHandler(e){e.preventDefault();const t=this.fetchUserInput();if(Array.isArray(t)){const[e,n,r]=t;c.addProject(e,n,r),console.log(e,n,r),this.clearUserInput()}}configure(){this.mainElement.addEventListener("submit",this.submitHandler)}render(){}}d([i],u.prototype,"submitHandler",null);var p=function(e,t,n,r){var s,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(a=(i<3?s(a):i>3?s(t,n,a):s(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a};class h extends r{constructor(e,t){super("single-project",e,!1,t.id),this.project=t,this.configure(),this.render()}get persons(){return 1===this.project.team?"1 person":this.project.team+" persons"}render(){this.mainElement.querySelector("h2").textContent=this.project.title,this.mainElement.querySelector("h3").textContent=this.persons+" assigned",this.mainElement.querySelector("p").textContent=this.project.description}dragStartHandler(e){e.dataTransfer.setData("text/plain",this.project.id),e.dataTransfer.effectAllowed="move"}dragEndHandler(e){console.log("DragEnd")}deleteProjectHandler(e){c.deleteProject(this.project.id)}configure(){this.mainElement.addEventListener("dragstart",this.dragStartHandler),this.mainElement.addEventListener("dragend",this.dragEndHandler),this.mainElement.querySelector("button").addEventListener("click",this.deleteProjectHandler)}}p([i],h.prototype,"dragStartHandler",null),p([i],h.prototype,"dragEndHandler",null),p([i],h.prototype,"deleteProjectHandler",null);var m=function(e,t,n,r){var s,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(a=(i<3?s(a):i>3?s(t,n,a):s(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a};class f extends r{constructor(e){super("project-list","app",!1,e+"-projects"),this.type=e,this.assignedProjects=[],this.configure(),this.render()}renderProjects(){document.getElementById(this.type+"-projects-list").innerHTML="";for(const e of this.assignedProjects)new h(this.mainElement.querySelector("ul").id,e)}dragOverHandler(e){if(e.dataTransfer&&"text/plain"===e.dataTransfer.types[0]){e.preventDefault();this.mainElement.querySelector("ul").classList.add("droppable")}}dropHandler(e){const t=e.dataTransfer.getData("text/plain");c.moveProject(t,"active"===this.type?a.Active:a.Finished);this.mainElement.querySelector("ul").classList.remove("droppable")}dragLeaveHandler(e){this.mainElement.querySelector("ul").classList.remove("droppable")}render(){const e=this.type+"-projects-list";this.mainElement.querySelector("ul").id=e,this.mainElement.querySelector("h2").textContent=this.type.toUpperCase()+" PROJECTS"}configure(){c.addListener(e=>{const t=e.filter(e=>"active"===this.type?e.status===a.Active:e.status===a.Finished);this.assignedProjects=t,this.renderProjects()}),this.mainElement.addEventListener("dragover",this.dragOverHandler),this.mainElement.addEventListener("dragleave",this.dragLeaveHandler),this.mainElement.addEventListener("drop",this.dropHandler)}}m([i],f.prototype,"dragOverHandler",null),m([i],f.prototype,"dropHandler",null),m([i],f.prototype,"dragLeaveHandler",null);new u,new f("active"),new f("finished");let g=o.getInstance();g.addProject("Specs, sitemap and wireframe","Write full specificaton document according to customer's requirements. Generate sitemap and wireframes.",2),g.addProject("Frontend development","Design UI according to spec doc. Implement website's frontend using React and Bootstrap",3),g.addProject("Backend development","Design and create MongoDB database, implement Express server",5),g.addProject("Testing","Test the website following the spec doc. Document bugs, issues and missing features.",1)}]);