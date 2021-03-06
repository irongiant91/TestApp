(function (window) {
  NOVA.service_from = ko.observable('General');
  NOVA.inspection_id = ko.observable('');
})(this);
  
function init() {
  if (document.readyState == "interactive") {
  	$('#navItemInspection').addClass('active');
    NOVA.hideLoading();
    var docUrlArr = document.URL.split('/');
    var vehicle_service_id = docUrlArr[docUrlArr.length - 1];
    NOVA.vehicle_service_id(vehicle_service_id);
    var inspection_id = docUrlArr[docUrlArr.length - 4];
    NOVA.inspection_id(inspection_id);
    NOVA.getVehiclesList();
    ko.applyBindings(NOVA);
  }
}

document.onreadystatechange = init;