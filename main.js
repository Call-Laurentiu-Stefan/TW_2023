// Define the variable to store the data globally
let chartDataGlobal = null;

// Create a lookup for full country names
const countryLookup = {
  'AT': 'Austria',
  'BE': 'Belgium',
  'BG': 'Bulgaria',
  'CY': 'Cyprus',
  'CZ': 'Czech Republic',
  'DE': 'Germany',
  'DK': 'Denmark',
  'EA18': 'Euro Area - 18 countries',
  'EA19': 'Euro Area - 19 countries',
  'EE': 'Estonia',
  'EL': 'Greece',
  'ES': 'Spain',
  'EU27_2007': 'European Union - 27 countries(2007-2013)',
  'EU27_2020': 'European Union - 27 countries(from 2020)',
  'EU28': 'European Union - 28 countries(2013-2020)',
  'FI': 'Finland',
  'FR': 'France',
  'GR': 'Greece',
  'HR': 'Croatia',
  'HU': 'Hungary',
  'IE': 'Ireland',
  'IS': 'Iceland',
  'IT': 'Italy',
  'LT': 'Lithuania',
  'LU': 'Luxembourg',
  'LV': 'Latvia',
  'MK': 'North Macedonia',
  'MT': 'Malta',
  'NL': 'Netherlands',
  'NO': 'Norway',
  'PL': 'Poland',
  'PT': 'Portugal',
  'RO': 'Romania',
  'RS': 'Serbia',
  'SE': 'Sweden',
  'SI': 'Slovenia',
  'SK': 'Slovakia',
  'TR': 'Turkey',
  'UK': 'United Kingdom'
};

// Create chart outside of event listener
const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// This function will populate the select elements with the distinct years
function fetchDistinctYears() {
  var query = `{ distinctYears }`;

  const stringifiedQuery = JSON.stringify({query: query});

  fetch('http://localhost:4000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: stringifiedQuery
  })
  .then(r => r.json())
  .then(data => {
    const distinctYears = data.data.distinctYears;
    const ani1Select = document.getElementById('ani1');
    const ani2Select = document.getElementById('ani2');

    distinctYears.forEach(year => {
      ani1Select.options[ani1Select.options.length] = new Option(year, year);
      ani2Select.options[ani2Select.options.length] = new Option(year, year);
    });
  });
}


function fetchDistinctCountries() {
  var query = `{ distinctCountries }`;

  const stringifiedQuery = JSON.stringify({query: query});

  fetch('http://localhost:4000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: stringifiedQuery
  })
  .then(r => r.json())
  .then(data => {
    const distinctCountries = data.data.distinctCountries;
    const countryDropdown = document.getElementById('countryDropdown');

    distinctCountries.forEach(countryCode => {
      const countryName = countryLookup[countryCode] || countryCode;

      const listItem = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = countryCode;
      checkbox.value = countryCode;
      listItem.appendChild(checkbox);
      listItem.appendChild(document.createTextNode(` ${countryName}`));
      countryDropdown.appendChild(listItem);
    });
  });
}


// Call both functions on window load
window.onload = function() {
  console.log('loaded fetches');
  fetchDistinctYears();
  fetchDistinctCountries();
};

function populateDropdown(countries) {
  const dropdown = document.querySelector('.dropdown');

  countries.forEach((country) => {
    const listItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = country;
    checkbox.value = country;

    const label = document.createElement('label');
    label.htmlFor = country;
    label.appendChild(document.createTextNode(countryLookup[country]));

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    dropdown.appendChild(listItem);
  });
}

