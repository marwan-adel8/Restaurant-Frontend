import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

// بيانات الخدمة الخاصة بك من موقع EmailJS
// يجب استبدالها ببياناتك الحقيقية
const SERVICE_ID = "service_ymee4l5";
const TEMPLATE_ID = "template_fxrqgry";
const PUBLIC_KEY = "bgvAp9O47yBoAISAK";

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState(""); // لعرض حالة الإرسال للمستخدم

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Sending..."); // جار الإرسال

    // التحقق من أن جميع البيانات المطلوبة متوفرة
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus("Error: EmailJS service configuration missing.");
      console.error("EmailJS configuration missing. Please check your IDs.");
      return;
    }

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
      (result) => {
        console.log("SUCCESS!", result.text);
        setStatus("Message sent successfully! 🎉"); // تم الإرسال بنجاح
        form.current.reset(); // تفريغ الحقول بعد الإرسال
      },
      (error) => {
        console.log("FAILED...", error.text);
        setStatus("Failed to send message. Please try again."); // فشل الإرسال
      }
    );
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-[170px] md:py-[170px]">
      {/* التعديل هنا:
        استخدام 'max-w-md' للعرض الأقصى على الشاشات الصغيرة (افتراضي).
        استخدام 'sm:max-w-lg' لزيادة العرض على الشاشات المتوسطة والكبيرة.
        أصبح العرض الآن يبدأ أصغر ويتسع حسب حجم الشاشة.
      */}
      <div className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8 shadow-2xl rounded-xl mx-4"> 
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Contact Us
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Send us your message and we will get back to you as soon as possible.
        </p>

        <form ref={form} onSubmit={sendEmail} className="space-y-6">
          {/* حقل الاسم */}
          <div>
            <label
              htmlFor="user_name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            {/* تم تغيير 'w-full' إلى 'w-full' وهو بالفعل العرض الكامل لعنصر الحاوية، 
              لكن العرض الكلي للـ Form أصبح أصغر، مما يجعل الـ inputs أصغر تلقائياً.
              تم تعديل الـ padding من 'px-4 py-2' إلى 'px-3 py-2' لتقليل الحجم قليلاً.
            */}
            <input
              type="text"
              name="user_name"
              id="user_name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="Your Name"
            />
          </div>

          {/* حقل رقم الهاتف (اختياري) */}
          <div>
            <label
              htmlFor="user_phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="user_phone"
              id="user_phone"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., 01xxxxxxxxx"
            />
          </div>

          {/* حقل البريد الإلكتروني (مهم للرد) */}
          <div>
            <label
              htmlFor="user_email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              name="user_email"
              id="user_email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="you@example.com"
            />
          </div>

          {/* حقل الرسالة */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows="4"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="Your message content..."
            ></textarea>
          </div>

          {/* زر الإرسال */}
          <div>
            {/* تم تقليل حجم الخط من 'text-lg' إلى 'text-base' على الشاشات الصغيرة، واستخدام 'sm:text-lg' على الشاشات الأكبر. */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base sm:text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Send Message
            </button>
          </div>
        </form>

        {/* عرض حالة الإرسال */}
        {status && (
          <p
            className={`mt-4 text-center font-semibold ${
              status.includes("success")
                ? "text-green-600"
                : status.includes("Error") || status.includes("Failed")
                ? "text-red-600"
                : "text-blue-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </section>
  );
};

export default Contact;