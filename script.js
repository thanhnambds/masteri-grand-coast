document.addEventListener('DOMContentLoaded', () => {
    // Sticky Header & Back to Top visibility
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        // Sticky Header logic
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to Top button visibility (hiện khi qua Hero section)
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    // Back to Top click logic
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });
        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('open');
            });
        });
    }

    // Mặt Bằng Lightbox
    const matBangImg = document.getElementById('mat-bang-img');
    const lightbox = document.getElementById('mb-lightbox');
    if (matBangImg && lightbox) {
        matBangImg.parentElement.addEventListener('click', () => {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Swiper Initiation for Amenities
    if(typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.amenitiesSwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            pagination: {
                el: '.am-pagination',
                type: 'fraction',
                formatFractionCurrent: function (number) {
                    return number;
                },
                formatFractionTotal: function (number) {
                    return number;
                }
            },
            navigation: {
                nextEl: '.am-nav-next',
                prevEl: '.am-nav-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 25,
                },
            }
        });
    }

    // Counter Animation Logic
    const counters = document.querySelectorAll('.counter');
    const countOptions = {
        threshold: 0.5,
        rootMargin: "0px 0px -50px 0px"
    };

    const countOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const isFloat = counter.getAttribute('data-target').includes('.');
                let count = 0;
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function: easeOutExpo
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                    const currentCount = easeProgress * target;

                    if (isFloat) {
                        counter.innerText = currentCount.toFixed(1);
                    } else {
                        counter.innerText = Math.floor(currentCount);
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target;
                    }
                };

                requestAnimationFrame(updateCount);
                observer.unobserve(counter);
            }
        });
    }, countOptions);

    counters.forEach(counter => {
        countOnScroll.observe(counter);
    });

    // Simple smooth scrolling for anchor links matching URL hashes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // compensate for sticky header
                    behavior: 'smooth'
                });
            }
        });
    });
    // --- FORM DATABASE INTEGRATION (GOOGLE SHEETS) ---
    // Anh hãy thay link 'SECRET_URL' bên dưới bằng link Web App sau khi Deploy Apps Script
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxFnycpCYaWPYp9k12I_8mjM5Izc-rMWoGNFPp8Zl28Uh9VVI1tc84N1Tuo-zotm0Zw/exec';
    const PDF_LINK = 'https://drive.google.com/file/d/1q4ccXmHxmcDVb5oiYNbzJncmvSKPkqXq/view';

    const validatePhone = (phone) => {
        const vnPhoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        return vnPhoneRegex.test(phone.replace(/\s/g, ''));
    };

    const handleFormSubmit = async (formElement) => {
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        try {
            const formData = new FormData(formElement);
            
            // Honeypot check
            if (formData.get('website')) {
                console.log('Bot detected');
                return; // Silently ignore
            }

            // Client-side validation
            const phone = formData.get('phone');
            if (phone && !validatePhone(phone)) {
                alert('Vui lòng nhập số điện thoại hợp lệ (VD: 0965325555)');
                return;
            }

            // Trạng thái đang gửi
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';

            const params = new URLSearchParams();
            formData.forEach((value, key) => {
                if (key !== 'website') { // Don't send honeypot field
                    params.append(key, value);
                }
            });

            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString()
            });

            // Sau khi gửi thành công, chuyển đổi giao diện thay vì mở tự động (tránh chặn popup trên Mobile)
            formElement.style.display = 'none';

            // Tìm container chứa text tiêu đề để ẩn nếu là Hero/CTA
            const ctaText = formElement.parentElement.querySelector('.cta-text');
            if(ctaText) ctaText.style.display = 'none';
            const heroTitle = formElement.parentElement.querySelector('.hero-cta-title');
            if(heroTitle) heroTitle.style.display = 'none';
            const heroSub = formElement.parentElement.querySelector('.hero-sub-headline');
            if(heroSub) heroSub.style.display = 'none';

            // --- CRM INTEGRATION ---
            const CRM_STORAGE_KEY = 'crm_realty_data';
            let existingData = JSON.parse(localStorage.getItem(CRM_STORAGE_KEY)) || [];
            if (!Array.isArray(existingData)) existingData = [];
            
            const newId = existingData.length > 0 ? Math.max(...existingData.map(c => c.id)) + 1 : 1;
            
            const newLead = {
                id: newId,
                name: formData.get('fullname') || 'Khách đăng ký',
                phone: formData.get('phone') || '',
                email: '', 
                project: 'Grand Coast',
                status: 'Mới',
                note: `Đăng ký từ Landing Page Masteri Grand Coast`,
                date: new Date().toISOString().split('T')[0]
            };
            
            console.log('--- DỮ LIỆU GỬI SANG CRM ---');
            console.table(newLead);
            
            existingData.push(newLead);
            localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(existingData));
            console.log('✅ Lead đã được lưu vào LocalStorage (Key: crm_realty_data)');

            // Hiện Success State và set link PDF
            const successDiv = formElement.parentElement.querySelector('.form-success');
            if(successDiv) {
                successDiv.style.display = 'block';
                const pdfBtn = successDiv.querySelector('a[href="#pdf-link"]');
                if (pdfBtn) {
                    pdfBtn.href = PDF_LINK;
                }
            }

        } catch (error) {
            console.error('Lỗi khi gửi form:', error);
            // backup alert nếu URL chưa cấu hình hoặc lỗi mạng
            alert('Cảm ơn anh/chị. Thông tin đăng ký đã được ghi nhận vào hệ thống tạm thời!');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    };

    const heroForm = document.getElementById('hero-form');
    const footerForm = document.getElementById('footer-form');

    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(heroForm);
        });
    }

    if (footerForm) {
        footerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(footerForm);
        });
    }

    // --- AUTO POPUP ---
    const autoPopup = document.getElementById('autoPopup');
    const popupClose = document.getElementById('popupClose');
    let popupShown = false;

    const showPopup = () => {
        if (popupShown) return;
        if (sessionStorage.getItem('popupDismissed')) return;
        autoPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        popupShown = true;
    };

    const closePopup = () => {
        autoPopup.style.display = 'none';
        document.body.style.overflow = '';
        sessionStorage.setItem('popupDismissed', '1');
    };

    if (autoPopup) {
        // Hiện popup khi cuộn qua 50% chiều cao trang
        window.addEventListener('scroll', () => {
            const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPct > 50) showPopup();
        }, { passive: true });

        // Đóng popup khi nhấn nút ×
        if (popupClose) popupClose.addEventListener('click', closePopup);

        // Đóng popup khi nhấn ra ngoài
        autoPopup.addEventListener('click', (e) => {
            if (e.target === autoPopup) closePopup();
        });

        // Xử lý popup form submit
        const popupForm = document.getElementById('popup-form');
        const popupSuccess = document.getElementById('popup-success');
        if (popupForm) {
            popupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = popupForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';

                const formData = new FormData(popupForm);
                const phone = formData.get('phone');

                if (phone && !validatePhone(phone)) {
                    alert('Vui lòng nhập số điện thoại hợp lệ (VD: 0965325555)');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    return;
                }

                const params = new URLSearchParams();
                params.append('phone', phone);
                params.append('form_origin', 'Auto Popup');

                try {
                    await fetch(SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: params.toString()
                    });

                    // --- CRM INTEGRATION ---
                    const CRM_STORAGE_KEY = 'crm_realty_data';
                    let existingData = JSON.parse(localStorage.getItem(CRM_STORAGE_KEY)) || [];
                    if (!Array.isArray(existingData)) existingData = [];
                    
                    const newId = existingData.length > 0 ? Math.max(...existingData.map(c => c.id)) + 1 : 1;
                    const newLead = {
                        id: newId,
                        name: 'Khách Popup',
                        phone: phone || '',
                        email: '', 
                        project: 'Grand Coast',
                        status: 'Mới',
                        note: `Đăng ký từ Auto Popup Masteri Grand Coast`,
                        date: new Date().toISOString().split('T')[0]
                    };
                    
                    console.log('--- DỮ LIỆU POPUP GỬI SANG CRM ---');
                    console.table(newLead);
                    
                    existingData.push(newLead);
                    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(existingData));
                    console.log('✅ Lead Popup đã được lưu vào LocalStorage');

                } catch (err) {
                    console.error('Popup form error:', err);
                }

                popupForm.style.display = 'none';
                if (popupSuccess) popupSuccess.style.display = 'block';
                setTimeout(closePopup, 3000);

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
        }
    }

    // --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const toggle = item.querySelector('.faq-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const icon = otherItem.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-plus';
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    const icon = item.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-minus';
                }
            });
        }
    });
});
