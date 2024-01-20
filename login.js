"use strict";
window.addEventListener("load", () => {
  if (localStorage.getItem("token")) {
    window.location.replace("/home.html");
  }

  const formEle = document.querySelector("#lgForm");
  const email = document.querySelector("#adminemail");
  const password = document.querySelector("#adminpassword");

  // ui elements

  const log = document.querySelector(".log");
  const loader = document.querySelector(".dot-spinner");
  const toast = document.querySelector(".toast");
  const toastBody = document.querySelector(".toast-body");
  // ends
  formEle.addEventListener("submit", (e) => {
    e.preventDefault();

    if (email.value === "" || password.value === "") {
      console.log("please enter the email or password");
    }
    if (email.value && password.value) {
      log.classList.add("d-none");
      loader.classList.remove("d-none");

      fetch(
        "https://developmentsamak-production-7c7b.up.railway.app/v1/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      )
        .then((response) => {
          let data = response.json();
          console.log(data);
          return data;
        })
        .then((data) => {
          if (data.result.roleName === "ROLE_Admin") {
            log.classList.remove("d-none");
            loader.classList.add("d-none");
            toast.classList.add("show");
            toastBody.innerHTML = "Logged in successfully";
            // console.log(parseJwt(data.result.accessToken));
            localStorage.setItem("token", data.result.accessToken);
            window.location.href = "https://admin.sammak.store/home.html";
          } else {
            log.classList.remove("d-none");
            loader.classList.add("d-none");
            toast.classList.add("show");
            toastBody.innerHTML = "Please enter a valid user login credential ";
          }
        })
        .catch((err) => {
          log.classList.remove("d-none");
          loader.classList.add("d-none");
          toast.classList.add("show");
          toastBody.innerHTML = err;
          console.warn(err);
        });
    }
  });
});

// function parseJwt(token) {
//   var base64Url = token.split(".")[1];
//   var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   var jsonPayload = decodeURIComponent(
//     window
//       .atob(base64)
//       .split("")
//       .map(function (c) {
//         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join("")
//   );

//   return JSON.parse(jsonPayload);
// }
