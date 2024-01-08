window.addEventListener("load", () => {
  const form = document.querySelector(".addForm");

  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "login.html";
    }
  }, 1000);

  // form.addEventListener("submit", (e) => {
  //   // e.preventDefault();
  //   add();
  // });
});

function add() {
  // const token = localStorage.getItem("token");
  // const config = {
  //   headers: {
  //     Accept: "multipart/form-data",
  //     Authorization: `Bearer ` + token,
  //   },
  // };
  // Make an AJAX request to the Spring Boot backend
  var formData = new FormData(document.getElementById("productForm"));
  console.log(formData);
  fetch("http://13.200.180.167:9731/HeroSlider/addHeroSlider", {
    method: "POST",
    body: formData,

    headers: {
      // Accept: "*/*",
      Authorization: `Bearer ` + localStorage.getItem("token"),
      Accept: "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => {
      // Handle the response from the backend
      console.log("Response:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
