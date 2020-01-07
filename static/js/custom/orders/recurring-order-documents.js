(function (window) {  

  NOVA.redirectToJob = function(){
    window.location = '/orders/recurring/'+NOVA.order_id();
  }

  NOVA.redirectToFinances = function(){
    window.location = '/order/recurring/'+NOVA.order_id()+'/finance';
  }
  
})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var id = docUrlArr[docUrlArr.length - 2];
    NOVA.order_id(id);
    NOVA.source('config');
    NOVA.getDocuments();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;