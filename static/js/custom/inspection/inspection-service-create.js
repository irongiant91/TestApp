(function (window) {
  NOVA.service_from = ko.observable('Inspection');
  NOVA.inspection_id = ko.observable('');

})(this);
  
function init() {
  if (document.readyState == "interactive") {
  	$('#navItemInspection').addClass('active');
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
  	var inspection_id = docUrlArr[docUrlArr.length - 3];
  	NOVA.inspection_id(inspection_id);
    NOVA.getServiceRequestId();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;