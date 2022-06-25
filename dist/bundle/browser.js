!function(e){"use strict";function t(e,t){
var n,r,o,l,i={label:0,sent:function(){
if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]}
;return l={next:u(0),throw:u(1),return:u(2)
},"function"==typeof Symbol&&(l[Symbol.iterator]=function(){
return this}),l;function u(l){return function(u){
return function(l){
if(n)throw new TypeError("Generator is already executing.")
;for(;i;)try{
if(n=1,r&&(o=2&l[0]?r.return:l[0]?r.throw||((o=r.return)&&o.call(r),
0):r.next)&&!(o=o.call(r,l[1])).done)return o
;switch(r=0,o&&(l=[2&l[0],o.value]),l[0]){case 0:
case 1:o=l;break;case 4:return i.label++,{
value:l[1],done:!1};case 5:i.label++,r=l[1],l=[0]
;continue;case 7:l=i.ops.pop(),i.trys.pop()
;continue;default:
if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==l[0]&&2!==l[0])){
i=0;continue}
if(3===l[0]&&(!o||l[1]>o[0]&&l[1]<o[3])){
i.label=l[1];break}if(6===l[0]&&i.label<o[1]){
i.label=o[1],o=l;break}if(o&&i.label<o[2]){
i.label=o[2],i.ops.push(l);break}
o[2]&&i.ops.pop(),i.trys.pop();continue}
l=t.call(e,i)}catch(e){l=[6,e],r=0}finally{n=o=0}
if(5&l[0])throw l[1];return{
value:l[0]?l[1]:void 0,done:!0}}([l,u])}}}
function n(e){
var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],r=0
;if(n)return n.call(e)
;if(e&&"number"==typeof e.length)return{
next:function(){
return e&&r>=e.length&&(e=void 0),{
value:e&&e[r++],done:!e}}}
;throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")
}function r(e,t){return e<t}var o=function(){
function e(e){
var t=void 0===e?{}:e,n=t.objectPool,o=t.lessThanFunc
;this._size=0,this._root=null,
this.merge=l,this.collapse=i,this._objectPool=n,this._lessThanFunc=o||r
}return e.prototype.clear=function(){
this._root=null,this._size=0
},Object.defineProperty(e.prototype,"size",{
get:function(){return this._size},enumerable:!1,
configurable:!0}),e.prototype.add=function(e){
var t=null!=this._objectPool?this._objectPool.get():null
;return null==t?t={child:null,next:null,prev:null,
item:e
}:t.item=e,this._size++,this._root=l(this._root,t,this._lessThanFunc),t
},e.prototype.getMin=function(){var e=this._root
;return null==e?void 0:e.item
},e.prototype.getMinNode=function(){
return this._root
},e.prototype.deleteMin=function(){
var e=this._root;if(null!=e){var t=e.item
;return this.delete(e),t}
},e.prototype.delete=function(e){var t
;if(e===this._root)this._root=i(e.child,this._lessThanFunc);else{
if(null==e.prev){
if(this._objectPool)throw new Error("The node is already deleted. Don't use the objectPool to prevent this error.")
;return}
e.prev.child===e?e.prev.child=e.next:e.prev.next=e.next,null!=e.next&&(e.next.prev=e.prev),
this._root=l(this._root,i(e.child,this._lessThanFunc),this._lessThanFunc)
}
e.child=null,e.prev=null,e.next=null,e.item=void 0,null===(t=this._objectPool)||void 0===t||t.release(e),
this._size--},e.prototype.decreaseKey=function(e){
e!==this._root&&(e.prev.child===e?e.prev.child=e.next:e.prev.next=e.next,
null!=e.next&&(e.next.prev=e.prev),
this._root=l(this._root,e,this._lessThanFunc))
},Object.defineProperty(e.prototype,"isEmpty",{
get:function(){return null==this._root},
enumerable:!1,configurable:!0
}),e.prototype[Symbol.iterator]=function(){
return this._iterate(!1)
},e.prototype.nodes=function(){var e
;return(e={})[Symbol.iterator]=function(){
return this._iterate(!0)},e
},e.prototype._iterate=function(e){
var r=this._lessThanFunc;return function o(l){
return t(this,(function(t){switch(t.label){case 0:
return l?e?[4,l]:[3,2]:[3,8];case 1:
return t.sent(),[3,4];case 2:return[4,l.item]
;case 3:t.sent(),t.label=4;case 4:
return l.next?[5,n(o(l.next))]:[3,6];case 5:
t.sent(),t.label=6;case 6:
return l.child?(null!=l.child.next&&(l.child=i(l.child,r),
l.child.prev=l),[5,n(o(l.child))]):[3,8];case 7:
t.sent(),t.label=8;case 8:return[2]}}))
}(this._root)},e}();function l(e,t,n){var r,o
;return null==e?t:null==t||e===t?e:(n(t.item,e.item)?(r=t,
o=e):(r=e,o=t),o.next=r.child,
null!=r.child&&(r.child.prev=o),o.prev=r,r.child=o,
r.next=null,r.prev=null,r)}function i(e,t){
var n,r,o,i,u;if(null==e)return null
;for(i=e,n=null;null!=i;){
if(null==(o=(r=i).next)){r.prev=n,n=r;break}
i=o.next,(u=l(r,o,t)).prev=n,n=u}
for(u=null;null!=n;)i=n.prev,u=l(u,n,t),n=i
;return u}
e.PairingHeap=o,Object.defineProperty(e,"__esModule",{
value:!0})}({});
