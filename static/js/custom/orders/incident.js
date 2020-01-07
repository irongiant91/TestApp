(function (window) {
  NOVA.redirectToJob = function(){
    window.location = '/order/'+NOVA.order_id();
  }

  NOVA.redirectToDocuments = function(){
    window.location = '/order/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/order/'+NOVA.order_id()+'/invoice';
  }

  NOVA.redirectToFinances = function(){
    window.location = '/order/'+NOVA.order_id()+'/finance';
  }

})(this);
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 2];
    NOVA.order_id(id);
    NOVA.getIncidents();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;