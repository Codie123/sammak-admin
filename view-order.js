window.addEventListener("load", () => {
  // Authenticate User
  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "https://admin.sammak.store/index.html";
    }
    localStorage.removeItem("editproData");
    localStorage.removeItem("editpro");
  }, 1000);
  // ends

  // logout Event
  const logoutBtn = document.querySelector("#logout");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
  });
  // ends
  document.querySelector(
    ".card-title"
  ).innerHTML = `Order#${localStorage.getItem("orderId")}`;
  // token
  getOrderById(localStorage.getItem("orderId"));
  // ends

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
async function getOrderById(id) {
  const tableContainer = document.querySelector(".tBody");
  const ctCard = document.querySelector(".coust-details-I");
  const ctCard2 = document.querySelector(".coust-details-II");
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
  //   const tableContainer = document.querySelector(".tBody");

  const response = await fetch(
    `https://developmentsamak-production-7c7b.up.railway.app/admin/getOrderByTrackId?trackId=${id}`,
    requestOptions
  );

  const data = await response.json();

  if (data.status === 200) {
    let resData = data.result;
    console.log(resData);
    let productInfo = [...resData.orderItemResponseList];

    productInfo.forEach((x) => {
      const markup = `<tr>
        <td class="ps-0">
          <div class="d-flex align-items-center">
            <div class="me-2 pe-1">
              <img
                src="${x.imageUrl}"
                class="rounded-2"
                width="48"
                height="48"
                alt=""
              />
            </div>
            <div>
              <h6 class="fw-semibold mb-1">${x.productName}</h6>
              <p class="fs-2 mb-0 text-muted">${x.cleaningType}</p>
            </div>
          </div>
        </td>
        <td>
          <p class="mb-0 fs-3 text-dark">${x.quantity}</p>
        </td>

       
      </tr>`;

      tableContainer.insertAdjacentHTML("beforeend", markup);
    });

    const markup = `<h6><strong>Customer Name</strong> - ${resData.shippingresponse.firstName} ${resData.shippingresponse.lastName}</h6>
      <p><strong>Customer email</strong> - ${resData.shippingresponse.email}</p>
      <p><strong>Street</strong> - ${resData.shippingresponse.street1}</p>
      <p><strong>City</strong> - ${resData.shippingresponse.city}</p>
      <p><strong>State</strong> - ${resData.shippingresponse.state}</p>
      <p><strong>Phone</strong> - ${resData.shippingresponse.phone}</p>
      <p><strong>Country</strong> -  ${resData.shippingresponse.country}</p>

      <p><strong>Zip-code</strong> - ${resData.shippingresponse.zip}</p>`;
    ctCard.insertAdjacentHTML("beforeend", markup);

    const markup2 = `
      <p><strong>Payment Method</strong> - ${resData.paymentMode}</p>
      <p><strong>status</strong> - ${resData.status}</p>
      <p><Strong>Total Price</Strong> - ${resData.totalPrice}</p>`;

    ctCard2.insertAdjacentHTML("beforeend", markup2);
  }
  if (data.status === 404) {
    tableContainer.insertAdjacentHTML(
      "beforeend",
      "<h4>No Products Found , please add a new product</h4>"
    );
  }

  // document.querySelector(".loader").classList.add("d-none");

  //   edit button global intitiator
  // editBtn = document.querySelectorAll(".editBtn");
  // editBtn.forEach((x) => {
  //   x.addEventListener("click", (e) => {
  //     e.preventDefault();

  //     const data1 = data.result;

  //     localStorage.setItem("editpro", (data.result.id = e.target.dataset.edit));

  //     window.location.href = "https://admin.sammak.store/edit-product.html";
  //   });
  // });

  // const deleteBtn = document.querySelectorAll(".delete-btn");
  // const deleteModal = document.querySelector("#deleteModal");

  // deleteBtn.forEach((x) => {
  //   x.addEventListener("click", (e) => {
  //     deleteProductId = e.target.dataset.prid;
  //     console.log(deleteProductId);
  //     // deleteModal.classList.add("show");
  //     // deleteModal.style.display = "block";
  //     // deleteModal.setAttribute("aria-hidden", false);
  //     loadDelete();
  //   });
  // });
}
