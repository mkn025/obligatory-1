self.onmessage = async (event) => {

    const { buffer } = event.data;


    try {

        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

        const hashBytes = new Uint8Array(hashBuffer);

        const hash = Array.from(hashBytes)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');

        self.postMessage({ "hash":hash });

    } catch (error) {

        self.postMessage({
            error: error.message
        });
    }
};
