(function (window) {

  NOVA.jobname = ko.observable("");
  NOVA.job_type_id = ko.observable("");
  NOVA.is_published = ko.observable("");
  NOVA.selected_normal = ko.observable(true);
  NOVA.selected_same_day = ko.observable(true);
  NOVA.selected_holiday = ko.observable(true);
  NOVA.selected_after_hour = ko.observable(true);
  NOVA.type_of_service = ko.observable("Normal");

  NOVA.VehicleTypes_list = ko.observableArray([]);
  NOVA.VehicleFeatures_list = ko.observableArray([]);
  NOVA.driverRequirement_list = ko.observableArray([]);
  NOVA.normal_configuration_rates = ko.observableArray([]);
  NOVA.charter_configuration_rates = ko.observableArray([]);
  NOVA.Daysserviceavailable = ko.observableArray([]);
  NOVA.sample_items = ko.observableArray([]);


  NOVA.Daysserviceavailable = ko.observableArray([
    {
      id: 1,
      name: "Monday",
      is_selected: ko.observable(false)
    },
    {
      id: 2,
      name: "Tuesday",
      is_selected: ko.observable(false)
    },
    {
      id: 3,
      name: "Wednesday",
      is_selected: ko.observable(false)
    },
    {
      id: 4,
      name: "Thursday",
      is_selected: ko.observable(false)
    },
    {
      id: 5,
      name: "Friday",
      is_selected: ko.observable(false)
    },
    {
      id: 6,
      name: "Saturday",
      is_selected: ko.observable(false)
    },
    {
      id: 7,
      name: "Sunday",
      is_selected: ko.observable(false)
    }
  ]);

  var day_service_item = function () {
    this.id = ko.observable('');
    this.name = ko.observable('');
    this.is_selected = ko.observable('');

    this.fill = function (d) {
      this.id('' || d.id);
      this.name('' || d.name);
      this.is_selected('' || d.is_selected);
    }
  }


  var vehicle_type_item = function () {
    this.id = ko.observable('');
    this.name = ko.observable('');
    this.is_selected = ko.observable('');

    this.fill = function (d) {
      this.id('' || d.id);
      this.name('' || d.name);
      this.is_selected('' || d.is_selected);
    }
  }

  var vehicle_properties_item = function () {
    this.id = ko.observable('');
    this.name = ko.observable('');
    this.is_selected = ko.observable('');

    this.fill = function (d) {
      this.id('' || d.id);
      this.name('' || d.name);
      this.is_selected('' || d.is_selected);
    }
  }

  var normal_delivery_item = function () {
    this.vehicletype_id = ko.observable('');
    this.vehicletype_name = ko.observable('');
    this.msp_normal = ko.observable('N/A');
    this.rsp_normal = ko.observable('N/A');
    this.msp_same_day = ko.observable('N/A');
    this.rsp_same_day = ko.observable('N/A');
    this.msp_holiday = ko.observable('N/A');
    this.rsp_holiday = ko.observable('N/A');
    this.msp_after_hour = ko.observable('N/A');
    this.rsp_after_hour = ko.observable('N/A');
    this.is_normal = ko.observable(true);
    this.is_same_day = ko.observable(true);
    this.is_holiday = ko.observable(true);
    this.is_after_hour = ko.observable(true);

    // this.item_child_lst = ko.observableArray([]);

    this.fill = function (d) {
      this.vehicletype_id('' || d.vehicletype_id);
      this.vehicletype_name('' || d.vehicletype_name);
      this.msp_normal('' || d.msp_normal);
      this.rsp_normal('' || d.rsp_normal);
      this.msp_same_day('' || d.msp_same_day);
      this.rsp_same_day('' || d.rsp_same_day);
      this.msp_holiday('' || d.msp_holiday);
      this.rsp_holiday('' || d.rsp_holiday);
      this.msp_after_hour('' || d.msp_after_hour);
      this.rsp_after_hour('' || d.rsp_after_hour);
      this.is_normal('' || d.is_normal);
      this.is_same_day('' || d.is_same_day);
      this.is_holiday('' || d.is_holiday);
      this.is_after_hour('' || d.is_after_hour);

      // for(var i=0;i<d.item_child_lst.length;i++){
      //   var child_item1 = new child_item();
      //   child_item1.fill(d.item_child_lst[i]);
      //   this.item_child_lst.push(child_item1);
      // }
      
    }
  }

  NOVA.normal_delivery_init = function(){
    var normal_delivery_item1 = new normal_delivery_item();
    NOVA.normal_configuration_rates.push(normal_delivery_item1);
  }

  var charter_item = function () {
    this.jt_vehicle_id = ko.observable('');
    this.vehicletype_id = ko.observable('');
    this.vehicletype_name = ko.observable('');
    this.item_periods_lst = ko.observableArray([]);

    this.fill = function (d) {
      this.jt_vehicle_id('' || d.jt_vehicle_id);
      this.vehicletype_id('' || d.vehicletype_id);
      this.vehicletype_name('' || d.vehicletype_name);
      for(var i=0;i<d.item_periods_lst.length;i++){
        var child_item1 = new period_item();
        child_item1.fill(d.item_periods_lst[i]);
        this.item_periods_lst.push(child_item1);
      }
      
    }
  }

  var period_item = function (){
    this.period_name = ko.observable('');
    this.period_id = ko.observable('');
    this.period_msp = ko.observable('N/A');
    this.period_rsm = ko.observable('N/A');
    this.fill = function (d) {
        this.period_name('' || d.period_name);
        this.period_id('' || d.period_id);
        this.period_msp('' || d.period_msp);
        this.period_rsm('' || d.period_rsm);
    }
  };

  $(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
    $('.property-requirement-select').select2({
      width: '100%',
      placeholder: 'Add Tags'
    });
    $(document).on('keyup', '#createCharterInput', function() {
      var _this = $(this);
      var passFlag = true;
      if(_this.val() == '') {
        passFlag = false
      }
      if(_this.val().charAt(_this.val().length - 1) == ',') {
        passFlag = false
      }
      var inputVals = _this.val().split(',');
      for(i=0; i<inputVals.length; i++) {
        if(inputVals[i] && i == 0) {
          if(inputVals[i].charAt(0) == ' ') {
            passFlag = false
          }
        }
        if(inputVals.length == i+1) {
          if(inputVals[i].charAt(inputVals[i].length - 1) == ' ') {
            passFlag = false
          }
        }
      }
      $('#createCharterBtn').prop('disabled',!passFlag);
    })
  });

  $('.typeofService').on('change', function() {
    $('#createCharterInput').val('');
    $('#createCharterBtn').prop('disabled',true);
    // $(".day-service"). prop("checked", false);
    // NOVA.Daysserviceavailable().forEach(function(entry){
    //   entry.is_selected(false)
    // })
    if( $(this).val() == 'typeofServiceCharter') {
      NOVA.type_of_service('Charter')
      NOVA.normal_configuration_rates([]);
      NOVA.charter_configuration_rates([]);
      NOVA.selected_normal(false);
      NOVA.selected_same_day(false);
      NOVA.selected_holiday(false);
      NOVA.selected_after_hour(false);
      $('.charter-service-section').removeClass('d-none');
      $('.charter-service-table').addClass('d-none');
      $('.normal-service-section').addClass('d-none');
    } else {
        NOVA.type_of_service('Normal')
        NOVA.normal_configuration_rates([]);
        NOVA.charter_configuration_rates([]);
        NOVA.selected_normal(true);
        NOVA.selected_same_day(true);
        NOVA.selected_holiday(true);
        NOVA.selected_after_hour(true);
        NOVA.VehicleTypes_list().forEach(function(entry){
          if(entry.is_selected() == true){
            var normal_delivery_item1 = new normal_delivery_item();
            var d = {
              vehicletype_id: entry.id(),
              vehicletype_name: entry.name(),
              msp_normal:'N/A',
              rsp_normal: 'N/A',
              msp_same_day:'N/A',
              rsp_same_day:'N/A',
              msp_holiday: 'N/A',
              rsp_holiday:'N/A', 
              msp_after_hour:'N/A',
              rsp_after_hour: 'N/A',  
              is_normal:true,
              is_same_day: true,
              is_holiday: true,
              is_after_hour: true,
            }
            normal_delivery_item1.fill(d);
            NOVA.normal_configuration_rates.push(normal_delivery_item1);
          };
          $('#deliveryChargesYes').prop('checked',true)
          $('#holidayChargesYes').prop('checked',true)
          $('#hourChargesYes').prop('checked',true)
        })
        $('.charter-service-section').addClass('d-none');
        $('.normal-service-section').removeClass('d-none');
    }
  })


  $("#createJob").validate({
    ignore: '',
    errorElement: 'span',
    errorClass: 'error text-danger',
    errorPlacement: function(error, element) {
      if (element.parent().hasClass("form-group")) {
        error.appendTo( element.parent());
      } else {
        error.appendTo( element.parent().parent().parent().parent().parent());
      }
    },
    rules: {
      jobName: "required",
      vehicleTypes: "required",
      vehicleProperties: "required",
      /*daysService: {
       required: function() {
          if($('#typeofServiceNormal').is(':checked')) {
            return true
          } else {
            return false
          }
        }
      },*/
      createCharterCreated: {
        required: function() {
          if($('#typeofServiceCharter').is(':checked')) {
            return true
          } else {
            return false
          }
        }
      }
    },
    messages: {
      jobName: "Please enter job name",
      vehicleTypes: "Please select vehicle type",
      vehicleProperties: "Please select vehicle properties",
      // daysService: "Please select service available day(s)",
      createCharterCreated: "Please enter periods "
    },
    submitHandler: function() {
      // NOVA.mainConfigUpdate();
    }
  });


  $('button[name="saveasdraft"], button[name="nextstep"]').on('click', function (e) {
      e.preventDefault();
      if ($('#createJob').valid()) {
        if($(this).attr('name') == 'saveasdraft') {
          NOVA.saveasDraft();
        } else{
          NOVA.mainConfigUpdate()
        }
      }
  });

  NOVA.getVehicleTypes = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/vehicle/types/get',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.VehicleTypes_list([]);
      for(var i=0; i< d.data.length; i++){
        var types1 = new vehicle_type_item()
        types1.fill(d.data[i]);
        NOVA.VehicleTypes_list.push(types1);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.getVehicleFeatures = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/vehicle/features/get',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.VehicleFeatures_list([]);
      for(var i=0; i< d.data.length; i++){
        var types1 = new vehicle_properties_item()
        types1.fill(d.data[i]);
        NOVA.VehicleFeatures_list.push(types1);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.getDriverPropertyRequirement = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/driver/property/requirement/get',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.driverRequirement_list([]);
      for(var i=0; i< d.data.length; i++){
        NOVA.driverRequirement_list.push(d.data[i]);
      }
      NOVA.getJTdetail();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.selectVehicleFeatures = function(data,e){
    item_selected = $(e.currentTarget).is(':checked')
    if (item_selected == true){
      data.is_selected(true)
    }else{
      data.is_selected(false)
    }
  };

  NOVA.selectVehicleTypes = function(data,e){
    item_selected = $(e.currentTarget).is(':checked')
    if (item_selected == true){
      data.is_selected(true)
      var normal_delivery_item1 = new normal_delivery_item();
      var d = {
        vehicletype_id: data.id(),
        vehicletype_name: data.name(),
        msp_normal:'N/A',
        rsp_normal: 'N/A',
        msp_same_day:'N/A',
        rsp_same_day:'N/A',
        msp_holiday: 'N/A',
        rsp_holiday:'N/A', 
        msp_after_hour:'N/A',
        rsp_after_hour: 'N/A',
        is_normal:NOVA.selected_normal(),
        is_same_day: NOVA.selected_same_day(),
        is_holiday: NOVA.selected_holiday(),
        is_after_hour: NOVA.selected_after_hour(),
      }
      normal_delivery_item1.fill(d);
      NOVA.normal_configuration_rates.push(normal_delivery_item1);
      if($('.typeofService').val() == 'typeofServiceCharter'){
        period_items = $('#createCharterInput').val();
        var inputVals = period_items.split(',')
        if(inputVals.length > 0){
          var charter_delivery_item1 = new charter_item();
          var d1 = {
            jt_vehicle_id: '',
            vehicletype_id: data.id(),
            vehicletype_name: data.name(),
            item_periods_lst: ([]),
          }
          for(i=0; i<inputVals.length; i++) {
            var period_item1 = new period_item()
            var period_i = {
              period_name: inputVals[i],
              period_id: '',
              period_msp: 'N/A',
              period_rsm: 'N/A',
            }
            period_item1.fill(period_i);
            d1.item_periods_lst.push(period_item1)
          }
          charter_delivery_item1.fill(d1);
          NOVA.charter_configuration_rates.push(charter_delivery_item1);
        }
      }
    }else{
      data.is_selected(false)
      NOVA.normal_configuration_rates().forEach(function(entry){
        if(entry.vehicletype_id() == data.id()){
          NOVA.normal_configuration_rates.remove(entry);
        }
      })

      NOVA.charter_configuration_rates().forEach(function(entry){
        if(entry.vehicletype_id() == data.id()){
          NOVA.charter_configuration_rates.remove(entry);
        }
      })
    }
  };


  NOVA.selectsameDayYes = function(){
    NOVA.selected_same_day(true);
    NOVA.normal_configuration_rates().forEach(function(entry){
      entry.is_same_day(true);
      entry.msp_same_day('N/A');
      entry.rsp_same_day('N/A');
    })
  };
  NOVA.selectsameDayNo = function(){
    NOVA.selected_same_day(false);
    NOVA.normal_configuration_rates().forEach(function(entry){
      entry.is_same_day(false);
    })
  };

  NOVA.selectHolidayYes = function(){
    NOVA.selected_holiday(true);
    NOVA.normal_configuration_rates().forEach(function(entry){
      entry.is_holiday(true);
      entry.msp_holiday('N/A');
      entry.rsp_holiday('N/A');
    })
  };
  NOVA.selectHolidayNo = function(){
    NOVA.selected_holiday(false);
    NOVA.normal_configuration_rates().forEach(function(entry){
      entry.is_holiday(false);
    })
  };

  NOVA.selectAfterHourYes = function(){
    NOVA.selected_after_hour(true);
    NOVA.normal_configuration_rates().forEach(function(entry){
      entry.is_after_hour(true);
      entry.msp_after_hour('N/A');
      entry.rsp_after_hour('N/A');
    })
  };
  NOVA.selectAfterHourNo = function(){
    NOVA.selected_after_hour(false);
    NOVA.normal_configuration_rates().forEach(function(entry){
      entry.is_after_hour(false);
    })
  };

  NOVA.chartHeaderCreate = function(){
    $('.charter-service-table').removeClass('d-none');
    period_items = $('#createCharterInput').val();
    var inputVals = period_items.split(',')
    NOVA.charter_configuration_rates([]);
    NOVA.VehicleTypes_list().forEach(function(entry){
      if(entry.is_selected() == true){
        NOVA.sample_items([])
        for(i=0; i<inputVals.length; i++) {
          var period_item1 = new period_item()
          var period_i = {
            period_name: inputVals[i],
            period_id: '',
            period_msp: 'N/A',
            period_rsm: 'N/A',
          }
          period_item1.fill(period_i);
          NOVA.sample_items.push(period_item1)
        }
        var charter_delivery_item1 = new charter_item();
        var d = {
          jt_vehicle_id: '',
          vehicletype_id: entry.id(),
          vehicletype_name: entry.name(),
          item_periods_lst: NOVA.sample_items(),
        }
        charter_delivery_item1.fill(d);
        NOVA.charter_configuration_rates.push(charter_delivery_item1);
      }
    })

    $('[name="createCharterCreated"]').val('1');
    $('#createCharterCreated-error').remove();
  };

  NOVA.selectdayServiceAvailable = function(data,e){
    item_selected = $(e.currentTarget).is(':checked')
    if (item_selected == true){
      data.is_selected(true)
    }else{
      data.is_selected(false)
    }
  }

  NOVA.mainConfigUpdate = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('job_type_id', NOVA.job_type_id());
    formdata.append('job_name', NOVA.jobname());
    formdata.append('vehicle_types', ko.toJSON(NOVA.VehicleTypes_list()));
    formdata.append('vehicle_properties', ko.toJSON(NOVA.VehicleFeatures_list()));
    formdata.append('has_same_day_charge', NOVA.selected_same_day());
    formdata.append('has_holiday_charge', NOVA.selected_holiday());
    formdata.append('has_afterhour_charge', NOVA.selected_after_hour());
    // formdata.append('day_service', ko.toJSON(NOVA.Daysserviceavailable()));
    formdata.append('driver_property_requirement', $('#dprequirement').val());
    if(NOVA.type_of_service() == 'Charter'){
      var type_of_service = 'Charter'
      formdata.append('configure_rates', ko.toJSON(NOVA.charter_configuration_rates()));
      formdata.append('type_of_service', NOVA.type_of_service());
      formdata.append('period_items', $('#createCharterInput').val());
    }else{
      var type_of_service = 'Normal'
      formdata.append('configure_rates', ko.toJSON(NOVA.normal_configuration_rates()));
      formdata.append('type_of_service', NOVA.type_of_service());
    }
    $.ajax({
      method: 'POST',
      url: '/api/admin/job/type/update',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d.msg)
      window.location = '/admin/document-config/'+NOVA.job_type_id();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.saveasDraft = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('job_type_id', NOVA.job_type_id());
    formdata.append('job_name', NOVA.jobname());
    formdata.append('vehicle_types', ko.toJSON(NOVA.VehicleTypes_list()));
    formdata.append('vehicle_properties', ko.toJSON(NOVA.VehicleFeatures_list()));
    formdata.append('has_same_day_charge', NOVA.selected_same_day());
    formdata.append('has_holiday_charge', NOVA.selected_holiday());
    formdata.append('has_afterhour_charge', NOVA.selected_after_hour());
    // formdata.append('day_service', ko.toJSON(NOVA.Daysserviceavailable()));
    formdata.append('driver_property_requirement', $('#dprequirement').val());
    if(NOVA.type_of_service() == 'Charter'){
      var type_of_service = 'Charter'
      formdata.append('configure_rates', ko.toJSON(NOVA.charter_configuration_rates()));
      formdata.append('type_of_service', NOVA.type_of_service());
      formdata.append('period_items', $('#createCharterInput').val());
    }else{
      var type_of_service = 'Normal'
      formdata.append('configure_rates', ko.toJSON(NOVA.normal_configuration_rates()));
      formdata.append('type_of_service', NOVA.type_of_service());
    }
    $.ajax({
      method: 'POST',
      url: '/api/admin/job/type/update',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d.msg)
      window.location = '/admin/jobtypes/';
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.getJTdetail = function(data,e){
    var formdata = {
      'jobtype_id': NOVA.job_type_id(),
    }
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/admin/job/type/details/get',
      data: formdata,
      datatype: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.jobname(d.data.job_name);
      NOVA.is_published(d.data.is_published);
      NOVA.VehicleTypes_list([]);
      for(var i=0; i< d.data.vehicle_type_lst.length; i++){
        var types1 = new vehicle_type_item()
        types1.fill(d.data.vehicle_type_lst[i]);
        NOVA.VehicleTypes_list.push(types1);
      }
      NOVA.VehicleFeatures_list([]);
      for(var i=0; i< d.data.vehiclefeature_lst.length; i++){
        var types1 = new vehicle_properties_item()
        types1.fill(d.data.vehiclefeature_lst[i]);
        NOVA.VehicleFeatures_list.push(types1);
      }
      $('.property-requirement-select').trigger('change');
      for (var i = 0; i < d.data.dp_requirements_lst.length; i++) {
        $("#dprequirement").find("option").each(function(){
          if (parseInt($(this).val())==parseInt(d.data.dp_requirements_lst[i].tag_id)) {
            $('.property-requirement-select option[value="' + d.data.dp_requirements_lst[i].tag_id + '"]').prop('selected',true);
            $('.property-requirement-select').trigger('change');
          }

        });
      }
      if(d.data.service_type == 'Charter'){
        NOVA.normal_configuration_rates([]);
        NOVA.charter_configuration_rates([]);
        NOVA.type_of_service('Charter')
        $('#createCharterInput').val(d.data.period_items)
        $('#typeofServiceCharter').prop('checked',true)
        $('.charter-service-section').removeClass('d-none');
        $('.charter-service-table').addClass('d-none');
        $('.normal-service-section').addClass('d-none');
        $('.charter-service-table').removeClass('d-none');
        for(var i=0; i< d.data.vehicle_lst.length; i++){
          var charter_delivery_item1 = new charter_item();
          charter_delivery_item1.fill(d.data.vehicle_lst[i]);
          // charter_delivery_item1.item_periods_lst([])
          // for(var j=0; j< d.data.vehicle_lst[i].item_periods_lst.length; j++){
          //   var period_item1 = new period_item();
          //   period_item1.fill(d.data.vehicle_lst[i].item_periods_lst[j]);
          //   charter_delivery_item1.item_periods_lst.push(period_item1)
          // }
          NOVA.charter_configuration_rates.push(charter_delivery_item1);
        }
      }else{
        // NOVA.Daysserviceavailable([]);
        NOVA.type_of_service('Normal')
        NOVA.normal_configuration_rates([]);
        NOVA.charter_configuration_rates([]);
        $('.charter-service-section').addClass('d-none');
        $('.normal-service-section').removeClass('d-none');
        NOVA.selected_normal(d.data.has_normal_charge)
        NOVA.selected_same_day(d.data.has_same_day_charge)
        NOVA.selected_holiday(d.data.has_holiday_charge)
        NOVA.selected_after_hour(d.data.has_afterhour_charge)
        /*for(var i=0; i< d.data.service_days_lst.length; i++){
          var day_service_item1 = new day_service_item();
          day_service_item1.fill(d.data.service_days_lst[i]);
          NOVA.Daysserviceavailable.push(day_service_item1);
        }*/
        if(d.data.has_same_day_charge == true){
          $('#deliveryChargesYes').prop('checked',true)
        }else{
          $('#deliveryChargesNo').prop('checked',true)
        }
        if(d.data.has_holiday_charge == true){
          $('#holidayChargesYes').prop('checked',true)
        }else{
          $('#holidayChargesNo').prop('checked',true)
        }
        if(d.data.has_afterhour_charge == true){
          $('#hourChargesYes').prop('checked',true)
        }else{
          $('#hourChargesNo').prop('checked',true)
        }
        for(var i=0; i< d.data.vehicle_lst.length; i++){
          var normal_delivery_item1 = new normal_delivery_item();
          normal_delivery_item1.fill(d.data.vehicle_lst[i]);
          NOVA.normal_configuration_rates.push(normal_delivery_item1);
        }
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.jobtypeDetails = function(){
    window.location = '/admin/jobtype/edit/'+NOVA.job_type_id();
  }

  NOVA.docConfigDetails = function(){
    window.location = '/admin/document-config/'+NOVA.job_type_id();
  }

  NOVA.financeConfigDetails = function(){
    window.location = '/admin/finance-config/'+NOVA.job_type_id();
  }


  NOVA.mspValueUpdate = function(data,e){
    data.period_msp($(e.currentTarget).val())
  }
  NOVA.rsmValueUpdate = function(data,e){
    data.period_rsm($(e.currentTarget).val())
  }

  $('#navItemAdmin').addClass('active');
  
  
})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    NOVA.getAppLogo();
    var docUrlArr = document.URL.split('/');
    var job_type_id = docUrlArr[docUrlArr.length - 1];
    NOVA.job_type_id(job_type_id);
    // NOVA.getJTdetail();
    // NOVA.getVehicleTypes();
    // NOVA.getVehicleFeatures();
    NOVA.getDriverPropertyRequirement();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;