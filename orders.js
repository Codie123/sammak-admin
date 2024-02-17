const itemsPerPage = 8;
let currentPage = 1;
let filterStatus = "All";

document.getElementById("next-btn").addEventListener("click", handlenextpage);
document
  .getElementById("previous-btn")
  .addEventListener("click", handlePreviouspage);

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
    Authorization: `Bearer ` + token,
  };

  const requestOptions = {
    method: "GET",
    headers: config,
    redirect: "follow",
  };

  fetch(
    `https://developmentsamak-production-7c7b.up.railway.app/admin/getAllOrders`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.status === 200) {
        orderList(result.result);
        localStorage.setItem("orderlist", JSON.stringify(result.result));
      }
    })
    .catch((error) => console.log("error", error));
}

function orderList(data) {
  const filteredData = filterOrders(data);
  const tableContainer = document.querySelector(".tb-container");
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  tableContainer.innerHTML = "";

  paginatedData.forEach((order) => {
    // Code for generating order markup...
    const orderedAtDate = new Date(order.orderedAt);
    const optionsDate = { day: "2-digit", month: "short", year: "numeric" };
    const optionsTime = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedDate = orderedAtDate.toLocaleDateString(
      "en-US",
      optionsDate
    );
    const formattedTime = orderedAtDate.toLocaleTimeString(
      "en-US",
      optionsTime
    );
    const formattedDateTime = `${formattedDate} - ${formattedTime}`;
    let markup = `<tr>
      <td class="border-bottom-0">
        <h6 class="fw-semibold mb-0">${order.orderId}</h6>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal">${formattedDateTime}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal">${order.shippingresponse.firstName} ${order.shippingresponse.lastName}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal">SAR${order.totalPrice}</p>
      </td>
      <td class="border-bottom-0 mb-0 fw-normal" data-status=${order.status}>
        ${order.status}
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal">
         ${order.paymentMode}
        </p>
      </td>
      <td class="border-bottom-0">
        <a href="">
          <button class="btn btn-primary viewBtn" data-id=${order.orderId}>View Order</button>
        </a>
        <a href="">
          <button class="btn btn-primary updateStatus" data-id=${order.orderId} data-userid=${order.userId} >Edit</button>
        </a>
      </td>
        </tr>`;

    tableContainer.insertAdjacentHTML("beforeend", markup);
  });

  updatePagination(filteredData.length);

  // view btn
  const viewBtn = document.querySelectorAll(".viewBtn");
  viewBtn.forEach((x) => {
    x.addEventListener("click", (e) => {
      e.preventDefault();
      let id = e.target.dataset.id;
      localStorage.setItem("orderId", id);
      window.location.href = "https://admin.sammak.store/view-order.html";
    });
  });

  const edit = document.querySelectorAll(".updateStatus");

  edit.forEach((x) => {
    x.addEventListener("click", (e) => {
      e.preventDefault();
      let userid = e.target.dataset.userid;
      let orderid = e.target.dataset.id;

      Swal.fire({
        title: "Select field validation",
        input: "select",
        inputOptions: {
          delivered: "Delivered",
          pending: "Pending",
          cancelled: "Cancelled",
        },
        inputPlaceholder: "Select an Option",
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value) {
              resolve();
            } else {
              resolve("You need to select select an option:)");
            }
          });
        },
      }).then((value) => {
        if (value.isConfirmed) {
          Swal.fire({
            title: "Processing!",
            text: "Update in progress.",
            icon: "info",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
          });
          updateStatus(userid, orderid, value.value);
        } else {
          // window.location.href = "product.html";
        }
      });

      // updateStatus(userid, orderid);
    });
  });
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

document.getElementById("orderStatus").addEventListener("change", function () {
  filterStatus = this.value;
  currentPage = 1;
  getOrder();
});

async function updateStatus(uid, oid, status) {
  console.log(uid);
  console.log(oid);
  console.log(status);

  const token = localStorage.getItem("token");

  const config = {
    Accept: "*/*",
    Authorization: `Bearer ` + token,
  };

  const requestOptions = {
    method: "PUT",
    headers: config,
    redirect: "follow",
  };

  fetch(
    `https://developmentsamak-production-7c7b.up.railway.app/admin/updateOrderStatusById?orderId=${oid}&status=${status}&userId=${uid}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.status === 200) {
        Swal.fire({
          title: "updated",
          text: "Status Updated successfully.",
          icon: "success",
        }).then(() => {
          window.location.href = "https://admin.sammak.store/orders.html";
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: `Error: ${response.status} - ${response.statusText}`,
          icon: "error",
        });
      }
    })
    .catch((error) => console.log("error", error));
}

// function filterOrders(orderStatus) {
//   var orders = document.querySelectorAll(".tb-container tr");

//   orders.forEach(function (order) {
//     order.style.display = "table-row";
//   });

//   if (orderStatus !== "all") {
//     orders.forEach(function (order) {
//       var statusCell = order.querySelector("td:nth-child(5)");
//       var status = statusCell.textContent.trim().toLowerCase();

//       if (status !== orderStatus) {
//         order.style.display = "none";
//       }
//     });
//   }
// }

// pagination
