(function (window) {
  
  NOVA.editmode = ko.observable(false)
  NOVA.leadName = ko.observable('');
  NOVA.client = ko.observable('');
  NOVA.subCompany = ko.observable('');
  NOVA.contactName = ko.observable('');
  NOVA.designation = ko.observable('');
  NOVA.email = ko.observable('');
  NOVA.leadValue = ko.observable('');
  NOVA.phone = ko.observable('');
  NOVA.fax = ko.observable('');
  NOVA.brand = ko.observable('');
  NOVA.industry = ko.observable('');
  NOVA.accountManager = ko.observable('');
  NOVA.isExporter = ko.observable('No');
  NOVA.isApproved = ko.observable(false);
  NOVA.isWon = ko.observable(false);
  NOVA.canChangeCompany = ko.observable(true);
  NOVA.canApprove = ko.observable('');
  NOVA.hasContract = ko.observable('');
  NOVA.approvalDate = ko.observable('');
  NOVA.approvalBy = ko.observable('');
  NOVA.startDate = ko.observable('');
  NOVA.lead_id = ko.observable('');
  NOVA.contract_uid = ko.observable('');
  NOVA.currentComp = ko.observable('');
  NOVA.lead_stage = ko.observable(''); 
  NOVA.lead_stage_name = ko.observable('');
  NOVA.lead_stage_index = ko.observable('');
  NOVA.toEmail = ko.observable('');
  NOVA.selectedIndustry = ko.observable('');
  NOVA.contract_id = ko.observable('');
  NOVA.clientsList = ko.observableArray([]);
  NOVA.managersList = ko.observableArray([]);
  NOVA.industryList = ko.observableArray([]);
  NOVA.lead_timeline_list = ko.observableArray([]);
  NOVA.closureStages = ko.observableArray([]);
  NOVA.stagesList = ko.observableArray([]);
  NOVA.subCompanyList = ko.observableArray([]);
  NOVA.address = ko.observable('');
  NOVA.billingAddress = ko.observable('')
  NOVA.pdf_viewer_button_status = ko.observable(true)

  NOVA.lead_created = ko.observable('');
  NOVA.lead_created_date = ko.observable('');
  NOVA.lead_created_by = ko.observable('');

  NOVA.has_requirements = ko.observable('');
  NOVA.has_requirements_date = ko.observable('');
  NOVA.has_requirements_by = ko.observable('');

  NOVA.contract_congifured = ko.observable('');
  NOVA.contract_congifured_date = ko.observable('');
  NOVA.contract_congifured_by = ko.observable('');

  NOVA.expense_configured = ko.observable('');
  NOVA.expense_configured_date = ko.observable('');
  NOVA.expense_configured_by = ko.observable('');

  NOVA.pl_approved = ko.observable('');
  NOVA.pl_approved_date = ko.observable('');
  NOVA.pl_approved_by = ko.observable('');

  NOVA.contract_uploaded = ko.observable('');
  NOVA.contract_uploaded_date = ko.observable('');
  NOVA.contract_uploaded_by = ko.observable('');

  NOVA.status = ko.observable('');
  NOVA.lead_won = ko.observable('');
  NOVA.lead_won_date = ko.observable('');
  NOVA.lead_won_by = ko.observable('');
  NOVA.comment_text = ko.observable('');
  NOVA.requirementGathered = ko.observable(false);
  NOVA.revenueConfigured = ko.observable(false);
  NOVA.expenseConfigured = ko.observable(false);
  NOVA.leadValue = ko.observable('');

  NOVA.total_revenue = ko.observable('');
  NOVA.total_expense = ko.observable('');
  NOVA.profit = ko.observable('');
  NOVA.leadStatus = ko.observable('');

  NOVA.isExistingCompany = ko.observable(true);
  NOVA.isExistingContact = ko.observable(true);
  NOVA.contactNamesList = ko.observableArray([]);

  NOVA.workflow_run_approval_status = ko.observable('');
  NOVA.workflow_approval_status = ko.observable('');
  NOVA.workflow_reject_status = ko.observable('');
  NOVA.contract_email = ko.observable('');


  NOVA.printPDF = function() {
    window.print()
  }
  // $('#pdfWrapperModal').modal('show');
  //   $("#uploadContractFile input").change(function(){
  //     $('#uploadContractModal').modal('hide');
  //     $('#pdfWrapperModal').modal('show');
  //   });

    $('#uploadContractModal').on('shown.bs.modal', function () {
      $('[name="refNumber"]').focus();
    })

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


    PDFObject.embed('{% static "/images/sample.pdf" %}', "#pdfWrapper");

  var leadDetailsFormValidator, leadCommentFormValidator

  NOVA.init = function(){
    $('input[name="scheduledStartDate"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      opens: "left",
      parentEl: '#scheduledStartDateParent',
      locale: {
        format: 'DD MMM YYYY'
      }
    }).on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('DD MMM YYYY')).trigger("change");
    });

    $.validator.addMethod("emailRegex", function(value, element) {
      return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test( value );
    });

    $.validator.addMethod("phoneRegex", function(value, element) {
      return /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/.test( value );
    });

    $.validator.addMethod("alpha", function(value, element) {
      if(value.charAt(0) != ' ') {
        if(this.optional(element) || /^[a-zA-Z\s]*$/i.test(value))  {
          return true;
        }
      }
    })

    jQuery.validator.addMethod("noSPace", function(value, element) {
        return this.optional(element) || /^[a-z0-9]/i.test(value);
    }, "First space is not allowed");
  }

  leadDetailsFormValidator = $("#leadDetailsForm").validate({
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
      leadName: {
        required: true,
      },
      companyName: {
        required: true,
      },
      contactName: {
        required: true,
        alpha: true
      },      
      designation: {
        required: true
      },
      emailAddress: {
        required: true,
        emailRegex: true
      },
      phoneNumber: {
        required: true,
        phoneRegex: true,
        minlength: 6
      },
      fax: {
        phoneRegex: true,
        minlength: 6
      },  
      industry: {
        required: true,
      }, 
      accountManager: {
        required: true,
      },
      address: {
        required: true,
      },
      billingAddress: {
        required: true,
      }
      
    },
    messages: {
      leadName: {
        required: "Please enter lead name"
      },
      companyName: {
        required: "Please select company name"
      },
      contactName: {
        required: "Please enter contact name",
        alpha: "Please enter a valid contact name"
      },      
      designation: {
        required: "Please enter designation"
      },
      emailAddress: {
        required: "Please enter email address",
        emailRegex: "Please enter a valid email"
      },
      phoneNumber: {
        required: "Please enter contact number",
        minlength: "Please enter a minimum of 6 digits",
        phoneRegex: "Please enter a valid contact number"  
      },
      fax: {
        minlength: "Please enter a minimum of 6 digits",
        phoneRegex: "Please enter a valid fax number"  
      },
      industry: {
        required: "Please select an industry"
      },
      address: {
        required: "Please enter address",
      },
      billingAddress: {
        required: "Please enter billing address",
      }
      // accountManager: {
      //   required: "Please select an account manager"
      // },
    },
    submitHandler: function() {
      if(NOVA.editmode()){
        NOVA.editLead();
      }
    }
  });

  leadCommentFormValidator = $("#leadCommentForm").validate({
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
      comment: {
        required: true,
        noSPace: true
      },
    },
    messages: {
      comment: {
        required: "Please enter comments",
      }
    },
    submitHandler: function() {
      NOVA.createComment();
    }
  });

  NOVA.editLeadDetails = function() {
    NOVA.editmode(true);
    if(NOVA.canChangeCompany() == false) {
      $('#company').attr("disabled", true);
    }
  }

  NOVA.setLeadStage = function(data) {
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('stage_id', data.stage_id);
    $.ajax({
      method: 'POST',
      url: '/api/lead/update/lead/stage',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.getStages();
      NOVA.getLeadDetails();
      NOVA.getLeadTimeline();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.getAccountManagers = function(){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/lead/get/account/managers/industries',
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
        NOVA.industryList([]);
        for(var i=0; i<d.industries.length; i++){
          NOVA.industryList.push(d.industries[i]);
        }
        NOVA.getLeadDetails();
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }

  NOVA.getLeadDetails = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/details/get',
      data: {'lead_id': NOVA.lead_id()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.leadName(d.lead_name);
      NOVA.client(d.client);
      NOVA.getSubCompanies(d.sub_company)
      for (let i = 0; i < d.contact_names_list.length; i++) {
        NOVA.contactNamesList.push(d.contact_names_list[i]);
      }
      $('#contactName').val(d.contact_name).trigger('change');
      NOVA.designation(d.designation);
      NOVA.email(d.email);
      NOVA.leadValue(d.lead_value);
      NOVA.phone(d.phone);
      NOVA.fax(d.fax);
      NOVA.brand(d.brand);
      NOVA.industry(d.industry);
      NOVA.accountManager(d.account_manager);
      NOVA.status(d.status);
      NOVA.address(d.address);
      NOVA.billingAddress(d.billing);
      NOVA.hasContract(d.has_contract);
      NOVA.canApprove(d.can_approve);
      NOVA.approvalDate(d.approval_date);
      NOVA.approvalBy(d.approval_by);
      NOVA.startDate(d.start_date);
      NOVA.currentComp(d.client);
      NOVA.lead_stage(d.lead_stage);
      NOVA.lead_stage_name(d.lead_stage_name);
      NOVA.lead_stage_index(d.lead_stage_index);
      NOVA.total_revenue(d.total_revenue);
      NOVA.total_expense(d.total_expense);
      NOVA.requirementGathered(d.requirement_gathered);
      NOVA.revenueConfigured(d.revenue_configured);
      NOVA.expenseConfigured(d.expense_configured);
      NOVA.leadValue(d.lead_value);
      NOVA.canChangeCompany(d.can_change_company);
      if(d.total_revenue != 'N/A' && d.total_expense != 'N/A'){
        var profit = (parseFloat(d.total_revenue) - parseFloat(d.total_expense)).toFixed(2);
        NOVA.profit(profit);
      // } else if (d.total_revenue != 'N/A' && d.total_expense == 'N/A') {
      //   NOVA.profit(d.total_revenue);
      // } else if (d.total_revenue == 'N/A' && d.total_expense != 'N/A') {
      //   var profit = d.total_expense * -1;
      //   NOVA.profit(profit);
      } else {
        NOVA.profit('N/A');
      }
      if(d.status == 'Approved') {
        NOVA.isApproved(true);
      }

      NOVA.workflow_run_approval_status(d.workflow_run_approval_status);
      NOVA.workflow_approval_status(d.workflow_approval_status);
      NOVA.workflow_reject_status(d.workflow_reject_status);

      if(d.lead_stage_name == 'Won') {
        NOVA.isWon(true);
      }
      if(d.lead_stage_name == 'Won'){
        $('#editButton').attr("disabled", true);
        $('#contractUpload').attr("disabled", true);
      }
      if(d.can_change_company == false){
        $('#company').attr("disabled", true);
      }
      $('#industry').val(d.industry).trigger('change');
      $('#account-manager').val(d.account_manager).trigger('change');
      $('#company').val(d.client).trigger('change');
      if (d.is_exporter) {
        NOVA.isExporter('Yes');
      } else {
        NOVA.isExporter('No');
      }

      if(d.lead_stage_name == 'Won') {
        $("#stageStatus").addClass( 'won' );
        $("#stageStatus").removeClass( 'lost' )
        $("#stageStatus").removeClass( 'moving-list' )
        $("#stageStatus li:last-of-type").addClass('active').prevAll().removeClass('active').addClass('completed');
      } else if(d.lead_stage_name == 'Lost') {
        $("#stageStatus").addClass( 'lost' )
        $("#stageStatus").removeClass( 'won' );
        $("#stageStatus").removeClass( 'moving-list' )
        $("#stageStatus li:last-of-type").addClass('active').prevAll().removeClass('active').addClass('completed');
      } else if(d.lead_stage_name == 'Waiting List') {
        $("#stageStatus").addClass( 'moving-list' );
        $("#stageStatus").removeClass( 'won' );
        $("#stageStatus").removeClass( 'lost' )
        $("#stageStatus li:last-of-type").addClass('active').prevAll().removeClass('active').addClass('completed');
      } else {
        $("#stageStatus").removeClass( 'moving-list' );
        $("#stageStatus").removeClass( 'won' );
        $("#stageStatus").removeClass( 'lost' )
        // $("#stageStatus li:last-of-type").addClass('active').prevAll().removeClass('active').addClass('completed');
      }

      $(".select2").select2({
        tags: true
      }).on('change', function (e, v) {
        if ($(e.currentTarget).find('option:checked').val() == '') {
          $(e.currentTarget).parent().find('span.error').show()
        } else {
          $(e.currentTarget).parent().find('span.error').hide()
        }
      });
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always( function(){
      NOVA.hideLoading();
    })
  }

  NOVA.editLead = function(){    
      var csrftoken = NOVA.getCookie('csrftoken');
      var formdata = new FormData();

      formdata.append('lead_id', NOVA.lead_id());
      formdata.append('lead_name', NOVA.leadName());
      formdata.append('company_name', NOVA.client());
      formdata.append('sub_company_name', NOVA.subCompany());
      formdata.append('contact_name', NOVA.contactName());
      formdata.append('phone_number', NOVA.phone());
      formdata.append('designation', NOVA.designation());
      formdata.append('fax', NOVA.fax());
      formdata.append('email', NOVA.email());
      formdata.append('industry', NOVA.industry());
      formdata.append('account_manager', NOVA.accountManager());
      formdata.append('brand_representation', NOVA.brand());
      formdata.append('is_export_company', NOVA.isExporter());
      formdata.append('scheduled_start_date', NOVA.startDate());
      formdata.append('address', NOVA.address());
      formdata.append('billing', NOVA.billingAddress());

      $.ajax({
        method: 'POST',
        url: '/api/lead/edit/lead',
        data: formdata,
        contentType: false,
        processData: false,
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        NOVA.editmode(false);
        NOVA.showToast(d);
        NOVA.getLeadDetails();
        NOVA.getLeadTimeline();
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }

    NOVA.rejectLead = function() {
      NOVA.leadStatus('Rejected');
      NOVA.statusChange(); 
    }

    NOVA.approveLead = function(){
      NOVA.leadStatus('Approved');
      NOVA.statusChange(); 
    }

    NOVA.runLeadAppoval = function(){
      NOVA.leadStatus('Run Approval');
     NOVA.statusChange(); 
    }

    NOVA.statusChange = function() {
      var csrftoken = NOVA.getCookie('csrftoken');
      var formdata = new FormData();

      formdata.append('lead_id', NOVA.lead_id());
      formdata.append('status', NOVA.leadStatus());
      if(NOVA.leadStatus()=='Run Approval'){
        url = '/api/lead/pl/run/approval'
      }
      else if(NOVA.leadStatus()=='Approved'){
        url = 'api/lead/pl/approve'
      }
      else{
        url = 'api/lead/pl/reject'
      }
      $.ajax({
        method: 'POST',
        url: url,
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
        NOVA.getLeadDetails();
        NOVA.getLeadMilestones();
        NOVA.getLeadTimeline();
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
      })
      .always(function(){
        NOVA.hideLoading();
      })
    }


    NOVA.uploadContract = function(){

    if ( /\.(pdf)$/i.test($("#uploadContract")[0].files[0].name) === false ) {
      NOVA.showErrorModal("Invalid file format. Only PDF file formats are allowed");
    } else {
      var csrftoken = NOVA.getCookie('csrftoken');
      var formdata = new FormData();
      if($("#uploadContract")[0].files[0] != undefined){
        document1 = $("#uploadContract")[0].files[0];
        formdata.append('contract_doc',document1);
        formdata.append('contract_uid', NOVA.contract_uid());
        formdata.append('lead_id', NOVA.lead_id());
        $.ajax({
          method: 'POST',
          url: '/api/lead/upload/contract',
          data: formdata,
          contentType: false,
          processData: false,
          beforeSend: function(xhr, settings) {
            NOVA.showLoading();
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
        })
        .done( function (d, textStatus, jqXHR) {
          NOVA.pdf_viewer_button_status(false);
          $('#uploadContractModal').modal('hide');
          $('#pdfWrapperModal').modal('show');
          NOVA.contract_id(d.event_id);
          PDFObject.embed(d.document_path, "#pdfWrapper");
          NOVA.getLeadTimeline();
          NOVA.getLeadDetails();
          // NOVA.showErrorModal(d);
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          // NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
          $('#uploadContractModal').modal('hide');
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
          NOVA.hideLoading();
          $("#uploadContract").val("");
          NOVA.getLeadTimeline();
        })
        .always(function(){
          NOVA.hideLoading();
        })
      }
    }
    
  };


  NOVA.getLeadMilestones = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/milestones/get',
      data: {'lead_id': NOVA.lead_id()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.lead_created(d.lead_created);
      NOVA.lead_created_date(d.lead_created_date);
      NOVA.lead_created_by(d.lead_created_by);

      NOVA.has_requirements(d.has_requirements);
      NOVA.has_requirements_date(d.has_requirements_date);
      NOVA.has_requirements_by(d.has_requirements_by);

      NOVA.contract_congifured(d.contract_congifured);
      NOVA.contract_congifured_date(d.contract_congifured_date);
      NOVA.contract_congifured_by(d.contract_congifured_by);

      NOVA.expense_configured(d.expense_configured);
      NOVA.expense_configured_date(d.expense_configured_date);
      NOVA.expense_configured_by(d.expense_configured_by);

      NOVA.pl_approved(d.pl_approved);
      NOVA.pl_approved_date(d.pl_approved_date);
      NOVA.pl_approved_by(d.pl_approved_by);

      NOVA.contract_uploaded(d.contract_uploaded);
      NOVA.contract_uploaded_date(d.contract_uploaded_date);
      NOVA.contract_uploaded_by(d.contract_uploaded_by);

      NOVA.lead_won(d.lead_won);
      NOVA.lead_won_date(d.lead_won_date);
      NOVA.lead_won_by(d.lead_won_by);
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always( function(){
      NOVA.hideLoading();
    })
  }

  NOVA.getLeadTimeline = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    $.ajax({
      method: 'GET',
      url: '/api/lead/get/lead/timeline',
      data: {'lead_id': NOVA.lead_id()},
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      NOVA.lead_timeline_list([]);
      for(var i=0; i<d.length; i++){
        var offset = moment().utcOffset();
        d[i].created_time = moment.utc(d[i].created_time, "DD MMM YYYY hh:mmA").utcOffset(offset).format("DD MMM YYYY hh:mmA");
        NOVA.lead_timeline_list.push(d[i]);
      }
      if (NOVA.lead_timeline_list().length > 0){
        $('.card-data-empty').addClass('d-none')
      }else{
        $('.card-data-empty').removeClass('d-none')
      }
      NOVA.getLeadMilestones();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jqXHR.responseText);
    })
    .always( function(){
      NOVA.hideLoading();
      // GBL.hideLoading();
    })
  }

  NOVA.addFavorite = function(data) {
    var csrftoken = NOVA.getCookie('csrftoken');
      var formdata = new FormData();

      formdata.append('timeline_id', data.timeline_id);

      $.ajax({
        method: 'POST',
        url: '/api/lead/add/favorite',
        data: formdata,
        contentType: false,
        processData: false,
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      })
      .done( function (d, textStatus, jqXHR) {
        NOVA.getLeadTimeline();
        // NOVA.showErrorModal(d);
      })
      .fail( function (jqXHR, textStatus, errorThrown) {
        NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
      })
      .always(function(){
        NOVA.hideLoading();
      })
  }

  NOVA.createComment = function(){
    var comment_text = ' Added a comment '+NOVA.comment_text(); 
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('comment_text', comment_text);
    $.ajax({
      method: 'POST',
      url: '/api/lead/create/comment',
      data: formdata,
      contentType: false,
      processData: false,
      beforeSend: function(xhr, settings) {
        NOVA.showLoading();
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    })
    .done( function (d, textStatus, jqXHR) {
      $("#commentInput").val("");
      NOVA.getLeadTimeline();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
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
      NOVA.closureStages([]);
      NOVA.stagesList([]);
      for(var i=0; i<d.closure_stages.length; i++){
        NOVA.closureStages.push(d.closure_stages[i]);
      }
      for(var i=0; i<d.stages_list.length; i++){
        NOVA.stagesList.push(d.stages_list[i]);
      }
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.sendMail = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('contract_id', NOVA.contract_id());
    formdata.append('email', NOVA.toEmail());
    $.ajax({
      method: 'POST',
      url: '/api/lead/send/contract',
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
       $('#pdfWrapperModal').modal('hide');
      NOVA.getLeadTimeline();
    })
    .fail( function (jqXHR, textStatus, errorThrown) {
      NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText));
    })
    .always(function(){
      NOVA.hideLoading();
    })
  }

  NOVA.checkCompany = function(){
    if (NOVA.clientsList().includes(NOVA.client()[0])){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/lead/get/company/contacts',
        data: {'company_name': NOVA.client(), 'sub_company': NOVA.subCompany()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
        .done( function (d, textStatus, jqXHR) {
          if (NOVA.editmode()){
            NOVA.contactNamesList([]);
            NOVA.isExistingCompany(true);
            NOVA.isExistingContact(true);
            for (let i = 0; i < d.contact_names_list.length; i++) {
              NOVA.contactNamesList.push(d.contact_names_list[i]);
            }
            $('#contactName').val(d.contact_name).trigger('change');
            NOVA.getSubCompanies(d.sub_company_name);
            NOVA.designation(d.designation);
            NOVA.email(d.email);
            NOVA.phone(d.phone);
            NOVA.fax(d.fax);
            $('#industry').val(d.industry).trigger('change');
            $('#account-manager').val(d.account_manager).trigger('change');
            NOVA.address(d.address);
            NOVA.billingAddress(d.billing);
        }
          
        })
        .fail( function (jqXHR, textStatus, errorThrown) {
          NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
        })
        .always(function(){
          NOVA.hideLoading();
        })
      } else {
          NOVA.isExistingCompany(false);
          $('#contactName').val('').trigger('change');
          NOVA.getSubCompanies('');
          $('#subCompanyName').val('').trigger('change');
          $('#industry').val('').trigger('change');
          $('#account-manager').val('').trigger('change');
          NOVA.contactNamesList([]);
          NOVA.contactName('');
          NOVA.designation('');
          NOVA.email('');
          NOVA.phone('');
          NOVA.fax('');
          NOVA.address('')
          NOVA.billingAddress('')
      }
       
    }
  
  NOVA.checkContactName = function(){
    if (NOVA.editmode() && NOVA.contactNamesList().includes(NOVA.contactName()[0])){
      var csrftoken = NOVA.getCookie('csrftoken');
      $.ajax({
        method: 'GET',
        url: '/api/lead/get/contact/detail',
        data: {'company_name': NOVA.client(), 'contact_name': NOVA.contactName()},
        beforeSend: function(xhr, settings) {
          NOVA.showLoading();
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      })
        .done( function (d, textStatus, jqXHR) {
          NOVA.isExistingContact(true);
          NOVA.designation(d.designation);
          NOVA.email(d.email);
          NOVA.phone(d.phone);
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
      NOVA.email('');
      NOVA.phone('');
      NOVA.fax('');
    }
      
  }

    NOVA.getSubCompanies = function(data){
      if (NOVA.client() != ''){
        var csrftoken = NOVA.getCookie('csrftoken');
        $.ajax({
          method: 'GET',
          url: '/api/lead/get/sub/companies',
          data: {'company_name': NOVA.client().toString()},
          beforeSend: function(xhr, settings) {
            NOVA.showLoading();
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
          }
        })
          .done( function (d, textStatus, jqXHR) {
            NOVA.subCompanyList([]);
            for (let i = 0; i < d.length; i++) {
              NOVA.subCompanyList.push(d[i]);
            }
            if(data==null){
              data= ''
            } else {
              data= data.toString()
            }
            $('#subCompanyName').val(data).trigger('change');
            
            
          })
          .fail( function (jqXHR, textStatus, errorThrown) {
            NOVA.showErrorModal(jQuery.parseJSON(jqXHR.responseText))
          })
          .always(function(){
            NOVA.hideLoading();
          })

      }
    }

  NOVA.showPDF = function(data) {
    NOVA.pdf_viewer_button_status(true);
    $('#uploadContractModal').modal('hide');
    $('#pdfWrapperModal').modal('show');
    NOVA.contract_id(data.event_id);
    PDFObject.embed(data.redirect_url, "#pdfWrapper");
  }

  NOVA.requirementGathering = function(){
    window.location.href = '/lead/'+NOVA.lead_id()+'/requirement-gathering/product-profile';
  }

  NOVA.configureRevenue = function(){
    window.location.href = '/leads/'+NOVA.lead_id()+'/revenue-config';
  }

  NOVA.configureExpense = function(){
    window.location.href = '/leads/'+NOVA.lead_id()+'/expense-config';
  }

  NOVA.toEmailFieldview = function(){
    $('#emailInput').removeClass('d-none');
  }

  $('#navItemLeads').addClass('active');

  NOVA.downloadPL = function(){
    location.href = ' /api/lead/revenue/export?lead_id='+ NOVA.lead_id();  
  }

  NOVA.sendContractMail = function(){
    var csrftoken = NOVA.getCookie('csrftoken');
    var formdata = new FormData();
    formdata.append('lead_id', NOVA.lead_id());
    formdata.append('email', NOVA.contract_email());
    $.ajax({
      method: 'POST',
      url: '/api/lead/revenue/email',
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
      $('#emailPL').modal('hide');
      NOVA.contract_email('');
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
    NOVA.init();
    ko.applyBindings(NOVA);
    var docUrlArr = document.URL.split('/');
    var lead_id = docUrlArr[docUrlArr.length - 1];
    NOVA.lead_id(lead_id);
    NOVA.getStages();
    NOVA.getAppLogo();
    NOVA.getAccountManagers();
    NOVA.getLeadMilestones();
    NOVA.getLeadTimeline();
  }
}
document.onreadystatechange = init;