window.addEventListener("load", () => {
  const form = document.querySelector(".heroSlider");

  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "login.html";
    }
  }, 1000);

  // form.addEventListener("submit", (e) => {
  //   // e.preventDefault();
  //   // add();
  // });
});

function addHero() {
  // const token = localStorage.getItem("token");
  // const config = {
  //   headers: {
  //     Accept: "multipart/form-data",
  //     Authorization: `Bearer ` + token,
  //   },
  // };
  // Make an AJAX request to the Spring Boot backend
  var formData = new FormData(document.getElementById("heroSlider"));
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
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from the backend
      redirectUrl(data);
      console.log("Response:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function redirectUrl(data) {
  if (data.status === 200) {
    window.location.href = "hero-slider.html";
  }
}
