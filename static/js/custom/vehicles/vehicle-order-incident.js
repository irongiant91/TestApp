(function (window) {
  NOVA.vehicle_id = ko.observable('');

  NOVA.redirectToJob = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id();
  }

  NOVA.redirectToDocuments = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/invoices';
  }

  NOVA.redirectToFinances = function(){
    window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+NOVA.order_id()+'/finances';
  }

})(this);
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 2];
    NOVA.order_id(id);
    var vehicle_id = docUrlArr[docUrlArr.length - 4];
    NOVA.vehicle_id(vehicle_id);
    NOVA.getIncidents();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;