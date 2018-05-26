require('../css/styles.css');

console.log('I am in main');

const li = document.createElement('li');

const image = document.createElement('img');
image.className = 'restaurant-img';
image.src = 'test.jpg';
li.append(image);

const name = document.createElement('h1');
name.innerHTML = 'resto test 1';
li.append(name);

const neighborhood = document.createElement('p');
neighborhood.innerHTML = 'resto test 2';
li.append(neighborhood);

const address = document.createElement('p');
address.innerHTML = 'resto test 3';
li.append(address);

const more = document.createElement('a');
more.innerHTML = 'View Details';
li.append(more)