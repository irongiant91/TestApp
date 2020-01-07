function init() {
  if (document.readyState == "interactive") {
  ko.applyBindings(NOVA);
  NOVA.hideLoading();
  var docUrlArr = document.URL.split('/');
  var order_id = docUrlArr[docUrlArr.length - 2];
  NOVA.order_id(order_id);
  NOVA.source('config');
  NOVA.getorderFinances();
  NOVA.getAppLogo();
  }
}

document.onreadystatechange = init;