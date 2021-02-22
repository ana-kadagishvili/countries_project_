const { StorageService, ApiService } = window;
const { CURRENT_USER_KEY } = window;

protectedRoute();

(async () => {
  const paginationRoot = document.getElementById("pagination");

  const userId = StorageService.read(CURRENT_USER_KEY);
  ApiService.setUserId(userId);

  const paginationData = await loadData();

  await setUser();

  // pagination
  const colorsPagination = new Pagination(paginationData);

  colorsPagination.appendTo(paginationRoot).render();

  // colorsPagination.listen(async (paginationQuery) => {
  //   const { data: colorList } = await ApiService.listResources(paginationQuery);
  //   console.log(paginationQuery);
  //   renderColors(colorList);
  // });
})();

async function setUser() {
  const country = document.getElementById("country");
  const flag = document.getElementById("flag");
  const capital = document.getElementById("capital");
  const area = document.getElementById("area");
  const population = document.getElementById("population");

  const user  = await ApiService.getUser();
  console.log('123123', user)

  flag.setAttribute("src", user[0].flag);
  country.textContent = `${user[0].name} - ${user[0].region}`;
  capital.textContent = 'Capital: ' + user[0].capital;
  area.textContent = 'Area: ' + user[0].area;
  population.textContent = 'population: ' + user[0].population;
}

function renderColors(colorList) {
  const colorListView = document.getElementById("colorListView");

  // colorList
  colorListView.innerHTML = null;
  colorList.forEach((color) => {
    // colorListView.innerHTML += cardTemplate(color);
  });
}

async function loadData() {
  // const {
  //   country,
  //   ...paginationData
  // } = await ApiService.listResources();
  let country = await ApiService.listResources();
  console.log(country)
  renderColors(country);
  // return paginationData;
}

// function cardTemplate(item) {
//   return `
//     <div
//           class="card text-white  mb-3 col-4"
//           style="max-width: 18rem; background-color:${item.color}"
//         >
//           <div class="card-header">${item.name}</div>
//           <div class="card-body">
//             <h5 class="card-title">Year - ${item.year}</h5>
//             <p class="card-text">
//               Pantone value - ${item.pantone_value}
//             </p>
//           </div>
//         </div>
//     `;
// }