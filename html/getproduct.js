let editBtn;
window.addEventListener("load", () => {
  // Toaster
  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "login.html";
    }
    localStorage.removeItem("editproData");
    localStorage.removeItem("editpro");
  }, 1000);
  // ends
  // token
  getProduct();
  // ends

  // get all products

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
    }</h6></td><td class="border-bottom-0"><div class="d-flex align-items-center gap-2"><img src="${element.images.map(
      (x) => x.imageUrl
    )}" width="100px" height="100px"></div></td><td class="border-bottom-0"><a><button class="editBtn btn btn-primary" data-edit=${
      element.id
    }>Edit</button></a><button class="btn btn-primary" id="deleteBtn">Delete</button></td></tr>`;

    tableContainer.insertAdjacentHTML("beforeend", markup);
  });
  document.querySelector(".loader").classList.add("d-none");

  //   edit button global intitiator
  editBtn = document.querySelectorAll(".editBtn");
  console.log(editBtn);
  editBtn.forEach((x) => {
    x.addEventListener("click", (e) => {
      e.preventDefault();
      editproduct(data, e.target.dataset.edit);
    });
  });
}

function editproduct(data, editId) {
  console.log("found you ");
  const data1 = data.result;
  console.log(data1);

  localStorage.setItem("editpro", (data.result.id = editId));
  let dataFilter = data1.filter(
    (x) => x.id === parseInt(localStorage.getItem("editpro"))
  );
  localStorage.setItem("editproData", JSON.stringify(dataFilter));

  window.location.href = "edit-product.html";
}
