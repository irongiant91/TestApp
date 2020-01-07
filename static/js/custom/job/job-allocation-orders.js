(function (window) {
  NOVA.assign_order_id = ko.observable();
  NOVA.assign_vehicle_id = ko.observable();
  NOVA.is_order_tab = ko.observable(true);
  NOVA.assign_user_id = ko.observable();
  NOVA.disbursement_user_id = ko.observable();
  NOVA.disbursement_amount = ko.observable();
  NOVA.assign_driver_vehicle_id = ko.observable();
  NOVA.filterDay = ko.observable();
  NOVA.filter_date = ko.observable();
  NOVA.order_date = ko.observable('');
  NOVA.validation_msg = ko.observable();
  NOVA.vehicles_filter_list = ko.observableArray([]);
  NOVA.orderList = ko.observableArray([]);
  NOVA.driverList = ko.observableArray([]);
  NOVA.vehicles_list = ko.observableArray([]);
  NOVA.filterList = ko.observableArray([]);
  NOVA.driverFinanceList = ko.observableArray([]);
  NOVA.disbursementList = ko.observableArray([]);

  NOVA.active_tab_name = ko.observable('Order');

  var vehicle = function(){
    this.vehicle_id = ko.observable('');
    this.device_id = ko.observable('');
    this.vehicle_type = ko.observable('');
    this.vehicle_type_id = ko.observable('');
    this.pending_jobs = ko.observable('');
    this.no_of_stops = ko.observable('');
    this.cargo_hands = ko.observable('');
    this.properties = ko.observable('');
    this.driver = ko.observable('');
    this.driver_id = ko.observable('');
    this.vehicle_driver_id = ko.observable('');
    this.driver_pic = ko.observable('');
    this.assigned_orders = ko.observableArray([]);
    this.vehiclefeature_ids = ko.observableArray([]);
    this.fill = function (d) {
      this.vehicle_id('' || d.vehicle_id);
      this.device_id('' || d.device_id);
      this.vehicle_type('' || d.vehicle_type);
      this.vehicle_type_id('' || d.vehicle_type_id);
      this.pending_jobs('' || d.pending_jobs);
      this.no_of_stops('' || d.no_of_stops);
      this.cargo_hands('' || d.cargo_hands);
      this.properties('' || d.properties);
      this.driver('' || d.driver);
      this.driver_id('' || d.driver_id);
      this.vehicle_driver_id('' || d.vehicle_driver_id);
      this.driver_pic('' || d.driver_pic);
      this.assigned_orders('' || d.assigned_orders)
      this.vehiclefeature_ids('' || d.vehiclefeature_ids)
    }
  };

  var order = function(){
    this.order_id = ko.observable('');
    this.uid = ko.observable('');
    this.vehicle_id = ko.observable('');
    this.client = ko.observable('');
    this.job_type = ko.observable('');
    this.vehicle_type = ko.observable('');
    this.vehicle_type_id = ko.observable('');
    // this.vehicle_properties = ko.observable('');
    this.is_assigened = ko.observable('');
    this.no_of_vehicles = ko.observable('');
    this.total_no_of_vehicles = ko.observable('');
    this.no_of_stops = ko.observable('');
    this.is_draggable = ko.observable('');
    this.is_unassign = ko.observable('');
    this.vehicle_properties = ko.observableArray([]);
    this.order_vehiclefeature_ids = ko.observableArray([]);
    this.fill = function (d) {
      this.order_id('' || d.order_id);
      this.uid('' || d.uid);
      this.vehicle_id('' || d.vehicle_id);
      this.client('' || d.client);
      this.job_type('' || d.job_type);
      this.vehicle_type('' || d.vehicle_type);
      this.vehicle_type_id('' || d.vehicle_type_id);
      // this.vehicle_properties('' || d.vehicle_properties);
      this.is_assigened('' || d.is_assigened);
      this.no_of_vehicles('' || d.no_of_vehicles);
      this.total_no_of_vehicles('' || d.total_no_of_vehicles);
      this.no_of_stops('' || d.no_of_stops);
      this.is_draggable('' || d.is_draggable);
      this.is_unassign('' || d.is_unassign);
      this.vehicle_properties('' || d.vehicle_properties)
      this.order_vehiclefeature_ids('' || d.order_vehiclefeature_ids)
    }
  };

  var driver = function(){
    this.user_id = ko.observable('');
    this.username = ko.observable('');
    this.driver_pic = ko.observable('');
    this.vehicle_id = ko.observable('');
    this.device_id = ko.observable('');
    this.is_added = ko.observable('');
    this.driver_features = ko.observableArray([]);
    this.fill = function (d) {
      this.user_id('' || d.user_id);
      this.username('' || d.username);
      this.driver_pic('' || d.driver_pic);
      this.vehicle_id('' || d.vehicle_id);
      this.device_id('' || d.device_id);
      this.is_added('' || d.is_added);
      this.driver_features('' || d.driver_features)
    }
  }

  var finance = function(){
    this.user_id = ko.observable('');
    this.username = ko.observable('');
    this.driver_pic = ko.observable('');
    this.no_of_trips = ko.observable('');
    this.total_amount = ko.observable('');
    this.item_marked_amount = ko.observable('');
    this.mark_as_unpaid_button = ko.observable('');
    this.mark_as_button_show = ko.observable('');
    this.drivervehicle_id = ko.observable('');
    this.disbursement_lst = ko.observableArray([]);
    this.fill = function (d) {
      this.user_id('' || d.user_id);
      this.username('' || d.username);
      this.driver_pic('' || d.driver_pic);
      this.no_of_trips('' || d.no_of_trips);
      this.total_amount('' || d.total_amount);
      this.item_marked_amount('' || d.item_marked_amount);
      this.mark_as_unpaid_button('' || d.mark_as_unpaid_button);
      this.mark_as_button_show('' || d.mark_as_button_show);
      this.drivervehicle_id('' || d.drivervehicle_id);
      for(var i=0;i<d.disbursement_lst.length;i++){
        var disbursement1 = new disbursement();
        disbursement1.fill(d.disbursement_lst[i]);
        this.disbursement_lst.push(disbursement1);
      }
    }
  }

  var disbursement = function(){
    this.order_uid = ko.observable('');
    this.client = ko.observable('');
    this.items = ko.observableArray([]);
    this.fill = function (d) {
      this.order_uid('' || d.order_uid);
      this.client('' || d.client);
      this.items('' || d.items)
    }
  }

  $(function() {
    $('.dropdown-menu.state-list').click(function(e) {
      e.stopPropagation();
    });
    var winHeight = $(window).height()
    $(".dropdown-menu.state-list").css({"max-height": winHeight-180})
  }); 
  var winHeight = $(document).height()
  $(".job-allocation").css({"height": winHeight-50})

  // $(document).on('click', '.unassign-btn', function() {
    // $(this).closest('.addedOrder').removeClass('addedOrder');
  // })

  $('input[name="filterByDate"]').daterangepicker({
    opens: 'left',
    autoUpdateInput: false,
    singleDatePicker: true,
    locale: {
      cancelLabel: 'Clear'
    } 
  }).on('apply.daterangepicker', function(ev, picker) {
    var fullDate = picker.startDate.format('DD MMM YYYY');
    $('input[name="filterBy"]').prop('checked', false);
    $(this).val(fullDate);
  });

  $('.filter-btn').on('click', function(){
    $("body").addClass("sidebar-right-open");
  });

  $('.btn-cal').on('click', function(){
    $('input[name="filterByDate"]').trigger("click")
  });
  
  $('.close-filter').on('click', function(){
    $("body").removeClass("sidebar-right-open");
    /*$('#search-input').val('');
    NOVA.filterDay('');
    NOVA.filter_date('');
    $('#filter-date').val('');
    NOVA.getOrderList();*/
  });

  $(document).on( "click", ".action-panel .btn-icon", function(){
    $(".action-panel .btn-icon").removeClass( 'active' );
    if ($(this).hasClass( 'active' )){
      $(this).removeClass( 'active' );
    } else {
      $(this).addClass( 'active' );
    }
  });

  $(document).on( "click", ".action-panel .btn-group .btn", function(){
    $(".action-panel .btn-icon").removeClass( 'active' );
  });

  $(document).on("click", function(e) {
    if ( $(".action-panel .btn-group, .action-panel .btn-icon").has(event.target).length == 0 && !$(".action-panel .btn-group").is(e.target) ){
      $(".action-panel .btn-icon").removeClass( 'active' );
    }
  });

  $('.unassign-all-btn').on('click', function(){
    drgElm.draggable({disabled: false});
    $('.setVehicleCont[data-asgndr="'+getvid+'"]').droppable({disabled: false});
  });

  // $(document).on('click', '.unassign-btn', function() {
  //   $(this).closest('.addedPerson').removeClass('addedPerson');
  //   var drgElm = $(this).closest('.personnel-draggable');
  //   var getvid = drgElm.find('.vId').data('vid');
  //   drgElm.draggable({disabled: false});
  //   $('.setVehicleCont[data-asgndr="'+getvid+'"]').droppable({disabled: false});
  // })

  $('.job-allocation-nav .nav-item').on('click', function (e) {
    $('.order-filter').removeClass('d-none')
    $('#search-input').val('');
    getId = $(this).attr('id');
    if(getId == 'nav-personnel-tab') {
      NOVA.active_tab_name('Personnel')
      NOVA.is_order_tab(false);
      NOVA.getDrivers();
      $('.order-filter').addClass('d-none')
      $('.allocation-body .card').removeClass('droppable');
      $('.allocation-body .card').addClass('personnel-droppable');
      NOVA.dragAndDropDriver();
    }else {
      if(getId == 'nav-finances-tab') {
        NOVA.active_tab_name('Finance');
        $('.order-filter').addClass('d-none')
        NOVA.getDriverFinances();
      }else{
        NOVA.active_tab_name('Order')
        NOVA.is_order_tab(true);
        NOVA.getOrderList();
      }
      $('.allocation-body .card').addClass('droppable');
      $('.allocation-body .card').removeClass('personnel-droppable');
      NOVA.dragAndDropOrder();
    }
   
  })

  NOVA.dragAndDropDriver = function(){
    var getElm1
    var setVid1
    $('.personnel-draggable').draggable({
      addClasses: false,
      helper: function(){
        getElm1 = $(this);
        console.log(getElm1);
        setVid1 = $(this).find('.userName').val();
        var getId = '<div><small class="text-muted">User:</small><div class="bg-light p-1">'+setVid1+'</div></div>'
        NOVA.assign_user_id($(this).find('.userId').val())
        return $(this).clone().html(getId);
      },
      appendTo: 'body',
      containment: ".job-orders",
      stop: function(event, ui) {
        ui.helper.removeClass("personnel-draggable");
      },
      cursorAt: { top: 60, left: 50 }
    });
    $('.personnel-droppable').droppable({
      accept: ".personnel-draggable",
      containment: "body",
      drop: function(event, ui) {
        NOVA.assign_driver_vehicle_id($(this).find('.vehicleId').val())
        // getElm1.draggable({disabled: true});
        // $(this).attr('data-asgndr',setVid1);
        // $(this).droppable({disabled: true});
        // getElm1[0].classList.add('addedPerson')
        NOVA.vehicleAllocation();
      }
    });
  }

  NOVA.dragAndDropOrder = function(){
    var getElm
    $('.draggable').draggable({
      addClasses: false,
      containment: ".job-orders",
      helper: function(){
        getElm = $(this);
        var getId = '<div><small class="text-muted">Order ID:</small><div class="bg-light p-0">'+$(this).find('.orderUid').val()+'</div></div>'
        NOVA.assign_order_id($(this).find('.orderID').val())
        return $(this).clone().html(getId);
      },
      appendTo: 'body',
      scroll: false,
      cursorAt: { top: 40, left: 50 }
    });
    $('.droppable').droppable({
      accept: ".draggable",
      drop: function(event, ui) {
        // console.log('to',$(this));
        // console.log('from',ui);
        // console.log('from',$(this));
        // getElm[0].classList.add('addedOrder')
        NOVA.assign_vehicle_id($(this).find('.vehicleId').val())
        NOVA.jobAllocationValidation();
      }
    });
  }

  NOVA.deviceFilter = function(data,e){
    item_selected = $(e.currentTarget).is(':checked')
    if (item_selected == true){
      NOVA.filterList.push(data.vehicle_id)
    }else{
      NOVA.filterList.remove(data.vehicle_id)
    }
    NOVA.getVehicles();
  };

  NOVA.getVehicles = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/vehicle/list/get',
      data: {
        'filterList': ko.toJSON(NOVA.filterList()),
        'filter_day': NOVA.filterDay(),
        'order_date': NOVA.order_date(),
        'filter_date': $('#filter-date').val(),
      },
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {

      NOVA.vehicles_list([]);

      for(var j=0; j<d.data.length; j++){
        var vehicle1 = new vehicle();
        vehicle1.fill(d.data[j]);
        NOVA.vehicles_list.push(vehicle1);
      }
       $('[data-toggle="tooltip"]').tooltip()
      NOVA.dragAndDropOrder();
      NOVA.dragAndDropDriver();

    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.getVehiclesFiltersGet = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/vehicle/filter/list/get',
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.vehicles_filter_list([]);
      for(var j=0; j<d.data.length; j++){
        NOVA.vehicles_filter_list.push(d.data[j]);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.searchKey = function() {
    if (NOVA.active_tab_name() == 'Order'){
      NOVA.getOrderList();
    }else if(NOVA.active_tab_name() == 'Personnel'){
      NOVA.getDrivers();
    }else{
      NOVA.getDriverFinances();
    }
  };

  NOVA.applayFilter = function() {
    NOVA.order_date('');
    NOVA.getOrderList();
    NOVA.getVehicles();
  };

  NOVA.resetFilter = function() {
    $('#search-input').val('');
    NOVA.filterDay('');
    NOVA.filter_date('');
    $('#filter-date').val('');
    var docUrlArr = document.URL.split('?');
    if(docUrlArr.length == 2){
      var order_date = docUrlArr[docUrlArr.length - 1];
      NOVA.order_date(order_date)
    }
    NOVA.getOrderList();
    NOVA.getVehicles();
  };


  NOVA.getOrderList = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/allocation/order/list/get',
      data:{
        'search_term':$('#search-input').val(),
        'filter_day': NOVA.filterDay(),
        'filter_date': $('#filter-date').val(),
        'order_date': NOVA.order_date(),
      },
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.orderList([]);
      for(var i = 0; i < d.data.length; i++) {
        var order1 = new order();
        order1.fill(d.data[i]);
        NOVA.orderList.push(order1);
      }
      NOVA.dragAndDropOrder();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.openFilterDatePicker = function(){
    $('input[name="filterByDate"]').trigger("click")
  };

  NOVA.getSelected = function() {
    $('#datepicker').val('');
    NOVA.order_date('');
    NOVA.filter_date('');
    NOVA.getOrderList();
    NOVA.getVehicles();
  };

  NOVA.filterDate = function(fullDate) {
    NOVA.order_date('');
    NOVA.filterDay('');
    NOVA.filter_date(fullDate);
    NOVA.getOrderList();
    NOVA.getVehicles();
  };

  NOVA.orderDetail = function(data){
    window.open('/order/'+data.order_id());
  }; 

  NOVA.vehicleDetails = function(data){
    window.open('/vehicle/'+data.vehicle_id()+'/details');
  };

  NOVA.jobAllocation = function(){
    var vehicle_vehicle_type_id = ''
    var order_vehicle_type_id = ''
    var vehicleFeatures = []
    var ordervehicleFeatures = []
    NOVA.vehicles_list().forEach(function(entry) {
      if(entry.vehicle_id() == NOVA.assign_vehicle_id()){
        vehicle_vehicle_type_id = entry.vehicle_type_id()
        vehicleFeatures = entry.vehiclefeature_ids()

      }
    });
    NOVA.orderList().forEach(function(entry) {
      if(entry.order_id() == NOVA.assign_order_id()){
        order_vehicle_type_id = entry.vehicle_type_id()
        ordervehicleFeatures = entry.order_vehiclefeature_ids();
      }
    });
    if(vehicle_vehicle_type_id !='' && order_vehicle_type_id !=''){
      if(vehicle_vehicle_type_id !=order_vehicle_type_id){
        NOVA.validation_msg("Order Vehicle Type is not matching with Vehicle's Vehicle Type!. Do you want to continue?")
        $("#allocationValidation").modal('show');
      }
    }
    var difference = $(ordervehicleFeatures).not(vehicleFeatures).get();
    if (difference.length > 0){
      NOVA.validation_msg("Order Vehicle Features is not matching with Vehicle's Vehicle Features!. Do you want to continue?")
      $("#allocationValidation").modal('show');
    }
  };

  NOVA.jobAllocationValidation = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/job/allocation/validation',
      data: {
        'order_id': NOVA.assign_order_id(),
        'vehicle_id': NOVA.assign_vehicle_id(),
      },
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      if(d.result == true){
        NOVA.orderAllocation();
      }else{
        NOVA.validation_msg(d.msg)
        $("#allocationValidation").modal('show');
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.orderAllocation = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_id',NOVA.assign_order_id());
    formdata.append('vehicle_id',NOVA.assign_vehicle_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/job/allocation',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $("#allocationValidation").modal('hide');
      NOVA.showToast(d.msg);
      /*NOVA.vehicles_list().forEach(function(entry) {
        if(entry.vehicle_id() == NOVA.assign_vehicle_id()){
          entry.pending_jobs(d.pending_jobs)
          entry.no_of_stops(d.no_of_stops)
          entry.cargo_hands(d.cargo_hands)
        }
      });*/
      NOVA.getOrderList();
      NOVA.getVehicles();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })    
  };

  NOVA.jobAllocationUnassign = function (data,e) {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_id',data.order_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/job/allocation/unassign',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $("#allocationValidation").modal('hide');
      data.is_assigened(false)
      NOVA.showToast(d);
      NOVA.getOrderList();
      NOVA.getVehicles();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })    
  };

  NOVA.getDrivers = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/drivers/list/get',
      data:{
        'search_term':$('#search-input').val(),
      },
      dataType: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.driverList([]);
      for(var i = 0; i < d.data.length; i++) {
        var driver1 = new driver();
        driver1.fill(d.data[i]);
        NOVA.driverList.push(driver1);
      }
      //$('[data-toggle="tooltip"]').tooltip()
      $('[data-toggle="tooltip"]').each(function() {
          if($(this).attr('title') != '') {
            $(this).tooltip({ boundary: 'window' })
          } else {
            var vals = $(this).parent().find('.forTollTip').html();
            $(this).attr('title',vals)
            $(this).tooltip({ boundary: 'window' })
          } 
        })
      NOVA.dragAndDropDriver();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.vehicleAllocation = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('driver_id',NOVA.assign_user_id());
    formdata.append('vehicle_id',NOVA.assign_driver_vehicle_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/driver/allocation',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d.msg);
      NOVA.vehicles_list().forEach(function(entry) {
        if(entry.vehicle_id() == NOVA.assign_driver_vehicle_id()){
          entry.driver(d.username)
          entry.driver_id(d.user_id)
        }
      });
      NOVA.getDrivers();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.driverUnassign = function (data,e) {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('user_id',data.user_id());
    formdata.append('vehicle_id',data.vehicle_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/driver/unassign',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      data.is_added(false)
      data.device_id('')
      data.vehicle_id('')
      NOVA.showToast(d);
      NOVA.getVehicles();
      setTimeout(function() {
        $('.allocation-body .card').removeClass('droppable');
      $('.allocation-body .card').addClass('personnel-droppable');
    }, 100);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })    
  };

  NOVA.getDriverFinances = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/driver/finance/list',
      data:{
        'search_term':$('#search-input').val(),
      },
      dataType: 'json',
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.driverFinanceList([]);
      for(var i = 0; i < d.data.length; i++) {
        var finance1 = new finance();
        finance1.fill(d.data[i]);
        NOVA.driverFinanceList.push(finance1);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.viewFinanceDetails = function(data){
    NOVA.disbursementList([]);
    NOVA.disbursement_user_id(data.user_id())
    NOVA.disbursement_amount(data.item_marked_amount())
    for(var i = 0; i < data.disbursement_lst().length; i++) {
      NOVA.disbursementList.push(data.disbursement_lst()[i]);
    }
    $("#financeDetail").modal('show');
  };

  NOVA.markasPaid = function(data,e){
    item_selected = $(e.currentTarget).is(':checked')
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('driver_id',NOVA.disbursement_user_id());
    formdata.append('item_selected',item_selected);
    formdata.append('order_finance_id',data.order_finance_id);
    formdata.append('driver_finance_id',data.driver_finance_id);
    $.ajax({
      method: 'POST',
      url: '/api/order/driver/finance/payment',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      data.driver_finance_id = d.driver_finance_id
      NOVA.driverFinanceList().forEach(function(entry) {
        if(entry.user_id() == NOVA.disbursement_user_id()){
          entry.mark_as_unpaid_button(d.mark_as_unpaid_button)
        }
      });
      NOVA.showToast(d.msg);
      NOVA.disbursement_amount(d.total_amount)
      NOVA.getDriverFinances();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      data.is_paid(false);
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.cancelFinanceModal = function(data){
    $("#financeDetail").modal('hide');
  };

  NOVA.allMarkasunpaid = function(data,e){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('driver_id',data.user_id());
    formdata.append('drivervehicle_id',data.drivervehicle_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/driver/finance/payment/mark/unpaid',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d);
      NOVA.getDriverFinances();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.allMarkasPaid = function(data,e){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('driver_id',data.user_id());
    formdata.append('drivervehicle_id',data.drivervehicle_id());
    $.ajax({
      method: 'POST',
      url: '/api/order/driver/finance/payment/mark/paid',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.showToast(d);
      NOVA.getDriverFinances();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }
})(this);

function init() {
  if (document.readyState == "interactive") {
    NOVA.hideLoading();
    $('#navItemJobList').addClass('active');
    ko.applyBindings(NOVA);
    NOVA.getVehicles();
    NOVA.getVehiclesFiltersGet();
    NOVA.getAppLogo();
    var docUrlArr = document.URL.split('?');
    if(docUrlArr.length == 2){
      var order_date = docUrlArr[docUrlArr.length - 1];
      NOVA.order_date(order_date)
    }
    NOVA.getOrderList();
  }
}
  document.onreadystatechange = init;