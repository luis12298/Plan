$(document).ready(function () {
  $("#search-box").on("input", function () {
    var value = $(this).val().toLowerCase();
    $("#dataTable tbody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
