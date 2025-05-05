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

export async function translateWord(word) {
    try {
        const res = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: word,
                source: "ko",
                target: "en",
                format: "text"
            })
        });

        if (!res.ok) throw new Error("Translation failed.");
        const data = await res.json();
        return data.translatedText;
    } catch (err) {
        console.error("Translate Error:", err);
        return "Translation unavailable";
    }
}