var dataGlobale;
var scoreKPItd;

$(function() {

  Search();
  // GetKPI();
  ReadDepartment();
  $('.ui.dropdown').dropdown();
  FilterDepartment();
  FilterPosition();

});

function Search() {

  $("#search-input").on("keyup", function(){
    var value = $(this).val();

    $("#employee_table tr").each(function(index) {
      if (index !== 0) {

        $row = $(this);

        var id = $row.find("td:first").text();

        if (id.indexOf(value) !== 0) {
          $row.hide();
        }
        else {
          $row.show();
        }
      }
    });
  });
}

function ShowEmployeeProfile(value) {

  $.ajax({
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getbytitle('Employee%20Profile')/items?$select=LI_FirstName,LI_LastName,LI_PositionTitle&$orderby=LI_FirstName asc&$filter=Id eq '"+ value +"'",
    method: "GET",
    headers: {
      "accept": "application/json;odata=verbose",
      "content-type": "application/json;odata=verbose"
    },
    success: function(data) {
      data = data.d.results;

      $.each(data, function(index, value) {
                   // console.log(value.LI_FirstName + " " + value.LI_LastName)
                   $('input[id=name]').val(value.LI_FirstName + " " + value.LI_LastName);
                   $('input[id=position_title]').val(value.LI_PositionTitle);
                  // $('#department span').html(data.d.LI_Department);
                  // $('#dateHired span').html(data.d.LI_DateHired);
                });


                // input[id=name]
              },
              error: function(error) {
                console.log(JSON.stringify(error));
              }

            });
}

function ReadDepartment() {

  $.ajax({
    url:  _spPageContextInfo.webAbsoluteUrl  + "/_api/web/lists/getbytitle('Department')/items?$select=Title, ID&$OrderBy=Title",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" },
    success: function (data) {
      var datares = data.d.results;
              ////console.log(datares)
              // $('#kpi_select_dept').empty();
              // $('#kpi_select_dept').append("<option value=''>Select Department</option>");

              //var department_div = document.getElementById('');
              var departmen_list="";
              
              $('#append_dept_id').append(''); 

              $('#append_dept_id').dropdown('clear')
              $('#append_dept_id').empty();
              //$('#append_dept_id').append("<option value=''>Select Department</option>");

              for (var a = 0; a < datares.length; a++) {
                ///////console.log(datares[a].Title+" ID: "+datares[a].ID);
                $('#kpi_select_dept').append('<option value="' + datares[a].ID + '">' + datares[a].Title + '</option>'); 

                departmen_list+="<div class='item' data-value='"+datares[a].ID+"'>"+datares[a].Title+"</div>";

              }

              $('#append_dept_id').append(departmen_list); 



            },
            error: function (error) {
              alert(JSON.stringify(error));
            }
          });
}

function ReadPosition(id) {  

  $.ajax({
    url:  _spPageContextInfo.webAbsoluteUrl  + "/_api/web/lists/getbytitle('Position')/items?$select=Title,ID,DepartmentId&$OrderBy=Title&$filter=Department_x003a_ID eq '"+id+"' ",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" },
    success: function (data) {
      var datares = data.d.results;
              ////////console.log(datares)
              var position_list="";
              
              $('#append_pos_id').empty();
              $('#text_pos_id').html('Select Position');

              $('#filter_position_id').val('')
              for (var a = 0; a < datares.length; a++) {
                  // $('#kpi_select_pos').append('<option value="' + datares[a].ID + '">' + datares[a].Title + '</option>'); 
                  position_list+="<div class='item' data-value='"+datares[a].Title+"'>"+datares[a].Title+"</div>";   

                }

                $('#append_pos_id').append(position_list);
              },
              error: function (error) {
                alert(JSON.stringify(error));
              }
            });
}

function FilterDepartment() {

  $('#filter_department_id').on('change', function() {
   ReadPosition(this.value)
 })
}

