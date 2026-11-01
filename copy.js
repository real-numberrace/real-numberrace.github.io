document.querySelectorAll('.code-block-wrapper').forEach((wrapper) => {
    const button = wrapper.querySelector('.copy-btn');
    const code = wrapper.querySelector('code');
 
    button.addEventListener('click', async () => {
        const textToCopy = code.innerText;
        try {
            await navigator.clipboard.writeText(textToCopy);
            button.classList.add('success');  // Green checkmark for 2s
            setTimeout(() => {
                button.classList.remove('success');
            }, 2000);
        } catch (err) {
            console.error('Clipboard runtime write failed: ', err);
        }
    });
});

document.querySelectorAll('.code-block-wrapper').forEach((wrapper) => {
    const pre = wrapper.querySelector('pre');
    const bar = document.createElement('div');
    bar.className = 'scrollbar';
    bar.innerHTML = '<div class="scrollbar-thumb"></div>';
    wrapper.appendChild(bar);
    const thumb = bar.firstChild;

    let timer;
    let touching = false;

    const update = () => {
        const w = pre.clientWidth, total = pre.scrollWidth;
        bar.style.display = total > w ? 'block' : 'none';
        bar.style.left = pre.offsetLeft + 'px';
        bar.style.width = w + 'px';
        const thumbW = w * w / total;
        const maxScroll = total - w || 1;
        thumb.style.width = thumbW + 'px';
        thumb.style.transform = `translateX(${pre.scrollLeft / maxScroll * (w - thumbW)}px)`;
    };

    const show = () => { bar.classList.remove('idle'); clearTimeout(timer); };
    const hideLater = () => {
        clearTimeout(timer);
        if (!touching) timer = setTimeout(() => bar.classList.add('idle'), 750);  // Time to fade out
    };

    pre.addEventListener('scroll', () => { update(); show(); hideLater(); });
    pre.addEventListener('touchstart', () => { touching = true; show(); }, { passive: true });
    pre.addEventListener('touchend',    () => { touching = false; hideLater(); });
    pre.addEventListener('touchcancel', () => { touching = false; hideLater(); });
    pre.addEventListener('mouseenter', show);
    pre.addEventListener('mouseleave', hideLater);
    window.addEventListener('resize', update);
    update();
    hideLater();
});