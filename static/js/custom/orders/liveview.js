(function (window) {

  NOVA.orderList = ko.observableArray([]);
  NOVA.vehicleTypes = ko.observableArray([]);
  NOVA.sourceList = ko.observableArray([]);
  NOVA.jobtypeList = ko.observableArray([]);
  NOVA.statusList = ko.observableArray([]);

  NOVA.selectedSource = ko.observableArray([]);
  NOVA.selectedJobType = ko.observableArray([]);
  NOVA.selectedVehicleType = ko.observableArray([]);
  NOVA.selectedStatus = ko.observableArray([]);
  NOVA.sortType = ko.observable('');
  NOVA.filterDay = ko.observable('');
  NOVA.filter_date = ko.observable('');
  NOVA.isChecked = ko.observable(false);

  NOVA.pageSearch = ko.observable('');
  NOVA.page_count = ko.observable('');
  NOVA.current_page = ko.observable(1);
  NOVA.pages_list = ko.observableArray([]);
  
  NOVA.view_name = ko.observable('Live');
  NOVA.groupByList = ko.observableArray([]);

  var order_item = function () {
      this.id = ko.observable('');
      this.uid = ko.observable('');
      this.client = ko.observable('');
      this.start_date = ko.observable('');
      this.job_type = ko.observable('');
      this.vehicle_type = ko.observable('');
      this.status = ko.observable('');
      this.source = ko.observable('');
      this.timer_date_time = ko.observable('');
      this.orinal_start_date = ko.observable('');
      this.has_vehicle = ko.observable('');
      this.allow_notification = ko.observable('');

      this.fill = function (d) {
        this.id('' || d.id);
        this.uid('' || d.uid);
        this.client('' || d.client);
        this.start_date('' || d.start_date);
        this.job_type('' || d.job_type);
        this.vehicle_type('' || d.vehicle_type);
        this.status('' || d.status);
        this.source('' || d.source);
        this.timer_date_time('' || d.timer_date_time);
        this.orinal_start_date('' || d.orinal_start_date);
        this.has_vehicle('' || d.has_vehicle);
        this.allow_notification('' || d.allow_notification);
      }
  };

  var orderGroup = function () {
    this.vehicle_name = ko.observable('');
    this.ordervehicle_id = ko.observable('');
    this.mesdc_byke_number = ko.observable('');
    this.vehicle_orders = ko.observableArray([]);
    

    this.fill = function (d) {
      this.vehicle_name('' || d.vehicle_name);
      this.ordervehicle_id('' || d.ordervehicle_id);
      for(var i=0;i<d.vehicle_orders.length;i++){
        var order_item1 = new order_item();
        order_item1.fill(d.vehicle_orders[i]);
        this.vehicle_orders.push(order_item1);
      }
    }
  };

  NOVA.openSidebarRight = function(){
    $("body").addClass("sidebar-right-open")
  }

  NOVA.closeSidebarRight = function(){
    $("body").removeClass("sidebar-right-open")
  }

  $(document).on('show.bs.collapse','.collapse', function () {
    $(this).parent().find('.btn-link span').removeClass('icon-plus').addClass('icon-minus');
  });
  $(document).on('hide.bs.collapse','.collapse', function () {
    $(this).parent().find('.btn-link span').removeClass('icon-minus').addClass('icon-plus');
  });
 // Group by functiom
 // $('#groupView').on('click', function() {
 //   if($('.group-view').hasClass('d-none')) {
 //     $('.list-live-view').addClass('d-none');
 //     $('.group-view').removeClass('d-none');
 //   } else {
 //      $('.list-live-view').removeClass('d-none');
 //       $('.group-view').addClass('d-none');
 //   }
 // })

  $('input[name="filterByDate"]').daterangepicker({
    opens: 'left',
    autoUpdateInput: false,
    locale: {
      cancelLabel: 'Clear'
    } 
  }).on('apply.daterangepicker', function(ev, picker) {
    var fullDate = picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY')
    $(this).val(fullDate);
    NOVA.filterDate(fullDate);
  });

  NOVA.search = function() {
    if(NOVA.view_name() == 'Live'){
      NOVA.getOrderListView();
    }else{
      NOVA.getGroupByListView();
    }
  }

  NOVA.getDetails = function (data) {
    window.open('/order/'+data.id());
  }
  
  NOVA.openFilterDatePicker = function(){
    $('input[name="filterByDate"]').trigger("click")
  }

  var sortList = ['descending','ascending']
  var next = 0
  NOVA.sortDate = function() {
    next = next + 1
    if (next > 1){
      next = 0
    } 
    var next_item =  sortList[next]
    NOVA.sortType(next_item)
    if(NOVA.view_name() == 'Live'){
      NOVA.getOrderListView();
    }else{
      NOVA.getGroupByListView();
    }
  }

  NOVA.getSelected = function() {
    NOVA.filter_date('');
    if(NOVA.view_name() == 'Live'){
      NOVA.getOrderListView();
    }else{
      NOVA.getGroupByListView();
    }
  }

  NOVA.filterDate = function(fullDate) {
    NOVA.filterDay('');
    NOVA.filter_date(fullDate);
    if(NOVA.view_name() == 'Live'){
      NOVA.getOrderListView();
    }else{
      NOVA.getGroupByListView();
    }
  }

  NOVA.showPending = function() {
    if($("#showPending").prop('checked') == true){
      NOVA.isChecked(true);
    } else {
      NOVA.isChecked(false);
    }
    if(NOVA.view_name() =='Live'){
      NOVA.getOrderListView();
    }else{
      NOVA.getGroupByListView();
    }
  }

  NOVA.filterSource = function(data,e) {
    if (event.target.checked) {
        NOVA.selectedSource.push(data[0])
      } 
    else {
      if (NOVA.selectedSource().includes(data[0])) {
        var i = NOVA.selectedSource().indexOf(data[0])
        NOVA.selectedSource.splice(i, 1)
      }
    }
    if(NOVA.view_name() == 'Live'){
      NOVA.getOrderListView();
    }else{
      NOVA.getGroupByListView();
    }
  }

  NOVA.filterJobType = function(data,e) {
    if (event.target.checked) {
        NOVA.selectedJobType.push(data[0])
      } 
    else {
      if (NOVA.selectedJobType().includes(data[0])) {
        var i = NOVA.selectedJobType().indexOf(data[0])
        NOVA.selectedJobType.splice(i, 1)
      }
    }
    if(NOVA.view_name() == 'Live'){
      NOVA.getOrderListView();
    }else{
      NOVA.getGroupByListView();
    }
  }

  NOVA.filterVehicleType = function(data,e) {
    if (event.target.checked) {
        NOVA.selectedVehicleType.push(data[0])
      } 
    else {
      if (NOVA.selectedVehicleType().includes(data[0])) {
        var i = NOVA.selectedVehicleType().indexOf(data[0])
        NOVA.selectedVehicleType.splice(i, 1)
      }
    }
    if(NOVA.view_name() == 'Live'){
      NOVA.getOrderListView();
    }else{
      NOVA.getGroupByListView();
    }
  }

  NOVA.filterStatus = function(data,e) {
    if (event.target.checked) {
        NOVA.selectedStatus.push(data[0])
      } 
    else {
      if (NOVA.selectedStatus().includes(data[0])) {
        var i = NOVA.selectedStatus().indexOf(data[0])
        NOVA.selectedStatus.splice(i, 1)
      }
    }
    if(NOVA.view_name() == 'Live'){
      NOVA.getOrderListView();
    }else{
      NOVA.getGroupByListView();
    }
  }

  NOVA.getFilterItems = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/live/view/get',
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.vehicleTypes([]);
      NOVA.sourceList([]);
      NOVA.jobtypeList([]);
      NOVA.statusList([]);
      NOVA.vehicleTypes(d.vehicletype_list);
      NOVA.sourceList(d.source_list);
      NOVA.jobtypeList(d.jobtype_list);
      NOVA.statusList(d.status_list);
      NOVA.getOrderListView();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }


  NOVA.getOrderListView = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/live/list/view/get',
      data:{
        'search_term':$('#search-input').val(),'page_number': NOVA.current_page(),
        'selected_source': ko.toJSON(NOVA.selectedSource()),
        'selected_jobtype': ko.toJSON(NOVA.selectedJobType()),
        'selected_vehicletype': ko.toJSON(NOVA.selectedVehicleType()),
        'selected_status': ko.toJSON(NOVA.selectedStatus()),
        'sort_type' :NOVA.sortType(),
      },
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.orderList([]);
      var offset = moment().utcOffset();
      for(var i = 0; i < d.length; i++) {
        // d[i].start_date = moment.utc(d[i].start_date, "DD MMM YYYY hh:mmA").utcOffset(offset).format("DD MMM YYYY HH:mm:ss");
        var order_item1 = new order_item();
        order_item1.fill(d[i]);
        NOVA.orderList.push(order_item1);
      }
      NOVA.updateTimer1();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.socket = io('13.250.123.95:9002');
  // NOVA.socket = io('54.179.183.182:9002');

  NOVA.socket.on('connect', function () {
    console.log("connect");
  });

  NOVA.socket.on('message', function (message) {
    var d = JSON.parse(message);
    if(d.type == 'notification'){
      // var notification1 = new notification();
      // notification1.fill(d.data);
      d.data.created_date = moment(d.data.created_date).add(NOVA.notificationsTimezone(),'hours').format();
      NOVA.notifications.unshift(d.data);
      NOVA.notificationsCount(NOVA.notificationsCount() +1);
    }    

    // NOVA.notificationsCount1 = ko.computed(function () {
    //   var x = [];
    //   for (var i = 0; i < NOVA.notifications().length; i++) {
    //     if (NOVA.notifications()[i].is_read() == false) {
    //       x.push(NOVA.notifications()[i].id());
    //     }
    //   };
    //   return x;
    // });
    // console.log(NOVA.notificationsCount());
    // NOVA.notificationsCount(NOVA.notificationsCount1().length);
    
    // console.log(NOVA.notificationsCount());
  });

  NOVA.vars = {};
  NOVA.ticketTime = [];

  NOVA.updateTimer1 = function(){
    NOVA.ticketTime = [];
    NOVA.vars = {}
    for(var i = 0; i < NOVA.orderList().length; i++) {
      NOVA.ticketTime.push(NOVA.orderList()[i].timer_date_time());
    };
    // console.log(ko.toJS(NOVA.ticketTime))

    for (var i = 0; i < NOVA.ticketTime.length; i++) {
      clearInterval(NOVA.vars["x"+i]);
    }

    $(".live-timer.raw strong").each(function(index, value){
      
      var timeString = NOVA.ticketTime[index];
      var time = moment(timeString).toDate();
      // console.log(index)

      NOVA.vars["x"+index] = setInterval(function() {

        // var d = new Date();
        // var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        // var now = new Date(utc + (3600000*(5.30)));
        var now = new Date();
        var countDownDate = time.getTime();
        // var countDownDate = timeString;

        var distance = countDownDate - now;
        // console.log(countDownDate,now,distance,d)

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days > 0) {
          str = "+"+days+"d, "+moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
        } else {
          str = moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
        }

        $(value).html(str);

        if (hours<=0 && minutes < 30) {
          //clearInterval(vars["x"+index]);
          $(value).addClass("bg-danger text-white");
        }

        if (distance < 0) {

          distance = now - countDownDate;

          days = Math.floor(distance / (1000 * 60 * 60 * 24));
          hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          seconds = Math.floor((distance % (1000 * 60)) / 1000);

          if (days > 0) {
            str = "- "+days+"d, "+moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
          } else {
            str = "- "+moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
          }

          
          $(value).html(str);
        }

      }, 100);
    });
  }

  NOVA.reassignAllocation = function(data){
    window.open('/job/job-allocation-orders/?'+data.orinal_start_date());
  }


  NOVA.groupViewShow = function(){
    NOVA.view_name('Group');
    NOVA.getGroupByListView();
    $('#groupViewbtn').hide();
    $('#liveViewbtn').show();
    $('.list-live-view,.card-data-empty-live').addClass('d-none');
    $('.group-view,.card-data-empty-gropby').removeClass('d-none');
  }

  NOVA.liveViewShow = function(){
    NOVA.view_name('Live');
    NOVA.getOrderListView();
    $('#groupViewbtn').show();
    $('#liveViewbtn').hide();
    $('.list-live-view,.card-data-empty-live').removeClass('d-none');
    $('.group-view,.card-data-empty-gropby').addClass('d-none');
  }

  NOVA.getGroupByListView = function () {
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/groupby/list/view/get',
      data:{
        'search_term':$('#search-input').val(),
        'selected_source': ko.toJSON(NOVA.selectedSource()),
        'selected_jobtype': ko.toJSON(NOVA.selectedJobType()),
        'selected_vehicletype': ko.toJSON(NOVA.selectedVehicleType()),
        'selected_status': ko.toJSON(NOVA.selectedStatus()),
        'sort_type' :NOVA.sortType(),
      },
      dataType: 'json',
      beforeSend: function(xhr, settings) {
      NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.groupByList([]);
      var offset = moment().utcOffset();
      for(var i = 0; i < d.length; i++) {
        // d[i].start_date = moment.utc(d[i].start_date, "DD MMM YYYY hh:mmA").utcOffset(offset).format("DD MMM YYYY HH:mm:ss");
        var orderGroup1 = new orderGroup();
        orderGroup1.fill(d[i]);
        NOVA.groupByList.push(orderGroup1);
      }
      NOVA.updateTimer2();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      $('#errorMessage').text(jqXHR.responseText);
      $('.error-modal').modal('show');
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.updateTimer2 = function(){
    NOVA.ticketTime = [];
    NOVA.vars = {}
    for(var i = 0; i < NOVA.groupByList().length; i++) {
      for(var j = 0; j < NOVA.groupByList()[i].vehicle_orders().length; j++) {
        NOVA.ticketTime.push(NOVA.groupByList()[i].vehicle_orders()[j].timer_date_time())
      }
    };
    // console.log(ko.toJS(NOVA.ticketTime))

    for (var i = 0; i < NOVA.ticketTime.length; i++) {
      clearInterval(NOVA.vars["x"+i]);
    }

    $(".group-by-live-timer.raw strong").each(function(index, value){
      
      var timeString = NOVA.ticketTime[index];
      var time = moment(timeString).toDate();
      // console.log(index)

      NOVA.vars["x"+index] = setInterval(function() {

        // var d = new Date();
        // var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        // var now = new Date(utc + (3600000*(5.30)));
        var now = new Date();
        var countDownDate = time.getTime();
        // var countDownDate = timeString;

        var distance = countDownDate - now;
        // console.log(countDownDate,now,distance,d)

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days > 0) {
          str = "+"+days+"d, "+moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
        } else {
          str = moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
        }

        $(value).html(str);

        if (hours<=0 && minutes < 30) {
          //clearInterval(vars["x"+index]);
          $(value).addClass("bg-danger text-white");
        }

        if (distance < 0) {

          distance = now - countDownDate;

          days = Math.floor(distance / (1000 * 60 * 60 * 24));
          hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          seconds = Math.floor((distance % (1000 * 60)) / 1000);

          if (days > 0) {
            str = "- "+days+"d, "+moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
          } else {
            str = "- "+moment(hours, "h").format("HH")+":"+moment(minutes, "m").format("mm")+":"+moment(seconds, "m").format("mm");
          }

          
          $(value).html(str);
        }

      }, 100);
    });
  }

  NOVA.sendNotification = function(data){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('order_id',data.id());
    $.ajax({
      method: 'POST',
      url: '/api/order/send/notification',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function (xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done(function (d, textStatus, jqXHR) {
      NOVA.showToast(d);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function () {
      NOVA.hideLoading();
    })
 }

  NOVA.socket.on('message', function (message) {
    var d = JSON.parse(message);

    // var audio = new Audio('/static/audio/notification.mp3');
    // audio.muted = false
    if(d.type == 'order_status_update'){
      NOVA.orderList().forEach(function(entry) {
        if( entry.id() == d.data.id){
          entry.status(d.data.status)
          if(d.data.status == 'Delivery Completed'){
            $('#audioTrgr').trigger('click')
            //audio.play();
            /*document.querySelector('button').addEventListener('click', function() {
              context.resume().then(() => {
                audio.play();
              });
            });*/
          }
        }
      });
      NOVA.groupByList().forEach(function(entry1) {
        entry1.vehicle_orders().forEach(function(entry) {
          if( entry.id() == d.data.id){
            entry.status(d.data.status)
          }
        });
      });
      NOVA.updateTimer1();
      NOVA.updateTimer2();
    }else if(d.type == 'order_new_entry'){
      document.querySelector('button').addEventListener('click', function() {
        context.resume().then(() => {
          audio.play();
        });
      });
      var order_item1 = new order_item();
      order_item1.fill(d.data);
      NOVA.orderList.unshift(order_item1);
      NOVA.updateTimer1();
    }else if(d.type == 'order_allocation'){
      NOVA.orderList().forEach(function(entry) {
        if( entry.id() == d.data.order_id){
          entry.has_vehicle(d.data.has_vehicle)
          entry.allow_notification(d.data.allow_notification)               
        }
      });
      var vehicle_name_flag = false
      NOVA.groupByList().forEach(function(entry1) {
        if( entry1.vehicle_name() == d.data.vehicle_name){
          vehicle_name_flag = true;
        }
      });
      if(vehicle_name_flag == false){
        var orderGroup1 = new orderGroup();
        orderGroup1.fill(d.data);
        NOVA.groupByList.push(orderGroup1);
      }
      NOVA.groupByList().forEach(function(entry1) {
        if( entry1.vehicle_name() == d.data.vehicle_name){
          order_flag = false
          for(var i = 0; i < d.data.vehicle_orders.length; i++) {
            entry1.vehicle_orders().forEach(function(entry2) {
              if(entry2.id() == d.data.vehicle_orders[i].id){
                  order_flag = true 
              }
            })
          }
          if(order_flag == false){
            var order_item1 = new order_item();
            order_item1.fill(d.data.vehicle_orders[0]);
            entry1.vehicle_orders.push(order_item1);
          }
        }
        NOVA.updateTimer1();
        NOVA.updateTimer2();
      });
      if(NOVA.groupByList().length == 0){
        var orderGroup1 = new orderGroup();
        orderGroup1.fill(d.data);
        NOVA.groupByList.push(orderGroup1);
      }
    }else if(d.type == 'job_allocation_unassign'){
      NOVA.orderList().forEach(function(entry) {
        if( entry.id() == d.data.order_id){
          entry.has_vehicle(false)
          entry.allow_notification(false)               
        }
      });
      NOVA.groupByList().forEach(function(entry1) {
        entry1.vehicle_orders().forEach(function(entry2){
          if(entry2.id() == d.data.order_id){
            entry1.vehicle_orders.remove(entry2)
          }
        })
        if(entry1.vehicle_orders().length == 0){
          NOVA.groupByList.remove(entry1)
        }
      });
    }else{
      // console.log(d);
    }

  });


})(this);
  
function init() {
  if (document.readyState == "interactive") {
    $('#liveViewbtn').hide()
    NOVA.hideLoading();
    ko.applyBindings(NOVA);
    NOVA.getFilterItems();
  }
}

document.onreadystatechange = init;