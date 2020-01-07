(function (window) {
  NOVA.run_vehicle_id = ko.observable();
})(this);

  function init() {
    $('#inspections').addClass('active')
    if (document.readyState == "interactive") {
      NOVA.hideLoading();
      var docUrlArr = document.URL.split('/');
      var inspection_id = docUrlArr[docUrlArr.length - 2];
      NOVA.inspection_id(inspection_id);
      var vehicle_id = docUrlArr[docUrlArr.length - 4];
      NOVA.getInspectionDetails();
      NOVA.vehicle_id(vehicle_id)
      NOVA.run_vehicle_id(vehicle_id)
      $('#vehicleId').attr('disabled',true)
      $('#vehicleRegistration').attr('disabled',true)
      NOVA.getAppLogo();
      ko.applyBindings(NOVA);
    }
  }

document.onreadystatechange = init;