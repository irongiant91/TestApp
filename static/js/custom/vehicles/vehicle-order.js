(function (window) {
    NOVA.vehicle_id = ko.observable();
    NOVA.search_term = ko.observable();
    NOVA.pages_list = ko.observableArray([]);
    NOVA.vehicleorders_list = ko.observableArray([]);
    NOVA.orderTypeList = ko.observableArray([]);
    NOVA.driverList = ko.observableArray([]);
    NOVA.statusList = ko.observableArray([]);
    NOVA.selectedOrderType = ko.observableArray([]);
    NOVA.selectedDriver = ko.observableArray([]);
    NOVA.selectedStatus = ko.observableArray([]);
    
    NOVA.current_page = ko.observable(1);
    NOVA.page_count = ko.observable('');
    NOVA.pageSearch = ko.observable('');
    NOVA.idSortOrder = ko.observable('ascending');
    NOVA.idSort = ko.observable('false');
    NOVA.dateSortOrder = ko.observable('ascending');
    NOVA.dateSort = ko.observable('false');
    
    NOVA.getVehicleOrders = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/vehicle/list/orders/get',
        data: {'vehicle_id': NOVA.vehicle_id(),
               'search_term': NOVA.search_term(),
               'page_number': NOVA.current_page(),
               'selected_ordertype': ko.toJSON(NOVA.selectedOrderType()),
               'selected_driver': ko.toJSON(NOVA.selectedDriver()),
               'selected_status': ko.toJSON(NOVA.selectedStatus()),
               'idSort': NOVA.idSort(),
               'idSortOrder': NOVA.idSortOrder(),
               'dateSort': NOVA.dateSort(),
               'dateSortOrder': NOVA.dateSortOrder(),
              },
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        console.log(d)
        NOVA.vehicleorders_list([]);
        for (let i = 0; i < d.data.length; i++) {
          NOVA.vehicleorders_list.push(d.data[i]);

        }
        NOVA.page_count(d.page_count);
        NOVA.refreshPagination();
        NOVA.pageSearch('');
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }
    
    NOVA.orderDetailPage = function(data){
      window.location = '/vehicle/'+NOVA.vehicle_id()+'/orders/'+data.id
    }
    // NOVA.getDriverOrderType = function (){
    //   var csrftoken = NOVA.getCookie('csrftoken');
    //   $.ajax({
    //     method: 'GET',
    //     url: '/api/order/drivervehicle/get',
    //     data: {'vehicle_id': NOVA.vehicle_id()},
    //     beforeSend: function(xhr, settings) {
    //       NOVA.showLoading();
    //       xhr.setRequestHeader('X-CSRFToken', csrftoken);
    //     }
    //   })
    //     .done( function (d, textStatus, jqXHR) {
    //       NOVA.orderTypeList([]);
    //       for (let i = 0; i < d.vehicle_list.length; i++) {
    //         NOVA.orderTypeList.push(d.vehicle_list[i]);
    //       }
    //       NOVA.driverList([]);
    //       for (let i = 0; i < d.driver_list.length; i++) {
    //         NOVA.driverList.push(d.driver_list[i]);
    //       }
    //     })
    //     .fail( function (jqXHR, textStatus, errorThrown) {
    //       NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    //     })
    //     .always(function(){
    //       NOVA.hideLoading();
    //     })
    // }
    
    
    // NOVA.driverFilter = function(data,e){
    //   if (event.target.checked) {
    //     NOVA.driver_filter.push(data)
    //   } 
    //   else {
    //     if (NOVA.driver_filter().includes(data)) {
    //       var j = NOVA.driver_filter().indexOf(data)
    //       NOVA.driver_filter.splice(j, 1)
    //     }
    //   }
    //   NOVA.getVehicleOrders();
    // }
  
    // NOVA.vehicleFilter = function(data,e){
    //   if (event.target.checked) {
    //     NOVA.vehicle_filter.push(data)
    //   } 
    //   else {
    //     if (NOVA.vehicle_filter().includes(data)) {
    //       var j = NOVA.vehicle_filter().indexOf(data)
    //       NOVA.vehicle_filter.splice(j, 1)
    //     }
    //   }
    //   NOVA.getVehicleOrders();
    // }
  
    // NOVA.sortDate = function(data, e){
    //   if(NOVA.date_sort() == 'ascending'){
    //     NOVA.date_sort('descending')
    //     NOVA.getVehicleOrders();
    //   }else{
    //     NOVA.date_sort('ascending');
    //     NOVA.getVehicleOrders();
    //   }
    // }
  
    NOVA.refreshPagination = function(){
      var max = NOVA.current_page() + 2;
      if(max > NOVA.page_count())
        max = NOVA.page_count();
      var min = max - 2;
      if(min < 1)
        min = 1;
      NOVA.pages_list([]);
      for(i=min;i<=max;i++){
        NOVA.pages_list.push(i);
      }
    };
  
    NOVA.getPrevPage = function(){
      if(NOVA.current_page() != 1){
        NOVA.current_page(NOVA.current_page() - 1);
        NOVA.getVehicleOrders();
      }
    };
  
    NOVA.getNextPage = function(){
      if(NOVA.current_page() != NOVA.page_count()){
        NOVA.current_page(NOVA.current_page() + 1);
        NOVA.getVehicleOrders();
      }
    };
  
    NOVA.onPageClick = function(pageno){
      NOVA.current_page(pageno);
      NOVA.getVehicleOrders();
    };
  
    NOVA.getFirstPage = function(){
      NOVA.current_page(1);
      NOVA.getVehicleOrders();
    }
  
    NOVA.getLastPage = function(){
      NOVA.current_page(NOVA.page_count());
      NOVA.getVehicleOrders();
    }
  
    NOVA.pageSearchGo = function(data, e){
      if (NOVA.pageSearch() > NOVA.page_count()){
        NOVA.current_page(NOVA.page_count());
        NOVA.pageSearch(NOVA.page_count());
      }else{
        if (NOVA.pageSearch() != ''){
          NOVA.current_page(NOVA.pageSearch());
        }
      }
      NOVA.getVehicleOrders();
    }
  
    NOVA.searchKey = function(){
      NOVA.current_page(1)
      NOVA.search_term($('#search-input').val());
      NOVA.getVehicleOrders();
    }

    NOVA.getOrderFilters = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/vehicle/order/filters/get',
        data: {'vehicle_id': NOVA.vehicle_id()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        NOVA.orderTypeList([]);
        for(var i=0; i<d.order_types.length; i++){
          NOVA.orderTypeList.push(d.order_types[i]);
        }
        NOVA.driverList([]);
        for(var i=0; i<d.vehicle_drivers.length; i++){
          NOVA.driverList.push(d.vehicle_drivers[i]);
        }
        NOVA.statusList([]);
        for(var i=0; i<d.status_list.length; i++){
          NOVA.statusList.push(d.status_list[i]);
        }
        NOVA.getVehicleOrders();
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }

    NOVA.filterOrderType = function(data,e) {
      if (event.target.checked) {
          NOVA.selectedOrderType.push(data)
        } 
      else {
        if (NOVA.selectedOrderType().includes(data)) {
          var i = NOVA.selectedOrderType().indexOf(data)
          NOVA.selectedOrderType.splice(i, 1)
        }
      }
      NOVA.getVehicleOrders();
    }

    NOVA.filterDriver = function(data,e) {
      if (event.target.checked) {
          NOVA.selectedDriver.push(data)
        } 
      else {
        if (NOVA.selectedDriver().includes(data)) {
          var i = NOVA.selectedDriver().indexOf(data)
          NOVA.selectedDriver.splice(i, 1)
        }
      }
      NOVA.getVehicleOrders();
    }

    NOVA.filterStatus = function(data,e) {
      if (event.target.checked) {
          NOVA.selectedStatus.push(data)
        } 
      else {
        if (NOVA.selectedStatus().includes(data)) {
          var i = NOVA.selectedStatus().indexOf(data)
          NOVA.selectedStatus.splice(i, 1)
        }
      }
      NOVA.getVehicleOrders();
    }

    NOVA.sortOrderId = function() {
      NOVA.idSort('true');
      NOVA.dateSort('false');
      if(NOVA.idSortOrder() == 'ascending'){
        NOVA.idSortOrder('descending')
      }else{
        NOVA.idSortOrder('ascending') 
      }
      NOVA.getVehicleOrders();
    }

    NOVA.sortDate = function() {
      NOVA.dateSort('true');
      NOVA.idSort('false');
      if(NOVA.dateSortOrder() == 'ascending'){
        NOVA.dateSortOrder('descending')
      }else{
        NOVA.dateSortOrder('ascending') 
      }
      NOVA.getVehicleOrders();
    }
  
  })(this);

  function init() {
    if (document.readyState == "interactive") {
      NOVA.hideLoading();
      var docUrlArr = document.URL.split('/');
      console.log(docUrlArr);
      var id = docUrlArr[docUrlArr.length - 2];
      NOVA.vehicle_id(id);
      NOVA.getOrderFilters();
      ko.applyBindings(NOVA);
    }
  }
  
  document.onreadystatechange = init;