document.getElementById('graphqlForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const selectedCountries = Array.from(document.querySelectorAll('.dropdown input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
  var bmi = document.querySelector('input[name="group1"]:checked').value;
  var year1Value = document.getElementById('ani1').value;
  var year2Value = document.getElementById('ani2').value;
  console.log('countries:', selectedCountries);
  console.log('bmi:', bmi);
  console.log('an1:', year1Value);
  console.log('an2:', year2Value);
  
  if(year1Value && !year2Value){
    var query = `{ 
      data(bmi: "${bmi}", time_period: "${year1Value}", geo: ${JSON.stringify(selectedCountries)}) { 
          id, dataflow, last_update, freq, unit, bmi, geo, time_period, obs_value, obs_flag 
      } 
    }`;

    const stringifiedQuery = JSON.stringify({query: query});
    console.log('the query:', stringifiedQuery);

    fetch('http://localhost:4000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: stringifiedQuery
    })
    .then(r => r.json())
    .then(data => {
      console.log('Response:', data);
      const chartData = data.data.data.map(item => item.obs_value || 0);
      const chartLabels = data.data.data.map(item => countryLookup[item.geo] || item.geo);  // Use full country name if available

      console.log('chartData:', chartData);

      chartDataGlobal = data.data.data;

      const maxValue = Math.max(...chartData.map(Number)) + 10;

      // Update the chart's data and options
      chart.data.labels = chartLabels;
      chart.data.datasets = [{
        label: 'Obs Value',
        data: chartData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }];

      chart.options.scales = {
        x: {
          barPercentage: 0.2 // Reduce bar width to 50% of available space
        },
        y: {
          min: 0,
          max: maxValue // Set max y-value to a value higher than the highest data value
        }
      };

      chart.update();
    });
  }
  else if(year1Value && year2Value) {
    // Make separate queries for both years
    console.log('in second query');
    var query = `{ 
      dataYear1: data(bmi: "${bmi}", time_period: "${year1Value}", geo: ${JSON.stringify(selectedCountries)}) { 
          id, dataflow, last_update, freq, unit, bmi, geo, time_period, obs_value, obs_flag 
      },
      dataYear2: data(bmi: "${bmi}", time_period: "${year2Value}", geo: ${JSON.stringify(selectedCountries)}) { 
          id, dataflow, last_update, freq, unit, bmi, geo, time_period, obs_value, obs_flag 
      } 
    }`;

    const stringifiedQuery = JSON.stringify({query: query});

    fetch('http://localhost:4000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: stringifiedQuery
    })
    .then(r => r.json())
    .then(data => {
      console.log('Response:', data);

      // Prepare a map of obs_values for the second year
      const dataYear2Map = data.data.dataYear2.reduce((map, item) => {
        map[item.geo] = item.obs_value;
        return map;
      }, {});

      // Calculate differences for the first year data using the second year data
      const chartData = data.data.dataYear1.map(item => item.obs_value - dataYear2Map[item.geo]);
      const chartLabels = data.data.dataYear1.map(item => countryLookup[item.geo] || item.geo);  // Use full country name if available

      chartDataGlobal = data.data.data;
      const maxValue = Math.max(...chartData.map(Number)) + 3;
      const minValue = Math.min(...chartData.map(Number)) - 3;
      console.log('minValue:', minValue)

      // Update the chart's data and options
      chart.data.labels = chartLabels;
      chart.data.datasets = [{
        label: 'Obs Value',
        data: chartData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }];

      chart.options.scales = {
        x: {
          barPercentage: 0.2 // Reduce bar width to 50% of available space
        },
        y: {
          min: minValue,
          max: maxValue // Set max y-value to a value higher than the highest data value
        }
      };

      chart.update();
    });
  }
});





function downloadCSV() {
  const csvContent = 'data:text/csv;charset=utf-8,' + chartDataGlobal.map(e => Object.values(e)).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'chart_data.csv');
  link.click();
}


function downloadJSON() {
  const jsonContent = 'data:application/json;charset=utf-8,' + JSON.stringify(chartDataGlobal);
  const encodedUri = encodeURI(jsonContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'chart_data.json');
  link.click();
}


function downloadXML() {
  let xmlContent = '<root>\n';
  chartDataGlobal.forEach(item => {
    xmlContent += '\t<item>\n';
    Object.entries(item).forEach(([key, value]) => {
      xmlContent += `\t\t<${key}>${value}</${key}>\n`;
    });
    xmlContent += '\t</item>\n';
  });
  xmlContent += '</root>';
  const encodedUri = encodeURI('data:text/xml;charset=utf-8,' + xmlContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'chart_data.xml');
  link.click();
}


function downloadImage(imageType) {
  const canvas = document.getElementById('myChart');
  const link = document.createElement('a');
  link.setAttribute('href', canvas.toDataURL(`image/${imageType}`));
  link.setAttribute('download', `chart.${imageType}`);
  link.click();
}




function exportChart(format) {
  switch (format) {
    case 'CSV':
      downloadCSV();
      break;
    case 'JSON':
      downloadJSON();
      break;
    case 'XML':
      downloadXML();
      break;
    case 'PNG':
      downloadImage('png');
      break;
    case 'JPEG':
      downloadImage('jpeg');
      break;
    default:
      console.log('No format selected');
      break;
  }
}

document.getElementById('exportButton').addEventListener('click', function() {
  console.log('in export');
  const selectedFormat = document.getElementById('exportOptions').value;
  exportChart(selectedFormat);
});

