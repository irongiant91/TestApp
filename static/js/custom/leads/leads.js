(function (window) {
    NOVA.leadsGridList = ko.observableArray([]);
    NOVA.leadsList = ko.observableArray([]);
    NOVA.lead_source_list = ko.observableArray([]);
    NOVA.clientsList = ko.observableArray([]);
  
    NOVA.leadName = ko.observable('');
    NOVA.companyName = ko.observable('');
    NOVA.subCompanyName = ko.observable('');
    NOVA.contactName = ko.observable('')
    NOVA.phoneNumber = ko.observable('');
    NOVA.designation = ko.observable('');
    NOVA.fax = ko.observable('');
    NOVA.emailAddress = ko.observable('');
    NOVA.industry = ko.observable('');
    NOVA.accountManager = ko.observable('');
    NOVA.brandRepresentation = ko.observable('Local');
    NOVA.isExporterCompany = ko.observable(false);
    NOVA.scheduledStartDate = ko.observable('');
    NOVA.address = ko.observable('');
    NOVA.billingAddress = ko.observable('');
  
    NOVA.from_stage = ko.observable('');
    NOVA.from_position = ko.observable('');
    NOVA.to_stage = ko.observable('');
    NOVA.to_position = ko.observable('');
    NOVA.changed_deal = ko.observable('');
  
    NOVA.search_term = ko.observable('');
    NOVA.page_count = ko.observable('');
    NOVA.current_page = ko.observable('');
    NOVA.last_page = ko.observable('');
    NOVA.pages_list = ko.observableArray([]);
    NOVA.pageSearch = ko.observable('');
  
    NOVA.sortLeadsFilters = ko.observableArray(['Select Sort','Lead Value', 'Account Manager']);
    NOVA.chosenSort = ko.observable('');
    NOVA.sortLeadsFiltersOrder = ko.observable('ascending');
  
    NOVA.availableUsers = ko.observableArray([]);
    NOVA.chosenUser = ko.observable('');
    NOVA.lead_id = ko.observable('');
  
    NOVA.stagesList = ko.observableArray([]);
    NOVA.selectedStagesList = ko.observableArray([]);
    NOVA.managersList = ko.observableArray([]);
    NOVA.selectedManagersList = ko.observableArray([]);
    NOVA.industryList = ko.observableArray([]);
    NOVA.subCompanyList = ko.observableArray([]);

    NOVA.isExistingCompany = ko.observable(false);
    NOVA.isExistingContact = ko.observable(false);
    NOVA.contactNamesList = ko.observableArray([]);



    NOVA.createLead = function(){    
      var csrftoken = NOVA.getCookie('csrftoken');
      var formdata = new FormData();
  
      formdata.append('lead_name', NOVA.leadName());
      formdata.append('company_name', NOVA.companyName());
      formdata.append('sub_company_name', NOVA.subCompanyName());
      formdata.append('contact_name', NOVA.contactName());
      formdata.append('phone_number', NOVA.phoneNumber());
      formdata.append('designation', NOVA.designation());
      formdata.append('fax', NOVA.fax());
      formdata.append('email_address', NOVA.emailAddress());
      formdata.append('industry', NOVA.industry());
      formdata.append('account_manager', NOVA.accountManager());
      formdata.append('brand_representation', NOVA.brandRepresentation());
      formdata.append('is_export_company', NOVA.isExporterCompany());
      formdata.append('scheduled_start_date', NOVA.scheduledStartDate());
      formdata.append('address', NOVA.address());
      formdata.append('billing', NOVA.billingAddress());
      $.ajax({
        method: 'POST',
        url: '/api/lead/create/lead',
        data: formdata,
        contentType: false,
        processData: false,
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        NOVA.showToast((jQuery.parseJSON(jqXHR.responseText)));
        
        NOVA.leadName('');
        NOVA.subCompanyName('');
        NOVA.contactName('');
        NOVA.phoneNumber('');
        NOVA.designation('');
        NOVA.fax('');
        NOVA.emailAddress('');
        NOVA.scheduledStartDate('');
        $('#industry').val('').trigger('change');
        $('#companyName').val('').trigger('change');
        $('#accountManager').val('').trigger('change');
        $( "#localRepresentation" ).prop( 'checked',true );
        $( "#exporterCompanyYes" ).prop( 'checked',true );
        NOVA.address('');
        NOVA.billingAddress('');

        createLeadValidator.resetForm();
        
        NOVA.getAccountManagers();  
        NOVA.getGridLeads();
        NOVA.getLeads();
        if ($(window).width() <= 767.98) {
          $('#leadSideBar').css('transform', 'translate(100%, 0)');
        } else {
          $('#leadSideBar').css('transform', 'translate(355px, 0)');
        }
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }
    
    NOVA.getGridLeads = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/lead/get/grid/lead',
        data: {'page_number': NOVA.current_page(), 'search_term':NOVA.search_term(),'sort_filters': NOVA.chosenSort()[0], 'user_filters':NOVA.chosenUser()[0], 'sort_order':NOVA.sortLeadsFiltersOrder()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        NOVA.leadsGridList([]);
        setTimeout(function(){
          $('[data-toggle="tooltip"]').tooltip({ boundary: '.card' });
        }, 10);
        

        for(var i=0; i<d.length; i++){
          NOVA.leadsGridList.push(d[i]);
        }
  
        $(document).on('click','ul.droptrue li .card-data', function() {
          var deal_id = $(this).closest('li').attr('id').match(/\d+/)[0];
          window.location = 'lead/details/'+deal_id
        })
  
  
        $("ul.droptrue").sortable({
          refreshPositions: true,
          tolerance:"intersect",
          helper: false,
          scroll: true,
          connectWith: "ul",
          placeholder: "ui-state-highlight",
  
  
          sort:function(e,ui){
  
            var w=ui.helper.outerWidth(true),
            elem1=$(".lead-grid-view .mCustomScrollBox"),
            elemWidth=elem1.width(),
            moveBy1=$(".lead-grid-view li").outerWidth(true)*2,
            mouseCoordsX=e.pageX-elem1.offset().left;
  
            if(mouseCoordsX<w){
              $(".lead-grid-view").mCustomScrollbar("scrollTo","+="+moveBy1);
            }else if(mouseCoordsX>elemWidth-w){
              $(".lead-grid-view").mCustomScrollbar("scrollTo","-="+moveBy1);
            }
          },
          start: function (event, ui) {
            NOVA.from_stage(ui.item.parent().attr('id').match(/\d+/)[0]);
            NOVA.from_position(ui.item.index()+1);
          },
          stop: function (event, ui) {
            NOVA.to_stage(ui.item.parent().attr('id').match(/\d+/)[0]);
            NOVA.to_position(ui.item.index()+1);
            NOVA.changed_deal(ui.item.attr('id').match(/\d+/)[0]);
            NOVA.changeLeadStage();
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

    NOVA.getLeads = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/lead/get/list/lead',
        data: {'page_number': NOVA.current_page(), 'search_term':NOVA.search_term(),'sort_filters': NOVA.chosenSort()[0], 'user_filters':NOVA.chosenUser()[0], 'sort_order':NOVA.sortLeadsFiltersOrder(), 'selectedstagesList': ko.toJSON(NOVA.selectedStagesList()), 'selectedManagersList': ko.toJSON(NOVA.selectedManagersList())},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        NOVA.leadsList([]);
        for(var i=0; i<d.leads.length; i++){
          NOVA.leadsList.push(d.leads[i]);
        }
        NOVA.page_count(d.page_count);
        NOVA.last_page(d.page_count);
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
  
    NOVA.changeLeadStage = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      var formdata = new FormData();
      formdata.append('from_stage',NOVA.from_stage());
      formdata.append('from_position',NOVA.from_position());
      formdata.append('to_stage', NOVA.to_stage());
      formdata.append('to_position',NOVA.to_position());
      formdata.append('lead_id', NOVA.changed_deal());
      formdata.append('sort_filters', NOVA.chosenSort());
      formdata.append('user_filters', NOVA.chosenUser());
      formdata.append('search_term', NOVA.search_term());
      
      $.ajax({
        method: 'POST',
        url: '/api/lead/change/lead/stage',
        data: formdata,
        contentType: false,
        processData: false,
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
          NOVA.getGridLeads();
          NOVA.getLeads();  
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        NOVA.getGridLeads();  
      })
      .always( function(){
        NOVA.hideLoading();
      })
    }

    NOVA.sortFilter = function(data,e){
      if(NOVA.chosenSort() == 'Select Sort'){
        NOVA.getGridLeads();
        NOVA.getLeads();
      }
    }
  
    NOVA.userFilter = function(data,e){
      NOVA.getGridLeads();
      NOVA.getLeads();
    }
  
    NOVA.sortbyOrder = function(data,e){
      if(NOVA.chosenSort() != ''){
        if(NOVA.sortLeadsFiltersOrder() == 'ascending'){
          NOVA.sortLeadsFiltersOrder('descending')
          NOVA.getGridLeads();
          NOVA.getLeads();
        }else{
          NOVA.sortLeadsFiltersOrder('ascending');
          NOVA.getGridLeads();
          NOVA.getLeads();
        }
      }
    }

    NOVA.leadValueSort = function(data, e){
      NOVA.chosenSort(['Lead Value'])
      if(NOVA.sortLeadsFiltersOrder() == 'ascending'){
        NOVA.sortLeadsFiltersOrder('descending')
        NOVA.getLeads();
      }else{
        NOVA.sortLeadsFiltersOrder('ascending');
        NOVA.getLeads();
      }
    }
    
    NOVA.brandRep = function(data, event){
      if (event.target.checked) {
        NOVA.brandRepresentation(event.currentTarget.value);
      }
    }

    NOVA.radioExporterCompany = function(data, event){
      if(event.target.checked) {
        if (event.currentTarget.value == 'Yes'){
          NOVA.isExporterCompany(true);
        }
        else{
          NOVA.isExporterCompany(false);
        }
      }
    }

    NOVA.clickDetailPage = function(data,e){
      window.open('lead/details/' + (data.lead_id).toString());
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
        NOVA.clientsList([]);
        for(var i=0; i<d.companies.length; i++){
          NOVA.clientsList.push(d.companies[i]);
        }

        NOVA.managersList([]);
        for(var i=0; i<d.managers.length; i++){
          NOVA.managersList.push(d.managers[i]);
        }

        NOVA.availableUsers([]);
        NOVA.availableUsers.push({'owner_id':0,'owner_name':'All Users'});
        for(var i=0; i<d.owners.length; i++){
          NOVA.availableUsers.push(d.owners[i]);
        }

        NOVA.industryList([])
          for (let i = 0; i < d.industries.length; i++) {
            NOVA.industryList.push(d.industries[i]);
          }

      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }

    NOVA.checkCompany = function(){
      if (NOVA.clientsList().includes(NOVA.companyName()[0])){
        var csrftoken = NOVA.getCookie('csrftoken');
        $.ajax({
          method: 'GET',
          url: '/api/lead/get/company/contacts',
          data: {'company_name': NOVA.companyName(), 'sub_company': NOVA.subCompanyName()},
          beforeSend: function(xhr, settings) {
            NOVA.showLoading();
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
          }
        })
          .done( function (d, textStatus, jqXHR) {
            NOVA.isExistingCompany(true);
            NOVA.isExistingContact(true);
            // NOVA.contactNamesList(d.contact_name_list)
            for (let i = 0; i < d.contact_names_list.length; i++) {
              NOVA.contactNamesList.push(d.contact_names_list[i]);
            }
            $('#contactName').val(d.contact_name).trigger('change');
            for (let i = 0; i < d.sub_company_list.length; i++) {
              NOVA.subCompanyList.push(d.sub_company_list[i]);
            }
            $('#subCompanyName').val(d.sub_company_name).trigger('change');
            $('#industry').val(d.industry).trigger('change');
            $('#accountManager').val(d.account_manager).trigger('change');

            
            NOVA.designation(d.designation);
            NOVA.emailAddress(d.email);
            NOVA.phoneNumber(d.phone);
            NOVA.fax(d.fax);
            NOVA.address(d.address)
            NOVA.billingAddress(d.billing)
            
          })
          .fail( function (jqXHR, textStatus, errorThrown) {
            NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
          })
          .always(function(){
            NOVA.hideLoading();
          })
      }
      else{
        NOVA.isExistingCompany(false);
        $('#contactName').val('').trigger('change');
        $('#subCompanyName').val('').trigger('change');
        NOVA.contactNamesList([]);
        NOVA.subCompanyList([]);
        $('#industry').val('').trigger('change');
        $('#accountManager').val('').trigger('change');
        NOVA.designation('');
        NOVA.emailAddress('');
        NOVA.phoneNumber('');
        NOVA.fax('');
        NOVA.address('')
        NOVA.billingAddress('')
      } 
    }

    NOVA.checkContactName = function(){
      if (NOVA.contactNamesList().includes(NOVA.contactName()[0])){
        var csrftoken = NOVA.getCookie('csrftoken');
        $.ajax({
          method: 'GET',
          url: '/api/lead/get/contact/detail',
          data: {'company_name': NOVA.companyName(), 'contact_name': NOVA.contactName()},
          beforeSend: function(xhr, settings) {
            NOVA.showLoading();
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
          }
        })
          .done( function (d, textStatus, jqXHR) {
            NOVA.isExistingContact(true);
            NOVA.designation(d.designation);
            NOVA.emailAddress(d.email);
            NOVA.phoneNumber(d.phone);
            NOVA.fax(d.fax);
            
          })
          .fail( function (jqXHR, textStatus, errorThrown) {
            NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
          })
          .always(function(){
            NOVA.hideLoading();
          })
      }else{
        NOVA.isExistingContact(false);
        NOVA.designation('');
        NOVA.emailAddress('');
        NOVA.phoneNumber('');
        NOVA.fax('');
      }
       
    }
  
    NOVA.getStages = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/lead/get/stages',
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        NOVA.stagesList([]);
        for(var i=0; i<d.all_stages_list.length; i++){
          NOVA.stagesList.push(d.all_stages_list[i]);
        }
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }
  
    NOVA.stagesFilter = function(data,e){
      if (event.target.checked) {
        NOVA.selectedStagesList.push(data.stage_name)
      } 
      else {
        if (NOVA.selectedStagesList().includes(data.stage_name)) {
          var j = NOVA.selectedStagesList().indexOf(data.stage_name)
          NOVA.selectedStagesList.splice(j, 1)
        }
      }
      NOVA.getLeads();
    }

    NOVA.managersFilter = function(data,e){
      if (event.target.checked) {
        NOVA.selectedManagersList.push(data)
      } 
      else {
        if (NOVA.selectedManagersList().includes(data)) {
          var j = NOVA.selectedManagersList().indexOf(data)
          NOVA.selectedManagersList.splice(j, 1)
        }
      }
      NOVA.getLeads();
    }
    
    NOVA.cancelLeadCreate = function(data,e){
      if ($(window).width() <= 767.98) {
        $('#leadSideBar').css('transform', 'translate(100%, 0)');
      } else {
        $('#leadSideBar').css('transform', 'translate(355px, 0)');
      }
        
        NOVA.leadName('');
        NOVA.subCompanyName('');
        NOVA.contactName('');
        NOVA.phoneNumber('');
        NOVA.designation('');
        NOVA.fax('');
        NOVA.emailAddress('');
        NOVA.scheduledStartDate('');
        NOVA.address('')
        NOVA.billingAddress('')
        $( "#localRepresentation" ).prop( 'checked',true );
        $( "#exporterCompanyYes" ).prop( 'checked',true );
        $('#industry').val('').trigger('change');
        $('#companyName').val('').trigger('change');
        $('#accountManager').val('').trigger('change');
        createLeadValidator.resetForm();
  
    }
  
    NOVA.refreshPagination = function(){
      var max = NOVA.current_page() + 2;
      if(max > NOVA.page_count())
          max = NOVA.page_count();
      var min = max - 4;
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
        NOVA.getLeads();
      }
    };
  
    NOVA.getNextPage = function(){
      if(NOVA.current_page() != NOVA.page_count()){
        NOVA.current_page(NOVA.current_page() + 1);
        NOVA.getLeads();
      }
    };
  
    NOVA.onPageClick = function(pageno){
      NOVA.current_page(pageno);
      NOVA.getLeads();
    };
  
    NOVA.getFirstPage= function(){
      NOVA.current_page(1);
      NOVA.getLeads();
    };
    
    NOVA.getLastPage= function(){
      NOVA.current_page(NOVA.last_page());
      NOVA.getLeads();
    };

    NOVA.pageSearchGo = function(data, e){
      if (NOVA.pageSearch() > NOVA.page_count()){
        NOVA.current_page(NOVA.page_count());
        NOVA.pageSearch(NOVA.page_count());
      }else{
        if (NOVA.pageSearch() != ''){
          NOVA.current_page(NOVA.pageSearch());
        }
      }
      NOVA.getLeads();
    }
  
    NOVA.searchKey = function(){
      NOVA.search_term($('#search-input').val());
      NOVA.getLeads();
      NOVA.getGridLeads();
    }
  
    NOVA.toggleEstDate = function(){
      $('input[name="estDate"]').data('daterangepicker').show();
    }
  
    $('input[name="estDate"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      opens: "left",
      parentEl: '#datePicParent',
      locale: {
        format: 'DD MMM YYYY'
      }
    }).on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
    });
  
    NOVA.getCookie = function (name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    $('#navItemLeads').addClass('active');
    

  $(document).on('mouseover', '.overflow-fix', function(event) {
    event.preventDefault();
    var _this = $(this);
    $('.overflow-data').remove();
    _this.css('text-overflow', 'initial');
    if(_this[0].scrollWidth > _this.outerWidth()) {
      if(_this.parent().find('.overflow-data').length == 0) {
        var getPos = _this.offset()
        var tableOffset =_this.parent().css('position', 'relative').offset()
        var finalTop = getPos.top - tableOffset.top-1
        var finalLeft = getPos.left - tableOffset.left
        if(_this.hasClass('elm-overflow')) {
          var getObj = _this.clone(false).removeClass('overflow-fix').addClass('overflow-data').removeAttr('style');
          getObj.css({'left': (finalLeft), 'top':(finalTop)});
          _this.parent().append(getObj)
        } else {
          var getVal = _this.html()
          _this.parent().append(`<span class="overflow-data" style="left:`+(finalLeft-4)+`px; top: `+(finalTop-1)+`px;">`+getVal+`</span>`)
        }
      }
      setTimeout(function() {
        _this.parent().find('.overflow-data').css('opacity', 1);
      }, 0);
      _this.css('text-overflow', 'ellipsis');
    }
  });
  $(document).on('mouseout', '.overflow-data', function(event) {
    var _this = $(this);
    _this.parent().find('.overflow-fix').css('text-overflow', 'ellipsis');
    _this.css('opacity', 0);
    setTimeout(function() {
     _this.remove();
   }, 300);
  });
  })(this);
  
  function init() {
    if (document.readyState == "interactive") {
    NOVA.current_page(1)

        
      NOVA.getAppLogo();
      ko.applyBindings(NOVA);
      NOVA.getAppLogo();
      NOVA.getAccountManagers();
      NOVA.getGridLeads();
      NOVA.getLeads();
      NOVA.getStages();

    }
  }
  
  document.onreadystatechange = init;