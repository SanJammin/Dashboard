export function getRandomWordFromFile(filepath = "./data/ko_50k.txt") {
    return fetch(filepath)
        .then(res => res.text())
        .then(text => {
            const words = text.trim().split("\n").map(line => line.split(" ")[0]);
            return words[Math.floor(Math.random() * words.length)];
        });
}

export function fetchXMLDefinition(word, API_KEY) {
    const url = `https://krdict.korean.go.kr/api/search?key=${API_KEY}&q=${encodeURIComponent(word)}`;
    return fetch(url)
        .then(res => res.text())
        .then(str => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "application/xml");
            const definitionNode = xml.querySelector("definition");
            return definitionNode ? definitionNode.textContent : null;
        });
}

export async function translateWord(word, AZURE_KEY, AZURE_REGION, AZURE_ENDPOINT) {
    const url = `${AZURE_ENDPOINT}/translate?api-version=3.0&from=ko&to=en`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": AZURE_KEY,
                "Ocp-Apim-Subscription-Region": AZURE_REGION,
                "Content-Type": "application/json"
            },
            body: JSON.stringify([{ Text: word }])
        });

        if (!res.ok) throw new Error(`Translation failed with status ${res.status}`);
        const data = await res.json();
        return data[0]?.translations[0].text || "Translation unavailable";
    } catch (err) {
        console.error("Translate Error:", err);
        return "Translation unavailable";
    }
}