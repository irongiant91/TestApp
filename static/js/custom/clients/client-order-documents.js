(function (window) {    
  NOVA.client_id = ko.observable('');

  NOVA.redirectToJob = function(){
    window.location = '/client/'+NOVA.client_id()+'/orders/'+NOVA.order_id();
  }

  NOVA.redirectToFinances = function(){
    window.location = '/client/'+NOVA.client_id()+'/finance/'+NOVA.order_id()+'/order';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/client/'+NOVA.client_id()+'/invoice/'+NOVA.order_id()+'/order';
  }

  NOVA.redirectToStops = function(){
    window.location = '/client/'+NOVA.client_id()+'/stops/'+NOVA.order_id()+'/order';
  }

  NOVA.redirectToIncident = function(){
    window.location = '/client/'+NOVA.client_id()+'/incident/'+NOVA.order_id()+'/order';
  }

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 2];
    var client_id = docUrlArr[docUrlArr.length - 4]
    NOVA.order_id(id);
    NOVA.client_id(client_id);
    NOVA.source('order');
    NOVA.getDocuments();
    ko.applyBindings(NOVA);
  }
}  
document.onreadystatechange = init;