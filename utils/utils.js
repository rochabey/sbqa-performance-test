// Function to generate a UUIDv4
export function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// Custom UTF-8 encoding function
export function utf8Encode(str) {
    const utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        if (charCode < 0x80) utf8.push(charCode);
        else if (charCode < 0x800) {
            utf8.push(0xc0 | (charCode >> 6));
            utf8.push(0x80 | (charCode & 0x3f));
        } else if (charCode < 0x10000) {
            utf8.push(0xe0 | (charCode >> 12));
            utf8.push(0x80 | ((charCode >> 6) & 0x3f));
            utf8.push(0x80 | (charCode & 0x3f));
        } else {
            utf8.push(0xf0 | (charCode >> 18));
            utf8.push(0x80 | ((charCode >> 12) & 0x3f));
            utf8.push(0x80 | ((charCode >> 6) & 0x3f));
            utf8.push(0x80 | (charCode & 0x3f));
        }
    }
    return utf8;
}

// Custom Base64 encoding function
export function encodeBase64(byteArray) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let encoded = '';
    let i = 0;

    while (i < byteArray.length) {
        const b1 = byteArray[i++];
        const b2 = byteArray[i++];
        const b3 = byteArray[i++];

        const e1 = b1 >> 2;
        const e2 = ((b1 & 3) << 4) | (b2 >> 4);
        const e3 = ((b2 & 15) << 2) | (b3 >> 6);
        const e4 = b3 & 63;

        if (isNaN(b2)) {
            encoded += chars.charAt(e1) + chars.charAt(e2) + '==';
        } else if (isNaN(b3)) {
            encoded += chars.charAt(e1) + chars.charAt(e2) + chars.charAt(e3) + '=';
        } else {
            encoded += chars.charAt(e1) + chars.charAt(e2) + chars.charAt(e3) + chars.charAt(e4);
        }
    }

    return encoded;
}

// Function to convert a database ID to a GraphQL ID with Base64 encoding
export function toGraphqlId(databaseId, prefix) {
    const str = `${prefix}:${databaseId}`;
    const utf8Bytes = utf8Encode(str); // Convert string to UTF-8 byte array
    return encodeBase64(utf8Bytes);    // Encode to Base64
}