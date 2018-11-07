var dataGlobale;
var data;

$(function() {

    Search();
    // GetKPI();
    ReadDepartment();
    $('.ui.dropdown').dropdown();
    FilterDepartment();
    FilterPosition();

});

function Search() {

    $("#search-input").on("keyup", function() {
        var value = $(this).val();

        $("#employee_table tr").each(function(index) {
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
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data) {
            data = data.d.results;

            $.each(data, function(index, value) {
                // console.log(value.LI_FirstName + " " + value.LI_LastName)
                $('input[id=name]').val(value.LI_FirstName + " " + value.LI_LastName);
                $('input[id=position_title]').val(value.LI_PositionTitle);
                // $('#department span').html(data.d.LI_Department);
                // $('#dateHired span').html(data.d.LI_DateHired);
            });

            $.each(dataGlobale, function(index, value) {

                var en = value.Title;
                var encoded = encodeURIComponent(en);

                $.ajax({
                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getbytitle('Key%20Performance%20Indicator')/items?$select=Title,ID,Position_x0020_Title/ID&$expand=Position_x0020_Title&$orderby=Title asc&$filter=Position_x0020_Title/Title eq '" + encoded + "' ",
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function(data) {

                        $.each(data, function(index, value1) {

                            var html = "<tr><td id='" + value.Id + "' class='" + value.Id + "'>" + value.Title + "</td><td>" +
                                "<input type='text' id='data_source' style='width: 90px;'>" + "</td><td>" +
                                "<select id='remarks' style='width: 95px;'><option selected='true' disabled>Select</option><option value='poor'>Poor</option><option value='needs_improvement'>Needs Improvement</option><option value='meet_expectation'>Meet Expectation</option><option value='very_good'>Very Good</option><option value='excelent'>Excelent</option></select>" +
                                "</td><td>" + "<input type='text' id='score' style='width: 60px;'>" +
                                "</td><td>" + "<textarea id='comments'></textarea>" +
                                "</td>" + "</tr>";

                            $("#KPIdata").append(html);
                        });
                    },
                    error: function(error) {
                        console.log(JSON.stringify(error));
                    }
                });
            });
        },

        error: function(error) {
            console.log(JSON.stringify(error));
        }
    });
}

function ReadDepartment() {

    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Department')/items?$select=Title, ID&$OrderBy=Title",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data) {
            var datares = data.d.results;
            ////console.log(datares)
            // $('#kpi_select_dept').empty();
            // $('#kpi_select_dept').append("<option value=''>Select Department</option>");

            //var department_div = document.getElementById('');
            var departmen_list = "";

            $('#append_dept_id').append('');

            $('#append_dept_id').dropdown('clear')
            $('#append_dept_id').empty();
            //$('#append_dept_id').append("<option value=''>Select Department</option>");

            for (var a = 0; a < datares.length; a++) {
                ///////console.log(datares[a].Title+" ID: "+datares[a].ID);
                $('#kpi_select_dept').append('<option value="' + datares[a].ID + '">' + datares[a].Title + '</option>');

                departmen_list += "<div class='item' data-value='" + datares[a].ID + "'>" + datares[a].Title + "</div>";

            }

            $('#append_dept_id').append(departmen_list);



        },
        error: function(error) {
            alert(JSON.stringify(error));
        }
    });
}

function ReadPosition(id) {

    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Position')/items?$select=Title,ID,DepartmentId&$OrderBy=Title&$filter=Department_x003a_ID eq '" + id + "' ",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data) {
            var datares = data.d.results;
            ////////console.log(datares)
            var position_list = "";

            $('#append_pos_id').empty();
            $('#text_pos_id').html('Select Position');

            $('#filter_position_id').val('')
            for (var a = 0; a < datares.length; a++) {
                // $('#kpi_select_pos').append('<option value="' + datares[a].ID + '">' + datares[a].Title + '</option>'); 
                position_list += "<div class='item' data-value='" + datares[a].Title + "'>" + datares[a].Title + "</div>";

            }

            $('#append_pos_id').append(position_list);
        },
        error: function(error) {
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
        getKPI(this.value)
        // ShowEmployeeProfile(this.value)
    })
}

