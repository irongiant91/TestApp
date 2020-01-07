(function (window) {    
  NOVA.vehicle_id = ko.observable('');

  NOVA.redirectToJob = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id();
  }

  NOVA.redirectToFinances = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/finances';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/invoices';
  }

  NOVA.redirectToStops = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/stops';
  }

  NOVA.redirectToIncident = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/incidents';
  }

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 2];
    var vehicle_id = docUrlArr[docUrlArr.length - 4]
    NOVA.order_id(id);
    NOVA.vehicle_id(vehicle_id);
    NOVA.source('order');
    NOVA.getDocuments();
    ko.applyBindings(NOVA);
  }
}  
document.onreadystatechange = init;