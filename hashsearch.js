function searchhashlist(index) {
    let results_select = document.getElementById("resultsperpage");
    let results_per_page = results_select[results_select.selectedIndex].value;
    let search_string = document.getElementById("search_input").value;
    let resourcetype_select = document.getElementById("resourcetype");
    let resource_type = resourcetype_select[resourcetype_select.selectedIndex].value;
    let headerArrows = document.getElementById("headerarrows")
    reqJson = {
        "search_term": search_string,
        "number_of_results": parseInt(results_per_page),
        "resource_type": resource_type,
        "page_number": parseInt(index)
    }
    if (reqJson) {
        $.ajax({
            type: "POST",
            url: "/search",
            contentType: "application/json",
            data: JSON.stringify(reqJson),
            dataType: "json",
            error: function() {
                ajaxlert("Error occurred during search.");
            },
            success: function(res) {
                let mainTableBody = document.getElementById("main_table_body");
                while (mainTableBody.firstChild) {
                    mainTableBody.firstChild.remove()
                    headerArrows.innerHTML = ""
                }

                let results = res["results"]

                if (results == null) {
                    return
                }

                for (let i = 0; i < (results.length); i++) {
                    let hash = results[i].hash
                    let type = results[i].type
                    let string = results[i].string
                    if (hash != null && type !== null && string != null) {
                        let tableRow = document.createElement('tr');
                        let listItem1 = document.createElement('td');
                        listItem1.innerHTML = hash
                        tableRow.appendChild(listItem1)

                        let listItem2 = document.createElement('td');
                        listItem2.innerHTML = type
                        tableRow.appendChild(listItem2)

                        let listItem3 = document.createElement('td');
                        listItem3.innerHTML = string
                        tableRow.appendChild(listItem3)

                        mainTableBody.appendChild(tableRow)

                        if (i == results.length - 1) {
                            let results_per_page_num = res.number_of_results
                            let results_per_page_index_num = res.page_number
                            if (!isNaN(results_per_page_num) && !isNaN(results_per_page_index_num)) {
                                let tableRow = document.createElement('tr');
                                let listItem1 = document.createElement('td');
                                if (results_per_page_index_num == 0 && i + 1 == results_per_page_num) {
                                    listItem1.innerHTML = "<a href=\"javascript:void(0)\" onclick=\"searchhashlist(" + (results_per_page_index_num + 1).toString() + ")\">>></a>";
                                    headerArrows.innerHTML = "<a href=\"javascript:void(0)\" onclick=\"searchhashlist(" + (results_per_page_index_num + 1).toString() + ")\">>></a>";
                                } else if (results_per_page_index_num == 0) {} else if (i + 1 < results_per_page_num) {
                                    listItem1.innerHTML = "<a href=\"javascript:void(0)\" onclick=\"searchhashlist(" + (results_per_page_index_num - 1).toString() + ")\"><<</a>";
                                    headerArrows.innerHTML = "<a href=\"javascript:void(0)\" onclick=\"searchhashlist(" + (results_per_page_index_num - 1).toString() + ")\"><<</a>";
                                } else if (results_per_page_index_num >= 0) {
                                    listItem1.innerHTML = "<a href=\"javascript:void(0)\" onclick=\"searchhashlist(" + (results_per_page_index_num - 1).toString() + ")\"><<</a>&nbsp;&nbsp;";
                                    listItem1.innerHTML += "<a href=\"javascript:void(0)\" onclick=\"searchhashlist(" + (results_per_page_index_num + 1).toString() + ")\">>></a>";
                                    headerArrows.innerHTML = "<a href=\"javascript:void(0)\" onclick=\"searchhashlist(" + (results_per_page_index_num - 1).toString() + ")\"><<</a>&nbsp;&nbsp;";
                                    headerArrows.innerHTML += "<a href=\"javascript:void(0)\" onclick=\"searchhashlist(" + (results_per_page_index_num + 1).toString() + ")\">>></a>";
                                }
                                listItem1.align = "center";
                                listItem1.colSpan = 3;
                                tableRow.appendChild(listItem1);
                                mainTableBody.appendChild(tableRow);
                            }
                        }
                    }
                }
            }
        });
    } else {
        let mainTableBody = document.getElementById("main_table_body");
        while (mainTableBody.firstChild) {
            mainTableBody.firstChild.remove()
            headerArrows.innerHTML = ""
        }
    }
};