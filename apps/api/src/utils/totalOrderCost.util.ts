/**
 * @desc The function counts the total amount of the order
 *
 * @param products {array} - products array
 */
export const totalOrderCost = (products: any) => {
  let sumCost = 0;
  products.map((item: any) => {
    sumCost += item.price * item.quantity;
  });
  return sumCost;
};

export default totalOrderCost;
