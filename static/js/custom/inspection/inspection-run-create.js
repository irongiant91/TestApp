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
      NOVA.getInspectionDetails();
      NOVA.getAppLogo();
      ko.applyBindings(NOVA);
    }
  }

document.onreadystatechange = init;