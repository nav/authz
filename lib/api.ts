const fetcher = async (...args) => {
  const res = await fetch(...args, { credentials: "include" });

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export { fetcher };