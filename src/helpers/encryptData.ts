import { readFile } from "fs/promises";
import jose from "node-jose";

const encryptData = async (data: string) => {
    try {
        const keyStoreFile = await readFile("keys.json");
        const keyStore = await jose.JWK.asKeyStore(keyStoreFile.toString());
        const [key] = keyStore.all();

        const encryptedData = await jose.JWE.createEncrypt(
            { format: "compact" },
            key
        )
            .update(data)
            .final();

        return encryptedData;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export default encryptData;
