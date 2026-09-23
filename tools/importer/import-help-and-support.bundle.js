/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-help-and-support.js
  var import_help_and_support_exports = {};
  __export(import_help_and_support_exports, {
    default: () => import_help_and_support_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document: document2 }) {
    const image = element.querySelector('img[class*="imagesframe"], img[class*="hero"], img');
    const textContainer = element.querySelector('[class*="textContainer"], [class*="textcontainer"]');
    const eyebrow = element.querySelector('[class*="title"]:not(h1):not(h2)');
    const title = element.querySelector('h1, [class*="subtitle"]');
    const intro = element.querySelector('p[class*="text"]');
    if (!image && !textContainer && !title && !intro) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = document2.createDocumentFragment();
    imageCell.appendChild(document2.createComment(" field:image "));
    if (image) imageCell.appendChild(image);
    cells.push([imageCell]);
    const textCell = document2.createDocumentFragment();
    textCell.appendChild(document2.createComment(" field:text "));
    if (textContainer) {
      Array.from(textContainer.childNodes).forEach((n) => textCell.appendChild(n));
    } else {
      if (eyebrow) textCell.appendChild(eyebrow);
      if (title) textCell.appendChild(title);
      if (intro) textCell.appendChild(intro);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-solutions.js
  function parse2(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll("ul li"));
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((li) => {
      const link = li.querySelector("a[href]");
      const titleEl = li.querySelector('[class*="title"]');
      const title = titleEl ? titleEl.textContent.trim() : link ? link.textContent.trim() : "";
      const imageCell = "";
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      if (link && title) {
        const a = document2.createElement("a");
        a.href = (link.getAttribute("href") || "").trim();
        a.textContent = title;
        textCell.appendChild(a);
      } else if (title) {
        const p = document2.createElement("p");
        p.textContent = title;
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-solutions", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-app-promo.js
  function parse3(element, { document: document2 }) {
    const appContent = element.querySelector('[class*="appcontent"], [class*="parentAppContent"], [class*="appSectionContainer"]') || element;
    const lifestyleImg = appContent.querySelector(":scope > img, :scope > * > img:not(a img)");
    const taglines = appContent.querySelector('[class*="tagline"]:not([class*="midtagline"])');
    const heading6 = appContent.querySelector("h6");
    const heading5 = appContent.querySelector("h5");
    const appLinks = Array.from(appContent.querySelectorAll('[class*="applinks"] a[href], a[class*="applink"][href]')).filter((a) => a.getAttribute("href"));
    const supportingParas = Array.from(appContent.querySelectorAll("p")).filter((p) => !p.closest('[class*="tagline"]') && !p.closest('[class*="applinks"]') && !p.closest('[class*="tipCard"]'));
    if (!heading5 && !heading6 && !taglines && !supportingParas.length && !appLinks.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = document2.createDocumentFragment();
    imageCell.appendChild(document2.createComment(" field:image "));
    if (lifestyleImg) {
      imageCell.appendChild(lifestyleImg);
    } else {
      const img = document2.createElement("img");
      img.setAttribute("src", "https://taqadistribution.com/_next/static/media/manPhone.cb541850.webp");
      img.setAttribute("alt", "Take control of your TAQA Distribution account");
      imageCell.appendChild(img);
    }
    cells.push([imageCell]);
    const textCell = document2.createDocumentFragment();
    textCell.appendChild(document2.createComment(" field:text "));
    if (taglines) textCell.appendChild(taglines);
    if (heading6) textCell.appendChild(heading6);
    if (heading5) textCell.appendChild(heading5);
    supportingParas.forEach((p) => textCell.appendChild(p));
    appLinks.forEach((a) => {
      const href = (a.getAttribute("href") || "").trim();
      const img = a.querySelector("img");
      const label = img && img.getAttribute("alt") || a.textContent.trim() || href;
      const link = document2.createElement("a");
      link.setAttribute("href", href);
      link.textContent = label;
      const p = document2.createElement("p");
      p.appendChild(link);
      textCell.appendChild(p);
    });
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-app-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-tips.js
  function parse4(element, { document: document2 }) {
    const slides = Array.from(element.querySelectorAll('[class*="tipCard"]'));
    if (!slides.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector("img");
      const textContainer = slide.querySelector('[class*="textContainer"]');
      const cta = slide.querySelector("a[href]");
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      if (image) imageCell.appendChild(image);
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      if (textContainer) {
        Array.from(textContainer.childNodes).forEach((n) => textCell.appendChild(n));
      }
      if (cta) {
        const a = document2.createElement("a");
        a.href = (cta.getAttribute("href") || "").trim();
        a.textContent = cta.textContent.trim();
        textCell.appendChild(a);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-tips", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  var CATEGORY_BILLING = "All About Billings and Payments";
  var CATEGORY_ONLINE = "All about your online account";
  var FAQ = [
    [CATEGORY_BILLING, "I don\u2019t think my bill is right, what should I do?", 'There are a number of reasons why your bill may be higher or lower than you expected, such as: A change to your tariff/ estimated bills (or previous estimates) that are different to your actual consumption/the time of year (for example, the impact on your electricity bill of air conditioning in summer)/a change to your usage (if visitors are staying or you have new appliances)/water leaks. It\u2019s unlikely that there is a problem with your meter, but if you are worried about your usage and would like us to investigate, call our support team on 800 2332 or <a href="mailto:contactcentre@taqadistribution.com">email us</a>. Please note that if our investigation shows that your meter is not faulty, we will charge you a call-out fee. But you won\u2019t have to pay the fee if we discover a fault.'],
    [CATEGORY_BILLING, "I\u2019ve received an estimated bill; what should I do?", "You don\u2019t need to do anything; it simply means we don\u2019t have an up-to-date meter reading and we have estimated your bill based on the amount you normally use. The bill following your next meter reading will be adjusted to account for any previous overpayment or underpayment."],
    [CATEGORY_BILLING, "How can I pay my bill?", 'The easiest way to pay your bill is to set up Autopay or to pay online each month. However, you can also make payments in many other ways, including by phone, mobile app, or Internet banking, post offices, TAQA Distribution kiosks, partner banks, and exchanges across the emirate. <a href="https://www.addc.ae/en-us/residential/Pages/PaymentOptions.aspx">Click here</a> for more information about all the different payment options.'],
    [CATEGORY_BILLING, "I want to pay my bill online, what should I do?", 'You\u2019ll need to <a href="https://www.addc.ae/en-US/business/pages/ActivationBusiness.aspx">activate your online account</a>, if you haven\u2019t done so already. Then just <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">log in</a> and tell us how much you want to pay and which card to use. It\u2019s as simple as that.'],
    [CATEGORY_BILLING, "What is Autopay?", 'Autopay is a simple and secure way to ensure you never miss a bill payment. Once your <a href="https://www.addc.ae/en-US/business/pages/ActivationBusiness.aspx">online account</a> is activated, all you must do is set up Autopay and tell us how much you want to pay each month; then, you can relax, and we\u2019ll take the payments for you when they\u2019re due.'],
    [CATEGORY_BILLING, "How secure is Autopay?", "Autopay is protected by a cutting-edge security system. As long as you keep your login details private, using Autopay is simple, safe, and secure."],
    [CATEGORY_BILLING, "Can I use Autopay for the accounts on my Friends List?", 'Yes, you can. You just need to <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">set up Autopay</a> as you would for your own property.'],
    [CATEGORY_BILLING, "What happens if I change my mind about using Autopay?", 'You can cancel an Autopay arrangement at any time. Just <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">log in</a> to your online account and follow the simple steps shown.'],
    [CATEGORY_BILLING, "Can I pay someone else\u2019s bill for them?", "Yes, you can, either in full or in part; all you need is their TAQA Distribution account number. Once the payment has been processed, we\u2019ll send a confirmation email or SMS to you and the account holder."],
    [CATEGORY_BILLING, "What should I do if I can\u2019t afford to pay my bill?", "We care about our customers and are here to help, so if you\u2019re having problems paying your bills, please speak with our support team on 800 2332 or contact us immediately. We\u2019ll discuss your situation with you, and in some cases, we may be able to work out a manageable payment plan."],
    [CATEGORY_BILLING, "I\u2019m afraid I\u2019m going to get cut off. What can I do?", "It\u2019s important that you keep up to date with your bill payments to avoid a disruption to your service. We do everything we can to keep our customers connected and only cut off the supply as a last resort. We send reminders to customers whose bills are overdue, so if you get one, please don\u2019t ignore it. If you\u2019re worried, you\u2019re at risk of being cut off, call our support team on 800 2332 or contact us."],
    [CATEGORY_BILLING, "I\u2019ll be out of the country for a while. How can I avoid being disconnected?", 'You\u2019ll need to make arrangements to pay your bills while you\u2019re away. The easiest way is to <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">sign up for Autopay</a>, but you can also overpay your account and ask a friend to pay the bills for you.'],
    [CATEGORY_BILLING, "What should I do if I don\u2019t understand my bill?", 'We\u2019ve worked hard to make our water and electricity bills clear and easy to understand. However, if you find your bill confusing, our guide to <a href="https://www.addc.ae/en-us/business/pages/UnderstandYourBill.aspx">understanding your bill</a> should help.'],
    [CATEGORY_BILLING, "What tariff am I on?", 'Different tariffs are levied for water and electricity. The tariff you\u2019re on is based on your property type and your TAQA Distribution profile. To find out more, take a look at our <a href="https://www.addc.ae/en-US/business/Pages/RatesAndTariffs.aspx">tariff information page</a>.'],
    [CATEGORY_BILLING, "I think I\u2019m on the wrong tariff. Can I change it?", 'You can find out more about how we allocate our tariffs on our <a href="https://www.addc.ae/en-US/business/Pages/RatesAndTariffs.aspx">tariff information page</a>. If you think you\u2019re not on the right one, please get in touch with us and we\u2019ll look into it for you.'],
    [CATEGORY_BILLING, "Can I have a printed copy of my bill?", 'As long as you have registered for an <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">online account</a>, you can download and print your bills at any time.'],
    [CATEGORY_ONLINE, "How do I create an online account?", 'It\u2019s easy; you can set up your account online in minutes. Just <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">click here</a> for more information. All you\u2019ll need is a recent bill showing your account number.'],
    [CATEGORY_ONLINE, "What can I do with my online account?", 'Your online account is the best way to manage the services you\u2019re getting from us. You can check your usage, change or update your details, manage connections, and pay bills, whenever and wherever you like. <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">Activate your online account</a> now.'],
    [CATEGORY_ONLINE, "Do I need an online account to receive electronic bills?", 'No, you can receive your bills by email without an online account, so you\u2019ll get them immediately, and they won\u2019t get lost. You can call us to arrange for your bills to be sent by email. Alternatively, if you <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">Activate your online account</a>, you can arrange everything online. Your account lets you manage the services you get from us, which includes arranging electronic bills, checking your usage, changing, or updating your details, managing connections and paying bills.'],
    [CATEGORY_ONLINE, "I can\u2019t log in to my online account, what; do I do?", 'You may have entered the wrong username or password; check all the characters are correct. Your password will be 6-20 characters long and include at least 1 number. If you\u2019ve forgotten your login details, click <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">here</a> to recover your username or reset your password.'],
    [CATEGORY_ONLINE, "What happens if I can\u2019t remember my username?", "You can recover your username here. You will need to provide us with your TAQA Distribution account number, and then we\u2019ll send you a username reminder."],
    [CATEGORY_ONLINE, "I\u2019ve forgotten my password; what should I do?", 'Your password will be 6-20 characters long and include at least 1 number. You can <a href="https://www.addc.ae/en-US/home/pages/ForgotPassword.aspx">reset your password here</a>.'],
    [CATEGORY_ONLINE, "How do I update my contact details?", 'You can update the details we have for you at any time. Just <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">log in to your online account</a> and make any changes you want in your account profile.'],
    [CATEGORY_ONLINE, "Can I choose which language is used when you contact me?", 'Yes, you can decide which language we use for billing purposes and when we contact you. You can receive communications from us in either English or Arabic. <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">Click here</a> to change your language preference.'],
    [CATEGORY_ONLINE, "Can I register for an online account using my Emirates ID?", 'We prefer you to use your TAQA Distribution account number to activate your online account. However, if you don\u2019t know this number, you may be able to activate your account using your Emirates ID number if it\u2019s registered with us. If you don\u2019t have an Emirates ID number registered with us, contact our support team on 800 2332 or by <a href="mailto:contactcentre@taqadistribution.com">email</a> for assistance.'],
    [CATEGORY_ONLINE, "Why didn\u2019t I receive my security PIN code when I tried to activate my account?", "Your 4-digit PIN code is sent to the mobile number and email address you\u2019ve registered with us. There are several possible reasons why you may not receive it. The solutions below might help: You\u2019ve entered the wrong account or Emirates ID number. Check the account number is correct and try again to request a PIN code. We have a different mobile number or email address registered for you. Check to see if your PIN has been sent to a different mobile number or email address, such as that of your partner or a family member. The email we sent has gone into your junk mail. Check your email account\u2019s junk mail folder. Your mobile number and/or email address have changed recently. If you are using a different mobile number or email address than the one registered with us, please contact our support team at 800 2332 so we can reset your details. You\u2019ll be asked some security questions to verify your identity. Your PIN code didn\u2019t arrive or has expired. Please use the RESEND MY PIN CODE to request another pin code. If you\u2019ve tried these solutions and still don\u2019t receive your PIN, please contact our support team at 800 2332. Our operators are happy to help."],
    [CATEGORY_ONLINE, "Will my online account log in details work on the TAQA Distribution mobile App?", 'Yes, you can use the same login details for both. Download our mobile app for <a href="https://play.google.com/store/apps/details?id=com.ADDC.addcApp">Android</a> or <a href="https://apps.apple.com/in/app/addc/id1045166599">iOS</a>.']
  ];
  function parse5(element, { document: document2 }) {
    const cells = [];
    FAQ.forEach(([category, question, answerHtml]) => {
      const categoryCell = document2.createDocumentFragment();
      categoryCell.appendChild(document2.createComment(" field:category "));
      const catP = document2.createElement("p");
      const catStrong = document2.createElement("strong");
      catStrong.textContent = category;
      catP.appendChild(catStrong);
      categoryCell.appendChild(catP);
      const summaryCell = document2.createDocumentFragment();
      summaryCell.appendChild(document2.createComment(" field:summary "));
      const qP = document2.createElement("p");
      qP.textContent = question;
      summaryCell.appendChild(qP);
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      const ansP = document2.createElement("p");
      ansP.innerHTML = answerHtml;
      textCell.appendChild(ansP);
      cells.push([categoryCell, summaryCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-support.js
  var DAM_BASE = "/content/dam/taqa-ue";
  function localIconFor(href, title) {
    const h = (href || "").toLowerCase();
    const t = (title || "").toLowerCase();
    if (h.startsWith("tel:") || t.includes("call")) return `${DAM_BASE}/icon-phone.svg`;
    if (h.includes("videochat") || t.includes("video")) return `${DAM_BASE}/icon-video.svg`;
    if (h.includes("locations") || t.includes("location")) return `${DAM_BASE}/icon-location.svg`;
    if (h.includes("contactus") || t.includes("chat")) return `${DAM_BASE}/icon-chat.svg`;
    return `${DAM_BASE}/icon-chat.svg`;
  }
  function parse6(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll('[class*="supportDiv"]'));
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const titleEl = card.querySelector("h6");
      const descEl = Array.from(card.querySelectorAll('[class*="supportText"] p')).find((p) => p.textContent.trim());
      const href = (card.getAttribute("href") || "").trim();
      const title = titleEl ? titleEl.textContent.trim() : "";
      const icon = document2.createElement("img");
      icon.setAttribute("src", localIconFor(href, title));
      icon.setAttribute("alt", title);
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      if (icon) imageCell.appendChild(icon);
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      if (titleEl) textCell.appendChild(titleEl);
      if (descEl) textCell.appendChild(descEl);
      if (href) {
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = title || href;
        textCell.appendChild(a);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-support", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/taqa-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var DAM_BASE2 = "/content/dam/taqa-ue";
  var IMAGE_STEM_MAP = {
    HeaderImageResidential: `${DAM_BASE2}/HeaderImageResidential.webp`,
    AppStoreWhite: `${DAM_BASE2}/AppStoreWhite.png`,
    GooglePlayWhite: `${DAM_BASE2}/GooglePlayWhite.png`,
    airConditioner: `${DAM_BASE2}/airConditioner.png`,
    saveElectricity: `${DAM_BASE2}/saveElectricity.png`,
    efficientLighting: `${DAM_BASE2}/efficientLighting.png`,
    wiseAppliances: `${DAM_BASE2}/wiseAppliances.png`,
    saveWaterHome: `${DAM_BASE2}/saveWaterHome.png`,
    saveWaterOutside: `${DAM_BASE2}/saveWaterOutside.png`,
    waterUsage: `${DAM_BASE2}/waterUsage.png`,
    manPhone: `${DAM_BASE2}/manPhone.webp`
  };
  function localizeImages(element) {
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      const file = src.split("/").pop() || "";
      const stem = file.split(".")[0];
      if (stem && IMAGE_STEM_MAP[stem]) {
        img.setAttribute("src", IMAGE_STEM_MAP[stem]);
        img.removeAttribute("srcset");
      }
    });
  }
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".ReactModalPortal",
        "#modalRoot",
        ".dameg-shadow-root-host",
        "next-route-announcer",
        ".damegCursor",
        ".damegCursorMv",
        ".damegReadingLine",
        ".damegReadingLineTriangle"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "nav",
        "a.sr-only",
        ".primaryNavigation_container__NM_X7",
        ".primaryNavigationMobile_container__fMcyp",
        ".dropdown_dropdown__4_Gn0",
        ".footer_footer__Im9Y3",
        "iframe",
        "link",
        "noscript"
      ]);
      localizeImages(element);
    }
  }

  // tools/importer/transformers/taqa-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/transformers/taqa-regroup-app-tips.js
  function blockKey(table) {
    const firstRow = table.querySelector("tr");
    if (!firstRow) return "";
    return (firstRow.textContent || "").toLowerCase().replace(/[\s-]+/g, "");
  }
  function findBlockTable(element, key) {
    const tables = Array.from(element.querySelectorAll("table"));
    return tables.find((t) => blockKey(t).startsWith(key)) || null;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const appTable = findBlockTable(element, "heroapppromo");
    const tipsTable = findBlockTable(element, "carouseltips");
    if (!appTable || !tipsTable) return;
    appTable.after(tipsTable);
  }

  // tools/importer/transformers/taqa-prune-faq-leftovers.js
  function transform4(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const weHelpHeadings = Array.from(element.querySelectorAll("h5")).filter((h) => h.textContent.trim() === "WE ARE HERE TO HELP");
    weHelpHeadings.slice(1).forEach((h) => h.remove());
    const helpLists = Array.from(element.querySelectorAll("ul")).filter((ul) => {
      const firstLink = ul.querySelector("a");
      return firstLink && firstLink.textContent.trim() === "What to do in an emergency";
    });
    helpLists.slice(1).forEach((ul) => ul.remove());
    element.querySelectorAll("p").forEach((p) => {
      if (p.textContent.trim() === "ENERGY SAVING TIPS" && !p.querySelector("*")) {
        p.remove();
      }
    });
    const FILTER_LABELS = /* @__PURE__ */ new Set([
      "All",
      "All About Billings and Payments",
      "All about your online account"
    ]);
    element.querySelectorAll("p").forEach((p) => {
      if (FILTER_LABELS.has(p.textContent.trim()) && !p.querySelector("*")) {
        p.remove();
      }
    });
  }

  // tools/importer/import-help-and-support.js
  var parsers = {
    "hero-banner": parse,
    "cards-solutions": parse2,
    "hero-app-promo": parse3,
    "carousel-tips": parse4,
    "accordion-faq": parse5,
    "cards-support": parse6
  };
  var PAGE_TEMPLATE = {
    name: "help-and-support",
    description: "Help & Support page: page-intro hero, solution link cards, app-promo + energy-tips carousel, FAQ accordion, and customer support cards.",
    urls: [
      "https://taqadistribution.com/addc/en-us/residential/help-and-support/certificates"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [".headerFrame_herosection__gGU27"]
      },
      {
        name: "cards-solutions",
        instances: [".customCarousel_carousel__RG2l3", ".findYourSolutionCard_container__RLvzQ"]
      },
      {
        name: "hero-app-promo",
        instances: [".solutionsCarousel_appsectioncontainer__WLOtL"]
      },
      {
        name: "carousel-tips",
        instances: [".tipsCarousel_carousel__xtuBU", ".solutionsCarousel_tips__w2nPQ"]
      },
      {
        name: "accordion-faq",
        instances: [".faqsection_faqContainer__LM9T0"]
      },
      {
        name: "cards-support",
        instances: [".customerSupport_subContainer__7YEhA"]
      }
    ],
    sections: [
      {
        id: "rc2",
        name: "hero",
        selector: [".headerFrame_herosection__gGU27"],
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "find-your-solution",
        selector: [".customCarousel_container__sxi1j"],
        style: null,
        blocks: ["cards-solutions"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "app-promo-and-tips",
        selector: [".solutionsCarousel_appsectioncontainer__WLOtL"],
        style: null,
        blocks: ["hero-app-promo", "carousel-tips"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "faq",
        selector: [".faqPanel_container__Tce5m"],
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: []
      },
      {
        id: "rc6",
        name: "customer-support",
        selector: [".customerSupport_container__Nzg04"],
        style: "dark",
        blocks: ["cards-support"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform3,
    transform4
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_help_and_support_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      main.querySelectorAll('img[src*="/content/dam/taqa-ue/"]').forEach((img) => {
        const src = img.getAttribute("src") || "";
        const idx = src.indexOf("/content/dam/taqa-ue/");
        if (idx > -1) img.setAttribute("src", src.slice(idx));
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_help_and_support_exports);
})();
