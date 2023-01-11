async function displayTable(table: {
    titleRow: { [key: string]: string };
    data: { [key: string]: string | boolean | number }[];
}) {
    /**
     *
     * @param {string} content
     * @param {"green"|"red"} color
     */
    console.clear();
    const { titleRow, data } = table;
    const longestValues = Object.keys(titleRow).map((key) => {
        return Math.max(
            data
                // @ts-ignore
                .map((entry) => stringify[key](entry[key], true).length)
                .reduce((a, b) => Math.max(a, b), 0),
            titleRow[key].length
        );
    });

    const titleContent = Object.keys(titleRow)
        .map((key, index) => {
            const value = titleRow[key];
            const repeatCount = longestValues[index] - value.length;
            return `${value}${repeatCount > 0 ? " ".repeat(repeatCount) : ""}`;
        })
        .join(" | ");
    console.log(titleContent);
    console.log("=".repeat(titleContent.length));
    for (const entry of data) {
        const content = Object.keys(titleRow)
            .map((key, index) => {
                // @ts-ignore
                const value = stringify[key](entry[key], false);
                const repeatCount =
                    longestValues[index] -
                    // @ts-ignore
                    stringify[key](entry[key], true).length;
                return `${value}${
                    repeatCount > 0 ? " ".repeat(repeatCount) : ""
                }`;
            })
            .join(" | ");
        console.log(content);
    }
}
function colored(content: string, color: string) {
    return `\x1b[3${color === "green" ? "2" : "1"}m${content}\x1b[0m`;
}

function checkState(url: string, callback: (online: boolean) => void) {
    fetch(url)
        .then((res) => callback(res.ok))
        .catch((err) => callback(false));
}
function start(entry: {
    name?: string;
    online: any;
    lastUpdate: any;
    link: any;
}) {
    checkState(entry.link, (online) => {
        entry.online = online;
        entry.lastUpdate = new Date().getTime();
        displayTable(table);
        setTimeout(() => start(entry), Math.random() * 4000);
    });
}

const stringify = {
    name: (value: string, _lengthOnly: boolean) => value,
    online: (value: boolean, lengthOnly: boolean) => {
        if (lengthOnly) return value ? "Online" : "Offline";
        return value ? colored("Online", "green") : colored("Offline", "red");
    },
    lastUpdate: (value: number, lengthOnly: boolean) => {
        if (value == 0) return "-";
        const timePassed = Math.round((new Date().getTime() - value) / 1000);
        if (timePassed > 2 && !lengthOnly) {
            return colored(
                `${new Date(value).toLocaleTimeString()} - ${timePassed}s`,
                "red"
            );
        }
        return `${new Date(value).toLocaleTimeString()} - ${timePassed}s`;
    },
};

const urls = {
    google: "https://google.com",
    youtube: "https://youtube.com",
    wikipedia: "https://wikipedia.org",
    github: "https://github.com",
    microsoft: "https://microsoft.com",
    amazon: "https://amazon.com",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
};
let table = {
    titleRow: {
        name: "Ziel",
        online: "Status",
        lastUpdate: "Letzte Antwort",
    },
    data: Object.keys(urls).map((name: string) => ({
        name,
        online: false,
        lastUpdate: 0,
        // @ts-ignore
        link: urls[name],
    })),
};

for (const entry of table.data) {
    start(entry);
}
