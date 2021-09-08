const definitions = {
  API_REQUEST_HEADERS: {
    Authorization: `Token ${process.env.ACCESS_TOKEN}`,
  },
  API_SERVER: process.env.API_SERVER,
  SEGMENT_NAME: process.env.NEXT_PUBLIC_SEGMENT_NAME,
  SEGMENT_NAME_PLURAL: process.env.NEXT_PUBLIC_SEGMENT_NAME_PLURAL,
};

export { definitions };
