array = [];
function fetchData() {
    return new Promise((resolve, reject) => {
      fetch('/fetch-products')
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => fetch('/get-products'))
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(productsArray => {
          array = productsArray;
          ucitano = true;
          resolve(array);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  