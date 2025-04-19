// Trong một module khác
import instance from './axios-customize';

// ...

const someApiPath = `/some/endpoint`;
const fullApiPath = instance.defaults.baseURL + someApiPath;
console.log(fullApiPath); // Output: /api/landinvest/some/endpoint