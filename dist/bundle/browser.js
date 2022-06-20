!function(e){"use strict";function t(e,t){
return e<t}var n=function(){function e(e){
var n=void 0===e?{}:e,o=n.objectPool,i=n.lessThanFunc
;this._size=0,this._root=null,
this.merge=l,this.collapse=r,this._objectPool=o,this._lessThanFunc=i||t
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
},e.prototype.deleteMin=function(){
var e=this._root;if(null!=e){var t=e.item
;return this.delete(e),t}
},e.prototype.delete=function(e){var t
;if(e===this._root)this._root=r(e.child,this._lessThanFunc);else{
if(null==e.prev){
if(this._objectPool)throw new Error("The node is already deleted. Don't use the objectPool to prevent this error.")
;return}
e.prev.child===e?e.prev.child=e.next:e.prev.next=e.next,null!=e.next&&(e.next.prev=e.prev),
this._root=l(this._root,r(e.child,this._lessThanFunc),this._lessThanFunc)
}
e.child=null,e.prev=null,e.next=null,e.item=void 0,null===(t=this._objectPool)||void 0===t||t.release(e),
this._size--},e.prototype.decreaseKey=function(e){
e!==this._root&&(e.prev.child===e?e.prev.child=e.next:e.prev.next=e.next,
null!=e.next&&(e.next.prev=e.prev),
this._root=l(this._root,e,this._lessThanFunc))
},Object.defineProperty(e.prototype,"isEmpty",{
get:function(){return null==this._root},
enumerable:!1,configurable:!0}),e}()
;function l(e,t,n){var l,r
;return null==e?t:null==t||e===t?e:(n(t.item,e.item)?(l=t,
r=e):(l=e,r=t),r.next=l.child,
null!=l.child&&(l.child.prev=r),r.prev=l,l.child=r,
l.next=null,l.prev=null,l)}function r(e,t){
var n,r,o,i,u;if(null==e)return null
;for(i=e,n=null;null!=i;){
if(null==(o=(r=i).next)){r.prev=n,n=r;break}
i=o.next,(u=l(r,o,t)).prev=n,n=u}
for(u=null;null!=n;)i=n.prev,u=l(u,n,t),n=i
;return u}
e.PairingHeap=n,Object.defineProperty(e,"__esModule",{
value:!0})}({});
