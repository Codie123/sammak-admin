const itemsPerPage = 8;
let currentPage = 1;
let filterStatus = "All";

document.getElementById("next-btn").addEventListener("click", handlenextpage);
document
  .getElementById("previous-btn")
  .addEventListener("click", handlePreviouspage);

window.addEventListener("load", () => {
  const logoutBtn = document.querySelector("#logout");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
  });
  // ends
  localStorage.removeItem("orderId");
  // Call getOrder function for the first page
  getOrder();

  // call toaster
  const toastDetailsJSON = localStorage.getItem("nextPageToast");

  if (toastDetailsJSON) {
    const toastDetails = JSON.parse(toastDetailsJSON);

    // Show the toast using the showToast function
    showToast(toastDetails.message, toastDetails.type);

    // Clear the stored toast details from local storage
    localStorage.removeItem("nextPageToast");
  }
  // ends
});

async function getOrder() {
  const token = localStorage.getItem("token");
  const config = {
    Accept: "*/*",
    Authorization: `Bearer ${token}`,
  };
  const requestOptions = {
    method: "GET",
    headers: config,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://developmentsamak-production-7c7b.up.railway.app/admin/getAllOrders",
      requestOptions
    );
    const result = await response.json();
    if (result.status === 200) {
      orderList(result.result);
      localStorage.setItem("orderlist", JSON.stringify(result.result));
    }
  } catch (error) {
    console.log("error", error);
  }
}

function orderList(data) {
  const filteredData = filterOrders(data);
  const tableContainer = document.querySelector(".tb-container");
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Clear previous data
  tableContainer.innerHTML = "";

  paginatedData.forEach((order) => {
    // Code for generating order markup...
    tableContainer.insertAdjacentHTML("beforeend", markup);
  });

  updatePagination(filteredData.length);
}

function filterOrders(data) {
  return data.filter(
    (x) => filterStatus === "All" || x.status === filterStatus
  );
}

function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const previousButton = document.getElementById("previous-btn");
  const nextButton = document.getElementById("next-btn");

  if (currentPage === 1) {
    previousButton.setAttribute("disabled", true);
  } else {
    previousButton.removeAttribute("disabled");
  }

  if (currentPage >= totalPages) {
    nextButton.setAttribute("disabled", true);
  } else {
    nextButton.removeAttribute("disabled");
  }
}

function handlenextpage() {
  currentPage++;
  getOrder();
}

function handlePreviouspage() {
  if (currentPage > 1) {
    currentPage--;
    getOrder();
  }
}

document.getElementById("orderStatus").addEventListener("change", function () {
  filterStatus = this.value;
  currentPage = 1;
  getOrder();
});
