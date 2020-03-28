if ('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker.register("/sw.js", { scope: './' });
        console.log("SW registered");
    } catch (err) {
        console.log(err);
    }
}