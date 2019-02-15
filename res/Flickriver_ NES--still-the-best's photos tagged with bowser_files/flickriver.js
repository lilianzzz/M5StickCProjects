/***************************************************************************
/*
/* Flickriver - "River of photos" Flickr browser
/* 
/* Written by Alex Sirota (alex @ iosart.com), v1 May 2007
/*
/* Copyright (c) Alex Sirota 2007-2009, All Rights Reserved
/*
/* PLEASE DO NOT USE ALL OR PORTIONS OF THIS CODE WITHOUT MY PERMISSION!
/*
/***************************************************************************/
if(typeof Flickriver=="undefined"){var Flickriver={}}function updateProgressStatus(){var a=gPhotoRiverView?gLastImage:Math.min(gPageLoaded*gPhotosPerPage,gTotalPhotos);if(!gbLoadUntilStop){var c=gTotalPhotos;var b=Math.round((gPageLoaded/gTotalPages)*100)+"%";if(a>c){a=c}$("progress-text").innerHTML="loaded "+a+" / "+c+" - "+b}else{if(a>0){$("progress-text").innerHTML="loaded "+a}}}var gAllLoadedFlickrIds={};var gbStopLoading=false;function fetchNewPage(){gPageLoaded++;var e=false;if(!gbLoadUntilStop){e=(gPageLoaded>gTotalPages)}if(gbStopLoading){e=true}if(e){var a=$("footer");if(a&&!Element.visible(a)){Element.show(a)}var g=$("big-progress");if(g&&Element.visible(g)){Element.hide(g)}return}updateProgressStatus();if(gbRandomOrder&&(gRandomPageSequence===null)){initRandomPageSequence()}var f=!gbRandomOrder?gPageLoaded:gRandomPageSequence.pop();var d=gMyURL.match(/\?/)?"&":"?";var c=gMyURL;c=c.replace(/#.*/,"");var b=new Date();var h=b.getTime();c+=d+"ajax&page="+f+"&nocache="+h;gbInAjaxCall=true;Element.show("progress-indicator");new Ajax.Request(c,{method:"get",onSuccess:function(k){var i=k.responseText;if(i=="STOP"){gbStopLoading=true;i=""}var j=document.createElement("div");j.className="photos-page";j.innerHTML=i;$("photos").appendChild(j);Element.extend(j);setTimeout(function(){var l=j.select(".photo-panel");for(var m=0;m<l.length;m++){var p=l[m];if(gbAutoScale){scalePhotoPanelToFit(p,"screen")}var o=false;var q=p.select(".photo-panel-img");if(q.length>0){q=q[0];var n=q.id.replace(/photo-/,"")*1;if(n){if(typeof gAllLoadedFlickrIds[n]!="undefined"){o=true}else{gAllLoadedFlickrIds[n]=1}}}if(!o){gLastImage++;p.id="photo-panel-"+gLastImage}else{Element.hide(p)}}updateProgressStatus()},10)},onFailure:function(){gTotalPages=gPageLoaded;var i=document.createElement("div");i.innerHTML="<p>Couldn't fetch more photos...";$("photos").appendChild(i)},onComplete:function(){gbInAjaxCall=false;Element.hide("progress-indicator");var j=document.location.pathname;if(j.substr(j.length-1,1)!="/"){j+="/"}var i="/ajax"+j+"page/"+gPageLoaded;setTimeout(function(){trackPageView(i)},100)}})}var gRandomPageSequence=null;function initRandomPageSequence(){gRandomPageSequence=[];for(var a=1;a<=gTotalPages;a++){if(a!=gRandomPageLoaded){gRandomPageSequence.push(a)}}arrayShuffle(gRandomPageSequence)}function arrayShuffle(d){for(var c,a,b=d.length;b;){a=parseInt(Math.random()*b);c=d[--b];d[b]=d[a];d[a]=c}}function trackPageView(a){if(typeof _gaq!="undefined"){_gaq.push(["_trackPageview",a])}}function trackEvent(a,b){if(typeof _gaq!="undefined"){_gaq.push(["_trackEvent",a,b])}}function setLinksToTargetBlank(a){var b=a.select("a");for(var c=0;c<b.length;c++){var d=b[c];if(!d.href.match(/flickriver.com/)){d.target="_blank"}}}function isZoomedPhotoVisible(){var a=$("photo-zoomed-view");return(a&&Element.visible(a))}function hideZoomedPhoto(a){if(typeof a=="undefined"){a=true}if(isZoomedPhotoVisible()){var b=$("photo-zoomed-view");var c=$("photo-zoomed-view-screen");Element.hide(b);Element.hide(c);if(a){setAutoScaleState(true)}}}function zoomPhotoButtonClicked(a){showZoomedPhoto(a)}function showZoomedPhoto(j){var d=$("photo-"+j);if(!d){return}var o=Element.up(d,".photo-panel");if(o){setCurrentImageByPanel(o)}var e=d.getAttribute("largesrc");var f=e?d.getAttribute("largesrc"):d.getAttribute("src");var p=d.getAttribute("width");var n=d.getAttribute("height");var m=$("photo-zoomed-view");Element.show(m);var x=$("photo-zoomed-photo");var s=$("photo-zoomed-photo-protector");var h=$("photo-zoomed-please-wait");Element.hide(x);Element.hide(s);x.src="about:blank";Element.show(h);var k=document.viewport.getHeight();var w=document.viewport.getWidth();if(e){var a=scaleToFitRectangle(w,k,p,n,10,20);var l=a[0];var r=a[1]}else{var a=scaleToFitRectangle(Math.min(1024,w-10),Math.min(1024,k-20),p,n,0,0);var l=a[0];var r=a[1]}if(!k){return}var b=[0,0];var t=(k-r)/3;if(t>0){b[1]+=t}var u=(w-l)/2;if(u>0){b[0]+=u}var v=document.viewport.getScrollOffsets();var c=$("photo-zoomed-view-screen");c.style.top=v[1]+"px";c.style.left=0;c.style.width=w+"px";c.style.height=k+"px";Element.show(c);m.style.top=v[1]+b[1]+"px";m.style.left=v[0]+b[0]+"px";x.width=l;x.height=l;x.style.width=l+"px";x.style.height=r+"px";s.width=l;s.height=r;s.style.width=l+"px";s.style.height=r+"px";s.style.marginTop="-"+r+"px";m.style.width=l+"px";m.style.height=r+"px";h.style.width=l+"px";h.style.height=r+"px";var i=h.select("img")[0];var g=$$("body")[0];i.src=!g.hasClassName("onwhite")?i.getAttribute("templatesrc"):i.getAttribute("templatewhitesrc");i.style.top=Math.round(k/3)+"px";var q=new Image();q.onload=function(){x.src=q.src;Element.hide(h);Element.show(x);Element.show(s)};q.src=f;setTimeout(function(){trackEvent("Photos","Zoom")},1000)}function getLoadingHTML(b){if(typeof b=="undefined"){b="Loading..."}var a='<span class="vertical-align">';a+='<img src="'+gMyRoot+'/images/progress.gif" width="16" height="9" alt="" style="margin-right:0.6em">';a+="<span>"+b+"</span>";a+="</span>";return a}var gbTagsLoaded=false;function toggleUserTagPanel(){var a=$("user-tags");Element.toggle(a);if(!Element.visible(a)){return}if(gbTagsLoaded){return}a.innerHTML='<div style="text-align:center">'+getLoadingHTML()+"</div>";var b=gUserFlickriverGetTagsURL;new Ajax.Request(b,{method:"get",onSuccess:function(d){var c=d.responseText;a.innerHTML=c;gbTagsLoaded=true},onFailure:function(){a.innerHTML="Couldn't get tags..."},onComplete:function(){}})}function getCurrentScrollPos(){return window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop}function getWindowHeight(){var a=window.innerHeight?window.innerHeight:document.documentElement.clientHeight;return a}function getWindowWidth(){var a=window.innerWidth?window.innerWidth:document.documentElement.clientWidth;return a}function getRemainingScroll(){var f=getWindowHeight();if(f==0){return null}var c=document.documentElement.scrollHeight;if(c==0){return null}var a=c-f;var e=getCurrentScrollPos();var b=(e/a)*100;var d=a-e;return d}function saveCurrentViewportDimensions(){gCurrentViewportHeight=document.viewport.getHeight();gCurrentViewportWidth=document.viewport.getWidth();gCurrentViewportIsLarge=(gCurrentViewportWidth>=1280)&&(gCurrentViewportHeight>=800);Flickriver.Persist.set("viewport-size",gCurrentViewportWidth+"x"+gCurrentViewportHeight)}function scaleAllPhotoPanelsToFit(c){var a=$("photos").select(".photo-panel");for(var b=0;b<a.length;b++){scalePhotoPanelToFit(a[b],c)}}function scaleToFitRectangle(d,f,g,j,c,b){d-=c;f-=b;var h=g/j;var i=d/f;if(h>i){var e=d;var a=Math.round(e/h)}else{var a=f;var e=Math.round(a*h)}return[e,a]}function scalePhotoPanelToFit(j,h){var c=document.viewport.getHeight();var e=document.viewport.getWidth();var f=j.hasClassName("first");var o=j.select(".photo-panel-img")[0];var d=o.getAttribute("width");var m=o.getAttribute("height");var b=o.getAttribute("largesrc");var l=j.select(".photo-protector");l=(l.length>0)?l[0]:null;if(h=="screen"){if(b){var i=scaleToFitRectangle(e,c,d,m,50,(f?j.offsetTop+100:150));var g=i[0];var a=i[1]}else{var i=scaleToFitRectangle(Math.min(1024,e-30),Math.min(1024,c-100),d,m,0,0);var g=i[0];var a=i[1]}}else{if(h=="large"){var i=scaleToFitRectangle(1024,1024,d,m,0,0);var g=i[0];var a=i[1]}else{if(h=="medium640"){var i=scaleToFitRectangle(640,640,d,m,0,0);var g=i[0];var a=i[1]}else{var i=scaleToFitRectangle(500,500,d,m,0,0);var g=i[0];var a=i[1]}}}if(Math.max(g,a)<500){var i=scaleToFitRectangle(500,500,d,m,0,0);var g=i[0];var a=i[1]}var k=g+4;var p=a+4;j.style.width=k+"px";o.style.width=g+"px";o.style.height=a+"px";if(b){if(Math.max(g,a)>645){var n=o.src;if(n!=b){o.src=b}}}if(l){l.style.width=k+"px";l.style.height=p+"px"}}function switchPhotoSizeMode(c,d,a){if(typeof d=="undefined"){d="true"}if(typeof a=="undefined"){a="true"}switch(c){case"medium":if(a){Flickriver.Persist.set("fitscreen","false");Flickriver.Persist.set("viewlarge","false")}$("photo-size-label-main").innerHTML="photo size: medium 500";break;case"medium640":if(a){Flickriver.Persist.set("fitscreen","false");Flickriver.Persist.set("viewlarge","640")}$("photo-size-label-main").innerHTML="photo size: medium 640";break;case"large":if(a){Flickriver.Persist.set("fitscreen","false");Flickriver.Persist.set("viewlarge","true")}$("photo-size-label-main").innerHTML="photo size: large";break;case"fit":if(a){Flickriver.Persist.set("fitscreen","true")}$("photo-size-label-main").innerHTML="photo size: fit screen";break}$("photo-size-option-medium").checked=false;$("photo-size-option-medium640").checked=false;$("photo-size-option-large").checked=false;$("photo-size-option-fit").checked=false;$("photo-size-option-"+c).checked=true;if(d){var b=document.location.href;b=b.split("?")[0];window.location.href=b}}function setCurrentImageByPanel(b){var c=b.getAttribute("id");var a=c?c.replace(/photo-panel-/,"")*1:1;if(a!=gCurrentImage){setCurrentPhotoClass(false);gCurrentImage=a;setCurrentPhotoClass(true)}}function getCurrentPhotoIndex(){if(isZoomedPhotoVisible()){return}var e=getCurrentScrollPos();var g=getWindowHeight();var c=g/2;var a=$("photos").select(".photo-panel");var f=null;for(var b=0;b<a.length;b++){var d=a[b];if(d.offsetTop>e+c){break}f=d}if(f){setCurrentImageByPanel(f)}}function checkScrollPosition(){if(gbLoaded&&!gbInAjaxCall){var a=getRemainingScroll();if(a===null){return}var b=gbViewLargeImages||(gbAutoScale&&gCurrentViewportIsLarge)?3000:(gbKeyboardMode?1400:(gbIsEmbedded?400:600));if(a<b){fetchNewPage()}if(getCurrentScrollPos()>300){Element.show("page-ops")}else{Element.hide("page-ops")}}}var gLastScrollTimeout=0;var gbProgrammaticScroll=false;function onScroll(){hideZoomedPhoto();if(gbProgrammaticScroll){return}else{setKeyboardMode(false)}checkScrollPosition();clearTimeout(gLastScrollTimeout);gLastScrollTimeout=setTimeout(getCurrentPhotoIndex,200)}function onResize(){hideZoomedPhoto();if(gbAutoScale&&gCurrentViewportWidth&&gCurrentViewportHeight){if((gCurrentViewportHeight!=document.viewport.getHeight())||(gCurrentViewportWidth!=document.viewport.getWidth())){scaleAllPhotoPanelsToFit("screen");var a=$("photo-panel-"+gCurrentImage);if(a&&!a.hasClassName("first")){positionPhotoPanel(a)}}}if(gbKeyboardMode){var a=$("photo-panel-"+gCurrentImage);if(!a){return}positionPhotoPanel(a)}saveCurrentViewportDimensions()}function handleEntry(c,a){if(!c){c=window.event}if(!c){return}var d=typeof(c.srcElement)!="undefined"?c.srcElement:c.target;if(!d){return}if((c.which&&(c.which==13))||(c.keyCode&&(c.keyCode==13))){var e=d.value;e=encodeURIComponent(e);e=e.replace(/%20/g,"+");var b=null;switch(a){case"tag":b=gUserFlickriverTagsURL+e+"/";break}if(b){document.location.href=b}}}function togglePanel(b,a){if(typeof a=="undefined"){Element.toggle(b);return}if(a){Element.show(b)}else{Element.hide(b)}}function toggleLinkPanel(a){togglePanel("tools",false);var c=["link-tiny-button-img","link-medium-button-img","link-badge-img"];for(var b=0;b<c.length;b++){var d=$(c[b]);if(d){d.src=d.getAttribute("templatesrc")}}togglePanel("link-panel",a)}function toggleToolsPanel(a){togglePanel("link-panel",false);var c=["add-to-igoogle-button","add-to-netvibes-button"];for(var b=0;b<c.length;b++){var d=$(c[b]);if(d){d.src=d.getAttribute("templatesrc")}}togglePanel("tools",a)}function changeNearbyRadius(a){Flickriver.Persist.setAndReload("nearby-radius",a)}var gbLoaded=false;function onPageLoaded(){if(gbLoaded){return}if(gbIsIPhone){gFRMobileUtils.iPhoneOnLoad()}else{saveCurrentViewportDimensions()}gbLoaded=true}function onRiverPageLoaded(){if(gbLoaded){return}onPageLoaded();setInterval(checkScrollPosition,1000);setInterval(getCurrentPhotoIndex,4000);if(!gbIsIPhone){if(gbAutoScale){scaleAllPhotoPanelsToFit("screen")}}}function setCurrentPhotoClass(b){var a=$("photo-panel-"+gCurrentImage);if(!a){return}if(b){Element.addClassName(a,"current-photo")}else{Element.removeClassName(a,"current-photo")}}function positionPhotoPanel(b){var d=getWindowHeight();if(!d){return}var a=Position.cumulativeOffset(b);var c=(d-b.offsetHeight)/3;if(c>0){a[1]-=c}gbProgrammaticScroll=true;setTimeout(function(){gbProgrammaticScroll=false},100);window.scrollTo(0,a[1]);checkScrollPosition()}function navigatePhotos(b){setCurrentPhotoClass(true);var c=gCurrentImage+b;if(c<1){return}var a=$("photo-panel-"+c);if(!a){return}setCurrentPhotoClass(false);gCurrentImage=c;setCurrentPhotoClass(true);positionPhotoPanel(a)}function openCurrentPhotoOriginalPage(){var b=$("photo-panel-"+gCurrentImage);if(!b){return}var a=b.getElementsByTagName("a")[0];if(!window.open(a.href)){alert("A popup blocker might be preventing Flickriver from opening this photo page.\nPlease configure your popup blocker to allow Flickriver to open new windows.")}}function zoomCurrentPhoto(){if(isZoomedPhotoVisible()){hideZoomedPhoto();return}var c=$("photo-panel-"+gCurrentImage);if(!c){return}var a=c.select(".photo-panel-img");if(!a||!a.length){return}var b=a[0].id.replace(/photo-/,"")*1;if(!b){return}showZoomedPhoto(b)}var gbKeyboardMode=false;function setKeyboardMode(b){gbKeyboardMode=b;var a=document.getElementsByTagName("body");if(!a||(!a.length)){return}a=a[0];if(gbKeyboardMode){Element.addClassName(a,"keyboard-mode")}else{if(Element.hasClassName(a,"keyboard-mode")){Element.removeClassName(a,"keyboard-mode")}}}function onMouseMove(){}function onMouseScroll(){setKeyboardMode(false)}function getCurrentViewPhotoSize(){if(gbViewLargeImages){return"large"}if(gbViewMedium640Images){return"medium640"}return"medium"}function setAutoScaleState(a){var c=$("photo-panel-"+gCurrentImage);var b=$$("body")[0];if(a){if(gbAutoScale){return}scaleAllPhotoPanelsToFit("screen");b.addClassName("viewlarge");b.addClassName("fitscreen");switchPhotoSizeMode("fit",false,false)}else{if(!gbAutoScale){return}scaleAllPhotoPanelsToFit(getCurrentViewPhotoSize());b.removeClassName("viewlarge");b.removeClassName("fitscreen");switchPhotoSizeMode(getCurrentViewPhotoSize(),false,false)}if(c){setTimeout(function(){positionPhotoPanel(c)},10)}gbAutoScale=a}function onKeyPress(c){if(gFRCommentPanel.isVisible()){return}if(!c){c=window.event}if(!c){return}var e=typeof(c.srcElement)!="undefined"?c.srcElement:c.target;if(!e){return}if(e.tagName.toLowerCase()=="input"){return}var a=c.which;var f=c.keyCode;var d=a?a:f;var b=String.fromCharCode(d);if((b=="j")||(b==" ")){setKeyboardMode(true);navigatePhotos(1);Event.stop(c);return false}else{if((b=="k")||(d==8)){setKeyboardMode(true);navigatePhotos(-1);Event.stop(c)}else{if(b=="v"){openCurrentPhotoOriginalPage();Event.stop(c)}else{if((d==122)&&(a!=0)){if(isZoomedPhotoVisible()){hideZoomedPhoto(false);setAutoScaleState(false)}else{zoomCurrentPhoto()}Event.stop(c)}else{if(d==27){hideZoomedPhoto();setKeyboardMode(false);setAutoScaleState(false);Event.stop(c)}}}}}}function onEntryboxExpand(a){Element.addClassName(a,"focused")}function onEntryboxCollapse(a){Element.removeClassName(a,"focused")}function showDateChooser(){var b=$("date-chooser");var g=$("date-chooser-link");if(!Element.visible(b)){Element.show(b)}else{return}var f=Position.cumulativeOffset(g);var a=Element.getHeight(g);var d=f[1]+a+4;b.style.left=f[0]+"px";b.style.top=d+"px";var e=true;var c=function(i){if(e){e=false;return}var h=Event.element(i);if(h.descendantOf(b)){return}Element.hide(b);Event.stopObserving(document,"click",c)};Event.observe(document,"click",c)}function dateChooserGo(){var f=$("date-chooser-year");var h=$("date-chooser-month");var b=$("date-chooser-day");if(!f||!h||!b){return}f=f.value;h=h.value;b=b.value;var a=new Date(f,h-1,b);var d=a.getFullYear();var e=a.getMonth()+1;var g=a.getDate();if((d!=f)||(e!=h)||(g!=b)){alert("This date does not exist");return}if(h.length==1){h="0"+h}if(b.length==1){b="0"+b}var c=gMyRoot+"/explore/interesting/"+f+"/"+h+"/"+b+"/";document.location=c}var gbChangingFaveStatus=false;function setPhotoFaveStatus(c,a,h,d){var e=false;if(!gLoggedInUserId){var f=confirm("You need to login to add to faves.\nWould you like to login?");if(!f){return}e=true}else{if(gLoggedInUserPerms!="write"){var f=confirm("You need to login and allow Flickriver to add faves.\nWould you like to proceed?");if(!f){return}e=true}}if(e){var b=gMyRoot+"/auth/login/write";document.location=b;return}var b=gMyRoot+"/-/photo-add-to-faves/";var g="photoid="+a+"&stoken="+d;if(!h){g+="&remove=1"}gbChangingFaveStatus=true;new Ajax.Request(b,{method:"post",parameters:g,onSuccess:function(j){var i=j.responseText;if(i=="success"){if(h){c.addClassName("isfavorite");c.setAttribute("title","Undo add to faves")}else{c.removeClassName("isfavorite");c.setAttribute("title","Add to faves")}}else{alert("Problem faving this photo")}},onFailure:function(){alert("Problem faving this photo")},onComplete:function(){gbChangingFaveStatus=false}})}function addToFavoritesButtonClicked(b,a,d){if(gbChangingFaveStatus){return}var c=Event.element(b);if(!c){return}var e=true;if(c.hasClassName("isfavorite")){e=false}setPhotoFaveStatus(c,a,e,d);setTimeout(function(){trackEvent("Photos","Fave")},200)}function playVideo(b,e,c,i){var a="http://www.flickr.com/apps/video/stewart.swf?v=71377";var g='<object type="application/x-shockwave-flash" width="'+c+'" height="'+i+'" data="'+a+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"> <param name="flashvars" value="intl_lang=en-us&flickr_noAutoPlay=false&onsite=true&photo_secret='+e+"&photo_id="+b+'"></param> <param name="movie" value="'+a+'"></param> <param name="bgcolor" value="#000000"></param> <param name="allowFullScreen" value="true"></param><embed type="application/x-shockwave-flash" src="'+a+'" bgcolor="#000000" allowfullscreen="true" flashvars="intl_lang=en-us&flickr_noAutoPlay=false&onsite=true&photo_secret='+e+"&photo_id="+b+'" height="'+i+'" width="'+c+'"></embed></object>';var h=$("photo-img-container-"+b);var d=$("photo-video-container-"+b);var f=$("video-"+b);if(!h||!d||!f){return}Element.hide(h);Element.show(d);f.innerHTML=g}function closeVideoPanel(a){var c=$("photo-img-container-"+a);var b=$("photo-video-container-"+a);if(!c||!b){return}Element.hide(b);Element.show(c)}function switchBlackWhite(){var a=$$("body")[0];if(!a){return}if(a.hasClassName("onwhite")){a.removeClassName("onwhite");Flickriver.Persist.remove("onwhite")}else{a.addClassName("onwhite");Flickriver.Persist.set("onwhite","true")}}function scrollIntoViewIfOffScreen(e){if(!e){return}if(!e.scrollIntoView){return}var b=document.viewport.getScrollOffsets()[1];var d=document.viewport.getHeight();var g=b+d;var a=Element.cumulativeOffset(e)[1];var c=Element.getHeight(e);var f=a+c;if(a>g){e.scrollIntoView(false)}else{if(f<b){e.scrollIntoView(true)}}}function loadExternalScript(b){var a=document.createElement("script");a.src=b;document.documentElement.firstChild.appendChild(a)}Flickriver.Cookie={set:function(c,f,b,e,g){if(typeof e=="undefined"){e=".flickriver.com"}if(typeof g=="undefined"){g="/"}var a="";if(b!=undefined){var h=new Date();h.setTime(h.getTime()+(86400000*parseFloat(b)));a="; expires="+h.toGMTString()}e="; domain="+e;g="; path="+g;return(document.cookie=escape(c)+"="+escape(f||"")+a+e+g)},get:function(a){var b=document.cookie.match(new RegExp("(^|;)\\s*"+escape(a)+"=([^;\\s]*)"));return(b?unescape(b[2]):null)},remove:function(a){var b=Flickriver.Cookie.get(a)||true;Flickriver.Cookie.set(a,"",-1);return b}};Flickriver.Persist={_cookieName:"persist",_dict:{},_fromCookie:function(){this._dict={};var e=Flickriver.Cookie.get(this._cookieName);if(!e){return{}}var a=e.split("&");for(var c=0;c<a.length;c++){var d=a[c].split("=");if(d.length!=2){continue}var b=unescape(d[0]);var e=unescape(d[1]);this._dict[b]=e}return this._dict},_toCookie:function(){var a="";for(key in this._dict){if(a!=""){a+="&"}a+=escape(key)+"="+escape(this._dict[key])}Flickriver.Cookie.set(this._cookieName,a,365*30)},get:function(a){this._fromCookie();return(typeof this._dict[a]=="undefined")?null:this._dict[a]},set:function(a,b){this._fromCookie();this._dict[a]=b;this._toCookie()},remove:function(a,b){this._fromCookie();if(typeof this._dict[a]!="undefined"){delete this._dict[a]}this._toCookie()},setAndReload:function(a,b){this.set(a,b);window.location.reload(true)}};Flickriver.CommentPanel=function(){this.postingComment=false;this.movingPanel=false;this.eventMouseMove=this.onMouseMove.bindAsEventListener(this);this.eventMouseUp=this.onMouseUp.bindAsEventListener(this)};Flickriver.CommentPanel.prototype={isVisible:function(){var a=$("post-comment-panel");return Element.visible(a)},onCommentButtonClicked:function(a,b){var d=$("post-comment-panel");var c=$("post-comment-flickr-link");if(c){c.href=b}if(this.isVisible()&&(d.getAttribute("photoid")==a)){this.close(a)}else{this.show(a)}},close:function(a){var b=$("post-comment-panel");Element.hide(b)},show:function(a){var k=$("photo-"+a);if(!k){return}var g=$("post-comment-panel");var b=$("post-comment-text");var c=g.getAttribute("photoId");if(!c||(c!=a)){b.value=""}this.hideStatus();g.setAttribute("photoid",a);var i=Position.cumulativeOffset(k);var m=Element.getHeight(k);var l=Element.getWidth(k);var j=Element.getWidth(g);var o=Element.getHeight(g);var f=i[0]+Math.round((l-j)/2);var e=i[1]+Math.round((m-o)/3);g.style.top=e+"px";g.style.left=f+"px";var h=this.needToLogin();if(h){Element.hide(b);Element.hide("post-comment-button");Element.hide("cancel-comment-button");var n=$("post-comment-login-text");var d=n.select("span")[0];d.innerHTML=h;Element.show(n)}Element.show(g);scrollIntoViewIfOffScreen(g);setTimeout(function(){b.focus()},10)},showStatus:function(d,b){var c=$("post-comment-panel");var a=$("post-comment-status");a.innerHTML=d;if(b){a.addClassName("error")}else{a.removeClassName("error")}Element.show(a);a.style.visibility="visible"},hideStatus:function(){var a=$("post-comment-status");Element.hide(a);a.style.visibility="hidden"},post:function(d,h){if(this.postingComment){return}var f=$("post-comment-panel");var b=f.getAttribute("photoid");if(!b){return}var c=$("post-comment-text");if(c.value.length<1){return}var i=c.value;var a=gMyRoot+"/-/photo-add-a-comment/";var e="photoid="+b+"&stoken="+d+"&comment="+encodeURIComponent(i)+"&referrer="+encodeURIComponent(h);if(gReferrerTitle){e+="&referrer-title="+encodeURIComponent(gReferrerTitle)}this.postingComment=true;var g=this;new Ajax.Request(a,{method:"post",parameters:e,onSuccess:function(k){var j=k.responseText;if(j=="success"){c.value="";g.showStatus("Comment posted successfully",false);setTimeout(function(){g.close()},1400)}else{g.showStatus("Problem adding a comment",true)}},onFailure:function(){g.showStatus("Problem adding a comment",true)},onComplete:function(){g.postingComment=false}});setTimeout(function(){trackEvent("Photos","Comment")},200)},needToLogin:function(){var a=null;if(!gLoggedInUserId){a="You need to login to add comments."}else{if(gLoggedInUserPerms!="write"){a="You need to login and allow Flickriver to add comments."}}return a},onMouseDownTitle:function(b){if(this.movingPanel){return}var c=$("post-comment-panel");this.movingPanel=c;this.pointerX=Event.pointerX(b);this.pointerY=Event.pointerY(b);var a=$$("body")[0];Event.observe(a,"mousemove",this.eventMouseMove);Event.observe(a,"mouseup",this.eventMouseUp);Event.stop(b)},onMouseMove:function(b){if(!this.movingPanel){return}var f=Event.pointerX(b);var e=Event.pointerY(b);var i=f-this.pointerX;var h=e-this.pointerY;var c=parseFloat(this.movingPanel.style.top);var g=parseFloat(this.movingPanel.style.left);c+=h;g+=i;if(c<0){c=0}if(g<0){g=0}var d=document.viewport.getWidth();var a=Element.getWidth(this.movingPanel);if(g+a>d){g=d-a}this.movingPanel.style.top=c+"px";this.movingPanel.style.left=g+"px";this.pointerX=f;this.pointerY=e;Event.stop(b)},onMouseUp:function(b){if(!this.movingPanel){return}this.movingPanel=false;var a=$$("body")[0];Event.stopObserving(a,"mousemove",this.eventMouseMove);Event.stopObserving(a,"mouseup",this.eventMouseUp);Event.stop(b)}};var gFRCommentPanel=new Flickriver.CommentPanel();Flickriver.InfoPanel=function(){this.showTimeout=null;this.hideTimeout=null;this.showHoverTimeout=500;this.hideHoverOutTimeout=500;this.dockOnHover=true};Flickriver.InfoPanel.prototype={cancelTimers:function(){clearTimeout(this.showTimeout);clearTimeout(this.hideTimeout);this.showTimeout=null;this.hideTimeout=null},onMouseOver:function(a){return;var b=$("photo-more-info-panel-"+a);this.cancelTimers();var c=this;this.showTimeout=setTimeout(function(){if(!Element.visible(b)){if(c.dockOnHover){b.addClassName("docked")}c.show(a)}},c.showHoverTimeout)},onMouseOut:function(a){return;var b=$("photo-more-info-panel-"+a);if(!b.hasClassName("docked")){this.cancelTimers();var c=this;this.hideTimeout=setTimeout(function(){c.close(a)},c.hideHoverOutTimeout)}},onButtonClicked:function(a){var b=$("photo-more-info-panel-"+a);if(Element.visible(b)&&b.hasClassName("docked")){this.close(a);return}b.addClassName("docked");this.show(a)},close:function(a){var b=$("photo-more-info-panel-"+a);Element.hide(b);b.removeClassName("docked");this.cancelTimers()},show:function(a){var b=$("photo-more-info-panel-"+a);var e=$("photo-more-info-panel-contents-"+a);Event.stopObserving(b,"mouseenter");Event.stopObserving(b,"mouseleave");var d=this;Event.observe(b,"mouseenter",function(){d.cancelTimers()});Event.observe(b,"mouseleave",function(){if(!b.hasClassName("docked")){d.cancelTimers();this.hideTimeout=setTimeout(function(){d.close(a)},d.hideHoverOutTimeout)}});var f=(e.innerHTML.length>0);if(!f){e.innerHTML=getLoadingHTML("loading...")}Element.show(b);scrollIntoViewIfOffScreen(b);if(f){return}var c=gMyRoot+"/-/photo-info/"+a+"/";new Ajax.Request(c,{method:"get",onSuccess:function(h){var g=h.responseText;e.innerHTML=g;setTimeout(function(){setLinksToTargetBlank(e)},10)},onFailure:function(){},onComplete:function(){}});setTimeout(function(){trackEvent("Photos","InfoPanel")},200)}};var gFRInfoPanel=new Flickriver.InfoPanel();Flickriver.Search=function(){this._searchHintText={photos:"Search for photos",groups:"Search for groups",users:"Search for a user by username",tags:"Search by photo tags",places:"Search for places in the world"};this._currentSearchType="photos";this._placesSearchCurrentQuery=""};Flickriver.Search.prototype={getSeatchBoxElem:function(){return $("search-box")},getSearchResultsPanelElem:function(){return $("search-results-panel")},getCurrentHintText:function(){return(typeof this._searchHintText[this._currentSearchType]!="undefined")?this._searchHintText[this._currentSearchType]:""},onSearchBoxFocus:function(a){if(a.value==this.getCurrentHintText()){a.value="";Element.addClassName(a,"hastext")}},onSearchBoxBlur:function(a){this.setSearchboxHintState()},onSearchBoxKeydown:function(a){if(!a){a=window.event}if(!a){return}if((a.which&&(a.which==13))||(a.keyCode&&(a.keyCode==13))){this.doSearch()}},setSearchboxHintState:function(){var a=this.getSeatchBoxElem();if(!a){return}if((a.value=="")||(a.value==this.getCurrentHintText())){Element.removeClassName(a,"hastext");a.value=this.getCurrentHintText()}else{Element.addClassName(a,"hastext")}},setSearchTabState:function(d,a){var c=$("search-panel");if(!c){return}var b=c.select(".tab-search-"+d);if(b.length!=1){return}if(!a){Element.removeClassName(b[0],"current")}else{Element.addClassName(b[0],"current")}},setSearchboxText:function(b){var a=this.getSeatchBoxElem();if(!a){return}a.value=b;this.setSearchboxHintState()},changeSearchType:function(a){var b=this.getSeatchBoxElem();if(!b){return}if(b.value==this.getCurrentHintText()){b.value=""}this.setSearchTabState(this._currentSearchType,false);this._currentSearchType=a;this.setSearchTabState(this._currentSearchType,true);this.setSearchboxHintState()},showSearchResultsPanel:function(){var b=this.getSeatchBoxElem();var d=this.getSearchResultsPanelElem();if(!b||!d){return}var f=Position.cumulativeOffset(b);var a=Element.getHeight(b);var c=Element.getWidth(b);var e=f[1]+a+4;d.style.left=f[0]+"px";d.style.top=e+"px";Element.show(d)},hideSearchResultsPanel:function(){Element.hide(this.getSearchResultsPanelElem())},startPlacesSearch:function(e){this._placesSearchCurrentQuery=e;var c=$("search-results-contents");this.showSearchResultsPanel();c.innerHTML=getLoadingHTML("Searching...");var a="/search-places/"+e+"/";var b=gMyRoot+a;var d=this;new Ajax.Request(b,{method:"get",onSuccess:function(g){if(d._placesSearchCurrentQuery==e){var f=g.responseText;c.innerHTML=f}},onFailure:function(){if(d._placesSearchCurrentQuery==e){c.innerHTML="Couldn't get places..."}},onComplete:function(){if(d._placesSearchCurrentQuery==e){setTimeout(function(){trackPageView(a)},100)}}})},doSearch:function(){var b=this.getSeatchBoxElem();if((b.value=="")||(b.value==this.getCurrentHintText())){return}var f=b.value;var e=new RegExp("http://(www.)?flickr.com/groups/([^/]+)/?");var d=new RegExp("http://(www.)?flickr.com/photos/([^/]+)/?");var a=new RegExp("http://(www.)?flickr.com/people/([^/]+)/?");if(e.test(f)||d.test(f)||a.test(f)){f=RegExp.$2}f=f.replace(/\//,"%2F");f=f.replace(/&/,"%26");f=encodeURIComponent(f);f=f.replace(/%20/g,"+");f=f.replace(/%3a/ig,":");var c=null;switch(this._currentSearchType){case"tags":c=gMyRoot+"/photos/tags/"+f+"/interesting/";break;case"photos":c=gMyRoot+"/search/"+f+"/";break;case"users":c=gMyRoot+"/search-username/"+f+"/";break;case"groups":c=gMyRoot+"/search-groups/"+f+"/";break;case"places":this.startPlacesSearch(f);return;break}if(c){document.location.href=c}}};Flickriver.MobileUtils=function(){this.currentPopupPanel=null;this.currentPopupPanelButton=null;this.currentWidth=320;this.currentHovering=null;this.currentHoveringTimeout=null};Flickriver.MobileUtils.prototype={iPhoneOnLoad:function(){var a=this;setTimeout(function(){a.updateOrientation(false)},0);setInterval(function(){a.updateOrientation()},400);window.onorientationchange=function(){a.updateOrientation()};setTimeout(scrollTo,100,0,1);if(window.addEventListener){window.addEventListener("click",function(b){var c=b.target;if(c.href){c.addClassName("active");setTimeout(function(){c.removeClassName("active")},500)}},false)}if(document.body&&document.body.addEventListener){document.body.addEventListener("touchstart",function(c){var d=c.target;if(!d){return}var b=Element.up(d,".photo-panel");if(!b){return}a.currentHoveringTimeout=setTimeout(function(){b.addClassName("hovering");a.currentHovering=b},100)},false);document.body.addEventListener("touchend",function(b){if(a.currentHoveringTimeout){clearTimeout(a.currentHoveringTimeout);a.currentHoveringTimeout=null}if(a.currentHovering){a.currentHovering.removeClassName("hovering");a.currentHovering=null}},false)}},updateOrientation:function(b){if(typeof b=="undefined"){b=true}if(window.innerWidth!=this.currentWidth){this.currentWidth=window.innerWidth;var a=(this.currentWidth<=320)?"portrait":"landscape";document.body.setAttribute("orient",a);if(b&&(typeof gCurrentImage!="undefined")&&!this.currentPopupPanel){var c=$("photo-panel-"+gCurrentImage);if(!c){return}setTimeout(function(){c.scrollIntoView(true)},100)}}},togglePanel:function(d,b){var a=$(b);if(!a){return}var c=d.currentTarget;if(!c){return}c=c.select("img")[0];if(this.currentPopupPanel&&(this.currentPopupPanel!=a)){Element.hide(this.currentPopupPanel)}if(this.currentPopupPanelButton&&(this.currentPopupPanelButton!=c)){this.currentPopupPanelButton.removeClassName("active")}c.toggleClassName("active");Element.toggle(a);if(Element.visible(a)){this.currentPopupPanel=a;this.currentPopupPanelButton=c}else{this.currentPopupPanel=null;this.currentPopupPanelButton=null}Event.stop(d)},switchToFullVersion:function(a){if(a){Flickriver.Cookie.set("forcefull","1",365*30)}else{Flickriver.Cookie.remove("forcefull")}window.location.reload(true)}};var gFRMobileUtils=new Flickriver.MobileUtils();Flickriver.GeoLocation={};Flickriver.GeoLocation.getCurrentPosition=function(a,b){if(typeof geo_location_lib_loaded=="undefined"){geo_location_lib_loaded_callback=function(){Flickriver.GeoLocation.getCurrentPosition(a,b)};var c=(typeof Flickriver.GeoLocation.geoJavaScriptSrc=="undefined")?gMyStaticJSCSSRoot+"/js/geo.js":Flickriver.GeoLocation.geoJavaScriptSrc;loadExternalScript(c);return}if(geo_position_js.init()){geo_position_js.getCurrentPosition(a,b)}else{Flickriver.Maps.getCurrentPosition(a,b)}};Flickriver.Maps={apiKey:"ABQIAAAAUyt4B0vZw2UwPybGUZdSKBR7Qne_s5d683gYr7FIghv3JLwDMhQe-N_BRDNVY_bakWz5l23s4lJlmQ",initAPI:function(a){if(typeof a=="undefined"){a=function(){}}var b=(typeof gbIsIPhone!="undefined")&&gbIsIPhone;var d=b?"sensor=true":"sensor=false";Flickriver.Maps.googleAjaxLoaderCallback=function(){google.load("maps","2",{other_params:d,callback:function(){a()}})};var c="http://www.google.com/jsapi?key="+Flickriver.Maps.apiKey+"&callback=Flickriver.Maps.googleAjaxLoaderCallback";loadExternalScript(c)},renderMap:function(a,g,h,f,e){if(typeof GMap2=="undefined"){if(typeof e=="undefined"){Flickriver.Maps.initAPI(function(){Flickriver.Maps.renderMap(a,g,h,f,true)});return}else{a.innerHTML="Couldn't load map.";return false}}if(!GBrowserIsCompatible()){a.innerHTML="Couldn't load map.";return false}var c=new GLatLng(g,h);var d=new GMap2($(a));d.setCenter(c,f);var b=d.getDefaultUI();d.setUI(b);d.addOverlay(new GMarker(c));return true},getStaticMapImageURL:function(d,a,f,g,e,c){var b="http://maps.google.com/maps/api/staticmap?";if(typeof c!="undefined"){b+="sensor=true"}else{b+="sensor=false"}b+="&key="+Flickriver.Maps.apiKey;b+="&center="+f+","+g;b+="&size="+d+"x"+a;b+="&zoom="+e;b+="&markers="+f+","+g;if(typeof c!="undefined"){b+="&mobile=true"}return b},getCurrentPosition:function(a,b,c){if((typeof google=="undefined")||(typeof google.loader=="undefined")||(typeof google.loader.ClientLocation=="undefined")){if(typeof c=="undefined"){Flickriver.Maps.initAPI(function(){Flickriver.Maps.getCurrentPosition(a,b,true)});return}else{b({code:2,message:"Cannot get current position on this device and browser"});return false}}if(google.loader.ClientLocation&&google.loader.ClientLocation.latitude&&google.loader.ClientLocation.longitude){var d={};d.coords={latitude:google.loader.ClientLocation.latitude,longtitude:google.loader.ClientLocation.longitude,accuracy:11},a(d)}else{b({code:2,message:"Cannot get current position on this device and browser"})}},togglePanel:function(a,d,e,c){var a=$(a);if(!a){return}if(Element.visible(a)){Element.hide(a)}else{Element.show(a);var b=a.select(".map-container")[0];Flickriver.Maps.renderMap(b,d,e,c)}}};Flickriver.MainMenu={showDropDownMenu:function(e){e=Element.extend(e);var g=e.up("li");var b=g.down(".top-link");var d=g.down(".popup-menu");if(Element.visible(d)){return false}Element.show(d);if(b){Element.addClassName(b,"active")}Element.addClassName(e,"drop-down-menu-arrow-active");var a=$(d.id+"-shim");if(a){a.style.top=d.style.top;a.style.right=d.style.right;a.style.width=(d.offsetWidth+2)+"px";a.style.height=(d.offsetHeight+2)+"px";Element.show(a)}var f=true;var c=function(i){if(f){f=false;return}Element.hide(d);if(b){Element.removeClassName(b,"active")}Element.removeClassName(e,"drop-down-menu-arrow-active");var h=$(d.id+"-shim");if(h){Element.hide(h)}Event.stopObserving(document,"click",c)};Event.observe(document,"click",c);return false},onArrowMouseOver:function(b){var a=Element.extend(b).up("li").down(".top-link");a.addClassName("active")},onArrowMouseOut:function(b){if(!b.className.match(/active/)){var a=Element.extend(b).up("li").down(".top-link");a.removeClassName("active")}}};