(function (window) {    
  NOVA.vehicle_id = ko.observable('');

})(this);

function init() {
  if (document.readyState == "interactive") {
  ko.applyBindings(NOVA);
  NOVA.hideLoading();
  var docUrlArr = document.URL.split('/');
  var order_id = docUrlArr[docUrlArr.length - 2];
  NOVA.order_id(order_id);
  var vehicle_id = docUrlArr[docUrlArr.length - 4];
  NOVA.vehicle_id(vehicle_id);
  NOVA.source('order');
  NOVA.getorderFinances();
  NOVA.getAppLogo();
  }
}

document.onreadystatechange = init;