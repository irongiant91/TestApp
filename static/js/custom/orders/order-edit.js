
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    $('#navItemOrders').addClass('active'); 
    var docUrlArr = document.URL.split('/');
    if(docUrlArr.length > 6){
      NOVA.order_type('config');
    }else{
      NOVA.order_type('order');
    }
    var order_id = docUrlArr[docUrlArr.length - 1];
    NOVA.order_id(order_id);
    NOVA.getPPERequirements();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;