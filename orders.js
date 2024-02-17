const itemsPerPage = 8;
let currentPage = 1;
localStorage.setItem("page", 1);
let filterStatus = "All";

function handlenextpage() {
  let pagenum = document.getElementById("pageNum");
  currentPage = currentPage + 1;
  getOrder();
  pagenum.textContent = currentPage;
}

function handlePreviouspage() {
  let pagenum = document.getElementById("pageNum");
  if ((currentPage = 1)) {
    currentPage = 1;
    getOrder();
    pagenum.textContent = currentPage;
  }
}

document.getElementById("next-btn").addEventListener("click", handlenextpage);
document
  .getElementById("previous-btn")
  .addEventListener("click", handlePreviouspage);
window.addEventListener("load", () => {
  // validate token
  // setInterval(() => {
  //   if (!localStorage.getItem("token")) {
  //     window.location.href = "https://admin.sammak.store/index.html";
  //   }
  // }, 1000);
  // ends
  // logout trigger

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
  const tableContainer = document.querySelector(".tb-container");

  // Clear previous data
  tableContainer.innerHTML = "";

  console.log(data);
  let indexOfLastItem = currentPage * itemsPerPage;
  let indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let dtcpy = [...data]
    .filter((x) => filterStatus === "All" || x.status === filterStatus)
    .slice(indexOfFirstItem, indexOfLastItem)
    .reverse();

  dtcpy
    .map((x) => {
      // Format the orderedAt date
      const orderedAtDate = new Date(x.orderedAt);
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
            <h6 class="fw-semibold mb-0">${x.orderId}</h6>
          </td>
          <td class="border-bottom-0">
            <p class="mb-0 fw-normal">${formattedDateTime}</p>
          </td>
          <td class="border-bottom-0">
            <p class="mb-0 fw-normal">${x.shippingresponse.firstName} ${x.shippingresponse.lastName}</p>
          </td>
          <td class="border-bottom-0">
            <p class="mb-0 fw-normal">SAR${x.totalPrice}</p>
          </td>
          <td class="border-bottom-0 mb-0 fw-normal" data-status=${x.status}>
            ${x.status}
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
              <button class="btn btn-primary updateStatus" data-id=${x.orderId} data-userid=${x.userId} >Edit</button>
            </a>
          </td>
        </tr>`;

      tableContainer.insertAdjacentHTML("beforeend", markup);
    })
    .slice(indexOfFirstItem, indexOfLastItem);

  // filter event
  document
    .getElementById("orderStatus")
    .addEventListener("change", function () {
      console.log(this.value);
      filterStatus = this.value;
      currentPage = 1;
      let pagenum = document.getElementById("pageNum");
      pagenum.textContent = currentPage;
      getOrder();
    });
  // ends

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
