
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    $('#navItemClients').addClass('active');
    NOVA.getAppLogo();   
    var docUrlArr = document.URL.split('/');
    NOVA.order_type('order');
    var order_id = docUrlArr[docUrlArr.length - 1];
    NOVA.order_id(order_id);
    var client_id = docUrlArr[docUrlArr.length - 4];
    NOVA.client_id(client_id);
    NOVA.getPPERequirements();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;