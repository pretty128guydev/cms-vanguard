
export default async function handler(req, res) {
  try {
    const result = await someAsyncOperation();
    res.status(200).send({ result });
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" });
  }
}

// Mock function for someAsyncOperation
async function someAsyncOperation() {
  return "Hello, World!";
}
