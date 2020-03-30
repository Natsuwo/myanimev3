if ('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker.register("/dist/sw.min.js", { scope: '/dist/' });
        console.log("SW registered");
    } catch (err) {
        console.log(err);
    }
}