function FilterPosition() {

  $('#filter_position_id').on('change', function(e) {

    var en = this.value;
    var encoded = encodeURIComponent(en);
    var linkurl = _spPageContextInfo.webAbsoluteUrl  + "/_api/Web/Lists/getbytitle('Key%20Performance%20Indicator')/items?$select=Title,ID,Position_x0020_Title/ID&$expand=Position_x0020_Title&$filter=Position_x0020_Title/Title eq '"+encoded+"' ";
    $('#listEmployee').empty();

    $.ajax({
      url: linkurl,
      method: "GET",
      headers: { "Accept": "application/json; odata=verbose" },
      success: function (data) {
        dataGlobale = data.d.results;
        $('#employee_table').empty();
        $('#KPIdata').empty();

        if(dataGlobale.length > 0) {
          $('#alert').hide();
          $('.table-scroll').show();
          $('#employee_table').append("<th class='sticky_col0' style='width:130px!important' scope='col'>Employee name</th>");

          $.each(dataGlobale, function(index, value) {

            var html = "<th scope='col'>" + value.Title + "</th>";
            $('#employee_table').append(html);

            var html2 = "<tr><td id='"+value.Id+"' class='"+value.Id+"'>" + value.Title + "</td><td>" + 
            "<input type='text' id='data_source' style='width: 90px;'>" + "</td><td>" +
            "<select id='remarks' style='width: 95px;'><option selected='true' disabled>Select</option><option value='poor'>Poor</option><option value='needs_improvement'>Needs Improvement</option><option value='meet_expectation'>Meet Expectation</option><option value='very_good'>Very Good</option><option value='excelent'>Excelent</option></select>" + 
            "</td><td>" + "<input type='text' id='score' style='width: 60px;'>" +
            "</td><td>" + "<textarea id='comments'></textarea>" +
            "</td>" + "</tr>";

            $('#KPIdata').append(html2); 
          });
          $('#employee_table').append("<th class='sticky_col1' scope='col' style='width:80px!important'>Average</th>");
          $('#employee_table').append("<th class='sticky_col2' scope='col' style='width:80px!important'>Action</th>");
        } else {
          $('#alert').show();
          $('.table-scroll').hide();
        }
      },
      error: function(error) {
        console.log(JSON.stringify(error));
      }
    });

      $('#listEmployee').empty();
      $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl  + "/_api/Web/Lists/getbytitle('Employee%20Profile')/items?$select=LI_FirstName,LI_LastName,LI_PositionTitle,LI_Department,Id&$orderby=LI_FirstName asc &$filter=LI_PositionTitle eq '"+ encoded +"' ",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
          var data = data.d.results;

          $.each(data, function(index, value) {

            var html = "<tr class='content'>"+
            "<td class='sticky_col0'>"+ value.LI_FirstName + "&nbsp;" + value.LI_LastName +"</td>"+
            "<td class='sticky_col'></td>"+
            "<td class='sticky_col2'><a href='#' onclick='ShowEmployeeProfile("+ value.Id +")'>View</a></td>"+
            "</tr>";

            $('#listEmployee').append(html);
          });
        },
        error: function(error) {
          console.log(JSON.stringify(error));
        }
    }).then( function(data) {//1
            $.each(dataGlobale, function(index, value) {
            $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl  + "/_api/Web/Lists/getbytitle('Key%20Performance%20Score%20Storage')/items?$select=Score,Employee/LI_FirstName,Employee/LI_LastName,KPI_x0020_Title/Title&$expand=KPI_x0020_Title,Employee&$filter=KPI_x0020_Title/Title eq '"+value.Title+"' ",
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
              var data = data.d.results;
               $.each(data, function(index, value) {
                console.log(value.Score)
                var scoreKPItd = "<tr class='content'>"+
                "<td class='sticky_col'>"+ value.Score +"</td>"+
                "</tr>";

                 $('#listEmployee').append(scoreKPItd);
              });
            },
            error: function(error) {
              console.log(JSON.stringify(error));
            }
          })
        });
      });
  });//end onchange
}

// function GetKPI(value) {

//  var en = value;
//  var encoded = encodeURIComponent(en);
//  $('#listEmployee').empty(); 

