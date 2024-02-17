window.addEventListener("load", () => {
  // logout Event
  const logoutBtn = document.querySelector("#logout");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
  });
  // ends

  // token
  getContacts();
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

async function getContacts() {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ` + token,
    },
  };
  const tableContainer = document.querySelector(".tBody");

  //   document.querySelector(".loader").classList.remove("d-none");
  const response = await fetch(
    "https://developmentsamak-production-7c7b.up.railway.app/contactUs/getAll",
    {
      method: "GET",
      config,
    }
  );

  const data = await response.json();

  //   if (data.status === 200) {
  //     let resData = data.result;
  //   }
  //   if (data.status === 404) {
  //     tableContainer.insertAdjacentHTML(
  //       "beforeend",
  //       "<h4>No Products Found , please add a new product</h4>"
  //     );
  //   }

  //   document.querySelector(".loader").classList.add("d-none");
}
