(function (window) {
  NOVA.service_from = ko.observable('General');
  NOVA.inspection_id = ko.observable('');

})(this);
  
function init() {
  if (document.readyState == "interactive") {
    $('#navItemService').addClass('active');
    NOVA.hideLoading();
    NOVA.getServiceRequestId();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;