function getKPI(value) {

    var en = value;
    var encoded = encodeURIComponent(en);
    var tr_element = "";

    $('#listEmployee').empty();

    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getbytitle('Key%20Performance%20Indicator')/items?$select=Title,ID,Position_x0020_Title/ID&$expand=Position_x0020_Title&$filter=Position_x0020_Title/Title eq '" + encoded + "' ",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function(data) {

            dataGlobale = data.d.results;
            $('#employee_table').empty();
            $('#KPIdata').empty();

            if (dataGlobale.length > 0) {

                $('#alert').hide();
                $('.table-scroll').show();

            } else {

                $('#alert').show();
                $('.table-scroll').hide();
            }

            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getbytitle('Key%20Performance%20Score%20Storage')/items?$select=ID,Score,KPI_x0020_Title/Title,Employee/LI_EmployeeID,KPI_x0020_Title/Id&$expand=KPI_x0020_Title,Employee&$filter= (Month eq 'October' ) and (Year eq '2018' ) and (Position_x0020_Title/Title eq '" + encoded + "') &$OrderBy=KPI_x0020_Title/Title desc",
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: function(data) {
                    var data = data.d.results;

                    $.ajax({
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getbytitle('Employee%20Profile')/items?$select=LI_FirstName,LI_LastName,LI_PositionTitle,LI_Department,Id,LI_EmployeeID&$orderby=LI_FirstName asc &$filter= (LI_PositionTitle eq '" + encoded + "' ) and (LI_Department eq 'IT') ",
                        method: "GET",
                        headers: { "Accept": "application/json; odata=verbose" },
                        success: function(data2) {
                            var data2 = data2.d.results;
                            $.each(data2, function(index, value3) {

                                var td_element = "";
                                var th_element = "";

                                $.each(data, function(index, value2) {

                                    $.each(dataGlobale, function(index, value) {

                                        var KPI_Id = value.Id;
                                        var kpi_title = value.Title;

                                        if (KPI_Id == value2.KPI_x0020_Title.Id && value3.LI_EmployeeID == value2.Employee.LI_EmployeeID) {
                                            td_element += "<td id='" + value2.ID + "'>" + value2.Score + "</td>"
                                            th_element += "<th scope='col' id='" + value.Id + "'>" + value.Title + "</th>";
                                        }

                                    }); //foreach dataGlobale


                                    $('#employee_table').html("<th class='sticky_col0' style='width:130px!important' scope='col'>Employee name</th>" + th_element + "<th class='sticky_col1' scope='col' style='width:80px!important'>Average</th><th class='sticky_col2' scope='col' style='width:80px!important'>Action</th>")

                                }) //foreach data

                                tr_element += "<tr><td>" + value3.LI_FirstName + " " + value3.LI_LastName + "</td>" + td_element + "</tr>"

                                $('#listEmployee').append("<tr><td class='sticky_col0'>" + value3.LI_FirstName + " " + value3.LI_LastName + "</td>" + td_element + "<td class='sticky_col1' scope='col' style='width:80px!important'>" + "average" + "</td>" + "<td class='sticky_col2'><a href='#' onclick='ShowEmployeeProfile(" + value3.Id + ")'>View</a></td>" + "</tr>")

                            }); //foreach data2                           
                        }, //3rd ajax success
                        error: function(error) {
                            console.log(JSON.stringify(error));
                        }
                    }); //3rd ajax
                }, //2nd ajax success
                error: function(error) {
                    console.log(JSON.stringify(error));
                }
            }); //2nd ajax 
        }, //1st ajax success
        error: function(error) {
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
        "__metadata": { "type": "SP.Data.Key%20Performance%20Score%20StorageListItem" },
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
        success: function(data) {
            console.log("success");
        },
        error: function(error) {
            alert(JSON.stringify(error));
        }
    });
}
