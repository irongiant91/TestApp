(function (window) {
  
    NOVA.client_id = ko.observable();
    NOVA.acManager = ko.observable();
    NOVA.industry = ko.observable();
    NOVA.address = ko.observable();
    NOVA.billingAddress = ko.observable();
    NOVA.companyName = ko.observable();
    NOVA.clientName = ko.observable();
    NOVA.pandl = ko.observable();
    NOVA.revenue = ko.observable();
    NOVA.expense = ko.observable();
    NOVA.lastInvoiceValue = ko.observable('');
    NOVA.contacts_list = ko.observableArray([]);
    NOVA.industryList = ko.observableArray([]);
    NOVA.managersList = ko.observableArray([]);
    NOVA.clientList = ko.observableArray([]);

    NOVA.primaryContactName = ko.observable();
    NOVA.primaryContactDesignation = ko.observable();
    NOVA.primaryContactEmail = ko.observable();
    NOVA.primaryContactPhone = ko.observable();
    NOVA.primaryContactFax = ko.observable();
    NOVA.reset_button_enable = ko.observable(false);

    NOVA.contact_id = ko.observable();

    NOVA.activateClient = function() {
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'POST',
        url: '/api/client/activate/client/portal',
        data: {'client_id' : NOVA.client_id()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        NOVA.showToast(d);  
        NOVA.clientDetailsGet();
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }

    NOVA.resetAccount = function() {
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'POST',
        url: '/api/client/reset/client/account',
        data: {'client_id' : NOVA.client_id()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        NOVA.showToast(d);  
        NOVA.clientDetailsGet();
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }


    NOVA.clientDetailsGet = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/client/get/details',
        data: {'client_id' : NOVA.client_id()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
        .done( function (d, textStatus, jqXHR) {
          // console.log(d);
          NOVA.companyName(d.company_name);
          NOVA.clientName(d.company_name);
          NOVA.acManager(d.account_manager);
          NOVA.industry(d.industry);
          $('#industrytype').val(d.industry).trigger('change');
          $('#accountManager').val(d.account_manager).trigger('change');
          $('#clientname').val(d.company_name).trigger('change');
          NOVA.address(d.address);
          NOVA.billingAddress(d.billing_address);
          NOVA.pandl(d.pandl);
          NOVA.revenue(d.est_revenue);
          NOVA.expense(d.est_expense);     
          NOVA.lastInvoiceValue(d.last_invoice_value);     
          NOVA.reset_button_enable(d.reset_button_enable);     
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        })
        .always(function(){
          NOVA.hideLoading();
        })
    }



    NOVA.savedetails = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'POST',
        url: '/api/client/update/details',
        data: {'client_id' : NOVA.client_id(),'client_name':NOVA.clientName(),'acManager':NOVA.acManager(),'industry':NOVA.industry(),'address':NOVA.address(),'billingAddress':NOVA.billingAddress()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
        .done( function (d, textStatus, jqXHR) {
          // console.log(d);
          // NOVA.billingAddress(d.billingAddress);
          // NOVA.address(d.address);
          // NOVA.acManager(d.acManager);
          // NOVA.industry(d.industry);
          // $('#accountManager').trigger('change');
          // $('#industrytype').trigger('change');
          $('.save-btn').addClass('d-none');
          $('.edit-btn').removeClass('d-none');
          $('.save-btn').closest('#companyDetail').find('.form-control,.custom-control-input').prop('disabled', true);
          NOVA.showToast(d.msg); 
          location.reload();         
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        })
        .always(function(){
          NOVA.hideLoading();
        })
    }


    NOVA.addPrimaryContact = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'POST',
        url: '/api/client/create/primary/contact',
        data: {'client_id' : NOVA.client_id(),'name':NOVA.primaryContactName(),'designation':NOVA.primaryContactDesignation(),'email':NOVA.primaryContactEmail(),'phone':NOVA.primaryContactPhone(),'fax':NOVA.primaryContactFax()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
        .done( function (d, textStatus, jqXHR) {
          // console.log(d);
          NOVA.primaryContactName('');
          NOVA.primaryContactDesignation('');
          NOVA.primaryContactEmail('');
          NOVA.primaryContactPhone('');
          NOVA.primaryContactFax('');
          $("body").removeClass("sidebar-right-open")
          NOVA.getPrimaryContacts();
          NOVA.showToast((jQuery.parseJSON(jqXHR.responseText)));        
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        })
        .always(function(){
          NOVA.hideLoading();
        })
    }


    NOVA.getPrimaryContacts = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/client/get/primary/contacts',
        data: {'client_id' : NOVA.client_id()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
        .done( function (d, textStatus, jqXHR) {
          console.log(d);
          NOVA.contacts_list([]);
          for(var i=0; i<d.length; i++){
          NOVA.contacts_list.push(d[i]);
        } 

          var swiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            spaceBetween: 15,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          }); 
                  
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        })
        .always(function(){
          NOVA.hideLoading();
        })
    }


    NOVA.getAccountManagers = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/lead/get/account/managers',
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      })
        .done( function (d, textStatus, jqXHR) {
          // console.log(d)
          NOVA.managersList([]);
          for(var i=0; i<d.managers.length; i++){
            NOVA.managersList.push(d.managers[i]);
          }
          NOVA.industryList([])
          for (let i = 0; i < d.industries.length; i++) {
            NOVA.industryList.push(d.industries[i]);
          }
          NOVA.clientList([])
          for (let i = 0; i < d.companies.length; i++) {
            NOVA.clientList.push(d.companies[i]);
          }
          NOVA.clientDetailsGet();
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        })
        .always(function(){
          NOVA.hideLoading();
        })
    }


    NOVA.favoriteContact = function(data){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'POST',
        url: '/api/client/contact/favourite',
        data: {'client_id' : NOVA.client_id(),'favourite_contact_id':data.contact_id},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
        .done( function (d, textStatus, jqXHR) {
          // console.log(d);
          NOVA.showToast((jQuery.parseJSON(jqXHR.responseText)));
       
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        })
        .always(function(){
          NOVA.hideLoading();
        })
    }


