import jwt from "jsonwebtoken";
import config from "config";

export default function(req: any, res: any, next: any) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    try {
        const decoded: any = jwt.verify(token, config.get("jwtSecret"));
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Token is invalid, authorization denied" });
    }
}
