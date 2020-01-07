(function (window) {
  NOVA.vehicle_id = ko.observable();
  
})(this);

  function init() {
    $('#navItemVehicles').addClass('active');
    if (document.readyState == "interactive") {
      NOVA.hideLoading();
      var docUrlArr = document.URL.split('/');
      console.log(docUrlArr);
      var vehicle_id = docUrlArr[docUrlArr.length - 3];
      var inspection_id = docUrlArr[docUrlArr.length - 1];
      NOVA.inspection_id(inspection_id);
      NOVA.inspection_report_id(inspection_id);
      NOVA.vehicle_id(vehicle_id);
      NOVA.getInspectionDetails();
      NOVA.getAppLogo();
      ko.applyBindings(NOVA);
    }
  }

document.onreadystatechange = init;