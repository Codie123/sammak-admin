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
              <button class="btn btn-primary updateStatus" >Edit</button>
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
      getOrderById(e.target.dataset.id);

      // window.location.href = "https://admin.sammak.store/view-order.html";
    });
  });
}

async function getOrderById(id) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ` + token,
    },
  };

  const requestOptions = {
    method: "GET",
    headers: config,

    redirect: "follow",
  };
  const tableContainer = document.querySelector(".tBody");

  const response = await fetch(
    `https://developmentsamak-production-7c7b.up.railway.app/admin/getOrderByTrackId?trackId=${id}`,
    requestOptions
  );

  const data = await response.json();

  if (data.status === 200) {
    let resData = data.result;
    console.log(resData);
    // resData.forEach((x) => {
    //   const markup = `  <tr>
    //     <td class="ps-0">
    //       <div class="d-flex align-items-center">
    //         <div class="me-2 pe-1">
    //           <img
    //             src="../assets/images/products/product-1.jpg"
    //             class="rounded-2"
    //             width="48"
    //             height="48"
    //             alt=""
    //           />
    //         </div>
    //         <div>
    //           <h6 class="fw-semibold mb-1">Minecraf App</h6>
    //           <p class="fs-2 mb-0 text-muted">Jason Roy</p>
    //         </div>
    //       </div>
    //     </td>
    //     <td>
    //       <p class="mb-0 fs-3 text-dark">qty</p>
    //     </td>

    //     <td>
    //       <p class="fs-3 text-dark mb-0">$3.5k</p>
    //     </td>
    //   </tr>`;

    //   tableContainer.insertAdjacentHTML("beforeend", markup);
    // });
  }
  if (data.status === 404) {
    tableContainer.insertAdjacentHTML(
      "beforeend",
      "<h4>No Products Found , please add a new product</h4>"
    );
  }
}
