"use strict";
window.addEventListener("load", () => {
  const form = document.querySelector(".addForm");

  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "https://admin.sammak.store/index.html";
    }
  }, 1000);
  form.addEventListener("submit", (e) => {
    // e.preventDefault();
    add();
  });
});

function add() {
  const prName = document.querySelector("#name");
  const prImage = document.querySelector(".file-upload-info");
  const prSmDesc = document.querySelector("#small_description");
  const prDesc = document.querySelector("#description");
  const prOriprice = document.querySelector("#original_price");
  const prSelprice = document.querySelector("#selling_price");
  const prCat = document.querySelector("#category");
  const prQty = document.querySelector("#quantity");

  const submitBtn = document.querySelector("#submit");
  if (
    prName.value &&
    prImage.files.length != 0 &&
    prSmDesc.value &&
    prDesc.value &&
    prOriprice.value &&
    prSelprice.value &&
    prCat.value &&
    prQty.value
  ) {
    var formData = new FormData(document.getElementById("productForm"));
    submitBtn.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Loading...`;
    submitBtn.setAttribute("disabled", "true");
    fetch(
      "https://developmentsamak-production-7c7b.up.railway.app/admin/addProducts",
      {
        method: "POST",
        body: formData,

        headers: {
          // Accept: "*/*",
          Authorization: `Bearer ` + localStorage.getItem("token"),
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          formData.reset();
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response from the backend
        if (data.status === 200) {
          submitBtn.innerHTML = `Submit`;
          submitBtn.setAttribute("disabled", "false");

          // initiate toaster value
          showToastOnNextPage(`${data.result}`, `${data.message}`);
          // ends
        } else {
          // Handle other conditions if needed
          formData.reset();
          console.error("Error:", data.errorMessage);
        }
      })
      .catch((error) => {
        formData.reset();
        console.error("Error:", error);
        // Optionally, show an error toaster message
        // toastr.error("An error occurred while adding the product.");
      });
  }
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
