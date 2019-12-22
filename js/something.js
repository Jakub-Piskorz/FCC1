const checkCashRegister = (price, cash, cid) => {

  if (typeof price === "string") price = JSON.parse(price);
  if (typeof cash === "string") cash = JSON.parse(cash);
  if (typeof cid === "string") cid = JSON.parse(cid);
  console.log(price, cash, cid);

  //declaring useful variables and functions for later use
  let change = [["PENNY", 0], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];
  const currency = [0.01, 0.05, 0.1, 0.25, 1, 5, 10, 20, 100];
  let toGive = cash-price;
  let error = 1;
  let stall = false;
  const fixNumbers = () => {
    cid.map((x, i) => {cid[i][1] = cid[i][1].toFixed(4)*1});
    change.map((x, i) => {change[i][1] = change[i][1].toFixed(4)*1});
    toGive = toGive.toFixed(4)*1;
  };
  const sum = arr => arr.reduce((x,y) => x+y[1], 0).toFixed(4)*1;
  const giveChange = i => {
    if (toGive>=currency[i] && cid[i][1]>=currency[i]) {
      toGive-=currency[i];
      cid[i][1]-=currency[i];
      change[i][1]+=currency[i];
      stall = false;
      }
  }

  if (toGive<0 || toGive>sum(cid)) return {status: "INSUFFICIENT_FUNDS", change: []};
  while (toGive>0 && error<100 && !stall) {
    stall = true;
    for (let i=8; i>=0; i--) if (!stall) break; else giveChange(i);
    fixNumbers();
    error++;
  }

  let output = (toGive>0) ? {
    status: "INSUFFICIENT_FUNDS", change: []
    } : (sum(cid)===0) ? {
        status: "CLOSED", change: change
      } : {
        status: "OPEN", change: change
        .map((a,i) => change[change.length-i-1])
        .filter((x, i) => x[1]>0)
      }
  document.querySelector('#output').innerHTML = JSON.stringify(output);
  return output;
}