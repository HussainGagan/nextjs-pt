const faker = require("@faker-js/faker").faker;
console.log(faker.lorem.word());
console.log(faker.commerce.price({ min: 100, max: 2000 }));
console.log(faker.number.int({ min: 0, max: 15 }).toFixed(2));
console.log(faker.lorem.sentences());
console.log(faker.date.past({ years: 2 }));

const unique = new Set();

for (let i = 0; i < 25; i++) {
  let productName;
  do {
    productName = faker.commerce.product();
  } while (unique.has(productName));
  unique.add(productName);
}

console.log([...unique]);
