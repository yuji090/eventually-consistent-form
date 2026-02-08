let counter = 0;

export function fetchPage() {
  const size = Math.floor(Math.random() * 10); // sometimes < 10

  const items = Array.from({ length: size }, () => ({
    id: Math.floor(Math.random() * 15), // overlapping IDs
    value: ++counter,
  }));

  return new Promise((res) =>
    setTimeout(() => res(items), 800)
  );
}
