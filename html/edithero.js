window.addEventListener("load", () => {
  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "login.html";
    }
  }, 1000);

  const formEle = document.querySelector("#heroslider");
  const title = document.getElementById("title");
  const description = document.getElementById("smallDescription");
  const image = document.getElementById("refImage");
  const dataEdit = JSON.parse(localStorage.getItem("editData"));

  formEle.addEventListener("submit", (e) => {
    e.preventDefault();
    addHero();
  });

  title.value = dataEdit[0].heroTitle;
  description.value = dataEdit[0].description;
  image.src = dataEdit[0].imageUrl;
  console.log(dataEdit[0].imageUrl);
});

function addHero() {
  let formData = new FormData(document.getElementById("heroslider"));
  if (formData) {
    console.log("Form data is not empty ");
  }
  fetch(
    "http://13.200.180.167:9731/HeroSlider/updateSlider/" +
      localStorage.getItem("edit"),
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

  window.location.href = "hero-slider.html";
}
