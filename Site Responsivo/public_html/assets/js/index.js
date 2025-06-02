// Ticker Carousel Infinito

document.addEventListener("DOMContentLoaded", () => {
    const tickerList = document.querySelector(".ticker-list");
    const tickerWrapper = document.querySelector(".ticker");

    const listWidth = tickerList.scrollWidth;
    const wrapperWidth = tickerWrapper.offsetWidth;

    const totalDistance = listWidth + wrapperWidth;
    const speed = 125; // pixels por segundo

    const duration = totalDistance / speed; // segundos

    tickerList.style.animationDuration = `${duration}s`;
});