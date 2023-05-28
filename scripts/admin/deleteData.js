async function deleteData(event) {
    debugger;
    var elementId = event.currentTarget.getAttribute('name');
    const response = await fetch(`/OVi/api/bmi-data/${elementId}`, {
      method: "DELETE",
    });
    location.reload();
    const responseData = await response.json();
    return responseData;
  }