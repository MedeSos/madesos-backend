
import jwt from "jsonwebtoken";
const auth = (req, res, next) => {
  // Get auth header authorization value
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  
  // Verify token
  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    // forbidden if not exists
    if (err) return res.status(403).json({ message: "forbidden" });
    req.user = payload;
    next();
  })
}
export default auth