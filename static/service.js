if ('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker.register("/sw.min.js?v=2");
        console.log("SW registered");
    } catch (err) {
        console.log(err);
    }
}