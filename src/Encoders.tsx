export class Encoders {

    /**
     * Returns an array of bytes as a hexadecimal string.
     */
    static ToHexa(arr) {
        return [...arr].map(v => v.toString(16).toUpperCase().padStart(2, "0")).join("");
    }


    /**
     * Returns a hexadecimal string as an array of bytes.
     *
     * @param str
     */
    static FromHexa(str : string) {
        if (str == null || typeof str !== "string" || !str.match(/^([\da-f]{2})*$/gi)) {
            throw new Error("Invalid hex format.");
        }
        const chars : string[] | null =  str.match(/../g);
        if (chars === null) {
            throw new Error("Invalid hex format.");
        }
        return new Uint8Array(
           chars.map(s => parseInt(s, 16))
        );
    }


    static ToUint8Array( bytes : Uint8Array | Array<number> ) : Uint8Array {
        if (bytes instanceof Array) {
            return Uint8Array.from(bytes)
        } else if (bytes instanceof Uint8Array) {
            return bytes
        } else {
            try {
                return new Uint8Array(Object.entries(bytes));
            } catch (e) {
                throw new Error(`[encoder] invalid type of bytes: expected either Uint8array or Array(number), got ${typeof bytes}`);
            }
        }
    }
}