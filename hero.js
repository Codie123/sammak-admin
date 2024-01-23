"use strict";
window.addEventListener("load", () => {
  const form = document.querySelector(".heroSlider");

  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "https://admin.sammak.store/index.html";
    }
  }, 1000);
});

function addHero() {
  const heroTitle = document.querySelector("#heroTitle");
  const heroDescription = document.querySelector("#description");
  const heroImage = document.querySelector("#file");

  if (heroTitle.value && heroDescription.value && heroImage.files.length != 0) {
    console.log(
      `Form Data:- ${heroTitle} || ${heroDescription} || ${heroImage}`
    );
  }

  var formData = new FormData(document.getElementById("heroSlider"));
  console.log(formData);
  // fetch(
  //   "https://developmentsamak-production-7c7b.up.railway.app/HeroSlider/addHeroSlider",
  //   {
  //     method: "POST",
  //     body: formData,

  //     headers: {
  //       // Accept: "*/*",
  //       Authorization: `Bearer ` + localStorage.getItem("token"),
  //       Accept: "application/json",
  //     },
  //   }
  // )
  //   .then((response) => response.json())
  //   .then((data) => {
  //     // Handle the response from the backend
  //     if (data.status === 200) {
  //       console.log(data);
  //       // initiate toaster value
  //       showToastOnNextPage(`${data.result}`, `${data.message}`);
  //       // ends
  //     } else {
  //       // Handle other conditions if needed
  //       console.error("Error:", data.errorMessage);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //   });
}

function showToastOnNextPage(message, type) {
  const toastDetails = {
    message: message,
    type: type,
  };

  // Store the toast details in local storage
  localStorage.setItem("nextPageToast", JSON.stringify(toastDetails));

  // Redirect to the next page
  window.location.href = "https://admin.sammak.store/hero-slider.html";
}
