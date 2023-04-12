$(document).ready(function () {
  $("#fileInput").change(function (evt) {
    var selectedSheet;
    var file = evt.target.files[0];
    if (file) {
      var reader = new FileReader();
      $("#sheet-select").prop("disabled", false);
      reader.onload = function (e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: "binary" });

        $("#sheet-select").empty();
        workbook.SheetNames.forEach(function (sheetName) {
          var option =
            "<option value='" + sheetName + "'>" + sheetName + "</option>";
          $("#sheet-select").append(option);
        });

        var firstSheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[firstSheetName];
        var rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if ($.fn.DataTable.isDataTable("#dataTable")) {
          $("#dataTable").DataTable().clear().destroy();
        }
        $("#dataTable thead").empty();
        $("#dataTable tbody").empty();
        // Remove empty columns
        var nonEmptyColumns = [];
        for (var j = 0; j < rows[0].length; j++) {
          var columnValues = rows.map(function (row) {
            return row[j];
          });
          if (
            columnValues.some(function (value) {
              return value != null && value !== "";
            })
          ) {
            nonEmptyColumns.push(j);
          }
        }

        var headerRow = "<tr>";
        for (var j = 0; j < nonEmptyColumns.length; j++) {
          var headerIndex = nonEmptyColumns[j];
          headerRow += "<th>" + rows[0][headerIndex] + "</th>";
        }
        headerRow += "</tr>";
        $("#dataTable thead").append(headerRow);
        for (var i = 1; i < rows.length; i++) {
          var dataRow = "<tr>";
          for (var j = 0; j < nonEmptyColumns.length; j++) {
            var dataIndex = nonEmptyColumns[j];
            dataRow += "<td>" + rows[i][dataIndex] + "</td>";
          }
          dataRow += "</tr>";
          $("#dataTable tbody").append(dataRow);
        }
        $("#dataTable").DataTable({
          searching: true,
          lengthMenu: [25, 35, 50, 100, 500],

          language: {
            search: "Dato a Buscar:",
            lengthMenu: "Mostrar _MENU_ registros por página",
            info: "Mostrando _START_ a _END_ de un total de _TOTAL_ registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
          },
        });
        $("#sheet-select").empty(); // Limpiar opciones anteriores
        for (var i = 0; i < workbook.SheetNames.length; i++) {
          var sheetName = workbook.SheetNames[i];
          $("#sheet-select").append(
            "<option value='" + sheetName + "'>" + sheetName + "</option>"
          );
        }
        $("#sheet-select").change(function () {
          var sheetName = $(this).val();
          selectedSheet = workbook.Sheets[sheetName];
          updateTableWithData(selectedSheet);
        });
        function updateTableWithData(sheet) {
          var rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Eliminar contenido anterior de la tabla
          $("#dataTable thead").empty();
          $("#dataTable tbody").empty();

          // Crear encabezados de columna
          var headerRow = "<tr>";
          for (var j = 0; j < rows[0].length; j++) {
            headerRow += "<th>" + rows[0][j] + "</th>";
          }
          headerRow += "</tr>";
          $("#dataTable thead").append(headerRow);

          // Agregar filas de datos
          for (var i = 1; i < rows.length; i++) {
            var dataRow = "<tr>";
            for (var j = 0; j < rows[i].length; j++) {
              dataRow += "<td>" + rows[i][j] + "</td>";
            }
            dataRow += "</tr>";
            $("#dataTable tbody").append(dataRow);
          }
          // Update table with new data
          if ($.fn.DataTable.isDataTable("#dataTable")) {
            $("#dataTable").DataTable().clear().destroy(); // destruir la tabla DataTable
          }
          $("#dataTable thead").empty();
          $("#dataTable tbody").empty();

          nonEmptyColumns = [];
          for (var j = 0; j < rows[0].length; j++) {
            var columnValues = rows.map(function (row) {
              return row[j];
            });
            if (
              columnValues.some(function (value) {
                return value != null && value !== "";
              })
            ) {
              nonEmptyColumns.push(j);
            }
          }

          var headerRow = "<tr>";
          for (var j = 0; j < nonEmptyColumns.length; j++) {
            var headerIndex = nonEmptyColumns[j];
            headerRow += "<th>" + rows[0][headerIndex] + "</th>";
          }
          headerRow += "</tr>";
          $("#dataTable thead").append(headerRow);
          for (var i = 1; i < rows.length; i++) {
            var dataRow = "<tr>";
            for (var j = 0; j < nonEmptyColumns.length; j++) {
              var dataIndex = nonEmptyColumns[j];
              dataRow += "<td>" + rows[i][dataIndex] + "</td>";
            }
            dataRow += "</tr>";
            $("#dataTable tbody").append(dataRow);
          }
          // Inicializar tabla con DataTables
          $("#dataTable").DataTable({
            searching: true,
            lengthMenu: [25, 35, 50, 100, 500, 1000, 2000],

            language: {
              lengthMenu: "Mostrar _MENU_ registros por página",
              info: "Mostrando _START_ a _END_ de un total de _TOTAL_ registros",
              infoFiltered: "(filtrado de un total de _MAX_ registros)",
            },
          });
        }
      };
      reader.readAsBinaryString(file);
    }
  });
});
