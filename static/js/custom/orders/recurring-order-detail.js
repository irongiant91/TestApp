  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    ko.applyBindings(NOVA);
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 1];
    var tz = jstz.determine();
    var timezone = tz.name(); 
    NOVA.user_timezone(timezone);
    NOVA.order_id(id);
    NOVA.getPeriodicity();
  }
}

document.onreadystatechange = init;