$(document).ready(function () {
  // Initiate Scroll Reveal Activation
  $("html").addClass("js-active");

  // Language Interactivity (I18N)
  let preferredLang = localStorage.getItem("preferredLanguage");
  let currentLang = (preferredLang === "en" || preferredLang === "ar") ? preferredLang : "en";
  let activeStrengthKey = null;

  const strengthDetails = {
    "founder-strength-1": {
      icon: "fas fa-chart-line",
      en: {
        title: "Strategic Execution",
        desc: "Over 20 years of driving massive strategic programs from initial vision to precise ground-level operations in Dubai's most complex environments."
      },
      ar: {
        title: "التنفيذ الاستراتيجي",
        desc: "أكثر من 20 عاماً من قيادة البرامج الإستراتيجية الضخمة من الرؤية الأولية إلى العمليات الميدانية الدقيقة في بيئات دبي الأكثر تعقيداً."
      }
    },
    "founder-strength-2": {
      icon: "fas fa-sitemap",
      en: {
        title: "Performance Optimization",
        desc: "Deep experience in restructuring commercial entities and operations to scale yields, eliminate wastage, and drive long-term sustainability."
      },
      ar: {
        title: "تحسين الأداء",
        desc: "خبرة عميقة في إعادة هيكلة الكيانات التجارية والعمليات لزيادة العوائد، القضاء على الهدر، ودفع عجلة الاستدامة طويلة الأجل."
      }
    },
    "founder-strength-3": {
      icon: "fas fa-hotel",
      en: {
        title: "Real Estate Development",
        desc: "A proven track record in shaping premium residential and commercial spaces, bringing institutional rigor to luxury property assets."
      },
      ar: {
        title: "التطوير العقاري",
        desc: "سجل حافل في تصميم وتطوير المساحات السكنية والتجارية الفاخرة، مع إدخال معايير مؤسسية صارمة للأصول العقارية الراقية."
      }
    },
    "founder-strength-4": {
      icon: "fas fa-laptop-code",
      en: {
        title: "Digital Transformation",
        desc: "Shifting brick-and-mortar operations into smart, cloud-managed, and automated business systems that minimize manual friction."
      },
      ar: {
        title: "التحول الرقمي",
        desc: "تحويل العمليات التقليدية إلى أنظمة أعمال ذكية، مدارة سحابياً، ومؤتمتة بالكامل لتقليل الاحتكاك البشري والخطأ التشغيلي."
      }
    },
    "founder-strength-5": {
      icon: "fas fa-bus-simple",
      en: {
        title: "Mobility Systems",
        desc: "Instrumental in developing and managing highly complex transit and logistics infrastructures supporting Dubai's urban growth."
      },
      ar: {
        title: "أنظمة التنقل",
        desc: "المساهمة الفعالة في تطوير وإدارة البنية التحتية واللوجستية لأنظمة النقل المعقدة الداعمة للتوسع الحضري لإمارة دبي."
      }
    },
    "founder-strength-6": {
      icon: "fas fa-coins",
      en: {
        title: "Investment Structuring",
        desc: "Aligning private and institutional capital into highly protected, high-yield structured real estate investment models."
      },
      ar: {
        title: "هيكلة الاستثمار",
        desc: "توجيه وتنسيق رأس المال الخاص والمؤسسي نحو نماذج استثمارية عقارية مهيكلة، محمية بالكامل، ومدرة لعوائد مرتفعة."
      }
    },
    "founder-strength-7": {
      icon: "fas fa-award",
      en: {
        title: "Operational Standards",
        desc: "Instilling a hospitality-grade operational framework (Zimforth Services) that protects build quality and commands premium rent."
      },
      ar: {
        title: "المعايير التشغيلية",
        desc: "إرساء إطار عمل تشغيلي بمعايير الضيافة العالمية (خدمات زيمفورث) لحماية جودة المبنى وتحقيق قيم تأجيرية ممتازة."
      }
    }
  };

  const $html = $("html");
  const $bootstrapLink = $("#bootstrap-link");
  const $langToggle = $(".lang-toggle");

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("preferredLanguage", lang);

    // 1. Toggle HTML direction and lang
    if (lang === "ar") {
      $html.attr("dir", "rtl").attr("lang", "ar");
      $bootstrapLink.attr(
        "href",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css"
      );
      $("body").addClass("ar-font").removeClass("en-font");
    } else {
      $html.attr("dir", "ltr").attr("lang", "en");
      $bootstrapLink.attr(
        "href",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      );
      $("body").addClass("en-font").removeClass("ar-font");
    }

    // 2. Translate elements
    $("[data-i18n]").each(function () {
      const key = $(this).data("i18n");
      if (translations[lang] && translations[lang][key] !== undefined) {
        const valStr = String(translations[lang][key]);
        if ($(this).hasClass("allow-html") || valStr.includes("<") || valStr.includes("&copy;")) {
          $(this).html(valStr);
        } else {
          $(this).text(valStr);
        }
      }
    });

    // 3. Form Placeholders
    $("[data-i18n-placeholder]").each(function () {
      const key = $(this).data("i18n-placeholder");
      if (translations[lang] && translations[lang][key]) {
        $(this).attr("placeholder", translations[lang][key]);
      }
    });

    // 4. Recalculate and update sub-views
    updateCalculator();
    updateFloorPlanDetail($(".floor-plan-pill.active").data("part"));

    // 5. Dynamic Active Strength Translation
    if (activeStrengthKey && strengthDetails[activeStrengthKey]) {
      const info = strengthDetails[activeStrengthKey];
      const data = info[lang];
      $("#strength-desc-icon").attr("class", info.icon);
      $("#strength-desc-title").text(data.title);
      $("#strength-desc-text").text(data.desc);
    }
  }

  $langToggle.on("click", function (e) {
    e.preventDefault();
    const targetLang = currentLang === "en" ? "ar" : "en";
    $("body").animate({ opacity: 0.95 }, 100, function () {
      setLanguage(targetLang);
      $("body").animate({ opacity: 1 }, 150);
    });
  });

  // Language toggler hook is configured; initialization deferred to bottom of file


  // Sticky Glassmorphic Header
  const $nav = $(".navbar");
  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 50) {
      $nav.addClass("scrolled shadow-sm");
    } else {
      $nav.removeClass("scrolled shadow-sm");
    }
  });


  // Advanced Mouse Parallax & Spotlight Tracking
  const $heroSection = $("#home");
  if ($heroSection.length) {
    $heroSection.on("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // Update CSS variables inside requestAnimationFrame for maximum smoothness
      window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mouse-x", x.toFixed(4));
        document.documentElement.style.setProperty("--mouse-y", y.toFixed(4));
      });
    });
  }

  // High-Performance Scroll Parallax Driver
  let isScrollParallaxTicking = false;
  $(window).on("scroll", function () {
    if (!isScrollParallaxTicking) {
      window.requestAnimationFrame(() => {
        const scrollTop = $(window).scrollTop();
        document.documentElement.style.setProperty("--scroll-top", scrollTop);
        isScrollParallaxTicking = false;
      });
      isScrollParallaxTicking = true;
    }
  });



  // Lightweight Scroll Reveal (Aos Alternative)
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $(entry.target).addClass("reveal-visible");
          
          // Trigger metric counter animations if this section enters
          if ($(entry.target).hasClass("hero-metrics-grid") || $(entry.target).find(".counter-animate").length > 0) {
            animateCounters();
          }
        }
      });
    },
    { threshold: 0.15 }
  );

  $(".reveal-on-scroll, .reveal-zoom").each(function () {
    revealObserver.observe(this);
  });


  // Animated Metrics Counter
  function animateCounters() {
    $(".counter-animate").each(function () {
      const $this = $(this);
      if ($this.hasClass("counted")) return;
      $this.addClass("counted");
      
      const countTo = parseFloat($this.data("target"));
      
      $({ countNum: 0 }).animate(
        { countNum: countTo },
        {
          duration: 2000,
          easing: "swing",
          step: function () {
            // Check if metric has a percent suffix
            if ($this.data("suffix") === "%") {
              $this.text(Math.floor(this.countNum) + "%");
            } else {
              $this.text(Math.floor(this.countNum));
            }
          },
          complete: function () {
            if ($this.data("suffix") === "%") {
              $this.text(countTo + "%");
            } else {
              $this.text(countTo);
            }
          }
        }
      );
    });
  }

  // Fallback trigger for hero metrics if observer hasn't loaded instantly
  setTimeout(animateCounters, 600);


  // Interactive Yield Calculator
  const $unitsInput = $("#calc-units");
  const $rentInput = $("#calc-rent");
  const $occupancyInput = $("#calc-occupancy");

  const $unitsVal = $("#val-units");
  const $rentVal = $("#val-rent");
  const $occupancyVal = $("#val-occupancy");

  const $convGross = $("#conv-gross-revenue");
  const $convNet = $("#conv-net-yield");
  const $metGross = $("#met-gross-revenue");
  const $metNet = $("#met-net-yield");
  const $advantageAmt = $("#advantage-amount");

  const PROPERTY_VALUATION = 10000000; // 10 million AED standard capital asset evaluation

  function formatCurrency(val) {
    const formatted = Math.round(val).toLocaleString();
    return currentLang === "ar" ? `${formatted} درهم` : `AED ${formatted}`;
  }

  function formatPercent(val) {
    return `${val.toFixed(2)}%`;
  }

  function updateCalculator() {
    const units = parseInt($unitsInput.val());
    const baseRent = parseFloat($rentInput.val());
    const occupancy = parseFloat($occupancyInput.val());

    // Update dynamic numeric tags
    $unitsVal.text(units);
    $rentVal.text(baseRent.toLocaleString());
    $occupancyVal.text(occupancy);

    // 1. CONVENTIONAL
    const convOccupancyRate = occupancy / 100;
    const convGrossRevenue = units * baseRent * convOccupancyRate;
    const convExpenses = convGrossRevenue * 0.15; // 15% standard property overhead
    const convNetIncome = convGrossRevenue - convExpenses;
    const convNetYieldVal = (convNetIncome / PROPERTY_VALUATION) * 100;

    // 2. METALLY SERVICED (25% Rent Premium, +5% stable occupancy, higher expenses)
    const metRentPremium = baseRent * 1.25;
    const metOccupancyRate = Math.min(occupancy + 5, 100) / 100;
    const metGrossRevenue = units * metRentPremium * metOccupancyRate;
    const metExpenses = metGrossRevenue * 0.22; // 22% hospitality overhead
    const metNetIncome = metGrossRevenue - metExpenses;
    const metNetYieldVal = (metNetIncome / PROPERTY_VALUATION) * 100;

    const netAdvantage = metGrossRevenue - convGrossRevenue;

    // Update Text Data
    $convGross.text(formatCurrency(convGrossRevenue));
    $convNet.text(formatPercent(convNetYieldVal));
    $metGross.text(formatCurrency(metGrossRevenue));
    $metNet.text(formatPercent(metNetYieldVal));
    $advantageAmt.text(formatCurrency(netAdvantage));

    // Update Dynamic Graphic Bars heights
    const maxGross = Math.max(convGrossRevenue, metGrossRevenue) || 1;
    const convHeight = Math.max((convGrossRevenue / maxGross) * 90, 20); // Min height 20%
    const metHeight = Math.max((metGrossRevenue / maxGross) * 90, 20);

    $(".yield-bar-conv").css("height", convHeight + "%").html(`<span>${formatPercent(convNetYieldVal)}</span>`);
    $(".yield-bar-metally").css("height", metHeight + "%").html(`<span>${formatPercent(metNetYieldVal)}</span>`);
  }

  $(".calc-range").on("input change", updateCalculator);


  // Interactive Floor Plan Explorer
  const floorPlanDetails = {
    bedroom: {
      en: {
        title: "Master Suite",
        desc: "Generously sized for complete privacy, featuring built-in oak closets, warm recessed LED lighting, high acoustic insulation, and soft tactile wall details.",
      },
      ar: {
        title: "جناح النوم الرئيسي",
        desc: "مساحة رحبة مصممة لتوفير الهدوء والخصوصية، تضم خزائن ملابس مدمجة من خشب البلوط، إضاءة LED مخفية دافئة، عزل صوتي ممتاز، وتفاصيل جدارية ناعمة.",
      }
    },
    hall: {
      en: {
        title: "Spacious Living Hall",
        desc: "A warm, light-filled focal point combining a lounge and media room. Large premium double-glazed thermal windows offer high energy efficiency.",
      },
      ar: {
        title: "صالة المعيشة الواسعة",
        desc: "نقطة ارتكاز دافئة ومشرقة تجمع بين صالة الاسترخاء وركن الترفيه. نوافذ زجاجية مزدوجة حرارية ممتازة توفر كفاءة طاقة عالية.",
      }
    },
    pantry: {
      en: {
        title: "Open Smart Pantry",
        desc: "Seamlessly integrated open-concept kitchen fitted with premium quartz countertops, soft-close luxury cabinets, and dedicated spaces for appliances.",
      },
      ar: {
        title: "المطبخ التحضيري الذكي",
        desc: "مطبخ تحضيري مفتوح ومتكامل بسلاسة، مجهز بأسطح عمل فاخرة من الكوارتز، خزائن ذكية ذات إغلاق صامت، ومساحات مهيأة لتركيب الأجهزة.",
      }
    },
    bath: {
      en: {
        title: "Boutique Bathroom",
        desc: "A spa-inspired sanctuary featuring premium matte-black sanitary ware, a walk-in rain shower, backlit mirror panels, and Spanish porcelain tile finishes.",
      },
      ar: {
        title: "الحمام الفاخر",
        desc: "ملاذ مستوحى من المنتجعات الصحية الفخمة، يتميز بأدوات صحية متميزة بلون أسود مطفأ، دش مطري منفصل، مرآة ذكية بإضاءة خلفية، وتكسية فاخرة.",
      }
    }
  };

  function updateFloorPlanDetail(part) {
    if (!part || !floorPlanDetails[part]) return;
    const info = floorPlanDetails[part][currentLang];
    
    $("#floor-plan-detail-card").fadeOut(150, function () {
      $(this).find(".card-title").text(info.title);
      $(this).find(".card-text").text(info.desc);
      $(this).fadeIn(150);
    });

    $(".floor-highlight").removeClass("active");
    $(`.floor-highlight-${part}`).addClass("active");
  }

  $(".floor-plan-pill").on("click", function (e) {
    e.preventDefault();
    $(".floor-plan-pill").removeClass("active");
    $(this).addClass("active");
    const part = $(this).data("part");
    updateFloorPlanDetail(part);
  });

  // Sync blueprint highlights with list items
  $(".floor-highlight").on("click", function () {
    const part = $(this).data("part");
    $(".floor-plan-pill").removeClass("active");
    $(`.floor-plan-pill[data-part="${part}"]`).addClass("active");
    updateFloorPlanDetail(part);
  });


  // Interactive Strength Badges
  $(".strength-badge").on("mouseenter click", function () {
    const key = $(this).data("strength");
    if (!key || !strengthDetails[key]) return;
    activeStrengthKey = key;

    // Visual active highlight
    $(".strength-badge").css({
      "border-color": "rgba(7, 44, 36, 0.05)",
      "box-shadow": "var(--shadow-soft)",
      "transform": "translateY(0)"
    });
    $(this).css({
      "border-color": "var(--accent-leaf)",
      "box-shadow": "var(--shadow-leaf)",
      "transform": "translateY(-3px)"
    });

    const info = strengthDetails[key];
    const data = info[currentLang];

    $("#strength-desc-icon").attr("class", info.icon);
    $("#strength-desc-title").text(data.title);
    $("#strength-desc-text").text(data.desc);
    
    if ($("#strength-desc-panel").is(":hidden")) {
      $("#strength-desc-panel").slideDown(300);
    }
  });

  // Active Nav Link Highlighting Via Intersectionobserver
  const sections = $("section[id]");
  const navLinks = $(".navbar-nav .nav-link");

  const navObserverOptions = {
    root: null,
    rootMargin: "-25% 0px -55% 0px", // High accuracy middle viewport focus
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        
        let targetId = id;
        if (id === "founder") {
          targetId = "home"; // Introduction matches Home Link
        } else if (id === "operations") {
          targetId = "project"; // Operations matches Project Link
        }
        
        const $activeLink = $(`.navbar-nav .nav-link[href="#${targetId}"]`);
        if ($activeLink.length) {
          navLinks.removeClass("active");
          $activeLink.addClass("active");
        }
      }
    });
  }, navObserverOptions);

  sections.each(function () {
    navObserver.observe(this);
  });


  // Contact Enquiry Hub
  const $contactForm = $("#enquiry-form");
  const $formFeedback = $("#form-feedback");

  $contactForm.on("submit", function (e) {
    e.preventDefault();
    const $btn = $(this).find("button[type='submit']");
    const originalText = $btn.text();
    
    let isValid = true;
    $(this).find("input, textarea").each(function () {
      if ($(this).prop("required") && !$(this).val()) {
        isValid = false;
        $(this).addClass("is-invalid");
      } else {
        $(this).removeClass("is-invalid");
      }
    });

    if (!isValid) return;

    $btn.prop("disabled", true).html('<i class="fas fa-spinner fa-spin me-2"></i> Executing...');
    
    setTimeout(() => {
      $formFeedback.fadeIn(300);
      $contactForm[0].reset();
      $btn.prop("disabled", false).text(originalText);

      setTimeout(() => {
        $formFeedback.fadeOut(300);
      }, 4000);
    }, 1500);
  });

  $contactForm.find("input, textarea, select").on("focus", function () {
    $(this).parent(".form-group").addClass("focused");
  }).on("blur", function () {
    $(this).parent(".form-group").removeClass("focused");
  });

  // Smooth scroll
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    const target = $(this.hash);
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 80,
        },
        600
      );
    }
  });

  // Init Lang after all elements, variables, and modules are fully defined
  setLanguage(currentLang);
});
