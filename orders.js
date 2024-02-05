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
  //   document.querySelector(".loader").classList.remove("d-none");
  const token = localStorage.getItem("token");
  const config = {
    Accept: "*/*",
    Authorization: `Bearer ` + token,
  };
  var requestOptions = {
    method: "GET",
    headers: config,
    redirect: "follow",
  };

  fetch(
    "https://developmentsamak-production-7c7b.up.railway.app/admin/getAllOrders",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => (result.status === 200 ? orderList(result.result) : ""))
    .catch((error) => console.log("error", error));
}

function orderList(data) {
  const tableContainer = document.querySelector(".tb-container");
  let dataCopy = [...data].reverse();

  dataCopy.forEach((x) => {
    let markup = `<tr>
        <td class="border-bottom-0">
          <h6 class="fw-semibold mb-0">${x.orderId}</h6>
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

  const viewBtn = document.querySelectorAll(".viewBtn");
  const updateBtn = document.querySelector(".updateStatus");

  viewBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const data1 = data.result;

      localStorage.setItem("viewOrderId", e.target.dataset.id);
      window.location.href = "https://admin.sammak.store/view-order.html";
    });
  });
}
// toaster function
// function showToast(message, type) {
//   const toastContainer = document.querySelector(".toast");
//   // Create a new toast element
//   const toastBd = document.querySelector(".toast-body");
//   toastBd.innerHTML = message;
//   toastContainer.classList.add("show");
//   toastContainer.classList.add(type);
// }
// ends
// function showToastOnNextPage(message, type) {
//   const toastDetails = {
//     message: message,
//     type: type,
//   };

//   // Store the toast details in local storage
//   localStorage.setItem("nextPageToast", JSON.stringify(toastDetails));

//   // Redirect to the next page
//   window.location.href = "https://admin.sammak.store/hero-slider.html";
// }
