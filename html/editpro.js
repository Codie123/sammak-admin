window.addEventListener("load", () => {
  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "login.html";
    }
  }, 1000);

  const formEle = document.querySelector("#productForm");

  const prname = document.getElementById("name");
  const smDescription = document.querySelector("#small_description");
  const description = document.getElementById("description");
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
    // editProduct();
    console.log(dataEdit[0].originalPrice);
  });

  //   title.value = dataEdit[0].heroTitle;
  //   description.value = dataEdit[0].description;
  //   image.src = dataEdit[0].imageUrl;
  //   console.log(dataEdit[0].imageUrl);

  prname.value = dataEdit[0].productName;
  smDescription.value = dataEdit[0].smallDescription;
  description.value = dataEdit[0].productDescription;
  oriPrice.value = dataEdit[0].originalPrice;
  sellPrice.value = dataEdit[0].sellingPrice;
  category.value = dataEdit[0].categoryName;
  quantity.value = dataEdit[0].quantity;

  dataEdit[0].images.forEach((x) => {
    let imgEle = `<img src=${x.imageUrl}  width:"100px"; height="100px">`;
    imageContainer.insertAdjacentHTML("beforeend", imgEle);
  });
});

function editProduct() {
  let formData = new FormData(document.getElementById("productForm"));

  fetch(
    "http://13.200.180.167:9731/admin/updateProductById/" +
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
      return response.text();
    })
    .then((data) => {
      if (data) {
        const jsonData = JSON.parse(data);
        redirectUrl(jsonData);
        console.log("Response:", jsonData);
      } else {
        console.log("Empty response received.");
        // Handle empty response if needed
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle the error, possibly show a user-friendly message
    });
}

function redirectUrl(data) {
  console.log("function" + data);

  window.location.href = "product.html";
}