NOVA.editcontact=function(data)
{
  

    var csrftoken = NOVA.getCookie('csrftoken');
    NOVA.primaryContactName(data.contact_name);
    NOVA.primaryContactDesignation(data.designation);
    NOVA.primaryContactEmail(data.email);
    NOVA.primaryContactPhone(data.phone);
    NOVA.primaryContactFax(data.fax);
    NOVA.contact_id(data.contact_id);
    $("body").addClass("sidebar-right-open");

}



    NOVA.updatePrimaryContact = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'POST',
        url: '/api/client/edit/primary/contact',
        data: {'client_contact_id' : NOVA.contact_id(),'name':NOVA.primaryContactName(),'designation':NOVA.primaryContactDesignation(),'email':NOVA.primaryContactEmail(),'phone':NOVA.primaryContactPhone(),'fax':NOVA.primaryContactFax()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
        .done( function (d, textStatus, jqXHR) {
          // console.log(d);
          NOVA.primaryContactName('');
          NOVA.primaryContactDesignation('');
          NOVA.primaryContactEmail('');
          NOVA.primaryContactPhone('');
          NOVA.primaryContactFax('');
          $("body").removeClass("sidebar-right-open")
          NOVA.getPrimaryContacts();
          NOVA.showToast((jQuery.parseJSON(jqXHR.responseText)));        
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        })
        .always(function(){
          NOVA.hideLoading();
        })
    }

  NOVA.generateGraph = function (data, invoices) {
    var chart = c3.generate({
      bindto: "#totalInvoice",
      padding: {
        right: 20,
        left: 20,
      },
      data: {
        x: 'x',
        columns: data,
        type: 'spline',
        colors: {
          'data1': '#4B00F1',
        },
      },

      axis: {
        y: {
          show: false
        },
        x: {
          type: 'category',
          tick: {
            fit: true,
            format: "%b"
          },
          culling: {
            max: 4 // the number of tick texts will be adjusted to less than this value
          },
        },
      },
      point: {
        r: 7,
      },
      legend: {
        show: false
      },
      tooltip: {
        contents: function (d) {
          var data = invoices[d[0].index];
          return (

            d.map(dd => dd.value == 0 ? null : "<span class='custom-map-tooltip'>"+ "Total invoices - "+ data.orderinvoice+ " , Amount - "+ data.total+"</span>"+'<br>'+"<span class='custom-map-tooltip'>" + "Billed invoices - " + data.paid_orderinvoice +  " , Amount - "+ data.paid_total+"</span>"  )
          )
        }
      }
    });
  }

  NOVA.getInvoiceGraph = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/get/invoice/generated/graph',
      data: {'client_id' : NOVA.client_id()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
    })
      .done( function (d, textStatus, jqXHR) {
        NOVA.generateGraph(d.whole_list,d.invoice_list);
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
      NOVA.getAppLogo();
      // NOVA.init();
      ko.applyBindings(NOVA);
      var docUrlArr = document.URL.split('/');
      var client_id = docUrlArr[docUrlArr.length - 2];
      NOVA.client_id(client_id);
      NOVA.getPrimaryContacts();
      NOVA.getAccountManagers();
      NOVA.getInvoiceGraph();
    }
  }
  document.onreadystatechange = init;