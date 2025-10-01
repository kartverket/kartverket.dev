export const post = async <RequestBody, ResponseBody>(
    url: URL,
    backstageToken: string,
    requestBody: RequestBody,
): Promise<ResponseBody> => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${backstageToken}`,
        },
        body: JSON.stringify(requestBody),
    })

    const result: ResponseBody =
        response.status === 204 ? await response.text() : await response.json()

    if (!response.ok) {
        switch (response.status) {
            case 401:
                throw new Error("Mangler autentisering. Vennligst logg inn.")
            case 403:
                throw new Error(
                    "Det ser ut som du ikke har tilgang til metrikker for denne ressursen.",
                )
            case 404:
                throw new Error("Vi fant ikke ressursen du leter etter.")
            case 500:
                throw new Error(
                    "Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.",
                )
            case 502:
                throw new Error(
                    "Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.",
                )
            case 503:
                throw new Error(
                    "Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.",
                )
            case 504:
                throw new Error(
                    "Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.",
                )
            default:
                throw new Error(
                    "Kunne ikke hente metrikker for denne ressursen på grunn av en ukjent feil.",
                )
        }
    }

    return result
}

export const get = async <ResponseBody>(
    url: URL,
    backstageToken: string,
    entraIdToken: string,
): Promise<ResponseBody> => {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${backstageToken}`,
            EntraId: entraIdToken,
        },
    })

    const result: ResponseBody = await response.json()

    if (!response.ok) {
        switch (response.status) {
            case 401:
                throw new Error("Mangler autentisering. Vennligst logg inn.")
            case 403:
                throw new Error(
                    "Det ser ut som du ikke har tilgang til metrikker for denne ressursen.",
                )
            case 404:
                throw new Error("Vi fant ikke ressursen du leter etter.")
            case 500:
                throw new Error(
                    "Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.",
                )
            case 502:
                throw new Error(
                    "Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.",
                )
            case 503:
                throw new Error(
                    "Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.",
                )
            case 504:
                throw new Error(
                    "Kunne ikke hente metrikker for denne ressursen på grunn av en server-feil.",
                )
            default:
                throw new Error(
                    "Kunne ikke hente metrikker for denne ressursen på grunn av en ukjent feil.",
                )
        }
    }

    return result
}
