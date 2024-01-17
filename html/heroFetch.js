let editBtn;

let deleteProductId;
window.addEventListener("load", () => {
  // Toaster
  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "login.html";
    }
  }, 1000);
  // ends
  // logout trigger
  const logoutBtn = document.querySelector("#logout");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
  });
  // ends

  // token
  getHero();
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

async function getHero() {
  document.querySelector(".loader").classList.remove("d-none");
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ` + token,
    },
  };
  const response = await fetch("http://13.200.180.167:9731/HeroSlider/getAll", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    config,
  });

  const data = await response.json();
  heroList(data);
}

function heroList(data) {
  const tableContainer = document.querySelector(".tBody");

  if (data.status === 200) {
    let resData = data.result;

    resData.forEach((element) => {
      console.log(element);

      const markup = ` <tr>
                          <td class="border-bottom-0">
                            <h6 class="fw-semibold mb-0">${element.id}</h6>
                          </td>
                          <td class="border-bottom-0">
                            <h6 class="fw-semibold mb-1">${element.heroTitle}</h6>
                          </td>
                          <td class="border-bottom-0">
                            <h6 class="fw-semibold mb-0 fs-4">${element.description}</h6>
                          </td>
                          <td class="border-bottom-0">
                            <div class="d-flex align-items-center gap-2">
                              <div class="row">
                                <div class="col-md-4">
                                  <img
                                    src="${element.imageUrl}"
                                    alt=""
                                    class="img-fluid"
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
    
                          <td class="border-bottom-0">
                            
                              <button class="btn btn-primary editBtn" data-edit=${element.id}>Edit</button>
                            <button type="button" class="btn btn-primary delete-btn" data-prid="${element.id}" >Delete</button>
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

  editBtn = document.querySelectorAll(".editBtn");
  console.log(editBtn);
  editBtn.forEach((x) => {
    x.addEventListener("click", (e) => {
      e.preventDefault();
      editHero(data, e.target.dataset.edit);
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
function editHero(data, editId) {
  // const token = localStorage.getItem("token");
  // const config = {
  //   headers: {
  //     Accept: "*/*",
  //     Authorization: `Bearer ` + token,
  //   },
  // };
  const data1 = data.result;

  localStorage.setItem("edit", (data.result.id = editId));
  let dataFilter = data1.filter(
    (x) => x.id === parseInt(localStorage.getItem("edit"))
  );
  localStorage.setItem("editData", JSON.stringify(dataFilter));

  window.location.href = "edit-hero.html";
}

// delete modal
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
      `http://13.200.180.167:9731/HeroSlider/deleteSlider/${deleteId}`,
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
// ends

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
  window.location.href = "hero-slider.html";
}
