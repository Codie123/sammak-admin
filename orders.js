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
  //   document.querySelector(".loader").classList.remove("d-none");
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ` + token,
    },
  };

  const response = await fetch(
    "https://developmentsamak-production-7c7b.up.railway.app/admin/getAllOrders",
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      config,
    }
  );

  const data = await response.json();
  console.log(data);
}

// toaster function
// function showToast(message, type) {
//   const toastContainer = document.querySelector(".toast");
//   // Create a new toast element
//   const toastBd = document.querySelector(".toast-body");
//   toastBd.innerHTML = message;
//   toastContainer.classList.add("show");
//   toastContainer.classList.add(type);
// }
// ends
// function showToastOnNextPage(message, type) {
//   const toastDetails = {
//     message: message,
//     type: type,
//   };

//   // Store the toast details in local storage
//   localStorage.setItem("nextPageToast", JSON.stringify(toastDetails));

//   // Redirect to the next page
//   window.location.href = "https://admin.sammak.store/hero-slider.html";
// }
