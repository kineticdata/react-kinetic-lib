(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{376:function(u,e,a){!function(u){"use strict";var e="nolla yksi kaksi kolme nelj\xe4 viisi kuusi seitsem\xe4n kahdeksan yhdeks\xe4n".split(" "),a=["nolla","yhden","kahden","kolmen","nelj\xe4n","viiden","kuuden",e[7],e[8],e[9]];function n(u,e,a,n){var i="";switch(a){case"s":return n?"muutaman sekunnin":"muutama sekunti";case"ss":return n?"sekunnin":"sekuntia";case"m":return n?"minuutin":"minuutti";case"mm":i=n?"minuutin":"minuuttia";break;case"h":return n?"tunnin":"tunti";case"hh":i=n?"tunnin":"tuntia";break;case"d":return n?"p\xe4iv\xe4n":"p\xe4iv\xe4";case"dd":i=n?"p\xe4iv\xe4n":"p\xe4iv\xe4\xe4";break;case"M":return n?"kuukauden":"kuukausi";case"MM":i=n?"kuukauden":"kuukautta";break;case"y":return n?"vuoden":"vuosi";case"yy":i=n?"vuoden":"vuotta"}return t(u,n)+" "+i}function t(u,n){return u<10?n?a[u]:e[u]:u}u.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kes\xe4kuu_hein\xe4kuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kes\xe4_hein\xe4_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] HH.mm",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] HH.mm",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] HH.mm",llll:"ddd, Do MMM YYYY, [klo] HH.mm"},calendar:{sameDay:"[t\xe4n\xe4\xe4n] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s p\xe4\xe4st\xe4",past:"%s sitten",s:n,ss:n,m:n,mm:n,h:n,hh:n,d:n,dd:n,M:n,MM:n,y:n,yy:n},dayOfMonthOrdinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}(a(50))}}]);