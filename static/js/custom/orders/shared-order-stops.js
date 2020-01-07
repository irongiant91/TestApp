(function (window) {
  NOVA.order_id = ko.observable();
  NOVA.search_term = ko.observable();
  NOVA.pages_list = ko.observableArray([]);
  NOVA.orderstops_list = ko.observableArray([]);
  NOVA.vehicleList = ko.observableArray([]);
  NOVA.driverList = ko.observableArray([]);
  NOVA.vehicle_filter= ko.observableArray([]);
  NOVA.driver_filter= ko.observableArray([]);
  NOVA.date_sort= ko.observable('')
  NOVA.exportStartDate = ko.observable('')
  NOVA.exportEndDate = ko.observable('')

  NOVA.current_page = ko.observable(1);
  NOVA.page_count = ko.observable('');
  NOVA.pageSearch = ko.observable('');
  NOVA.user_timezone = ko.observable('');
  
  NOVA.redirectToJob= function(){
    window.location = '/order/'+NOVA.order_id();
  }

  NOVA.redirectToDocuments = function(){
    window.location = '/order/'+NOVA.order_id()+'/documents';
  }

  NOVA.redirectToFinances = function(){
    window.location = '/order/'+NOVA.order_id()+'/finance';
  }

  NOVA.redirectToInvoices = function(){
    window.location = '/order/'+NOVA.order_id()+'/invoice';
  }

  NOVA.getDriverVehicle = function (){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/drivervehicle/get',
      data: {'order_id': NOVA.order_id()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done( function (d, textStatus, jqXHR) {
        NOVA.vehicleList([]);
        for (let i = 0; i < d.vehicle_list.length; i++) {
          NOVA.vehicleList.push(d.vehicle_list[i]);
        }
        NOVA.driverList([]);
        for (let i = 0; i < d.driver_list.length; i++) {
          NOVA.driverList.push(d.driver_list[i]);
        }
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
  }
  
  NOVA.getOrderStops = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/order/stops/get',
      data: {'order_id': NOVA.order_id(),
             'search_term': NOVA.search_term(),
             'page_number': NOVA.current_page(),
             'vehicle_filter': ko.toJSON(NOVA.vehicle_filter()),
             'driver_filter': ko.toJSON(NOVA.driver_filter()),
             'date_sort': NOVA.date_sort(),
            },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done( function (d, textStatus, jqXHR) {
        NOVA.orderstops_list([]);
        var offset = moment().utcOffset();
        for (let i = 0; i < d.data.length; i++) {
          d.data[i].date = moment.utc(d.data[i].date, "DD MMM YYYY").utcOffset(offset).format("DD MMM YYYY");
          d.data[i].time = moment.utc(d.data[i].time, "hh:mm:ss A").utcOffset(offset).format("hh:mm:ss A");
          NOVA.orderstops_list.push(d.data[i]);

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


  NOVA.exportOrderStops = function(){
    console.log(NOVA.user_timezone())
    $("#exportModal").modal('hide');
    location.href = '/api/order/export/stops?startDate='+NOVA.exportStartDate()+'&endDate='+NOVA.exportEndDate()+'&order_id='+NOVA.order_id()+'&user_timezone='+NOVA.user_timezone()
  }

  NOVA.driverFilter = function(data,e){
    if (event.target.checked) {
      NOVA.driver_filter.push(data)
    } 
    else {
      if (NOVA.driver_filter().includes(data)) {
        var j = NOVA.driver_filter().indexOf(data)
        NOVA.driver_filter.splice(j, 1)
      }
    }
    NOVA.getOrderStops();
  }

  NOVA.vehicleFilter = function(data,e){
    if (event.target.checked) {
      NOVA.vehicle_filter.push(data)
    } 
    else {
      if (NOVA.vehicle_filter().includes(data)) {
        var j = NOVA.vehicle_filter().indexOf(data)
        NOVA.vehicle_filter.splice(j, 1)
      }
    }
    NOVA.getOrderStops();
  }

  NOVA.sortDate = function(data, e){
    if(NOVA.date_sort() == 'ascending'){
      NOVA.date_sort('descending')
      NOVA.getOrderStops();
    }else{
      NOVA.date_sort('ascending');
      NOVA.getOrderStops();
    }
  }

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
      NOVA.getOrderStops();
    }
  };

  NOVA.getNextPage = function(){
    if(NOVA.current_page() != NOVA.page_count()){
      NOVA.current_page(NOVA.current_page() + 1);
      NOVA.getOrderStops();
    }
  };

  NOVA.onPageClick = function(pageno){
    NOVA.current_page(pageno);
    NOVA.getOrderStops();
  };

  NOVA.getFirstPage = function(){
    NOVA.current_page(1);
    NOVA.getOrderStops();
  }

  NOVA.getLastPage = function(){
    NOVA.current_page(NOVA.page_count());
    NOVA.getOrderStops();
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
    NOVA.getOrderStops();
  }

  NOVA.searchKey = function(){
    NOVA.current_page(1);
    NOVA.search_term($('#search-input').val());
    NOVA.getOrderStops();
  }

})(this);