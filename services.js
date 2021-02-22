window.USER_TOKEN_KEY = "application:user_token";
window.CURRENT_USER_KEY = "application:current_user";

class API {
  baseUrl = "https://reqres.in/api";
  countryUrl = "https://restcountries.eu/rest/v2"; // countriesUrl
  countUrl = "https://restcountries.eu/rest/v2/name"
  // TODO implement static method

  constructor() {
    this.userToken = localStorage.getItem(window.USER_TOKEN_KEY);
  }

  setUserId(userId) {
    this.userId = userId;
  }

  setUserToken(userToken) {
    this.userToken = userToken;
  }

  async fetchRequest(params, options = {}) { // erti - qveknis saxelit wamogeba
    console.log(params, options)
    try {
      const res = await fetch(`https://reqres.in/api/login`, options)
      // const res = await fetch(`${this.countUrl}/Georgia`);
      const result = await res.json();
      console.log(result, 'result');

      return result;
    } catch (err) {
      console.error("[API.login]", err);
      return;
    }
  }

  // async getCountry() {
  //   try {
  //     const res = await fetch(`${this.countUrl}/Georgia`);
  //     const result = await res.json();
  //     console.log(result, 'result');

  //     return result;
  //   } catch (err) {
  //     console.error("[API.login]", err);
  //     return;
  //   }
  // }

  async login(data) {
    try {
      const request = this.buildRequest("login", data);
      const result = await this.fetchRequest(request.params, request.options);

      return result;
    } catch (err) {
      console.error("[API.login]", err);
    }
  }

  async signUp(regData) {
    try {
      const request = this.buildRequest("register", regData);
      const newUser = await this.fetchRequest(request.params, request.options);
      return newUser;
    } catch (err) {}
  }

  async listUsers(query) { // kvela qveknis wamogeba 
    const res = await fetch(`${this.countryUrl}/all`);
    const result = await res.json();
    console.log(result, 'result');

    return result;
  }

  async getUser(country) {
    console.log('Entered', country)
    const res = await fetch(`${this.countUrl}/Georgia`);
    const result = await res.json();
    console.log(result, 'result');
    return result;
    // if (this.userToken && this.userId) {
    //   try {
    //     const request = this.buildRequest("getUser", {
    //       userId: this.userId,
    //     });

    //     const response = await this.fetchRequest(
    //       request.params,
    //       request.options
    //     );
    //     return response;
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
  }

  async listResources(query) {
    const res = await fetch(`${this.countUrl}/Turkey`);
    const result = await res.json();
    console.log(result, 'result');
    return result;
    // if (this.userToken && this.userId) {
    //   try {
    //     const request = this.buildRequest("listResources", query);

    //     const response = await this.fetchRequest(
    //       request.params,
    //       request.options
    //     );
    //     return response;
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
  }

  buildRequest(action, data) {
    console.log('data', data)
    const params = {
      endpoint: "",
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    };

    if (action === "login") {
      params.endpoint = "/login";
    } else if (action === "register") {
      params.endpoint = "/register";
    } else if (action === "listUsers") {
      params.endpoint = "/users";
      options.method = "GET";
      options.headers["Authorization"] = `Bearer ${this.userToken}`;
      params.endpoint += `?page=${data.page}`;
    } else if (action === "getUser") {
      params.endpoint = `/users/${data.userId}`;
      options.method = "GET";
      options.headers.Authorization = `Bearer ${this.userToken}`;
    } else if (action === "listResources") {
      params.endpoint = "/unknown";
      options.method = "GET";
      if (data && data.page) {
        params.endpoint += `?page=${data.page}`;
      }
    }

    if (data && options.method !== "GET") {
      options.body = this.stringify(data);
    }

    return {
      params,
      options,
    };
  }

  stringify(data) {
    return JSON.stringify(data);
  }

}

