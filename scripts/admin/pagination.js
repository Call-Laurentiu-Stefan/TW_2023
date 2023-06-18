function incrementPage() {
  if (Number(page) < maxPage) {
    page = Number(page) + 1;
    console.log(page);
    let geoFilter = document.getElementById("geoFilter").value;
    let timeFilter = document.getElementById("timeFilter").value;
    let bmiFilter = document.getElementById("bmiFilter").value;    

    window.location.href = `${window.location.href.split("?")[0]}?page=${page}&geoFilter=${geoFilter}&timeFilter=${timeFilter}&bmiFilter=${bmiFilter}`;
  } else {
    page = maxPage;
  }
}

function decrementPage() {
  if (Number(page) > 1) {
    page = Number(page) - 1;
    let geoFilter = document.getElementById("geoFilter").value;
    let timeFilter = document.getElementById("timeFilter").value;
    let bmiFilter = document.getElementById("bmiFilter").value;    

    window.location.href = `${window.location.href.split("?")[0]}?page=${page}&geoFilter=${geoFilter}&timeFilter=${timeFilter}&bmiFilter=${bmiFilter}`;
  } else {
    page = 1;
  }
}

function firstPage(){
  page = 1;
  let geoFilter = document.getElementById("geoFilter").value;
  let timeFilter = document.getElementById("timeFilter").value;
  let bmiFilter = document.getElementById("bmiFilter").value;    

  window.location.href = `${window.location.href.split("?")[0]}?page=${page}&geoFilter=${geoFilter}&timeFilter=${timeFilter}&bmiFilter=${bmiFilter}`;
}

function lastPage(){
  page = maxPage;
  let geoFilter = document.getElementById("geoFilter").value;
  let timeFilter = document.getElementById("timeFilter").value;
  let bmiFilter = document.getElementById("bmiFilter").value;    

  window.location.href = `${window.location.href.split("?")[0]}?page=${page}&geoFilter=${geoFilter}&timeFilter=${timeFilter}&bmiFilter=${bmiFilter}`;
}