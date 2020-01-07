(function (window) {
  
  NOVA.client_id = ko.observable();
  NOVA.price_list = ko.observableArray([]);
  

  $(document).on('show.bs.collapse','.collapse', function () {
    $(this).parent().find('.card-header .btn-link span').removeClass('icon-plus').addClass('icon-minus');
  });

  $(document).on('hide.bs.collapse','.collapse', function () {
    $(this).parent().find('.card-header .btn-link span').removeClass('icon-minus').addClass('icon-plus');
  })

  $(document).on('click','.remarks-view', function() {
    var nextTr = $(this).closest('tr').next('tr')
    if(nextTr.is(':visible')) {
      nextTr.addClass('d-none');
    } else {
      nextTr.removeClass('d-none');
    }
  })


  
  NOVA.clientPriceListGet = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/price/list/get',
      data: {
        'client_id' : NOVA.client_id(),
        'search_term' : $('#search-input').val()
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.price_list([]);
      for(var i=0; i<d.data.length; i++){
        NOVA.price_list.push(d.data[i]);
      }
      $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };


  NOVA.search = function(){
    NOVA.clientPriceListGet()
  }






    
  
  })(this);
  
  function init() {
    if (document.readyState == "interactive") {
      $('#navItemClients').addClass('active');
      NOVA.hideLoading();
      ko.applyBindings(NOVA);
      var docUrlArr = document.URL.split('/');
      var client_id = docUrlArr[docUrlArr.length - 2];
      NOVA.client_id(client_id);
      NOVA.clientPriceListGet();
      NOVA.getAppLogo();
    }
  }
  document.onreadystatechange = init;