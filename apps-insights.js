// Functions  
function addActivityKey( keyString , value ) {
	 var keys = keyString.split(".");

	if( localStorage.getItem('computedState') == null ) {
		var computedState = {};
	} else {
		var computedState = JSON.parse( localStorage.getItem('computedState') );
	}

	var currentObj = computedState;
	for (var i = 0; i < keys.length - 1; i++) {
		var key = keys[i];
		currentObj = currentObj[key];
	}

	var lastKey = keys[keys.length - 1];
	currentObj[lastKey] = value;
	 
	localStorage.setItem('computedState', JSON.stringify( computedState ) );
}

function getActivityKey( key ) {
	var computedState = localStorage.getItem('computedState');

	if( computedState != null ) {
		var computedState = JSON.parse( localStorage.getItem('computedState') );
		return computedState[key];
	}

	return computedState;
}

function getDevice() {
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
		return "mobile";
	}else{
		return "desktop";
	}
}

function getUTMParameters() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  const utmParameters = {};
  
  for (const [key, value] of urlParams.entries()) {
    if (key.startsWith('utm_')) {
      utmParameters[key] = value;
    }
  }
  
  return utmParameters;
}

function appsInsightsInit() {
// Logic 
var landingPage = {
	page_type: "{{ isset($page) ? $page : '' }}",
	page_title: document.title,
	page_url: window.location.href,
	page_language: document.documentElement.lang || "", 
	from_url: document.referrer,
	landingTime: new Date()
}

// UTM Tracking
var utmParameters = getUTMParameters(); 
landingPage = { ...landingPage, ...utmParameters};

addActivityKey('deviceType', getDevice() );

if( getActivityKey('landingPage') == null ) {
	addActivityKey('landingPage',landingPage);
	addActivityKey('active_page', window.location.href );
} else {

	if( getActivityKey('pageCount') == null )
		pageCount = 0;
	else
		pageCount = getActivityKey('pageCount');

	if( getActivityKey('active_page') == window.location.href ) {

		if( getActivityKey("page" + pageCount + ".reloadCount") == null ) {
			addActivityKey( "page" + pageCount + ".reloadCount", 1 );
		} else {
			addActivityKey( "page" + pageCount + ".reloadCount", 1 + getActivityKey("page" + pageCount + ".reloadCount") );
		}
	} else {
		pageCount = pageCount + 1;
		addActivityKey('page' + pageCount, landingPage);
		
		addActivityKey('pageCount', pageCount );
		
		addActivityKey('active_page', window.location.href );
	}
}
