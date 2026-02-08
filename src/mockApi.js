export function mockSubmit(payload) {
  return new Promise((resolve, reject) => {
    const random = Math.random();

    // delayed success
    if (random < 0.3) {
      setTimeout(() => {
        resolve({ status: 200, data: payload });
      }, 5000 + Math.random() * 5000);
    }
    // temporary failure
    else if (random < 0.6) {
      setTimeout(() => {
        reject({ status: 503 });
      }, 1000);
    }
    // immediate success
    else {
      setTimeout(() => {
        resolve({ status: 200, data: payload });
      }, 1000);
    }
  });
}
