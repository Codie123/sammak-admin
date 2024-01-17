let editBtn;
let deleteProductId;
window.addEventListener("load", () => {
  // Authenticate User
  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "login.html";
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

  // token
  getProduct();
  // ends
  // delete modal
  const btnClose = document.querySelector(".btn-close");
  const modal = document.querySelector(".modal");
  const close = document.querySelector("#close");
  btnClose.addEventListener("click", () => {
    closeModal();
  });
  close.addEventListener("click", () => {
    closeModal();
  });

  function closeModal() {
    if (modal.classList.contains("show")) {
      modal.classList.remove("show");
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", true);
    } else {
      modal.classList.add("show");
      modal.style.display = "block";
      modal.setAttribute("aria-hidden", false);
    }
  }
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
async function getProduct() {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ` + token,
    },
  };
  const tableContainer = document.querySelector(".tBody");

  document.querySelector(".loader").classList.remove("d-none");
  const response = await fetch("http://13.200.180.167:9731/Product/post", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    config,
  });

  const data = await response.json();

  if (data.status === 200) {
    let resData = data.result;

    resData.forEach((element) => {
      const markup = `<tr class="tableRow"><td class="border-bottom-0"><h6 class="fw-semibold mb-0">${
        element.id
      }</h6></td><td class="border-bottom-0"><h6 class="fw-semibold mb-1">${
        element.productName
      }</h6> <span class="fw-normal">${
        element.categoryName
      }</span></td><td class="border-bottom-0"><h6 class="fw-semibold mb-0 fs-4">SAR${
        element.sellingPrice
      }</h6></td><td class="border-bottom-0"><div class="d-flex align-items-center gap-2"><img src="${
        element.images[element.images.length - 1].imageUrl
      }" width="100px" height="100px"></div></td><td class="border-bottom-0"><a><button class="editBtn btn btn-primary" data-edit=${
        element.id
      }>Edit</button>
    </a>
    <button type="button"  class="btn btn-danger delete-btn"  data-prid="${
      element.id
    }" data-target="#deleteModal" data-toggle="modal" >Delete</button> 
    </td>
    </tr>`;

      tableContainer.insertAdjacentHTML("beforeend", markup);
    });
  }
  if (data.status === 404) {
    tableContainer.insertAdjacentHTML(
      "beforeend",
      "<h4>No Products Found , please add a new product</h4>"
    );
  }

  document.querySelector(".loader").classList.add("d-none");

  //   edit button global intitiator
  editBtn = document.querySelectorAll(".editBtn");
  editBtn.forEach((x) => {
    x.addEventListener("click", (e) => {
      e.preventDefault();
      editproduct(data, e.target.dataset.edit);
    });
  });

  const deleteBtn = document.querySelectorAll(".delete-btn");
  const deleteModal = document.querySelector("#deleteModal");

  deleteBtn.forEach((x) => {
    x.addEventListener("click", (e) => {
      deleteProductId = e.target.dataset.prid;
      console.log(deleteProductId);
      deleteModal.classList.add("show");
      deleteModal.style.display = "block";
      deleteModal.setAttribute("aria-hidden", false);
      loadDelete();
    });
  });
}

function editproduct(data, editId) {
  const data1 = data.result;
  // setting product id
  localStorage.setItem("editpro", (data.result.id = editId));
  // filter product
  let dataFilter = data1.filter(
    (x) => x.id === parseInt(localStorage.getItem("editpro"))
  );

  localStorage.setItem("editproData", JSON.stringify(dataFilter));

  window.location.href = "edit-product.html";
}

// delete product
function loadDelete() {
  const confirmBtn = document.querySelector("#confirmDelete");

  confirmBtn.addEventListener("click", () => {
    console.log("clicked");
    deleteProduct(deleteProductId);
  });

  async function deleteProduct(id) {
    console.log(id);
    const token = localStorage.getItem("token");
    const deleteId = id;

    const response = await fetch(
      `http://13.200.180.167:9731/admin/deleteById/${deleteId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      // const deleteMessage = document.querySelector("#deleteMessage");

      showToastOnNextPage(`${data.result}`, `success`);
      // deleteMessage.innerHTML =
      //   '<div class="alert alert-success">Product deleted successfully!</div>';
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      const deleteMessage = document.querySelector("#deleteMessage");
      deleteMessage.innerHTML =
        '<div class="alert alert-danger">Error deleting product.</div>';
      console.error(`Error Details: ${errorText}`);
    }
  }
}

// toaster function
function showToast(message, type) {
  const toastContainer = document.querySelector(".toast");
  // Create a new toast element
  const toastBd = document.querySelector(".toast-body");
  toastBd.innerHTML = message;
  toastContainer.classList.add("show");
  toastContainer.classList.add(type);
}
// ends
function showToastOnNextPage(message, type) {
  const toastDetails = {
    message: message,
    type: type,
  };

  // Store the toast details in local storage
  localStorage.setItem("nextPageToast", JSON.stringify(toastDetails));

  // Redirect to the next page
  window.location.href = "product.html";
}
