    
function init() {
  if (document.readyState == "interactive") {
    ko.applyBindings(NOVA);
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var order_id = docUrlArr[docUrlArr.length - 2];
    NOVA.order_id(order_id);
    var tz = jstz.determine();
    var timezone = tz.name(); 
    NOVA.user_timezone(timezone);
    NOVA.getOrderStops();
    NOVA.getDriverVehicle()
    NOVA.getAppLogo();
  }
}    
document.onreadystatechange = init;