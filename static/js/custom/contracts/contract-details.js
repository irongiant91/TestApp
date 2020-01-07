(function (window) {
  NOVA.client_id = ko.observable('');
  NOVA.contract_id = ko.observable('');
  NOVA.toEmail = ko.observable('');
  NOVA.start_date = ko.observable('');
  NOVA.end_date = ko.observable('');
  NOVA.total_revenue = ko.observable(0);
  NOVA.pl_status = ko.observable('');
  NOVA.total_expense = ko.observable('');
  NOVA.published = ko.observable('');
  NOVA.is_published = ko.observable('');
  NOVA.lead_won = ko.observable('');
  NOVA.revenue_exist = ko.observable('');
  NOVA.contract_doc = ko.observable('');
  NOVA.contract_uid = ko.observable('');
  NOVA.contract_file = ko.observable('');
  NOVA.draft_contract_id = ko.observable('');
  NOVA.draft_contract_doc = ko.observable('');
  NOVA.categories_list = ko.observableArray([]);
  NOVA.modificationLogList = ko.observableArray([]);

  $('#uploadContractModal').on('hidden.bs.modal', function () {
      $('[name="refNumber"]').val('');
      $('#uploadContractFile').css({'opacity': .6}).removeClass('cursor-pointer').find('input').prop('disabled', true);
    });

    $('[name="refNumber"]').on('keyup', function() {
      if($(this).val() != '') {
        $('#uploadContractFile').css({'opacity': 1}).addClass('cursor-pointer').find('input').prop('disabled', false);
      } else {
        $('#uploadContractFile').css({'opacity': .6}).removeClass('cursor-pointer').find('input').prop('disabled', true);
      }
    })


  $('#toEmail').on('click', function() {
      $('#emailInput').removeClass('d-none');
    })

    $.validator.addMethod("emailRegex", function(value, element) {
      return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test( value );
    });

    mailForm = $("#mailForm").validate({
    errorElement: 'span',
    errorClass: 'error text-danger',
    errorPlacement: function(error, element) {
      if (element.parent().hasClass("input-group")) {
        error.appendTo( element.parent().parent());
      } else {
        error.appendTo( element.parent());
      }
    },
    rules: {
      toEmail: {
        required: true,
        emailRegex: true
      }
    },
    messages: {
      toEmail: {
        required: "Please enter mail ID",
        emailRegex: "Please enter valid email"
      }
    },
    submitHandler: function() {
      NOVA.sendMail();
    }
  });

  var category = function(){
    this.category_id = ko.observable('');
    this.category_name = ko.observable('');
    this.category_type = ko.observable('');
    this.selected_items = ko.observable('');
    this.total_items = ko.observable('');
    this.total_revenue = ko.observable('');
    this.is_selected = ko.observable('');
    this.items = ko.observableArray([]);
    this.fill = function (d) {
      this.category_id('' || d.category_id);
      this.category_name('' || d.category_name);
      this.category_type('' || d.category_type);
      this.selected_items('' || d.selected_items);
      this.total_items('' || d.total_items);
      this.total_revenue('' || d.total_revenue);
      this.is_selected('' || d.is_selected);
      this.items([]);
      for(var i=0;i<d.items.length;i++){
        var category_item = new categoryItem();
        category_item.fill(d.items[i]);
        this.items.push(category_item);
      }
    }
  }

  var categoryItem = function(){
    this.item_id = ko.observable('');
    this.name = ko.observable('');
    this.item_type = ko.observable('');
    this.is_selected = ko.observable('');
    this.volume = ko.observable('');
    this.uom = ko.observable('');
    this.uom_list = ko.observableArray([]);
    this.tooltip_text = ko.observable('');
    this.propose_rate = ko.observable('');
    this.revenue = ko.observable('');
    this.expense = ko.observable('');
    this.remarks = ko.observable('');
    this.remarks_tooltip = ko.observable('');
    this.remarks_editable = ko.observable('');
    this.fill = function (d) {
      this.item_id('' || d.item_id);
      this.name('' || d.name);
      this.item_type('' || d.item_type);
      this.is_selected('' || d.is_selected);
      this.volume('' || d.volume);
      this.uom('' || d.uom);
      this.uom_list('' || d.uom_list);
      this.tooltip_text('' || d.tooltip_text);
      this.propose_rate('' || d.propose_rate);
      this.revenue('' || d.revenue);
      this.expense('' || d.expense);
      this.remarks('' || d.remarks);
      this.remarks_tooltip('' || d.remarks_tooltip);
      this.remarks_editable('' || d.remarks_editable);
    }
  }
  
  NOVA.getclientContractDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/contract/details/get',
      data: {
        'client_id':NOVA.client_id(),
        'contract_id':NOVA.contract_id()
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.categories_list([]);
      setTimeout(function(){
        $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
      },10);
      $('#contractStartDate').val(d.start_date);
      $('#contractEndDate').val(d.end_date);
      NOVA.contract_doc(d.contract_doc);
      NOVA.start_date(d.start_date);
      NOVA.end_date(d.end_date);
      NOVA.total_revenue(d.total_revenue);
      NOVA.revenue_exist(d.revenue_exist);
      NOVA.pl_status(d.pl_status);
      NOVA.total_expense(d.total_expense);
      NOVA.is_published(d.is_published);
      NOVA.lead_won(d.lead_won);
      
      if(NOVA.revenue_exist() == true){
        publishFlag1 = true
        for(var j=0; j<d.data.length; j++){
          var category1 = new category();
          category1.fill(d.data[j]);
          NOVA.categories_list.push(category1);
        }
        $('#contractFilterBtn').addClass('d-none');
        $('#contractFilterBtnEdit').removeClass('d-none');
        $('#editBtn').removeClass('d-none');
        $('#contractStartDate, #contractEndDate, #contractFilterBtnEdit').attr('disabled','disabled');
        /*if(NOVA.is_published() == true){
          $('#draftBtn').attr('disabled','disabled');
          $('#publishBtn').addClass('d-none');
          $('#editBtn').removeClass('d-none');
          $('.config_expence').attr('disabled','disabled');
          $('#contractStartDate, #contractEndDate, #contractFilterBtnEdit').attr('disabled','disabled');
        }else{
          $('#publishBtn').removeClass('d-none');
          $('#editBtn').addClass('d-none');
          $('#draftBtn').removeAttr('disabled');
          $('#publishBtn').removeAttr('disabled');
          $('#contractStartDate, #contractEndDate, #contractFilterBtnEdit').attr('disabled','disabled');
        }*/
      }
      $('.config_expence[type="checkbox"]').each(function() {
        var getTr = $(this).closest('tr');
          getTr.find('.config_expence').prop('disabled',true);
          getTr.find('.volumeInputs').prop('disabled',true);
          getTr.find('.priceInputs').prop('disabled',true);
          getTr.find('.remarks-view').prop('disabled',true);
      })
      if(d.parent_exist == true){
        $('#contractFilterBtn').addClass('d-none');
        $('#contractFilterBtnEdit').addClass('d-none');
        $('#editBtn').addClass('d-none');
        $('#contractStartDate, #contractEndDate, #contractFilterBtnEdit').attr('disabled','disabled');
        $('.config_expence[type="checkbox"]').each(function() {
          var getTr = $(this).closest('tr');
            getTr.find('.config_expence').prop('disabled',true);
            getTr.find('.volumeInputs').prop('disabled',true);
            getTr.find('.priceInputs').prop('disabled',true);
            getTr.find('.remarks-view').prop('disabled',true);
        })
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  $(document).on('click', '#editBtn', function(){
    NOVA.getclientContractDraftDetails();
  })

  var publishFlag1 = false;
  var publishFlag2 = false;
  var publishFlag3 = false;

  NOVA.selectItem = function(parent,index,data, e){
    var getTr = $(e.currentTarget).closest('tr');
      if($(e.currentTarget).is(':checked')) {
        getTr.find('select.config_expence').prop('disabled',false);
        getTr.find('.volumeInputs').prop('disabled',false);
        getTr.find('.priceInputs').prop('disabled',false);
        getTr.find('.remarks-view').prop('disabled',false);
        publishFlag2 = true;
      if(getTr.find('select.config_expence').val() == '' || getTr.find('.volumeInputs').val() == '' || getTr.find('.priceInputs').val() == '') {
        publishFlag3 = false;
      } else {
        publishFlag3 = true;
      }
    } else {
        data.volume('');
        data.uom('');
        data.revenue(0);
        data.propose_rate(0);
        NOVA.categories_list()[parent].total_revenue(0)
        getTr.find('select.config_expence').prop('disabled',true);
        getTr.find('.volumeInputs').prop('disabled',true);
        getTr.find('.priceInputs').prop('disabled',true);
        getTr.find('.remarks-view').prop('disabled',true);
        getTr.next('tr:visible').addClass('d-none');

      if($('.config_expence[type="checkbox"]:checked').length > 0) {
        $('.config_expence[type="checkbox"]:checked').each(function() {
          publishFlag2 = true;
          publishFlag3 = true;
          var getTr = $(this).closest('tr');
          if(getTr.find('select.config_expence').val() == '' || getTr.find('.volumeInputs').val() == '' || getTr.find('.priceInputs').val() == '') {
              publishFlag3 = false;
            } 
        })
      } else {
        publishFlag2 = false;
      }
    }

    if(publishFlag1 && publishFlag2 && publishFlag3) {
      $('#publishBtn, #draftBtn').prop('disabled', false);
    } else {
      $('#publishBtn, #draftBtn').prop('disabled', true);
    }


    if(NOVA.categories_list()[parent].items()[index].is_selected() == 'true'){
      NOVA.categories_list()[parent].items()[index].is_selected('false');
    }else{
      NOVA.categories_list()[parent].items()[index].is_selected('true');
    }
    is_selected = 'false'
    NOVA.categories_list()[parent].items().forEach(function(entry) {
      if(entry.is_selected() == 'true'){
        is_selected = 'true'
      }
    })
    NOVA.categories_list()[parent].is_selected(is_selected);
    NOVA.calculateTotalRevenue();
  }

  $(document).on('keyup change', '.config_expence[type="number"], select.config_expence', function() {
    var getTr = $(this).closest('tr');

    if(getTr.find('select.config_expence').val() == '' || getTr.find('.volumeInputs').val() == '' || getTr.find('.priceInputs').val() == '') {
      
      if(getTr.find('.config_expence[type="checkbox"]').is(':checked')) {
        publishFlag3 = false;
      } 
    } else {
      if($('.config_expence[type="checkbox"]:checked').length > 0) {
          $('.config_expence[type="checkbox"]:checked').each(function() {
            publishFlag2 = true;
            publishFlag3 = true;
            var getTr = $(this).closest('tr');
            if(getTr.find('select.config_expence').val() == '' || getTr.find('.volumeInputs').val() == '' || getTr.find('.priceInputs').val() == '') {
                publishFlag3 = false;
                return false
              } 
          })
        } else {
          publishFlag2 = false;
        }
    }
    if(publishFlag1 && publishFlag2 && publishFlag3) {
      $('#publishBtn, #draftBtn').prop('disabled', false);
    } else {
      $('#publishBtn, #draftBtn').prop('disabled', true);
    }
  })

  NOVA.calculateItemRevenue = function(parent,index,data, e){
    volume = NOVA.categories_list()[parent].items()[index].volume()
    propose_rate = NOVA.categories_list()[parent].items()[index].propose_rate()
    if(volume != '' && propose_rate != ''){
      volume = parseFloat(volume)
      propose_rate = parseFloat(propose_rate)
      revenue = (volume * propose_rate).toFixed(2);
      NOVA.categories_list()[parent].items()[index].revenue(revenue);
    }else{
      NOVA.categories_list()[parent].items()[index].expense(0);
    }
    NOVA.calculateTotalRevenue();
  }

  NOVA.calculateTotalRevenue = function(){
    total_revenue = 0
    NOVA.categories_list().forEach(function(entry){
      if(entry.is_selected() == 'true'){
        item_revenue = 0
        entry.items().forEach(function(entry1){
          if(entry1.is_selected() == 'true'){
            revenue = parseFloat(entry1.revenue());
            item_revenue += revenue
          }
        })
        item_revenue = item_revenue.toFixed(2)
        entry.total_revenue(item_revenue);
        revenue = parseFloat(entry.total_revenue())
        total_revenue += revenue;
      }
    })
    total_revenue = total_revenue.toFixed(2);
    NOVA.total_revenue(total_revenue);
    pl_status = (total_revenue - parseFloat(NOVA.total_expense())).toFixed(2);
    NOVA.pl_status(pl_status)
  }
 

  NOVA.editRevenueDate = function(){
    $('[name="contractStartDate"]').prop('disabled', false);
    $('[name="contractEndDate"]').prop('disabled', false);

    $('#contractFilterBtnEdit').addClass('d-none');
    $('#contractFilterBtn').removeClass('d-none');

    publishFlag1 = false
    $('#publishBtn').attr('disabled','disabled');
    $('#draftBtn').attr('disabled','disabled');
    $('#editBtn').attr('disabled','disabled');
    if(NOVA.revenue_exist() == true){
      $('#contractFilterBtn').removeAttr('disabled');
    }

    $('input[name="contractEndDate"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      minDate: moment($('[name="contractStartDate"]').val(), 'DD MMM YYYY', true).format('DD MMM YYYY'),
      // parentEl: "#allocateUnitsModal",
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
  }

  NOVA.saveItemRemarks = function(parent,index,data, e){
    NOVA.categories_list()[parent].items()[index].remarks_editable('false');
    tooltip_text = NOVA.categories_list()[parent].items()[index].remarks();
    NOVA.categories_list()[parent].items()[index].remarks_tooltip(tooltip_text);
  }

  $(document).on('click','.remarks-view', function() {
    var nextTr = $(this).closest('tr').next('tr')
    if(nextTr.is(':visible')) {
      nextTr.addClass('d-none');
    } else {
      nextTr.removeClass('d-none');
    }
  })


  /*NOVA.revenueCategoryGet = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/active/revenue/categories/get',
      data: {
        'lead_id':NOVA.lead_id(),
        'start_date':NOVA.start_date(),
        'end_date':NOVA.end_date()
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.categories_list([]);
      setTimeout(function(){
        $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
      },10);
      NOVA.total_revenue(d.total_revenue);
      NOVA.pl_status(d.pl_status);
      for(var j=0; j<d.data.length; j++){
        var category1 = new category();
        category1.fill(d.data[j]);
        NOVA.categories_list.push(category1);
      }
      $('.inital-configure').removeClass('d-none');
      $('#contractFilterBtn').addClass('d-none');
      $('#contractFilterBtnEdit').removeClass('d-none');
      // $('#contractFilterBtnEdit').prop('disabled', 'disabled');
      $('[name="contractStartDate"]').prop('disabled', true);
      $('[name="contractEndDate"]').prop('disabled', true);
      publishFlag1 = true
      if(publishFlag1 && publishFlag2 && publishFlag3) {
        $('#publishBtn, #draftBtn').prop('disabled', false);
      } else {
        $('#publishBtn, #draftBtn').prop('disabled', true);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };*/


  NOVA.contractView = function(){
    $("#pdfViewModal1").modal('show');
    $("#pdfViewModal1 .modal-content").addClass('h-100');
    PDFObject.embed(NOVA.contract_doc(), "#pdfWrapper1");
  }

  NOVA.contractUpload = function(){
    $("#uploadContractModal").modal('show');
  }

  NOVA.contractReUpload = function(){
    // $('#fileView').addClass('d-none');
    // NOVA.contract_file('')
    // NOVA.contract_uid('')
    // $("#uploadContract").val('');
    $("#uploadContractModal").modal('show');
  }

  NOVA.uploadContract = function(e){
    if ( /\.(pdf)$/i.test($("#uploadContract")[0].files[0].name) === false ) {
      NOVA.showErrorModal("Invalid file format. Only PDF file formats are allowed");
    } else {
        var csrftoken = NOVA.getCookie('csrftoken');
        var formdata = new FormData();
        formdata.append('contract_uid', NOVA.contract_uid());
        $.ajax({
          method: 'POST',
          url: '/api/client/contract/uid/check',
          data: formdata,
          contentType: false,
          processData: false,
          beforeSend: function(xhr, settings) {
            NOVA.showLoading();
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
        })
        .done( function (d, textStatus, jqXHR) {
          $('#draftBtn,#publishBtn').removeAttr('disabled');
          NOVA.contract_file($("#uploadContract")[0].files[0].name)
          $("#uploadContractModal").modal('hide');
          $('#fileView,#reuploadContractBtn').removeClass('d-none');
          $('#addContractAddendumBtn').addClass('d-none');
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
        })
        .always(function(){
          NOVA.hideLoading();
        })
      }
  };

  NOVA.previewUpload = function(){
    $("#pdfViewModal").modal('show');
    document1 = $("#uploadContract")[0].files[0];
    if (document1 != undefined){
      $('#pdfWrapper').addClass('d-none');
      $('#pdf-main-container').removeClass('d-none');
        // PDFObject.embed(NOVA.draft_contract_doc(), "#pdfWrapper");
    }else{
      $('#pdfWrapper').removeClass('d-none');
      $('#pdf-main-container').addClass('d-none');
      PDFObject.embed(NOVA.draft_contract_doc(), "#pdfWrapper");
    }
  }


  NOVA.getclientContractDraftDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/contract/draft/get',
      data: {
        'client_id':NOVA.client_id(),
        'contract_id':NOVA.contract_id()
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $('#publishBtn,#draftBtn').removeClass('d-none');
      $('#editBtn,#viewContractFileBtn').addClass('d-none');
      publishFlag1 = true
      publishFlag2 = true
      publishFlag3 = true
      $('#draftBtn,#publishBtn').attr('disabled', 'disabled');

      $('.config_expence[type="checkbox"]').removeAttr('disabled');    
        
      $('#contractFilterBtnEdit').removeAttr('disabled');

      $('.config_expence[type="checkbox"]').each(function() {
        var getTr = $(this).closest('tr');
        if($(this).is(':checked')) {
          getTr.find('select.config_expence').prop('disabled',false);
          getTr.find('.volumeInputs').prop('disabled',false);
          getTr.find('.priceInputs').prop('disabled',false);
          getTr.find('.remarks-view').prop('disabled',false);
        } else {
          getTr.find('select.config_expence').prop('disabled',true);
          getTr.find('.volumeInputs').prop('disabled',true);
          getTr.find('.priceInputs').prop('disabled',true);
          getTr.find('.remarks-view').prop('disabled',true);
        }
      })
      NOVA.categories_list([]);
      setTimeout(function(){
        $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
      },10);
      $('#contractStartDate').val(d.start_date);
      $('#contractEndDate').val(d.end_date);
      NOVA.draft_contract_id(d.draft_contract_id);
      NOVA.draft_contract_doc(d.draft_contract_doc);
      NOVA.contract_doc(d.contract_doc);
      NOVA.start_date(d.start_date);
      NOVA.end_date(d.end_date);
      NOVA.total_revenue(d.total_revenue);
      NOVA.revenue_exist(d.revenue_exist);
      NOVA.pl_status(d.pl_status);
      NOVA.total_expense(d.total_expense);
      NOVA.is_published(d.is_published);
      NOVA.lead_won(d.lead_won);
      
      if(NOVA.revenue_exist() == true){
        publishFlag1 = true
        for(var j=0; j<d.data.length; j++){
          var category1 = new category();
          category1.fill(d.data[j]);
          NOVA.categories_list.push(category1);
        }
      }
      if(d.draft_contract_id !=''){
        $('#draftBtn,#publishBtn').attr('disabled', false);
      }
      if(d.draft_contract_doc != ''){
        // var docUrlArr = d.draft_contract_doc.split('/');
        // var contract_file = docUrlArr[docUrlArr.length - 1];
        NOVA.contract_file(d.doc_name);
        $('#fileView,#reuploadContractBtn').removeClass('d-none');
        $('#addContractAddendumBtn').addClass('d-none');
      }else{
        $('#addContractAddendumBtn').removeClass('d-none');
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.applyRevenueDate = function(){
    NOVA.revenueCategoryGet();
    /*setTimeout(function(){
        $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
      },10);*/
  };

  NOVA.revenueCategoryGet = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/active/revenue/categories/get',
      data: {
        'client_id':NOVA.client_id(),
        'contract_id':NOVA.contract_id(),
        'draft_contract_id':NOVA.draft_contract_id(),
        'start_date':$('#contractStartDate').val(),
        'end_date':$('#contractEndDate').val()
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.categories_list([]);
      setTimeout(function(){
        $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
      },10);
      NOVA.draft_contract_id(d.draft_contract_id);
      NOVA.contract_doc(d.contract_doc);
      NOVA.total_revenue(d.total_revenue);
      NOVA.revenue_exist(d.revenue_exist);
      NOVA.pl_status(d.pl_status);
      NOVA.total_expense(d.total_expense);
      NOVA.is_published(d.is_published);
      NOVA.lead_won(d.lead_won);
      
      if(NOVA.revenue_exist() == true){
        publishFlag1 = true
        for(var j=0; j<d.data.length; j++){
          var category1 = new category();
          category1.fill(d.data[j]);
          NOVA.categories_list.push(category1);
        }
      }
      publishFlag1 = true
      if(publishFlag1 && publishFlag2 && publishFlag3) {
        $('#publishBtn, #draftBtn').prop('disabled', false);
      } else {
        $('#publishBtn, #draftBtn').prop('disabled', true);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.publishClientRevenue = function(){
    NOVA.published('true');
    flag = false
    NOVA.categories_list().forEach(function(entry){
      if(entry.is_selected() == 'true'){
        flag = true
      }
    })
    if(flag == true){
      NOVA.createClientRevenue();
    }else{
      NOVA.showErrorModal("Please select atleast one category");
    }
  };

  NOVA.draftClientRevenue = function(){
    NOVA.published('false');
    flag = false
    NOVA.categories_list().forEach(function(entry){
      if(entry.is_selected() == 'true'){
        flag = true
      }
    })
    if(flag == true){
      NOVA.createClientRevenue();
    }else{
      NOVA.showErrorModal("Please select atleast one category");
    }
  };

  NOVA.createClientRevenue = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    document1 = $("#uploadContract")[0].files[0];
    if (document1 != undefined){
      formdata.append('contract_doc',document1);
    }
    formdata.append('client_id', NOVA.client_id());
    formdata.append('contract_id', NOVA.contract_id());
    formdata.append('draft_contract_id', NOVA.draft_contract_id());
    formdata.append('contract_uid', NOVA.contract_uid());
    formdata.append('categories_list', ko.toJSON(NOVA.categories_list()));
    formdata.append('start_date', $('#contractStartDate').val());
    formdata.append('end_date', $('#contractEndDate').val());
    formdata.append('published',NOVA.published());
    formdata.append('total_revenue',NOVA.total_revenue());
    $.ajax({
      method: 'POST',
      url: '/api/client/revenue/create',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      window.location = '/contracts';
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })    
  };

  NOVA.modificationLogGet = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/client/contract/modification/log/get',
      data: {
        'client_id':NOVA.client_id(),
        'contract_id':NOVA.contract_id(),
        'doc_type':'RevenueSimulation'
      },
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.modificationLogList([]);
      for(var j=0; j<d.data.length; j++){
        var offset = moment().utcOffset();
        d.data[j].created_time = moment.utc(d.data[j].created_time, "DD MMM YYYY hh:mmA").utcOffset(offset).format("DD MMM YYYY hh:mmA");
        NOVA.modificationLogList.push(d.data[j]);
      }
      $('#modificationSideBar').css('transform', 'translate(0px,0px)');
      $('body').css('overflow', 'hidden');
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  };

  NOVA.viewExpenseConfig = function(){
    window.location = '/client/'+NOVA.client_id()+'/contract/'+NOVA.contract_id()+'/expense_config'
  }

  NOVA.sendMail = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('contract_id', NOVA.contract_id());
    formdata.append('email', NOVA.toEmail());
    $.ajax({
      method: 'POST',
      url: '/api/client/send/contract',
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
      NOVA.toEmail('');
      $('#emailInput').addClass('d-none');
       $('#pdfWrapperModal1').modal('hide');
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
    $('#navItemContracts').addClass('active');
    var docUrlArr = document.URL.split('/');
    var client_id = docUrlArr[docUrlArr.length - 4];
    var contract_id = docUrlArr[docUrlArr.length - 2];
    NOVA.client_id(client_id);
    NOVA.contract_id(contract_id);
    NOVA.getAppLogo();
    NOVA.getclientContractDetails();
    ko.applyBindings(NOVA);
  }
}
document.onreadystatechange = init;