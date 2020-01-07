(function (window) {
  NOVA.client_id = ko.observable('');

  NOVA.redirectToJob= function(){
    window.location = '/client/'+NOVA.client_id()+'/orders/'+NOVA.order_id();
  }

  NOVA.redirectToDocuments = function(){
    window.location = '/client/'+NOVA.client_id()+'/orders/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/client/'+NOVA.client_id()+'/invoice/'+NOVA.order_id()+'/order';
  }

  NOVA.redirectToFinances = function (){
    window.location = '/client/'+NOVA.client_id()+'/finance/'+NOVA.order_id()+'/order';
  }

  NOVA.redirectToStops = function(){
    window.location = '/client/'+NOVA.client_id()+'/stops/'+NOVA.order_id()+'/order';
  }

})(this);
function init() {
  if (document.readyState == "interactive") {
    ko.applyBindings(NOVA);
    $('#navItemClients').addClass('active');
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var order_id = docUrlArr[docUrlArr.length - 2];
    NOVA.order_id(order_id);
    var client_id = docUrlArr[docUrlArr.length - 4];
    NOVA.client_id(client_id);
    var tz = jstz.determine();
    var timezone = tz.name(); 
    NOVA.user_timezone(timezone);
    NOVA.getOrderStops();
    NOVA.getDriverVehicle()
    NOVA.getAppLogo();
  }
}    
document.onreadystatechange = init;