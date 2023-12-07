// randomly generates a number between the range of low and high
function getRandom(low: number = 1, high: number = 10) {
    let randomNumber: number;
    // calculate random number
    randomNumber = Math.round(Math.random() * (high - low)) + low;
    // returning value
    return randomNumber;
}

function addKey(functionToCall: Function, myKeyCode: string = "Enter") {
    // this example exposes issue with scoping and event handlers and how it is solved with arrow function

    // wire up event listener
    document.addEventListener("keydown", (e: KeyboardEvent) => {
        // is the key released the provided key? Check keyCode via Event object
        if (e.code === myKeyCode) {
            // pressing the enter key will force some browsers to refresh
            // this command stops the event from going further
            e.preventDefault();
            // call provided callback to do everything else that needs to be done
            functionToCall();
            // this also helps the event from propagating in some browsers
            return false;
        }
    });
}

async function getJSONData(retrieveScript: string, success?: Function, failure?: Function) {
    try {
        const response: Response = await fetch(retrieveScript);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: any = await response.json();

        if (success !== undefined) {
            success(data);
        }

        return data;
    } catch (error: any) {
        console.error(`>>> FETCH ERROR: ${error.message}`);
        if (failure !== undefined) {
            failure(error.message);
        }
        return null;
    }
}

function sendJSONData(sendURL: string, sendJSON: any, success: Function, failure: Function, debug: boolean = false) {
    fetch(sendURL,
        {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(sendJSON)
        })
        .then((response: Response) => response.text())
        .then((responseText: string) => success(responseText))
        .catch((error: Error) => {
            failure(error);
            if (debug) throw error;
        });
}

export { getRandom, addKey, getJSONData, sendJSONData };