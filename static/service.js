if ('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker.register("/sw.min.js");
        console.log("SW registered");
    } catch (err) {
        console.log(err);
    }
}