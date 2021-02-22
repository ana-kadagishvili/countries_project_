const signOutButton = document.getElementById("signOutButton");
const { StorageService, ApiService } = window;
const { CURRENT_USER_KEY, USER_TOKEN_KEY } = window;

signOutButton.addEventListener("click", () => {
  StorageService.delete(USER_TOKEN_KEY);
  naviageToIndex();
});

protectedRoute();

// CARD

class CardBuilder {
  constructor(tagName = "div") {
    this.card = document.createElement(tagName);
    this.card.className = "card mt-2 mb-2 col-4 p-2";
    this.card.style.width = "18rem";

    this.cardBody = null;
    this.cardTitle = null;
    this.cardImage = null;
    this.cardText = null;
    this.catrLink = null;
  }

  addImage(src) {
    this.cardImage = document.createElement("img");
    this.cardImage.className = "card-img-top img-thumbnail";
    this.cardImage.style.cursor = "pointer";
    this.cardImage.setAttribute("src", src);
    this.card.appendChild(this.cardImage);

    return this;
  }

  addCardBody() {
    this.cardBody = document.createElement("div");
    this.cardBody.className = "card-body";
    this.card.appendChild(this.cardBody);

    return this;
  }

  addCardTitle(title) {
    if (!this.cardBody) {
      this.addCardBody();
    }
    this.cardTitle = document.createElement("h5");
    this.cardTitle.textContent = title;

    this.cardBody.appendChild(this.cardTitle);
    return this;
  }

  addCardText(text) {
    if (!this.cardBody) {
      this.addCardBody();
    }
    this.cardText = document.createElement("p");
    this.cardText.textContent = text;

    this.cardBody.appendChild(this.cardText);

    return this;
  }

  attachData(data) {
    if (!this.cardImage) {
      return;
    }

    for (let key of Object.keys(data)) {
      this.cardImage.dataset[key] = data[key];
    }

    return this;
  }

  render() {
    return this.card;
  }
}

(async () => {
  const response = await ApiService.listUsers({
    page: 1,
  });

  const lead = document.querySelector(".lead");

  renderUserList(response);
  setCardListListener();

  // lead.innerHTML = `
  //     page = ${response.page} <br />
  //     per_page = ${response.per_page} <br />
  //     total = ${response.total} <br />
  //     total_pages = ${response.total_pages} <br />
  //   `;
})();
// IIFE

function getLoadMoreButton(dataSet) {
  const button = document.createElement("button");
  button.className = "btn btn-primary btn-block";
  button.textContent = "Load More";
  button.dataset.action = "loadmore";
  button.dataset.page = dataSet.page;
  button.dataset.totalPages = dataSet.totalPages;

  let options = {
    root: null,
    rootMargin: "20px",
    threshold: 1.0,
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const { target } = entry;

        let page = parseInt(target.dataset.page);
        const total_pages = parseInt(target.dataset.totalPages);

        if (page < total_pages) {
          page += 1;
          target.dataset.page = page;

          ApiService.listUsers({
            page: page,
          }).then((response) => {
            renderUserList(response);
            target.remove();
          });
        }
      }
    });
  };
  let observer = new IntersectionObserver(callback, options);

  observer.observe(button);
  return button;
}

function renderUserList(response) {
  console.log(response, 'response');
  const cardList = document.getElementById("cardList");
  response.forEach((country) => {
    const card = new CardBuilder();
    card
      .addCardTitle(`${country.name} - ${country.region}`)
      .addImage(country.flag)
      .addCardText(country.capital)
      .attachData({
        userId: country.id,
        email: country.email,
      });

    cardList.appendChild(card.render());
  });

  if (response.page < response.total_pages) {
    cardList.appendChild(
      getLoadMoreButton({
        page: response.page,
        totalPages: response.total_pages,
      })
    );
  }
}

function setCardListListener() {
  const cardList = document.getElementById("cardList");

  cardList.addEventListener("click", async ({ target }) => {
    if (target.tagName.toLowerCase().match("img")) {
      const userId = target.dataset.userId;
      if (userId) {
        StorageService.store(CURRENT_USER_KEY, userId);
        naviageToProfile();
      }
    } else if (
      target.tagName.toLowerCase().match("button") &&
      target.dataset.action === "loadmore"
    ) {
      // let page = parseInt(target.dataset.page);
      // const total_pages = parseInt(target.dataset.totalPages);
      // if (page < total_pages) {
      //   page += 1;
      //   target.dataset.page = page;
      //   const response = await ApiService.listUsers({
      //     page: page,
      //   });
      //   renderUserList(response);
      //   target.remove();
      // }
    }
  });
}