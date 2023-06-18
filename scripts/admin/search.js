function search() {
    let geoFilter = document.getElementById("geoFilter").value;
    let timeFilter = document.getElementById("timeFilter").value;
    let bmiFilter = document.getElementById("bmiFilter").value;    

    getData(geoFilter, timeFilter, bmiFilter);
}