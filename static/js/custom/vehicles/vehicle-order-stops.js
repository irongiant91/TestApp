(function (window) {
  NOVA.vehicle_id = ko.observable('');

  NOVA.redirectToJob= function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id();
  }

  NOVA.redirectToDocuments = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/invoices';
  }

  NOVA.redirectToFinances = function (){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/finances';
  }

  NOVA.redirectToStops = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/stops';
  }

})(this);
function init() {
  if (document.readyState == "interactive") {
    ko.applyBindings(NOVA);
    $('#navItemvehicles').addClass('active');
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var order_id = docUrlArr[docUrlArr.length - 2];
    NOVA.order_id(order_id);
    var vehicle_id = docUrlArr[docUrlArr.length - 4];
    NOVA.vehicle_id(vehicle_id);
    var tz = jstz.determine();
    var timezone = tz.name(); 
    NOVA.user_timezone(timezone);
    NOVA.getOrderStops();
    NOVA.getDriverVehicle()
    NOVA.getAppLogo();
  }
}    
document.onreadystatechange = init;