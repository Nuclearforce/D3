const carsJSON = `[
  {
    "year": 2000,
    "make": "Honda",
    "model": "Accord",
    "price": 2800
  },
  {
    "make": "Nissan",
    "model": "Leaf",
    "year": 2012,
    "price": 1800
  },
  {
    "make": "Ford",
    "model": "F150",
    "year": 2009,
    "price": 1950
  },
  {
    "make": "Chevrolet",
    "model": "Trailblazer",
    "year": 2009,
    "price": 1550
  },
  {
    "make": "Honda",
    "model": "Pilot",
    "year": 2003,
    "price": 2200
  }
]`;
const cars = JSON.parse(carsJSON);

export const getCars = () => new Promise(resolve => {
  setTimeout(() => resolve(cars), 2000);
});