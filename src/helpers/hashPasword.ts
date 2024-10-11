import { createHmac } from "crypto";

const hashData = (targetData: string): string => {
    if (targetData.length > 0) {
        return createHmac("sha256", process.env.HASH_SCRT!)
            .update(targetData)
            .digest("hex");
    } else {
        return "";
    }
};

export default hashData;
