(function (window) {  

  NOVA.redirectToJob = function(){
    window.location = '/order/'+NOVA.order_id();
  }

  NOVA.redirectToFinances = function(){
    window.location = '/order/'+NOVA.order_id()+'/finance';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/order/'+NOVA.order_id()+'/invoice';
  }

  NOVA.redirectToStops = function(){
    window.location = '/order/'+NOVA.order_id()+'/stops';
  }

  NOVA.redirectToIncident = function(){
    window.location = '/order/'+NOVA.order_id()+'/incident'
  }
  
})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 2];
    NOVA.order_id(id);
    NOVA.source('order');
    NOVA.getDocuments();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;