(function(e){function t(t){for(var r,i,o=t[0],u=t[1],s=t[2],f=0,p=[];f<o.length;f++)i=o[f],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&p.push(a[i][0]),a[i]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);l&&l(t);while(p.length)p.shift()();return c.push.apply(c,s||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],r=!0,o=1;o<n.length;o++){var u=n[o];0!==a[u]&&(r=!1)}r&&(c.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},a={app:0},c=[];function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],u=o.push.bind(o);o.push=t,o=o.slice();for(var s=0;s<o.length;s++)t(o[s]);var l=u;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"0554":function(e,t,n){var r=n("96a4");"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var a=n("499e").default;a("17611838",r,!0,{sourceMap:!1,shadowMode:!1})},"07d8":function(e,t,n){var r=n("0b37");"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var a=n("499e").default;a("776a0bf1",r,!0,{sourceMap:!1,shadowMode:!1})},"0b37":function(e,t,n){var r=n("24fb");t=r(!1),t.push([e.i,".positive[data-v-695ad3fb]{color:green}.negative[data-v-695ad3fb]{color:red}",""]),e.exports=t},"2d79":function(e,t,n){var r=n("52e9");"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var a=n("499e").default;a("6788e88d",r,!0,{sourceMap:!1,shadowMode:!1})},"4d5e":function(e,t,n){"use strict";var r=n("2d79"),a=n.n(r);a.a},"52e9":function(e,t,n){var r=n("24fb");t=r(!1),t.push([e.i,"h3[data-v-0ddd1919]{margin:40px 0 0}ul[data-v-0ddd1919]{list-style-type:none;padding:0}li[data-v-0ddd1919]{display:inline-block;margin:0 10px}a[data-v-0ddd1919]{color:#42b983}",""]),e.exports=t},"5a91":function(e,t,n){"use strict";var r=n("07d8"),a=n.n(r);a.a},"5c0b":function(e,t,n){"use strict";var r=n("0554"),a=n.n(r);a.a},"96a4":function(e,t,n){var r=n("24fb");t=r(!1),t.push([e.i,"#app{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-align:center;color:#2c3e50}",""]),e.exports=t},cd49:function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=n("289d"),c=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[e._m(0),n("Stocks")],1)},i=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"hero is-primary"},[n("div",{staticClass:"hero-body"},[n("div",{staticClass:"container"},[n("h1",{staticClass:"title"},[e._v("Stocks")])])])])}],o=n("d4ec"),u=n("99de"),s=n("7e84"),l=n("262e"),f=n("9ab4"),p=n("60a3"),d=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{staticClass:"level"},[n("div",{staticClass:"level-item has-text-centered"},[n("div",[n("p",{staticClass:"heading"},[e._v("Value")]),n("p",{staticClass:"title"},[e._v(e._s(e._f("money")(e.total)))]),n("p",[e._v("Profit: "+e._s(e._f("money")(e.profit))+" ("),n("percentage",{attrs:{value:e.profitPercent}}),e._v(")")],1),n("p",[e._v("Invest: "+e._s(e._f("money")(e.invest)))])])]),n("div",{staticClass:"level-item has-text-centered"},[n("div",[n("p",{staticClass:"heading"},[e._v("Today")]),n("p",{staticClass:"title"},[n("percentage",{attrs:{value:e.todaysPercent}})],1)])])]),n("b-table",{attrs:{data:e.stocks},scopedSlots:e._u([{key:"default",fn:function(t){return[n("b-table-column",{attrs:{field:"name",label:"Name"}},[e._v(" "+e._s(t.row.name)+" ")]),n("b-table-column",{attrs:{label:"Buy price",numeric:""}},[e._v(" "+e._s(e._f("money")(t.row.buyPrice))+" ")]),t.row.price?n("b-table-column",{attrs:{label:"Share price",numeric:""}},[e._v(" "+e._s(e._f("money")(t.row.price))+" ")]):e._e(),t.row.price?n("b-table-column",{attrs:{label:"Difference",numeric:""}},[n("percentage",{attrs:{value:e.percentage(t.row)}})],1):e._e(),null!==t.row.change?n("b-table-column",{attrs:{label:"Today",numeric:""}},[n("percentage",{attrs:{value:t.row.change}})],1):e._e()]}}])}),n("section",[n("b-tag",[e._v("EUR/USD: "+e._s(e._f("round")(1/e.usdToEurRate,3)))])],1)],1)},b=[],m=(n("4de4"),n("4160"),n("d81d"),n("13d5"),n("159b"),n("96cf"),n("1da1")),v=n("bee2"),h=n("df67"),y=(n("99af"),n("bc3a")),g=n.n(y),w=function(){function e(t,n){Object(o["a"])(this,e),this.url=t,this.key=n}return Object(v["a"])(e,[{key:"price",value:function(){var e=Object(m["a"])(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,g.a.get("".concat(this.url,"/stock/").concat(t.symbol,"/quote?token=").concat(this.key));case 2:return n=e.sent,e.abrupt("return",{price:h["Money"].fromDecimal(n.data.latestPrice,"USD",Math.ceil),change:n.data.changePercent});case 4:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"fxRate",value:function(){var e=Object(m["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,g.a.get("https://api.exchangeratesapi.io/latest?base=USD&symbols=EUR");case 2:return t=e.sent,e.abrupt("return",t.data.rates.EUR);case 4:case"end":return e.stop()}}),e)})));function t(){return e.apply(this,arguments)}return t}()}]),e}(),_=(n("b0c0"),function e(t,n,r,a,c,i){Object(o["a"])(this,e),this.name=t,this.isin=n,this.symbol=r,this.currency=a,this.buyPrice=c,this.buyAmount=i,this.price=null,this.change=null}),O=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("span",{class:{positive:e.value>0,negative:e.value<0}},[e._v(e._s(e._f("percentage")(e.value)))])},j=[],U=(n("a9e3"),function(e){function t(){return Object(o["a"])(this,t),Object(u["a"])(this,Object(s["a"])(t).apply(this,arguments))}return Object(l["a"])(t,e),t}(p["c"]));Object(f["a"])([Object(p["b"])(Number)],U.prototype,"value",void 0),U=Object(f["a"])([p["a"]],U);var k=U,S=k,x=(n("5a91"),n("2877")),M=Object(x["a"])(S,O,j,!1,null,"695ad3fb",null),R=M.exports,D=0;function C(e){return h["Money"].fromInteger(Math.ceil(e.amount*D),"EUR")}function E(e){return e.reduce((function(e,t){var n=t.getCurrencyInfo()===h["Currencies"].USD?C(t):t;return e.add(n)}),h["Money"].fromDecimal(0,"EUR"))}var P=function(e){function t(){var e;return Object(o["a"])(this,t),e=Object(u["a"])(this,Object(s["a"])(t).apply(this,arguments)),e.stocks=[new _("AMD","US0079031078","AMD",h["Currencies"].USD,h["Money"].fromDecimal(38.45,"EUR"),26),new _("Alphabet","US02079K3059","GOOGL",h["Currencies"].USD,h["Money"].fromDecimal(1026.42,"EUR"),5),new _("Coca Cola","US1912161007","KO",h["Currencies"].USD,h["Money"].fromDecimal(41.79,"EUR"),70),new _("Facebook","US30303M1027","FB",h["Currencies"].USD,h["Money"].fromDecimal(136.98,"EUR"),15),new _("Fortuna Silver Mines","CA3499151080","FSM",h["Currencies"].USD,h["Money"].fromDecimal(2.25,"EUR"),90),new _("Kraft Heinz","US5007541064","KHC",h["Currencies"].USD,h["Money"].fromDecimal(31.44,"EUR"),100),new _("Paypal","US70450Y1038","PYPL",h["Currencies"].USD,h["Money"].fromDecimal(70.78,"EUR"),29),new _("RWE","DE0007037129","RWNFF",h["Currencies"].USD,h["Money"].fromDecimal(54.94,"EUR"),18),new _("Twitter","US90184L1026","TWTR",h["Currencies"].USD,h["Money"].fromDecimal(25.24,"EUR"),188),new _("Xiaomi","KYG9830T1067","XIACF",h["Currencies"].USD,h["Money"].fromDecimal(1.03,"EUR"),5600)],e.columns=[{field:"name",label:"Name"},{field:"price",label:"Share price"}],e.usdToEurRate=0,e}return Object(l["a"])(t,e),Object(v["a"])(t,[{key:"percentage",value:function(e){var t=e.price;return t.getCurrencyInfo()===h["Currencies"].USD&&(t=C(t)),t.amount/e.buyPrice.amount-1}},{key:"mounted",value:function(){var e=Object(m["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=new w("https://cloud.iexapis.com/stable","pk_b6fe1d1f8ebd4a04919de6910c70cf62"),e.next=3,t.fxRate();case 3:if(e.t0=e.sent,e.t0){e.next=6;break}e.t0=.9;case 6:this.usdToEurRate=e.t0,D=this.usdToEurRate,this.stocks.forEach(function(){var e=Object(m["a"])(regeneratorRuntime.mark((function e(n){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.price(n);case 2:r=e.sent,n.price=C(r.price),n.change=r.change;case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 9:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"total",get:function(){return E(this.stocks.filter((function(e){return e.price})).map((function(e){return e.price.multiply(e.buyAmount)})))}},{key:"invest",get:function(){return E(this.stocks.map((function(e){return e.buyPrice.multiply(e.buyAmount)})))}},{key:"profit",get:function(){return this.total.subtract(this.invest)}},{key:"profitPercent",get:function(){return this.profit.amount/this.invest.amount}},{key:"todaysPercent",get:function(){var e=this.stocks.filter((function(e){return e.change})).filter((function(e){return e.price})).map((function(e){return e.change*e.buyAmount*e.price.amount})).reduce((function(e,t){return e+t}),0),t=this.stocks.filter((function(e){return e.price})).map((function(e){return e.buyAmount*e.price.amount})).reduce((function(e,t){return e+t}),0);return e/t}}]),t}(p["c"]);P=Object(f["a"])([Object(p["a"])({components:{Percentage:R},filters:{round:function(e,t){return Math.round(e*Math.pow(10,t))/Math.pow(10,t)},money:function(e){return e?new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(e.amount/100):""}}})],P);var T=P,A=T,F=(n("4d5e"),Object(x["a"])(A,d,b,!1,null,"0ddd1919",null)),I=F.exports,K=function(e){function t(){return Object(o["a"])(this,t),Object(u["a"])(this,Object(s["a"])(t).apply(this,arguments))}return Object(l["a"])(t,e),t}(p["c"]);K=Object(f["a"])([Object(p["a"])({components:{Stocks:I}})],K);var N=K,$=N,G=(n("5c0b"),Object(x["a"])($,c,i,!1,null,null,null)),H=G.exports,L=(n("5abe"),n("cd1a"));r["a"].use(a["a"]),r["a"].use(L["a"]),r["a"].config.productionTip=!1,new r["a"]({render:function(e){return e(H)}}).$mount("#app")}});