//creates a currencyFormatter using the Intl.NumberFormat constructor in JavaScript. The Intl.NumberFormat object is part of the Internationalization API and allows you to format numbers in a way that is sensitive to locale and style preferences, such as currencies, percentages, and decimals.
// Intl -> global object, NumberFormat -> global object inside of Intl.
//global object ->In JavaScript, a global object is an object that is available in every part of your code, regardless of where you are in the execution context (e.g., within a function, loop, or block). You don’t need to explicitly create or import it to use it
export const currencyFormatter = new Intl.NumberFormat('en-US', { //Intl.NumberFormat: This is the constructor used to create a number formatting object.
    style: 'currency',
    currency: 'USD',
});