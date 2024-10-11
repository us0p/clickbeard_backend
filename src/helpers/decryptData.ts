import { readFile } from "fs/promises";
import jose from "node-jose";

const decryptData = async (data: string) => {
    try {
        const keyStoreFile = await readFile("keys.json");
        const keyStore = await jose.JWK.asKeyStore(keyStoreFile.toString());
        const [key] = keyStore.all();

        const decryptedData = await jose.JWE.createDecrypt(key).decrypt(data);

        return decryptedData.payload.toString();
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export default decryptData;
