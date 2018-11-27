var KPIglobal;
var KPSSglobal;
var EPglobal;

var idDeparment;

var metrics_score_temp = 0;
var kpi_score_total_temp = 0;


$(function () {

  Search();
  ReadDepartment();
  $('.ui.dropdown').dropdown();
  FilterDepartment();

  $('#filter_position_id').on('change', function (e) {
    // getKPInoScore(this.value);
    getKPI(this.value)
  });

});


function Search() {

  $("#search-input").on("keyup", function () {
    var value = $(this).val();

    $("#employee_table tr").each(function (index) {
      if (index !== 0) {

        $row = $(this);

        var id = $row.find("td:first").text();

        if (id.indexOf(value) !== 0) {
          $row.hide();
        } else {
          $row.show();
        }
      }
    });
  });
}


function ShowEmployeeProfile(value) {
  $("#KPIdata").empty();
  $.ajax({
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getbytitle('Employee%20Profile')/items?$select=LI_FirstName,LI_LastName,LI_PositionTitle&$orderby=LI_FirstName asc&$filter=Id eq '" + value + "'",
    method: "GET",
    headers: {
      "Accept": "application/json; odata=verbose"
    },
    success: function (data) {
      data = data.d.results;

      $.each(data, function (index, value) {
        // console.log(value.LI_FirstName + " " + value.LI_LastName)
        $('input[id=name]').val(value.LI_FirstName + " " + value.LI_LastName);
        $('input[id=position_title]').val(value.LI_PositionTitle);
        // $('#department span').html(data.d.LI_Department);
        // $('#dateHired span').html(data.d.LI_DateHired);

        // console.log("Inside")
      });

      $.each(KPIglobal, function (index, value) {

        var en = value.Title;
        var encoded = encodeURIComponent(en);

        $.ajax({
          url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getbytitle('Key%20Performance%20Indicator')/items?$select=Title,ID,Position_x0020_Title/ID&$expand=Position_x0020_Title&$orderby=Title asc&$filter=Position_x0020_Title/Title eq '" + encoded + "' ",
          method: "GET",
          headers: {
            "Accept": "application/json; odata=verbose"
          },
          success: function (data) {

            $.each(data, function (index, value1) {

              var html = "<tr><td id='" + value.Id + "' class='" + value.Id + "'>" + value.Title + "</td><td>" +
                "<input type='text' id='data_source' style='width: 90px;'>" + "</td><td>" +
                "<select id='remarks' style='width: 95px;'><option selected='true' disabled>Select</option><option value='poor'>Poor</option><option value='needs_improvement'>Needs Improvement</option><option value='meet_expectation'>Meet Expectation</option><option value='very_good'>Very Good</option><option value='excelent'>Excelent</option></select>" +
                "</td><td>" + "<input type='text' id='score' style='width: 60px;'>" +
                "</td><td>" + "<textarea id='comments'></textarea>" +
                "</td>" + "</tr>";

              $("#KPIdata").append(html);
            });
          },
          error: function (error) {
            console.log(JSON.stringify(error));
          }
        });
      });
    },

    error: function (error) {
      console.log(JSON.stringify(error));
    }
  });
}


function ReadDepartment() {

  $.ajax({
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Department')/items?$select=Title, ID&$OrderBy=Title",
    method: "GET",
    headers: {
      "Accept": "application/json; odata=verbose"
    },
    success: function (data) {

      var datares = data.d.results;
      var departmen_list = "";

      $('#append_dept_id').append('');

      $('#append_dept_id').dropdown('clear')
      $('#append_dept_id').empty();

      for (var a = 0; a < datares.length; a++) {

        $('#kpi_select_dept').append('<option value="' + datares[a].ID + '">' + datares[a].Title + '</option>');
        departmen_list += "<div class='item' data-value='" + datares[a].Title + "'>" + datares[a].Title + "</div>";
      }

      $('#append_dept_id').append(departmen_list);

    },
    error: function (error) {
      alert(JSON.stringify(error));
    }
  });
}


function FilterDepartment() {

  $('#filter_department_id').on('change', function (e) {
    // ReadPosition(this.value) _x003a_ID

    idDeparment = this.value;

    $.ajax({
      url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Position')/items?$select=Title,ID,DepartmentId&$OrderBy=Title&$filter=Department_x003a_Department eq '" + idDeparment + "' ",
      method: "GET",
      headers: {
        "Accept": "application/json; odata=verbose"
      },
      success: function (data) {

        var datares = data.d.results;
        var position_list = "";

        $('#append_pos_id').empty();
        $('#text_pos_id').html('Select Position');

        $('#filter_position_id').val('')
        for (var a = 0; a < datares.length; a++) {

          position_list += "<div class='item' data-value='" + datares[a].Title + "'>" + datares[a].Title + "</div>";
        }

        $('#append_pos_id').append(position_list);

      },
      error: function (error) {
        alert(JSON.stringify(error));
      }
    });
  })
}


