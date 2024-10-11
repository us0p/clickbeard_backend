import jose from "node-jose";
import { writeFile, readdir } from "fs/promises";

const startKeyStore = async () => {
    try {
        const files = await readdir("./");

        if (!files.includes("keys.json")) {
            const keyStore = jose.JWK.createKeyStore();

            await keyStore.generate("oct", 256, { use: "enc" });

            await writeFile(
                "keys.json",
                JSON.stringify(keyStore.toJSON(true), null, "  ")
            );

            return;
        }
    } catch (error) {
        console.log({ error });
        return;
    }
};

export default startKeyStore;
