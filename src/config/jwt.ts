const jwt = {
  secret: process.env.JWT_SECRET,
  tokenTTL: process.env.JWT_TTL,
  refreshTokenTTL: process.env.JWT_REFRESH_TTL,
}

export default jwt;
