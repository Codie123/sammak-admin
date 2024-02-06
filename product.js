"use strict";
window.addEventListener("load", () => {
  const form = document.querySelector(".addForm");
  const toast = document.querySelector(".toast");
  const toastBody = document.querySelector(".toast-body");
  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "https://admin.sammak.store/index.html";
    }
  }, 1000);
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission
    add(); // Call the add function for form validation and submission
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

  // Form validation logic
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
          Authorization: `Bearer ` + localStorage.getItem("token"),
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 200) {
          submitBtn.innerHTML = `Submit`;
          submitBtn.removeAttribute("disabled"); // Remove the disabled attribute

          // initiate toaster value
          showToastOnNextPage(`${data.result}`, `${data.message}`);
        } else {
          console.error("Error:", data.errorMessage);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    // If form fields are not valid, you can show an error message or take other actions
    toast.classList.add("show");
    toastBody.innerHTML = "Form fields are not valid ";
    console.log("Form fields are not valid");
  }
}

function showToastOnNextPage(message, type) {
  const toastDetails = {
    message: message,
    type: type,
  };

  localStorage.setItem("nextPageToast", JSON.stringify(toastDetails));
  window.location.href = "https://admin.sammak.store/product.html";
}
