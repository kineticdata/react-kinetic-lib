(window.webpackJsonp=window.webpackJsonp||[]).push([[80],{541:function(e,a,s){s(32),s(19),function(e){"use strict";var a={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},s={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};function r(e,a,s,r){var d="";if(a)switch(s){case"s":d="काही सेकंद";break;case"ss":d="%d सेकंद";break;case"m":d="एक मिनिट";break;case"mm":d="%d मिनिटे";break;case"h":d="एक तास";break;case"hh":d="%d तास";break;case"d":d="एक दिवस";break;case"dd":d="%d दिवस";break;case"M":d="एक महिना";break;case"MM":d="%d महिने";break;case"y":d="एक वर्ष";break;case"yy":d="%d वर्षे"}else switch(s){case"s":d="काही सेकंदां";break;case"ss":d="%d सेकंदां";break;case"m":d="एका मिनिटा";break;case"mm":d="%d मिनिटां";break;case"h":d="एका तासा";break;case"hh":d="%d तासां";break;case"d":d="एका दिवसा";break;case"dd":d="%d दिवसां";break;case"M":d="एका महिन्या";break;case"MM":d="%d महिन्यां";break;case"y":d="एका वर्षा";break;case"yy":d="%d वर्षां"}return d.replace(/%d/i,e)}e.defineLocale("mr",{months:"जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),monthsShort:"जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),monthsParseExact:!0,weekdays:"रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm वाजता",LTS:"A h:mm:ss वाजता",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm वाजता",LLLL:"dddd, D MMMM YYYY, A h:mm वाजता"},calendar:{sameDay:"[आज] LT",nextDay:"[उद्या] LT",nextWeek:"dddd, LT",lastDay:"[काल] LT",lastWeek:"[मागील] dddd, LT",sameElse:"L"},relativeTime:{future:"%sमध्ये",past:"%sपूर्वी",s:r,ss:r,m:r,mm:r,h:r,hh:r,d:r,dd:r,M:r,MM:r,y:r,yy:r},preparse:function(e){return e.replace(/[१२३४५६७८९०]/g,function(e){return s[e]})},postformat:function(e){return e.replace(/\d/g,function(e){return a[e]})},meridiemParse:/रात्री|सकाळी|दुपारी|सायंकाळी/,meridiemHour:function(e,a){return 12===e&&(e=0),"रात्री"===a?e<4?e:e+12:"सकाळी"===a?e:"दुपारी"===a?e>=10?e:e+12:"सायंकाळी"===a?e+12:void 0},meridiem:function(e,a,s){return e<4?"रात्री":e<10?"सकाळी":e<17?"दुपारी":e<20?"सायंकाळी":"रात्री"},week:{dow:0,doy:6}})}(s(240))}}]);
//# sourceMappingURL=80-35c242f7d2fd65bf55f5.js.map