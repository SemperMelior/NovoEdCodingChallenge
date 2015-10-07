(function(window, document, undefined) {

    var searchText = document.getElementsByTagName('input')[1];

    // DOM buttons
    var searchButton = document.getElementById('search');

    window.addEventListener('load', function(event) {

        /* Code from Matt West, Source: codepen.io/matt-west/pen/KjEHg */
        var fileInput = document.getElementById('csv-file');
        fileInput.addEventListener('change', function(e) {
            var file = fileInput.files[0];
            var data;

            Papa.parse(file, {
                complete: function(results) {
                    createStudentDataStructures(results.data);
                }
            });
        });

        searchButton.addEventListener('click', function(event) {
            // submit textbox data to relevant search function
            searchForOtherUsers(searchText.value);
            event.preventDefault();
        });

        /* Doesn't seem to work for "enter" keypress event */  // TODO
    });

})(this, this.document);
