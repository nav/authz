const definitions = {
  API_REQUEST_HEADERS: {
    Authorization: `Token ${process.env.ACCESS_TOKEN}`,
  },
  API_SERVER: process.env.API_SERVER || "http://localhost:3000",
  SEGMENT_NAME: process.env.NEXT_PUBLIC_SEGMENT_NAME || "Segment",
  SEGMENT_NAME_PLURAL:
    process.env.NEXT_PUBLIC_SEGMENT_NAME_PLURAL || "Segments",
};

export { definitions };
