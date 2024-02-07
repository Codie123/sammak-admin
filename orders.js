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
    .then((result) => (result.status === 200 ? orderList(result.result) : ""))
    .catch((error) => console.log("error", error));
}

function orderList(data) {
  const tableContainer = document.querySelector(".tb-container");

  // Clear previous data
  tableContainer.innerHTML = "";

  console.log(data);

  let dtcpy = [...data].reverse();

  dtcpy.forEach((x) => {
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
              <button class="btn btn-primary updateStatus" data-id=${x.orderId} data-userid=${x.userId} >Edit</button>
            </a>
          </td>
        </tr>`;

    tableContainer.insertAdjacentHTML("beforeend", markup);
  });

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
      let userid = localStorage.setItem("userId", e.target.dataset.userid);
      let orderid = localStorage.setItem("orderId", e.target.dataset.id);

      Swal.fire({
        title: "Select field validation",
        input: "select",
        inputOptions: {
          delivered: "Delivered",
          pending: "Pending",
          cancelled: "Cancelled",
        },
        inputPlaceholder: "Select a fruit",
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
