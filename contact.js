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
    Accept: "*/*",
    Authorization: `Bearer ` + token,
  };

  const requestOptions = {
    method: "GET",
    headers: config,
    redirect: "follow",
  };

  fetch(
    `https://developmentsamak-production-7c7b.up.railway.app/contactUs/getAll`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.status === 200) {
        generateCtCard(result.result);
      }
    })
    .catch((error) => console.log("error", error));
}
function generateCtCard(data) {
  const container = document.querySelector("#card-container");
  data.forEach((x) => {
    const markup = `<div class="col-lg-4 col-md-6">
        <div class="card text-center">
          <div class="card-body">
            <img
              src="../assets/images/profile/default-profile.webp"
              class="rounded-1 img-fluid"
              width="90"
            />
            <div class="mt-n2">
              <span class="badge text-bg-primary">#${x.contactId}</span>
              <h3 class="card-title mt-3">${x.contactName}</h3>
              <a href="mailto:${x.contactEmail}" class="card-subtitle">${
      x.contactEmail
    }</a>
            </div>
          
            <div class="row mt-4 justify-content-center flex-column">
                <div class="col" style="text-align: left;">
                    <p><strong>Message</strong>: ${x.contactMessage}</p>
                </div>
            
                <div class="col text-align-start" style="text-align: left;">
                    <h5>Subject</h5>
                    <p>${x.contactSubject ? x.contactSubject : "No subject!"}
                    </p>
                </div>

            </div>
                
              
          
          </div>
        </div>
      </div>`;

    container.insertAdjacentHTML("beforeend", markup);
  });
}
