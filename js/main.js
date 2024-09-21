document.addEventListener("DOMContentLoaded", (event) => {
    const weaponsContainer = document.querySelector('.weapons');
    const weaponWrappers = gsap.utils.toArray('.weapon-wrapper');

    weaponWrappers.forEach((weaponWrapper) => {
        const clone = weaponWrapper.cloneNode(true);
        weaponsContainer.appendChild(clone);
    });

    const weaponWidth = weaponWrappers[0].offsetWidth + parseFloat(gsap.getProperty(weaponWrappers[0], "marginRight"));
    const totalWidth = weaponWidth * weaponWrappers.length;

    gsap.set(weaponsContainer, { willChange: "transform", force3D: true });

    const loop = gsap.to(weaponsContainer, {
        x: `-=${totalWidth}`,
        duration: 10,
        ease: "none",
        repeat: -1,
        force3D: true,
        modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
        }
    });

    const allWeaponsWrappers = gsap.utils.toArray('.weapon-wrapper');

    allWeaponsWrappers.forEach(weaponWrapper => {
        const weapon = weaponWrapper.querySelector('.weapon');
        const weaponOn = weaponWrapper.querySelector('.weapon-on');

        weaponWrapper.addEventListener('mouseenter', () => {
            allWeaponsWrappers.forEach(wrapper => {
                const existingZoom = wrapper.querySelector('.zoom-image');
                if (existingZoom) existingZoom.remove();
            });

            gsap.to(loop, { timeScale: 0, duration: 0.5 });

            const zoomImage = document.createElement('div');
            zoomImage.classList.add('zoom-image');
            zoomImage.style.position = 'absolute';
            zoomImage.style.top = '15px';
            zoomImage.style.left = '15px';
            zoomImage.style.width = '38px';
            zoomImage.style.height = '38px';
            zoomImage.style.backgroundImage = 'url("images/zoom.png")';
            zoomImage.style.backgroundSize = 'contain';
            zoomImage.style.backgroundRepeat = 'no-repeat';
            zoomImage.style.pointerEvents = 'none';
            zoomImage.style.opacity = '0';
            zoomImage.style.transition = 'opacity 0.5s ease-in-out';

            weaponWrapper.appendChild(zoomImage);

            gsap.to(weapon, { opacity: 0, duration: 0 }, "-=");
            gsap.to([weaponOn, zoomImage], { opacity: 1, duration: 0.5 }, "-=");
        });

        weaponWrapper.addEventListener('mouseleave', () => {
            const zoomImage = weaponWrapper.querySelector('.zoom-image');

            gsap.to([weaponOn, zoomImage], {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    if (zoomImage) zoomImage.remove();
                }
            }, "-=");
            gsap.to(weapon, { opacity: 1, duration: 0.5 }, "-=");
            gsap.to(loop, { timeScale: 1, duration: 0.5 });
        });

        const overlay = document.getElementById('overlay');
        const fullImage = document.getElementById('fullImage');
        const closeBtn = document.getElementById('closeBtn');

        weaponOn.addEventListener('click', () => {
            const rect = weaponWrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;

            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);

            const totalArea = rect.width * rect.height;
            const visibleArea = Math.max(0, visibleWidth) * Math.max(0, visibleHeight);

            const visiblePercentage = (visibleArea / totalArea) * 100;

            if (visiblePercentage >= 65) {
                overlay.classList.remove('hidden');
                fullImage.src = weaponOn.src;

                // Pause the marquee
                loop.pause();
            }
        });


        closeBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');

            loop.resume();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');

                loop.resume();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
                overlay.classList.add('hidden');

                loop.resume();
            }
        });

    });
});
