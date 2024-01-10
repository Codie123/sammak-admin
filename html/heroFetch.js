let editBtn;
window.addEventListener("load", () => {
  // Toaster
  setInterval(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "login.html";
    }
  }, 1000);
  // ends
  // token
  getHero();
  // ends
});

async function getHero() {
  document.querySelector(".loader").classList.remove("d-none");
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ` + token,
    },
  };
  const response = await fetch("http://13.200.180.167:9731/HeroSlider/getAll", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    config,
  });

  const data = await response.json();

  heroList(data);
  // fetch("http://13.200.180.167:9731/HeroSlider/getAll", {
  //   method: "GET",
  //   headers: {
  //     "Content-type": "application/json; charset=UTF-8",
  //   },
  //   config,
  // })
  //   .then((response) => {
  //     let data = response.json();
  //     //   console.log(data);
  //     return data;
  //   })
  //   .then((data) => {
  //     heroList(data);
  //   })
  //   .catch((err) => {
  //     console.log("Something went wrong " + err);
  //   });
}

function heroList(data) {
  const tableContainer = document.querySelector(".tBody");

  let resData = data.result;

  resData.forEach((element) => {
    console.log(element);

    const markup = ` <tr>
                        <td class="border-bottom-0">
                          <h6 class="fw-semibold mb-0">${element.id}</h6>
                        </td>
                        <td class="border-bottom-0">
                          <h6 class="fw-semibold mb-1">${element.heroTitle}</h6>
                        </td>
                        <td class="border-bottom-0">
                          <h6 class="fw-semibold mb-0 fs-4">${element.description}</h6>
                        </td>
                        <td class="border-bottom-0">
                          <div class="d-flex align-items-center gap-2">
                            <div class="row">
                              <div class="col-md-4">
                                <img
                                  src="${element.imageUrl}"
                                  alt=""
                                  class="img-fluid"
                                />
                              </div>
                            </div>
                          </div>
                        </td>
  
                        <td class="border-bottom-0">
                          
                            <button class="btn btn-primary editBtn" data-edit=${element.id}>Edit</button>
                          <button class="btn btn-primary">Delete</button>
                        </td>
                      </tr>`;

    tableContainer.insertAdjacentHTML("beforeend", markup);
  });

  document.querySelector(".loader").classList.add("d-none");

  editBtn = document.querySelectorAll(".editBtn");
  console.log(editBtn);
  editBtn.forEach((x) => {
    x.addEventListener("click", (e) => {
      e.preventDefault();
      editHero(data, e.target.dataset.edit);
    });
  });
}
function editHero(data, editId) {
  // const token = localStorage.getItem("token");
  // const config = {
  //   headers: {
  //     Accept: "*/*",
  //     Authorization: `Bearer ` + token,
  //   },
  // };
  const data1 = data.result;

  localStorage.setItem("edit", (data.result.id = editId));
  let dataFilter = data1.filter(
    (x) => x.id === parseInt(localStorage.getItem("edit"))
  );
  localStorage.setItem("editData", JSON.stringify(dataFilter));

  window.location.href = "edit-hero.html";
}
