(function(e){function t(t){for(var n,i,o=t[0],u=t[1],s=t[2],f=0,p=[];f<o.length;f++)i=o[f],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&p.push(a[i][0]),a[i]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(e[n]=u[n]);l&&l(t);while(p.length)p.shift()();return c.push.apply(c,s||[]),r()}function r(){for(var e,t=0;t<c.length;t++){for(var r=c[t],n=!0,o=1;o<r.length;o++){var u=r[o];0!==a[u]&&(n=!1)}n&&(c.splice(t--,1),e=i(i.s=r[0]))}return e}var n={},a={app:0},c=[];function i(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=e,i.c=n,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(r,n,function(t){return e[t]}.bind(null,n));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],u=o.push.bind(o);o.push=t,o=o.slice();for(var s=0;s<o.length;s++)t(o[s]);var l=u;c.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("cd49")},2562:function(e,t,r){},"5a91":function(e,t,r){"use strict";var n=r("2562"),a=r.n(n);a.a},"5b58":function(e,t,r){"use strict";var n=r("fa50"),a=r.n(n);a.a},"5c0b":function(e,t,r){"use strict";var n=r("9c0c"),a=r.n(n);a.a},"9c0c":function(e,t,r){},cd49:function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("2b0e"),a=r("289d"),c=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[e._m(0),r("Stocks")],1)},i=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("section",{staticClass:"hero is-primary"},[r("div",{staticClass:"hero-body"},[r("div",{staticClass:"container"},[r("h1",{staticClass:"title"},[e._v("Stocks")])])])])}],o=r("d4ec"),u=r("99de"),s=r("7e84"),l=r("262e"),f=r("9ab4"),p=r("60a3"),b=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("b-table",{attrs:{data:e.stocks},scopedSlots:e._u([{key:"default",fn:function(t){return[r("b-table-column",{attrs:{field:"name",label:"Name"}},[e._v(" "+e._s(t.row.name)+" ")]),r("b-table-column",{attrs:{label:"Buy price",numeric:""}},[e._v(" "+e._s(t.row.buyPrice)+" "+e._s(t.row.buyPrice.getCurrencyInfo().symbol)+" ")]),t.row.price?r("b-table-column",{attrs:{label:"Share price",numeric:""}},[e._v(" "+e._s(e._f("eurPrice")(t.row.price))+" € ")]):e._e(),t.row.price?r("b-table-column",{attrs:{label:"Difference",numeric:""}},[r("percentage",{attrs:{value:e.percentage(t.row)}})],1):e._e(),null!==t.row.change?r("b-table-column",{attrs:{label:"Today",numeric:""}},[r("percentage",{attrs:{value:t.row.change}})],1):e._e()]}}])}),r("section",[r("b-tag",[e._v("USD/EUR: "+e._s(e._f("round")(e.usdToEurRate,3)))])],1)],1)},h=[],m=(r("4160"),r("d3b7"),r("25f0"),r("159b"),r("96cf"),r("1da1")),d=r("bee2"),v=r("df67"),y=(r("99af"),r("bc3a")),w=r.n(y),O=function(){function e(t){Object(o["a"])(this,e),this.key=t}return Object(d["a"])(e,[{key:"price",value:function(){var e=Object(m["a"])(regeneratorRuntime.mark((function e(t){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,w.a.get("https://cloud.iexapis.com/stable/stock/".concat(t.symbol,"/quote?token=").concat(this.key));case 2:r=e.sent,t.price=v["Money"].fromDecimal(r.data.latestPrice,"usd",Math.ceil),t.change=r.data.changePercent;case 5:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"fxRate",value:function(){var e=Object(m["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,w.a.get("https://api.exchangeratesapi.io/latest?base=USD&symbols=EUR");case 2:return t=e.sent,e.abrupt("return",t.data.rates.EUR);case 4:case"end":return e.stop()}}),e)})));function t(){return e.apply(this,arguments)}return t}()}]),e}(),g=(r("b0c0"),function e(t,r,n,a,c,i){var u=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0;Object(o["a"])(this,e),this.name=t,this.isin=r,this.symbol=n,this.currency=a,this.buyPrice=c,this.buyAmount=i,this.factor=u,this.price=null,this.change=null}),j=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("span",{class:{positive:e.value>0,negative:e.value<0}},[e._v(e._s(e._f("percentage")(e.value)))])},S=[],U=(r("a9e3"),function(e){function t(){return Object(o["a"])(this,t),Object(u["a"])(this,Object(s["a"])(t).apply(this,arguments))}return Object(l["a"])(t,e),t}(p["c"]));Object(f["a"])([Object(p["b"])(Number)],U.prototype,"value",void 0),U=Object(f["a"])([p["a"]],U);var _=U,R=_,D=(r("5a91"),r("2877")),M=Object(D["a"])(R,j,S,!1,null,"695ad3fb",null),k=M.exports,E=0;function C(e){return v["Money"].fromInteger(Math.ceil(e.amount*E),"EUR")}var x=function(e){function t(){var e;return Object(o["a"])(this,t),e=Object(u["a"])(this,Object(s["a"])(t).apply(this,arguments)),e.stocks=[new g("AMD","US0079031078","AMD",v["Currencies"].USD,v["Money"].fromDecimal(38.45,"EUR"),26),new g("Alphabet","US02079K3059","GOOGL",v["Currencies"].USD,v["Money"].fromDecimal(1026.42,"EUR"),5,2),new g("Coca Cola","US1912161007","KO",v["Currencies"].USD,v["Money"].fromDecimal(41.79,"EUR"),70),new g("Facebook","US30303M1027","FB",v["Currencies"].USD,v["Money"].fromDecimal(136.98,"EUR"),15),new g("Fortuna Silver Mines","CA3499151080","FSM",v["Currencies"].USD,v["Money"].fromDecimal(2.25,"EUR"),90,-1),new g("Kraft Heinz","US5007541064","KHC",v["Currencies"].USD,v["Money"].fromDecimal(31.44,"EUR"),100),new g("Paypal","US70450Y1038","PYPL",v["Currencies"].USD,v["Money"].fromDecimal(70.78,"EUR"),29),new g("RWE","DE0007037129","RWNFF",v["Currencies"].USD,v["Money"].fromDecimal(54.94,"EUR"),18),new g("Twitter","US90184L1026","TWTR",v["Currencies"].USD,v["Money"].fromDecimal(25.24,"EUR"),188,-1),new g("Xiaomi","KYG9830T1067","XIACF",v["Currencies"].USD,v["Money"].fromDecimal(1.03,"EUR"),5600,-2)],e.columns=[{field:"name",label:"Name"},{field:"price",label:"Share price"}],e.usdToEurRate=0,e}return Object(l["a"])(t,e),Object(d["a"])(t,[{key:"percentage",value:function(e){var t=e.price;return t.getCurrencyInfo()===v["Currencies"].USD&&(t=C(t)),t.amount/e.buyPrice.amount-1}},{key:"mounted",value:function(){var e=Object(m["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=new O("pk_b6fe1d1f8ebd4a04919de6910c70cf62"),e.next=3,t.fxRate();case 3:if(e.t0=e.sent,e.t0){e.next=6;break}e.t0=.9;case 6:this.usdToEurRate=e.t0,E=this.usdToEurRate,this.stocks.forEach(function(){var e=Object(m["a"])(regeneratorRuntime.mark((function e(r){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.price(r);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 9:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}]),t}(p["c"]);x=Object(f["a"])([Object(p["a"])({components:{Percentage:k},filters:{round:function(e,t){return Math.round(e*Math.pow(10,t))/Math.pow(10,t)},eurPrice:function(e){return e?e.getCurrencyInfo()===v["Currencies"].USD?C(e).toString():e.toString():""}}})],x);var P=x,T=P,F=(r("5b58"),Object(D["a"])(T,b,h,!1,null,"1652610c",null)),A=F.exports,I=function(e){function t(){return Object(o["a"])(this,t),Object(u["a"])(this,Object(s["a"])(t).apply(this,arguments))}return Object(l["a"])(t,e),t}(p["c"]);I=Object(f["a"])([Object(p["a"])({components:{Stocks:A}})],I);var K=I,$=K,N=(r("5c0b"),Object(D["a"])($,c,i,!1,null,null,null)),G=N.exports,L=(r("5abe"),r("cd1a"));n["a"].use(a["a"]),n["a"].use(L["a"]),n["a"].config.productionTip=!1,new n["a"]({render:function(e){return e(G)}}).$mount("#app")},fa50:function(e,t,r){}});