function getKPI(value) {

  var en = value;
  var pos_title = encodeURIComponent(en);

  var tr_element = "";

  $('#employee_table').empty();
  $('#listEmployee').empty();

  // $('#alert').show();




  $.ajax({
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Key Performance Indicator')/items?$select=Title, ID, Department/Title, Position_x0020_Title/Title, Position_x0020_Title/ID, Key_x0020_Result_x0020_Area/Title, Key_x0020_Result_x0020_Area/ID, Minimum_x0020_Score, Maximum_x0020_Score&$expand=Department&$expand=Position_x0020_Title&$expand=Key_x0020_Result_x0020_Area&$OrderBy=Key_x0020_Result_x0020_Area/Title&$filter=Position_x0020_Title/Title eq '" + pos_title + "' &$OrderBy=Title desc",
    method: "GET",
    headers: {
      "Accept": "application/json; odata=verbose"
    },
    success: function (data) {
      $('#alert').hide();


      KPIglobal = data.d.results;

      DisplayMetricsInfo();


      if (KPIglobal.length > 0) {


        $.ajax({
          url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getbytitle('Key%20Performance%20Score%20Storage')/items?$select=ID,Score,KPI_x0020_Title/Title,Employee/LI_EmployeeID,KPI_x0020_Title/Id&$expand=KPI_x0020_Title,Employee&$filter= (Month eq 'October' ) and (Year eq '2018' ) and (Position_x0020_Title/Title eq '" + pos_title + "') &$OrderBy=KPI_x0020_Title/Title desc",
          method: "GET",
          headers: {
            "Accept": "application/json; odata=verbose"
          },
          success: function (data) {


            KPSSglobal = data.d.results;


            $.ajax({
              url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getbytitle('Employee%20Profile')/items?$select=LI_FirstName,LI_LastName,LI_PositionTitle,LI_Department,LI_Separated,Id,LI_EmployeeID&$orderby=LI_FirstName asc &$filter= (LI_PositionTitle eq '" + pos_title + "' ) and (LI_Department eq '" + idDeparment + "') and (LI_Separated eq 'Active')",
              method: "GET",
              headers: {
                "Accept": "application/json; odata=verbose"
              },
              success: function (data) {


                EPglobal = data.d.results;


                if (KPSSglobal.length > 0) {

                  if (EPglobal.length > 0) {

                    $.each(EPglobal, function (index, value3) {

                      var td_score = 0;
                      var td_element = "";
                      var th_element = "";

                      $.each(KPSSglobal, function (index, value2) {

                        $.each(KPIglobal, function (index, value) {

                          var KPI_Id = value.Id;


                          if (KPI_Id == value2.KPI_x0020_Title.Id && value3.LI_EmployeeID == value2.Employee.LI_EmployeeID) {
                            td_element += "<td id='" + value2.ID + "'>" + value2.Score + "</td>"
                            th_element += "<th scope='col' id='" + value.Id + "'>" + value.Title + "</th>";
                            td_score += value2.Score;

                          }

                        }); //foreach dataGlobale

                        $('.table-scroll').show();
                        $('#employee_table').html("<th class='sticky_col0' style='width:130px!important' scope='col'>Employee name</th>" + th_element + "<th class='sticky_col1' scope='col' style='width:80px!important'>Total</th><th class='sticky_col2' scope='col' style='width:80px!important'>Action</th>")

                      }) //foreach data

                      tr_element += "<tr><td>" + value3.LI_FirstName + " " + value3.LI_LastName + "</td>" + td_element + "</tr>"

                      $('#listEmployee').append("<tr><td class='sticky_col0'>" + value3.LI_FirstName + " " + value3.LI_LastName + "</td>" + td_element + "<td class='sticky_col1' scope='col' style='width:80px!important'>" + td_score + "</td>" + "<td class='sticky_col2'><a href='#' onclick='ShowEmployeeProfile(" + value3.Id + ")'>View</a></td>" + "</tr>")

                    }); //foreach data2  

                  } else {
                    console.log("EPglobal F-State");
                    $('.table-scroll').hide();
                    $('#alert').html("<p><strong>Oops! </strong>There is no available <b>Employee</b> in this position.</p>")
                    $('#alert').show();
                  }



                } else {

                  var td_element = "";
                  var th_element = "";


                  for (let i = 0; i < KPIglobal.length; i++) {
                    th_element += "<th scope='col' id='" + KPIglobal[i].ID + "'>" + KPIglobal[i].Title + "</th>";
                    td_element += "<td>0</td>";

                  }


                  if (EPglobal.length > 0) {
                    console.log("EPglobal T-State");

                    for (let i = 0; i < EPglobal.length; i++) {
                      $('#listEmployee').append("<tr><td class='sticky_col0'>" + EPglobal[i].LI_FirstName + " " + EPglobal[i].LI_LastName + "</td>" + td_element + "<td class='sticky_col1' scope='col' style='width:80px!important'>" + td_score + "</td>" + "<td class='sticky_col2'><a href='#' onclick='ShowEmployeeProfile(" + EPglobal[i].Id + ")'>View</a></td>" + "</tr>")
                    }

                    $('.table-scroll').show();
                    $('#employee_table').html("<th class='sticky_col0' style='width:130px!important' scope='col'>Employee name</th>" + th_element + "<th class='sticky_col1' scope='col' style='width:80px!important'>Average</th><th class='sticky_col2' scope='col' style='width:80px!important'>Action</th>");

                  } else {
                    console.log("EPglobal F-State");
                    $('.table-scroll').hide();
                    $('#alert').html("<p><strong>Oops! </strong>There is no available <b>Employee</b> in this position.</p>")
                    $('#alert').show();
                  }

                }

              }, //3rd ajax success
              error: function (error) {
                console.log(JSON.stringify(error));
              }
            }); //3rd ajax


          }, //2nd ajax success
          error: function (error) {
            console.log(JSON.stringify(error));
          }
        }); //2nd ajax 


      } else {
        console.log("KPIglobal F-State")
        $('.table-scroll').hide();
        $('#alert').html("<p><strong>Oops! </strong>There is no available <b>KPI</b> in this position.</p>")
        $('#alert').show();
      }



    }, //1st ajax success
    error: function (error) {
      console.log(JSON.stringify(error));
    }
  }); //1st ajax

} //function


