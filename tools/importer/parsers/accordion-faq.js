/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq (category-filterable). Base: accordion.
 * Source: https://taqadistribution.com/addc/en-us/residential/help-and-support/certificates
 *
 * The source FAQ is an interactive, category-filtered accordion whose answers
 * are lazy-loaded (only the collapsed questions are in the initial DOM). The
 * full Q&A set across the two content categories was captured from the live
 * site and is embedded below so the migrated block carries the complete,
 * authorable content.
 *
 * Container block (Accordion convention): name row + one 3-cell row per item.
 * Item model fields (_accordion-faq.json): category (text), summary (text),
 * text (richtext). "All" is a synthetic pill the block adds at render time;
 * every item is tagged with one of the real content categories.
 *   Col 1: category (field:category)
 *   Col 2: question title (field:summary)
 *   Col 3: answer richtext (field:text)
 */
const CATEGORY_BILLING = 'All About Billings and Payments';
const CATEGORY_ONLINE = 'All about your online account';

const FAQ = [
  [CATEGORY_BILLING, 'I don’t think my bill is right, what should I do?', 'There are a number of reasons why your bill may be higher or lower than you expected, such as: A change to your tariff/ estimated bills (or previous estimates) that are different to your actual consumption/the time of year (for example, the impact on your electricity bill of air conditioning in summer)/a change to your usage (if visitors are staying or you have new appliances)/water leaks. It’s unlikely that there is a problem with your meter, but if you are worried about your usage and would like us to investigate, call our support team on 800 2332 or <a href="mailto:contactcentre@taqadistribution.com">email us</a>. Please note that if our investigation shows that your meter is not faulty, we will charge you a call-out fee. But you won’t have to pay the fee if we discover a fault.'],
  [CATEGORY_BILLING, 'I’ve received an estimated bill; what should I do?', 'You don’t need to do anything; it simply means we don’t have an up-to-date meter reading and we have estimated your bill based on the amount you normally use. The bill following your next meter reading will be adjusted to account for any previous overpayment or underpayment.'],
  [CATEGORY_BILLING, 'How can I pay my bill?', 'The easiest way to pay your bill is to set up Autopay or to pay online each month. However, you can also make payments in many other ways, including by phone, mobile app, or Internet banking, post offices, TAQA Distribution kiosks, partner banks, and exchanges across the emirate. <a href="https://www.addc.ae/en-us/residential/Pages/PaymentOptions.aspx">Click here</a> for more information about all the different payment options.'],
  [CATEGORY_BILLING, 'I want to pay my bill online, what should I do?', 'You’ll need to <a href="https://www.addc.ae/en-US/business/pages/ActivationBusiness.aspx">activate your online account</a>, if you haven’t done so already. Then just <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">log in</a> and tell us how much you want to pay and which card to use. It’s as simple as that.'],
  [CATEGORY_BILLING, 'What is Autopay?', 'Autopay is a simple and secure way to ensure you never miss a bill payment. Once your <a href="https://www.addc.ae/en-US/business/pages/ActivationBusiness.aspx">online account</a> is activated, all you must do is set up Autopay and tell us how much you want to pay each month; then, you can relax, and we’ll take the payments for you when they’re due.'],
  [CATEGORY_BILLING, 'How secure is Autopay?', 'Autopay is protected by a cutting-edge security system. As long as you keep your login details private, using Autopay is simple, safe, and secure.'],
  [CATEGORY_BILLING, 'Can I use Autopay for the accounts on my Friends List?', 'Yes, you can. You just need to <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">set up Autopay</a> as you would for your own property.'],
  [CATEGORY_BILLING, 'What happens if I change my mind about using Autopay?', 'You can cancel an Autopay arrangement at any time. Just <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">log in</a> to your online account and follow the simple steps shown.'],
  [CATEGORY_BILLING, 'Can I pay someone else’s bill for them?', 'Yes, you can, either in full or in part; all you need is their TAQA Distribution account number. Once the payment has been processed, we’ll send a confirmation email or SMS to you and the account holder.'],
  [CATEGORY_BILLING, 'What should I do if I can’t afford to pay my bill?', 'We care about our customers and are here to help, so if you’re having problems paying your bills, please speak with our support team on 800 2332 or contact us immediately. We’ll discuss your situation with you, and in some cases, we may be able to work out a manageable payment plan.'],
  [CATEGORY_BILLING, 'I’m afraid I’m going to get cut off. What can I do?', 'It’s important that you keep up to date with your bill payments to avoid a disruption to your service. We do everything we can to keep our customers connected and only cut off the supply as a last resort. We send reminders to customers whose bills are overdue, so if you get one, please don’t ignore it. If you’re worried, you’re at risk of being cut off, call our support team on 800 2332 or contact us.'],
  [CATEGORY_BILLING, 'I’ll be out of the country for a while. How can I avoid being disconnected?', 'You’ll need to make arrangements to pay your bills while you’re away. The easiest way is to <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">sign up for Autopay</a>, but you can also overpay your account and ask a friend to pay the bills for you.'],
  [CATEGORY_BILLING, 'What should I do if I don’t understand my bill?', 'We’ve worked hard to make our water and electricity bills clear and easy to understand. However, if you find your bill confusing, our guide to <a href="https://www.addc.ae/en-us/business/pages/UnderstandYourBill.aspx">understanding your bill</a> should help.'],
  [CATEGORY_BILLING, 'What tariff am I on?', 'Different tariffs are levied for water and electricity. The tariff you’re on is based on your property type and your TAQA Distribution profile. To find out more, take a look at our <a href="https://www.addc.ae/en-US/business/Pages/RatesAndTariffs.aspx">tariff information page</a>.'],
  [CATEGORY_BILLING, 'I think I’m on the wrong tariff. Can I change it?', 'You can find out more about how we allocate our tariffs on our <a href="https://www.addc.ae/en-US/business/Pages/RatesAndTariffs.aspx">tariff information page</a>. If you think you’re not on the right one, please get in touch with us and we’ll look into it for you.'],
  [CATEGORY_BILLING, 'Can I have a printed copy of my bill?', 'As long as you have registered for an <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">online account</a>, you can download and print your bills at any time.'],
  [CATEGORY_ONLINE, 'How do I create an online account?', 'It’s easy; you can set up your account online in minutes. Just <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">click here</a> for more information. All you’ll need is a recent bill showing your account number.'],
  [CATEGORY_ONLINE, 'What can I do with my online account?', 'Your online account is the best way to manage the services you’re getting from us. You can check your usage, change or update your details, manage connections, and pay bills, whenever and wherever you like. <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">Activate your online account</a> now.'],
  [CATEGORY_ONLINE, 'Do I need an online account to receive electronic bills?', 'No, you can receive your bills by email without an online account, so you’ll get them immediately, and they won’t get lost. You can call us to arrange for your bills to be sent by email. Alternatively, if you <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">Activate your online account</a>, you can arrange everything online. Your account lets you manage the services you get from us, which includes arranging electronic bills, checking your usage, changing, or updating your details, managing connections and paying bills.'],
  [CATEGORY_ONLINE, 'I can’t log in to my online account, what; do I do?', 'You may have entered the wrong username or password; check all the characters are correct. Your password will be 6-20 characters long and include at least 1 number. If you’ve forgotten your login details, click <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">here</a> to recover your username or reset your password.'],
  [CATEGORY_ONLINE, 'What happens if I can’t remember my username?', 'You can recover your username here. You will need to provide us with your TAQA Distribution account number, and then we’ll send you a username reminder.'],
  [CATEGORY_ONLINE, 'I’ve forgotten my password; what should I do?', 'Your password will be 6-20 characters long and include at least 1 number. You can <a href="https://www.addc.ae/en-US/home/pages/ForgotPassword.aspx">reset your password here</a>.'],
  [CATEGORY_ONLINE, 'How do I update my contact details?', 'You can update the details we have for you at any time. Just <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">log in to your online account</a> and make any changes you want in your account profile.'],
  [CATEGORY_ONLINE, 'Can I choose which language is used when you contact me?', 'Yes, you can decide which language we use for billing purposes and when we contact you. You can receive communications from us in either English or Arabic. <a href="https://www.addc.ae/en-us/business/_layouts/15/addc/login.aspx">Click here</a> to change your language preference.'],
  [CATEGORY_ONLINE, 'Can I register for an online account using my Emirates ID?', 'We prefer you to use your TAQA Distribution account number to activate your online account. However, if you don’t know this number, you may be able to activate your account using your Emirates ID number if it’s registered with us. If you don’t have an Emirates ID number registered with us, contact our support team on 800 2332 or by <a href="mailto:contactcentre@taqadistribution.com">email</a> for assistance.'],
  [CATEGORY_ONLINE, 'Why didn’t I receive my security PIN code when I tried to activate my account?', 'Your 4-digit PIN code is sent to the mobile number and email address you’ve registered with us. There are several possible reasons why you may not receive it. The solutions below might help: You’ve entered the wrong account or Emirates ID number. Check the account number is correct and try again to request a PIN code. We have a different mobile number or email address registered for you. Check to see if your PIN has been sent to a different mobile number or email address, such as that of your partner or a family member. The email we sent has gone into your junk mail. Check your email account’s junk mail folder. Your mobile number and/or email address have changed recently. If you are using a different mobile number or email address than the one registered with us, please contact our support team at 800 2332 so we can reset your details. You’ll be asked some security questions to verify your identity. Your PIN code didn’t arrive or has expired. Please use the RESEND MY PIN CODE to request another pin code. If you’ve tried these solutions and still don’t receive your PIN, please contact our support team at 800 2332. Our operators are happy to help.'],
  [CATEGORY_ONLINE, 'Will my online account log in details work on the TAQA Distribution mobile App?', 'Yes, you can use the same login details for both. Download our mobile app for <a href="https://play.google.com/store/apps/details?id=com.ADDC.addcApp">Android</a> or <a href="https://apps.apple.com/in/app/addc/id1045166599">iOS</a>.'],
];

export default function parse(element, { document }) {
  const cells = [];

  FAQ.forEach(([category, question, answerHtml]) => {
    // Col 1: category (field:category). Encoded as a bold marker so the value
    // survives the html2md gridtable serialization (a plain short paragraph in
    // the leading cell gets dropped); the block JS reads textContent and strips
    // formatting.
    const categoryCell = document.createDocumentFragment();
    categoryCell.appendChild(document.createComment(' field:category '));
    const catP = document.createElement('p');
    const catStrong = document.createElement('strong');
    catStrong.textContent = category;
    catP.appendChild(catStrong);
    categoryCell.appendChild(catP);

    // Col 2: question (field:summary)
    const summaryCell = document.createDocumentFragment();
    summaryCell.appendChild(document.createComment(' field:summary '));
    const qP = document.createElement('p');
    qP.textContent = question;
    summaryCell.appendChild(qP);

    // Col 3: answer richtext (field:text)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    const ansP = document.createElement('p');
    ansP.innerHTML = answerHtml;
    textCell.appendChild(ansP);

    cells.push([categoryCell, summaryCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
