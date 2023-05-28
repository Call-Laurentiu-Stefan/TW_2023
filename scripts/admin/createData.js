async function createData() {
  const data = getFormData();
  const response = await fetch("/OVi/api/bmi-data", {
    method: "POST",
    body: JSON.stringify(data),
  });
  location.reload();
  const responseData = await response.json();
  return responseData;
}

function getFormData() {
  let element = {};
  element["geo"] = document.getElementById("geo").value;
  element["time_period"] = document.getElementById("time_period").value;
  element["obs_value"] = document.getElementById("obs_value").value;
  element["bmi"] = document.getElementById("bmi").value;
  return element;
}