function storeKPI(kpi_id) {

  // console.log($('#KPIdata').find('#'+kpi_id).text());//text  
  var kpi_titles = $('#KPIdata').find('#' + kpi_id).text();
  // var data_sources = $('#data_source').val();
  var remarkss = $('#remarks').val();
  var scores = $('#score').val();
  var commentss = $('#comments').val();
}


function passKPI() {
  console.log("Yes Pass")
  var commentss = $('#comments').val();
  var item = {
    "__metadata": {
      "type": "SP.Data.Key%20Performance%20Score%20StorageListItem"
    },
    // "KPI_x0020_Title": kpi_titles,
    // "Remarks": remarkss,
    // "Score": scores,
    "Comments": commentss
  };

  $.ajax({
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Key Performance Score Storage')/items",
    type: "POST",
    contentType: "application/json;odata=verbose",
    data: JSON.stringify(item),
    headers: {
      "Accept": "application/json;odata=verbose",
      "X-RequestDigest": $("#__REQUESTDIGEST").val()
    },
    success: function (data) {
      console.log("success");
    },
    error: function (error) {
      alert(JSON.stringify(error));
    }
  });
}


function DisplayMetricsInfo() {

  var kpi_select_dept_val = $("#filter_department_id").val();
  var kpi_select_pos_val = $("#filter_position_id").val();
  var datares_kpi = KPIglobal;
  console.log(datares_kpi)

  var datares_metrics;
  metrics_score_temp = 0;
  kpi_score_total_temp = 0;
  //////////console.log("-------------DROPDOWN START-------------")

  /*  $('#kpi_total_progress_id').progress({
                 percent: kpi_score_total_temp
             });*/
  $.ajax({
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Metrics')/items?$select=Title, ID, Key_x0020_Performance_x0020_Indi/Title,Key_x0020_Performance_x0020_Indi/ID, Score, Remarks&$expand=Key_x0020_Performance_x0020_Indi&$OrderBy=Score",
    method: "GET",
    headers: {
      "Accept": "application/json; odata=verbose"
    },
    success: function (data) {
      datares_metrics = data.d.results;
      //////////console.log("----------datares_metrics----------");
      //////////console.log(datares_metrics);

      $("#table_kpi").find("tr:gt(0)").remove();
      var count_total_kpi = 0;
      // var metric_score = 0;
      kpi_score_total_temp = 0;
      for (var a = 0; a < datares_kpi.length; a++) {
        var kra_title = datares_kpi[a].Key_x0020_Result_x0020_Area.Title;
        var kra_id = datares_kpi[a].Key_x0020_Result_x0020_Area.ID;
        var kpi_title = datares_kpi[a].Title;
        var kpi_id = datares_kpi[a].ID;


        count_total_kpi++;
        ////////////console.log(datares[a].Title+" ID: "+datares[a].ID);   

        var metrics_append = "";

        var metric_score = 0;

        for (var b = 0; b < datares_metrics.length; b++) {
          ////////////console.log("datares_kpi["+a+"].ID: "+datares_kpi[a].ID);
          if (datares_kpi[a].ID == datares_metrics[b].Key_x0020_Performance_x0020_Indi.ID) {

            var metric_id = datares_metrics[b].ID;
            var metric_title = datares_metrics[b].Title;
            metric_score = datares_metrics[b].Score;
            var metric_remarks = datares_metrics[b].Remarks;

            metrics_append += "<tr><td>" + metric_title + "</td><td>" + metric_score + "%</td><td>" + metric_remarks + "</td></tr>";

          }



        }

        kpi_score_total_temp += metric_score;


        $('#table_kpi').append("<tr><td id='krakey-" + kra_id + "' data-id='key" + kra_id + "'> <div class='' id='kra_title_" + kra_id + "' style='' >" + kra_title + "</div></td><td><div class='' id='count_kra-" + kra_id + "'  style=''  >" + kpi_title + "</div></td><td>Sharepoint/Requestor/TQM</td><td style='padding: 0px;'>" +
          "<table class='ui very basic collapsing striped celled table' style='text-align: center; '> <thead> <tr><th width='75%' style='background: #FFFF00!important;' id='th_kpi_title_" + kpi_id + "' >" + kpi_title + "</th> <th style='background: #FFFF00!important;'>Score(%)</th> <th width='25%' style='background: #FFFF00!important;'>Remarks</th></tr></thead><tbody id='tbody-" + kpi_id + "'>" +
          metrics_append +
          " </tbody></table>" +
          "</td></tr>");


      } //end for loop


      $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Key Result Area')/items?$select=Title, ID,  Position_x0020_Title/Title, Position_x0020_Title/ID&$expand=Position_x0020_Title&$OrderBy=Title&$filter=Position_x0020_Title/ID eq '" + kpi_select_pos_val + "' ",

        method: "GET",
        headers: {
          "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
          var datares = data.d.results;
          //////////////console.log(datares)
          // $('#kpi_select_pos').dropdown('clear')

          for (var a = 0; a < datares.length; a++) {
            //////////////console.log(datares[a].Title+" ID: "+datares[a].ID);
            //$('#kpi_select_kra').append('<option value="' + datares[a].ID + '">' + datares[a].Title + '</option>');
            //krakey-12
            if (!$("#krakey-" + datares[a].ID + " ").length) {
              //////////console.log("Not Exist")
              $('#table_kpi').append("<tr><td><div class='ui large label'>" + datares[a].Title + " <i class='delete icon' onClick='delete_kra_onClick(" + datares[a].ID + ")'></i></div></td><td></td><td></td><td></td></tr>");
            }
            //$('#table_kpi').append("<tr><td>KRA Here</td><td></td><td></td><td></td></tr>");

          }
        },
        error: function (error) {
          alert(JSON.stringify(error));
        }
      });


      if (kpi_score_total_temp == 0) {
        $('#kpi_total_progress_id').removeClass('success');
      }

      $('#kpi_total_progress_id').progress({
        percent: kpi_score_total_temp
      });

      // ////////console.log("kpi_score_total_temp: "+kpi_score_total_temp);

      $('#kpi_count_label_id').html("Total KPI: " + count_total_kpi);

      //alert(kpi_score_total_temp);


      mergerKey();


    },
    error: function (error) {
      alert(JSON.stringify(error));
    }
  });
}

//merge cells in key column
function mergerKey() {

  // prevents the same attribute is used more than once Ip
  var idA = [];

  // finds all cells id column Key
  $('td[data-id^="key"]').each(function () {

    var id = $(this).attr('data-id');

    // prevents the same attribute is used more than once IIp
    if ($.inArray(id, idA) == -1) {
      idA.push(id);

      // finds all cells that have the same data-id attribute
      var $td = $('td[data-id="' + id + '"]');

      //counts the number of cells with the same data-id
      var count = $td.length;
      if (count > 1) {

        //If there is more than one
        //then merging                                
        $td.not(":eq(0)").remove();
        $td.attr('rowspan', count);
      }
    }
  })
}