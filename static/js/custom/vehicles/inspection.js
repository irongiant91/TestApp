(function (window) {
    NOVA.vehicle_id = ko.observable();
    NOVA.search_term = ko.observable();
    NOVA.pages_list = ko.observableArray([]);
    NOVA.inspections_list = ko.observableArray([]);
    
    NOVA.current_page = ko.observable(1);
    NOVA.page_count = ko.observable('');
    NOVA.pageSearch = ko.observable('');
    
    NOVA.inspectionDetailPage = function(data){
      window.location = '/vehicle/'+NOVA.vehicle_id()+'/inspection/'+data.id;
    }
    
    NOVA.getInspections = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/vehicle/list/inspections/get',
        data: {'vehicle_id': NOVA.vehicle_id(),
               'search_term': NOVA.search_term(),
               'page_number': NOVA.current_page(),
              },
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
        .done( function (d, textStatus, jqXHR) {
          console.log(d)
          NOVA.inspections_list([]);
          for (let i = 0; i < d.data.length; i++) {
            NOVA.inspections_list.push(d.data[i]);
  
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
    
    NOVA.showPDF = function (data) {
        console.log(data)
        $('#pdfWrapperModal').modal('show');
        PDFObject.embed(data.insp_report, "#pdfWrapper");
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
    //   NOVA.getInspections();
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
    //   NOVA.getInspections();
    // }
  
    // NOVA.sortDate = function(data, e){
    //   if(NOVA.date_sort() == 'ascending'){
    //     NOVA.date_sort('descending')
    //     NOVA.getInspections();
    //   }else{
    //     NOVA.date_sort('ascending');
    //     NOVA.getInspections();
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
        NOVA.getInspections();
      }
    };
  
    NOVA.getNextPage = function(){
      if(NOVA.current_page() != NOVA.page_count()){
        NOVA.current_page(NOVA.current_page() + 1);
        NOVA.getInspections();
      }
    };
  
    NOVA.onPageClick = function(pageno){
      NOVA.current_page(pageno);
      NOVA.getInspections();
    };
  
    NOVA.getFirstPage = function(){
      NOVA.current_page(1);
      NOVA.getInspections();
    }
  
    NOVA.getLastPage = function(){
      NOVA.current_page(NOVA.page_count());
      NOVA.getInspections();
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
      NOVA.getInspections();
    }
  
    NOVA.searchKey = function(){
      NOVA.current_page(1)
      NOVA.search_term($('#search-input').val());
      NOVA.getInspections();
    }
  
  })(this);

  function init() {
    if (document.readyState == "interactive") {
      NOVA.hideLoading();
      $('#navItemVehicles').addClass('active');
      var docUrlArr = document.URL.split('/');
      console.log(docUrlArr);
      var id = docUrlArr[docUrlArr.length - 2];
      NOVA.vehicle_id(id);
      NOVA.getInspections();
      ko.applyBindings(NOVA);
    }
  }
  
  document.onreadystatechange = init;