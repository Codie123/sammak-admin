"use strict";
window.addEventListener("load", () => {
  if (localStorage.getItem("token")) {
    window.location.replace("/home.html");
  }

  const formEle = document.querySelector("#lgForm");
  const email = document.querySelector("#adminemail");
  const password = document.querySelector("#adminpassword");

  // ui elements

  const toast = document.querySelector(".toast");
  const toastBody = document.querySelector(".toast-body");
  const submitBtn = document.querySelector("#submit");

  // ends
  formEle.addEventListener("submit", (e) => {
    e.preventDefault();

    if (email.value === "" || password.value === "") {
      toast.classList.add("show");
      toastBody.innerHTML = "please enter the email or password";
    }
    if (email.value && password.value) {
      submitBtn.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>Loading...`;
      submitBtn.setAttribute("disabled", "true");

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

          return data;
        })
        .then((data) => {
          if (data.result.roleName === "ROLE_Admin") {
            submitBtn.innerHTML = "submit";
            submitBtn.removeAttribute("disabled");
            toast.classList.add("show");
            toastBody.innerHTML = "Logged in successfully";

            localStorage.setItem("token", data.result.accessToken);
            window.location.href = "https://admin.sammak.store/orders.html";
          } else {
            submitBtn.innerHTML = "submit";
            submitBtn.removeAttribute("disabled");
            email.value = "";
            password.value = "";
            toast.classList.add("show");
            toastBody.innerHTML = "Please enter a valid user login credential ";
          }
        })
        .catch((err) => {
          submitBtn.innerHTML = "Submit";
          submitBtn.removeAttribute("disabled");
          email.value = "";
          password.value = "";
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
