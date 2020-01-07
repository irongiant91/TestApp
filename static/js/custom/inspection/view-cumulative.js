(function (window) {
  NOVA.start_time = ko.observable('');
  NOVA.end_time = ko.observable('');
  NOVA.inspection_id = ko.observable('');

  NOVA.inspectionLst = ko.observableArray([]);

  $('input[name="startDate"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      parentEl: "#allocateUnitsModal",
      locale: {
        format: 'DD MMM YYYY'
      }
    }).on('apply.daterangepicker', function(ev, picker) {

      $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
      

  $('input[name="endDate"]').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    autoUpdateInput: false,
    minDate: picker.startDate,
    parentEl: "#allocateUnitsModal",
    locale: {
      format: 'DD MMM YYYY'
    }
  }).on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
    if ($(this).hasClass("error")){
      $(this).parent().siblings("span.error").remove();
      $(this).removeClass("error text-danger");
    }        
  });

  if (moment(moment($('input[name="contractEndDate"]'))).diff(picker.startDate, 'days') <= 1){
    $('input[name="endDate"]').val('').trigger('change');
    $('input[name="endDate"]').data('daterangepicker').toggle();
  }
});

  jQuery.validator.addMethod("noSPace", function(value, element) {
      return this.optional(element) || /^[a-z,0-9]/i.test(value);
  }, "First space is not allowed");

  var cummulativeReportValidator = $("#cummulativeReport").validate({
    errorElement: 'span',
    errorClass: 'error text-danger',
    errorPlacement: function(error, element) {
      if (element.parent().hasClass("input-group")) {
        error.appendTo( element.parent().parent());
      } else if (element.parent().hasClass("custom-radio")) {
        error.appendTo( element.parent().parent().parent());
      } else {
        error.appendTo( element.parent());
      }
    },
    rules: {
      startDate: {
        required: true,
      },
      endDate : {
        required: true,
      },
    },
    messages: {
      startDate: {
        required: "Please select start date"
      },
      endDate : {
        required: "Please select end date"
      },
    },
    submitHandler: function() {
      NOVA.generateReport()
    }
  });

  NOVA.generateReport = function(data,e){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = {
      'start_time': NOVA.start_time(),
      'end_time': NOVA.end_time(),
      'inspection_id': NOVA.inspection_id(),
    }
    $.ajax({
      method: 'GET',
      url: '/api/inspection/view/cummulative/list/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.inspectionLst([]);
      var lastiter = Math.floor(d.data.length/7)
      for(var i=0; i<d.data.length/7; i++){
        var item = ko.observableArray([]);
        var n = 7
        if(i ==lastiter){
          n=d.data.length%7
        }
        for(var j=0; j<n; j++){
          item.push(d.data[i*7 + j])
        }
       NOVA.inspectionLst.push(item)
      }
      console.log(ko.toJS(NOVA.inspectionLst()))
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.redirectPage = function(data,e){
    if(data.inspected_id != ''){
      window.open('/inspection-report/'+data.inspected_id+'/detail');
    }else{
      window.open('/vehicle/'+data.vehicle_id+'/inspection-run/'+NOVA.inspection_id()+'/create');
    }

  }
})(this);

  function init() {
    $('#inspections').addClass('active')
    $('#inspections').addClass('active')
    if (document.readyState == "interactive") {
      NOVA.hideLoading();
      var docUrlArr = document.URL.split('/');
      var inspection_id = docUrlArr[docUrlArr.length - 2];
      NOVA.inspection_id(inspection_id);
      NOVA.getAppLogo();
      ko.applyBindings(NOVA);
    }
  }

document.onreadystatechange = init;