//  $.ajax({
//   url: _spPageContextInfo.webAbsoluteUrl  + "/_api/Web/Lists/getbytitle('Key%20Performance%20Indicator')/items?$select=Title,ID,Position_x0020_Title/ID&$expand=Position_x0020_Title&$filter=Position_x0020_Title/Title eq '"+encoded+"' ",
//   method: "GET",
//   headers: { "Accept": "application/json; odata=verbose" },
//   success: function (data) {

//     dataGlobale = data.d.results;
//     $('#employee_table').empty();
//     $('#KPIdata').empty();
//     var KPItable = jQuery('#employee_table');
//     var PerformanceReviewtable = jQuery('#KPIdata');

//     if(dataGlobale.length > 0) {
//       $('#alert').hide();
//       $(KPItable).append("<th class='sticky_col0' style='width:130px!important' scope='col'>Employee name</th>");
//       // DisplayEmployee(encoded);
//       $.each(dataGlobale, function(index, value) {

//         var html = "<th scope='col'>" + value.Title + "</th>";
//         $(KPItable).append(html);

//         var html2 = "<tr><td id='"+value.Id+"' class='"+value.Id+"'>" + value.Title + "</td><td>" + 
//         "<input type='text' id='data_source' style='width: 90px;'>" + "</td><td>" +
//         "<select id='remarks' style='width: 95px;'><option selected='true' disabled>Select</option><option value='poor'>Poor</option><option value='needs_improvement'>Needs Improvement</option><option value='meet_expectation'>Meet Expectation</option><option value='very_good'>Very Good</option><option value='excelent'>Excelent</option></select>" + 
//         "</td><td>" + "<input type='text' id='score' style='width: 60px;'>" +
//         "</td><td>" + "<textarea id='comments'></textarea>" +
//         "</td>" + "</tr>";

//         $(PerformanceReviewtable).append(html2);
//       });
//       $(KPItable).append("<th class='sticky_col1' scope='col' style='width:80px!important'>Average</th>");
//       $(KPItable).append("<th class='sticky_col2' scope='col' style='width:80px!important'>Action</th>");
//     } else {
//       $('#alert').show();
//       $('.table-scroll').hide();
//     }
//   },
//   error: function(error) {
//     console.log(JSON.stringify(error));
//   }
// }).then(function() {

//   $.ajax({
//     url: _spPageContextInfo.webAbsoluteUrl  + "/_api/Web/Lists/getbytitle('Employee%20Profile')/items?$select=LI_FirstName,LI_LastName,LI_PositionTitle,LI_Department,Id&$orderby=LI_FirstName asc &$filter=LI_PositionTitle eq '"+ encoded +"' ",
//     method: "GET",
//     headers: { "Accept": "application/json; odata=verbose" },
//     success: function (data) {

//       data = data.d.results;
//       $.each(data, function(index, value) {

//         var html = "<tr class='content'>"+
//         "<td class='sticky_col0'>"+ value.LI_FirstName + "&nbsp;" + value.LI_LastName +"</td>"+
//         "<td class='sticky_col'></td>"+
//         "<td class='sticky_col2'><a href='#' onclick='ShowEmployeeProfile("+ value.Id +")'>View</a></td>"+
//         "</tr>";

//         $('#listEmployee').append(html);

//         // DisplayKPIScore();

//       });
//     },
//     error: function(error) {
//       console.log(JSON.stringify(error));
//     }
//   });
// });
// }

function storeKPI(kpi_id) {

    // console.log($('#KPIdata').find('#'+kpi_id).text());//text  
    var kpi_titles = $('#KPIdata').find('#'+kpi_id).text();
    // var data_sources = $('#data_source').val();
    var remarkss = $('#remarks').val();
    var scores = $('#score').val();
    var commentss = $('#comments').val();


  }

  function passKPI() {
    console.log("Yes Pass")
    var commentss = $('#comments').val();
    var item = {
      "__metadata": { "type": "SP.Data.Key%20Performance%20Score%20StorageListItem" },
      // "KPI_x0020_Title": kpi_titles,
      // "Remarks": remarkss,
      // "Score": scores,
      "Comments": commentss
    };

    $.ajax({
      url:  _spPageContextInfo.webAbsoluteUrl  + "/_api/web/lists/getbytitle('Key Performance Score Storage')/items",
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
