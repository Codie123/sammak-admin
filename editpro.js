"use strict";
window.addEventListener("load", () => {
  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "https://admin.sammak.store/index.html";
    }
    const primgdeleteAPI =
      "https://developmentsamak-production-7c7b.up.railway.app/admin/deleteImage/";
  }, 1000);

  const formEle = document.querySelector("#productForm");

  const prname = document.getElementById("name");
  const smDescription = document.querySelector("#small_description");
  const description = document.getElementById("description");
  const productImage = document.querySelector(".file-upload-info");
  const image = document.querySelector("#refImage");

  const imageContainer = document.querySelector("#preview");
  const oriPrice = document.querySelector("#original_price");
  const sellPrice = document.querySelector("#selling_price");
  const category = document.querySelector("#category");
  const quantity = document.querySelector("#quantity");

  const dataEdit = JSON.parse(localStorage.getItem("editproData"));

  formEle.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(dataEdit);
    editProduct();
    console.log(dataEdit[0].originalPrice);
  });

  prname.value = dataEdit[0].productName;
  smDescription.value = dataEdit[0].smallDescription;
  description.value = dataEdit[0].productDescription;
  oriPrice.value = dataEdit[0].originalPrice;
  sellPrice.value = dataEdit[0].sellingPrice;
  category.value = dataEdit[0].categoryName;
  quantity.value = dataEdit[0].quantity;

  dataEdit[0].images.forEach((x) => {
    let imgEle = `<div class="wrapper">
                    <img src=${x.imageUrl} data-imgid=${x.id} data-productid =${x.productId}  class="img-fluid" id="refImage">
                    
                    <i class="fa-solid fa-xmark" id="deleteImg"></i>
                  </div>
    `;
    imageContainer.insertAdjacentHTML("beforeend", imgEle);
  });
  // delete product Image
  initDeletImg();
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
function initDeletImg() {
  const deleteImg = document.querySelectorAll("#deleteImg");

  deleteImg.forEach((x) => {
    x.addEventListener("click", (e) => {
      let imgId = e.target.offsetParent.childNodes[1].dataset.imgid;
      let productId = e.target.offsetParent.childNodes[1].dataset.productid;
      deleteProduct(imgid, productId);
    });
  });
}

function loadDelete(id, prid) {
  // const confirmBtn = document.querySelector("#confirmDelete");

  // confirmBtn.addEventListener("click", () => {
  //   console.log("clicked");
  //   deleteProduct(deleteProductId);
  // });
  let imageId = id;
  let productId = prid;

  async function deleteProduct(id, pid) {
    const token = localStorage.getItem("token");
    const deleteId = id;

    const response = await fetch(
      `https://developmentsamak-production-7c7b.up.railway.app/admin/deleteImage/${id}/${pid}`,
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

      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      }).then(() => {
        window.location.href = "https://admin.sammak.store/product.html";

        // showToastOnNextPage(`${data.result}`, `success`);
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: `Error: ${response.status} - ${response.statusText}`,
        icon: "error",
      });
    }
  }

  // sweet alert
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Processing!",
        text: "Delete in progress.",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      deleteProduct(imageId, productId);
    } else {
      // window.location.href = "product.html";
    }
  });

  // ends
}
function editProduct() {
  let formData = new FormData(document.getElementById("productForm"));
  const submitBtn = document.querySelector("#submit");

  submitBtn.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Loading...`;
  submitBtn.setAttribute("disabled", "true");

  fetch(
    "https://developmentsamak-production-7c7b.up.railway.app/admin/updateProductById/" +
      localStorage.getItem("editpro"),
    {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem("token"),
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Check if the response body is not empty before parsing as JSON
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.status === 200) {
        submitBtn.innerHTML = `Submit`;
        submitBtn.setAttribute("disabled", "false");
        showToastOnNextPage(`${data.message}`, `success`);
      }
    })
    .catch((error) => {
      document.querySelector(".update-text").classList.remove("d-none");
      document.querySelector(".dot-spinner").classList.add("d-none");
      console.error("Error:", error);
      // Handle the error, possibly show a user-friendly message
    });
}

function showToastOnNextPage(message, type) {
  const toastDetails = {
    message: message,
    type: type,
  };

  // Store the toast details in local storage
  localStorage.setItem("nextPageToast", JSON.stringify(toastDetails));

  // Redirect to the next page
  window.location.href = "https://admin.sammak.store/product.html";
}