class Storage {
  constructor() {
    this.storage = localStorage;
  }
  store(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }
  read(key) {
    return JSON.parse(this.storage.getItem(key));
  }
  delete(key) {
    this.storage.removeItem(key);
  }
  clear() {
    this.storage.clear();
  }
}

class Pagination {
  page = 0;
  perPage = 0;
  total = 0;
  totalPages = 0;
  parentNode = null;

  classDisabled = "disabled";
  classPageItem = "page-item";
  classPageLink = "page-link";
  classPagination = "pagination pagination-lg";

  nextLinkText = "Next";
  prevLinkText = "Previous";

  paginationEl = null;

  listener = null;

  /**
   *
   * @pagerData { Object }
   * @property page: number = 1
   * @property perPage: number = 6
   * @property total: number =
   * @property totalPages: number
   */
  constructor({
    page = 1,
    per_page: perPage = 6,
    total = 0,
    total_pages: totalPages = 0,
  }) {
    this.page = page;
    this.perPage = perPage;
    this.total = total;
    this.totalPages = totalPages;

    this.paginationEl = this.createElement("ul", this.classPagination);
  }

  appendTo(rootEl) {
    this.parentNode = rootEl;
    return this;
  }

  createElement(tagName, className) {
    const el = document.createElement(tagName);
    el.className = className;
    return el;
  }

  createPageItem() {
    const item = this.createElement("li", this.classPageItem);
    return item;
  }
  createPageLink(text) {
    const link = this.createElement("a", this.classPageLink);
    link.setAttribute("href", "#");
    link.textContent = text;
    return link;
  }

  getLinks() {
    const links = [];
    const prevLi = this.createPageItem();
    const prevLink = this.createPageLink(this.prevLinkText);
    prevLink.dataset.page = -1;
    prevLink.dataset.action = "previous";

    prevLi.appendChild(prevLink);
    links.push(prevLi);

    for (let i = 1; i <= this.totalPages; i++) {
      const pItem = this.createPageItem();
      const aItem = this.createPageLink(i);
      if (i === this.page) {
        pItem.classList.add(this.classDisabled);
      }

      aItem.dataset.page = i;
      aItem.dataset.action = "page";

      pItem.appendChild(aItem);
      links.push(pItem);
    }

    const nextLi = this.createPageItem();
    const nextLink = this.createPageLink(this.nextLinkText);
    nextLink.dataset.page = 1;
    nextLink.dataset.action = "next";
    nextLi.appendChild(nextLink);
    links.push(nextLi);

    if (this.page === 1) {
      prevLi.classList.add(this.classDisabled);
    } else if (this.page === this.totalPages) {
      nextLi.classList.add(this.classDisabled);
    }

    return links;
  }

  handlePageChange = (event) => {
    event.preventDefault();
    const { target } = event;
    const { page, action } = target.dataset;
    if (!!page && !!action) {
      switch (action) {
        case "next":
        case "previous":
          this.page += parseInt(page);
          break;
        case "page":
          this.page = parseInt(page);
          break;
        default:
          return;
      }
    }
    this.render();
    this.listener({
      page: this.page,
      action,
    });
  };

  initEvents() {
    this.paginationEl.addEventListener("click", this.handlePageChange);
  }

  listen(callback) {
    this.listener = callback;
  }

  render() {
    this.paginationEl.innerHTML = null;
    const links = this.getLinks();
    links.forEach((li) => this.paginationEl.appendChild(li));

    this.parentNode.appendChild(this.paginationEl);
    this.initEvents();
  }
}

function protectedRoute() {
  const userToken = StorageService.read(window.USER_TOKEN_KEY);

  if (!userToken) {
    naviageToIndex();
  }
}

function naviageToIndex() {
  location.replace("index.html");
}

function navigateToDashboard(token) {
  StorageService.store(window.USER_TOKEN_KEY, token);
  location.replace("dashboard.html");
}

function naviageToProfile() {
  location.replace("profile.html");
}

window.ApiService = new API();
window.StorageService = new Storage();