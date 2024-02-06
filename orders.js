window.addEventListener("load", () => {
  // validate token
  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "https://admin.sammak.store/index.html";
    }
  }, 1000);
  // ends
  // logout trigger
  const logoutBtn = document.querySelector("#logout");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
  });
  // ends

  // Call getOrder function for the first page
  getOrder(1);

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

async function getOrder(page) {
  const token = localStorage.getItem("token");
  const config = {
    Accept: "*/*",
    Authorization: `Bearer ` + token,
  };

  const requestOptions = {
    method: "GET",
    headers: config,
    redirect: "follow",
  };

  fetch(
    `https://developmentsamak-production-7c7b.up.railway.app/admin/getAllOrders?page=${page}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => (result.status === 200 ? orderList(result.result) : ""))
    .catch((error) => console.log("error", error));
}

function orderList(data) {
  const tableContainer = document.querySelector(".tb-container");

  // Clear previous data
  tableContainer.innerHTML = "";

  data.forEach((x) => {
    let markup = `<tr>
          <td class="border-bottom-0">
            <h6 class="fw-semibold mb-0">${x.orderId}</h6>
          </td>
          <td class="border-bottom-0">
          <p class="mb-0 fw-normal">${x.orderedAt}</p>
        </td>
        <td class="border-bottom-0">
          <p class="mb-0 fw-normal">${x.shippingresponse.firstName} ${x.shippingresponse.lastName}</p>
        </td>
          <td class="border-bottom-0">
            <p class="mb-0 fw-normal">SAR${x.totalPrice}</p>
          </td>
          <td class="border-bottom-0">
            <p class="mb-0 fw-normal">${x.status}</p>
          </td>
          <td class="border-bottom-0">
            <p class="mb-0 fw-normal">
             ${x.paymentMode}
            </p>
          </td>
          <td class="border-bottom-0">
            <a href="">
              <button class="btn btn-primary viewBtn" data-id=${x.orderId}>View Order</button>
            </a>
            <a href="">
              <button class="btn btn-primary updateStatus" >Edit</button>
            </a>
          </td>
        </tr>`;
    tableContainer.insertAdjacentHTML("beforeend", markup);
  });

  // Display pagination
  displayPagination();
}

function displayPagination() {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = "";

  const totalPages = 10; // Assuming there are 10 pages for example

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    const link = document.createElement("a");
    link.classList.add("page-link");
    link.href = "#";
    link.textContent = i;
    li.appendChild(link);
    paginationContainer.appendChild(li);

    // Add click event listener to each page link
    link.addEventListener("click", () => {
      getOrder(i);
    });
  }
}
