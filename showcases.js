document.querySelectorAll('.showcases').forEach((strip) => {
    const wrap = document.createElement('div');
    wrap.className = 'showcases-wrap';
    strip.parentNode.insertBefore(wrap, strip);
    wrap.appendChild(strip);
 
    const bar = document.createElement('div');
    bar.className = 'scrollbar';
    bar.innerHTML = '<div class="scrollbar-thumb"></div>';
    wrap.appendChild(bar);
    const thumb = bar.firstChild;
 
    const update = () => {
        const trackW = bar.clientWidth || strip.clientWidth;
        const thumbW = Math.max(30, trackW * strip.clientWidth / strip.scrollWidth);  // thumb size from the strip's real width
        bar.style.display = strip.scrollWidth > strip.clientWidth ? 'block' : 'none';
        const maxScroll = (strip.scrollWidth - strip.clientWidth) || 1;
        const ratio = Math.min(Math.max(strip.scrollLeft / maxScroll, 0), 1);  // clamp 0.1 so it never leaves the track
        thumb.style.width = thumbW + 'px';
        thumb.style.transform = `translateX(${ratio * (trackW - thumbW)}px)`;
    };
 
    let timer, touching = false;
    const show = () => { bar.classList.remove('idle'); clearTimeout(timer); };
    const hideLater = () => {
        clearTimeout(timer);
        if (!touching) timer = setTimeout(() => bar.classList.add('idle'), 750);  // Time to fade out
    };
    strip.addEventListener('scroll', () => { update(); show(); hideLater(); });
    strip.addEventListener('touchstart', () => { touching = true; show(); }, { passive: true });
    strip.addEventListener('touchend',    () => { touching = false; hideLater(); });
    strip.addEventListener('touchcancel', () => { touching = false; hideLater(); });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);  // images loaded, real width known
    update();
    hideLater();   // will fade first, appears when first touch
});