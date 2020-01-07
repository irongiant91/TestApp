(function (window) {    
  NOVA.vehicle_id = ko.observable('');

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    $('#navItemVehicles').addClass('active');
    NOVA.getAppLogo();   
    var docUrlArr = document.URL.split('/');
    NOVA.order_type('order');
    var order_id = docUrlArr[docUrlArr.length - 2];
    NOVA.order_id(order_id);
    var vehicle_id = docUrlArr[docUrlArr.length - 4];
    NOVA.vehicle_id(vehicle_id);
    NOVA.getPPERequirements();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;