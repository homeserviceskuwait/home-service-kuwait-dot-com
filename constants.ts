import { Service, Testimonial, BlogPost } from './types';

export const APP_NAME_EN = "Home Setup Kuwait";
export const APP_NAME_AR = "تجهيزات المنزل الكويت";
export const PHONE_NUMBER = "55791121";

export const ADMIN_CREDENTIALS = {
  email: 'admin@homeservice.com',
  password: 'admin123'
};

export type ContentType = {
  nav: {
    home: string;
    services: string;
    whyUs: string;
    blog: string;
    contact: string;
    callNow: string;
  };
  hero: {
    tagline: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    ctaCall: string;
    ctaServices: string;
    features: string[];
    stats: {
      secure: string;
      monitoring: string;
      fiveStar: string;
      reviews: string;
    }
  };
  services: {
    title: string;
    subtitle: string;
    cta: string;
    list: Service[];
  };
  whyUs: {
    title: string;
    subtitle: string;
    description: string;
    list: { title: string; desc: string; iconName: string }[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    list: Testimonial[];
  };
  blog: {
    title: string;
    subtitle: string;
    cta: string;
    readMore: string;
    list: BlogPost[];
  };
  contact: {
    tagline: string;
    title: string;
    description: string;
    guarantees: string[];
    callUs: string;
    emailUs: string;
    formTitle: string;
    nameLabel: string;
    phoneLabel: string;
    serviceLabel: string;
    messageLabel: string;
    submitBtn: string;
    disclaimer: string;
  };
  stats: { label: string; value: string }[];
  footer: {
    about: string;
    company: string;
    popularBrands: string;
    serviceAreas: string;
    getInTouch: string;
    rights: string;
    privacy: string;
    terms: string;
    more: string;
  }
};

const SERVICES_EN: Service[] = [
  {
    id: 'pbx',
    title: 'Telephone Exchange (PBX)',
    description: 'Panasonic Telephone Exchange Installation in Kuwait. Professional setup for seamless business connectivity.',
    iconName: 'Phone',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
    priceStart: 'Call for Quote'
  },
  {
    id: 'cctv',
    title: 'CCTV Surveillance',
    description: 'Expert CCTV Technician services. High-quality installation for homes and businesses ensuring 24/7 security.',
    iconName: 'Camera',
    imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=800',
    priceStart: 'Call for Quote'
  },
  {
    id: 'intercom',
    title: 'Intercom Systems',
    description: 'Intercom installation and repair. Enhance your property access control with video and audio solutions.',
    iconName: 'Video',
    imageUrl: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&q=80&w=800',
    priceStart: 'Call for Quote'
  },
  {
    id: 'fingerprint',
    title: 'Fingerprint Attendance',
    description: 'Time and attendance systems installation. Accurate and reliable authentication for your workforce.',
    iconName: 'Fingerprint',
    imageUrl: 'https://images.unsplash.com/photo-1623949556303-b0d17d122d2b?auto=format&fit=crop&q=80&w=800',
    priceStart: 'Call for Quote'
  },
  {
    id: 'audio',
    title: 'Audio Systems',
    description: 'Ceiling speaker technician and audio system setup for residential and commercial spaces.',
    iconName: 'Speaker',
    imageUrl: 'https://images.unsplash.com/photo-1545459720-aacaf5090834?auto=format&fit=crop&q=80&w=800',
    priceStart: 'Call for Quote'
  },
  {
    id: 'smart-lock',
    title: 'Smart Door Locks',
    description: 'Smart lock installation with fingerprint and app control. Optimal security and convenience.',
    iconName: 'Lock',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&q=80&w=800',
    priceStart: 'Call for Quote'
  },
  {
    id: 'panel',
    title: 'Distribution Panel Setup',
    description: 'Efficient and reliable distribution panel solutions for managing business and home electrical systems.',
    iconName: 'Settings',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800',
    priceStart: 'Call for Quote'
  },
  {
    id: 'landline',
    title: 'Landline & Fiber Repair',
    description: 'Fiber optic landline phone repair and setup. Fast response times for home and office connectivity.',
    iconName: 'PhoneCall',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80&w=800',
    priceStart: 'Call for Quote'
  }
];

const SERVICES_AR: Service[] = [
  {
    id: 'pbx',
    title: 'بدالة هواتف باناسونيك',
    description: 'تركيب وبرمجة بدالات هواتف باناسونيك في الكويت. حلول احترافية لاتصالات سلسة للشركات.',
    iconName: 'Phone',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
    priceStart: 'اتصل للاستفسار'
  },
  {
    id: 'cctv',
    title: 'كاميرات مراقبة',
    description: 'فني كاميرات مراقبة محترف. تركيب عالي الجودة للمنازل والشركات لضمان الأمان على مدار الساعة.',
    iconName: 'Camera',
    imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=800',
    priceStart: 'اتصل للاستفسار'
  },
  {
    id: 'intercom',
    title: 'أنظمة الانتركم',
    description: 'تركيب وتصليح انتركم. عزز التحكم في الوصول إلى منزلك باستخدام حلول الفيديو والصوت الحديثة.',
    iconName: 'Video',
    imageUrl: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&q=80&w=800',
    priceStart: 'اتصل للاستفسار'
  },
  {
    id: 'fingerprint',
    title: 'أجهزة بصمة حضور',
    description: 'تركيب أنظمة الحضور والانصراف. مصادقة دقيقة وموثوقة لإدارة الموظفين في شركتك.',
    iconName: 'Fingerprint',
    imageUrl: 'https://images.unsplash.com/photo-1623949556303-b0d17d122d2b?auto=format&fit=crop&q=80&w=800',
    priceStart: 'اتصل للاستفسار'
  },
  {
    id: 'audio',
    title: 'الأنظمة الصوتية',
    description: 'فني سماعات سقف وتركيب أنظمة صوتية للمساحات السكنية والتجارية والمساجد.',
    iconName: 'Speaker',
    imageUrl: 'https://images.unsplash.com/photo-1545459720-aacaf5090834?auto=format&fit=crop&q=80&w=800',
    priceStart: 'اتصل للاستفسار'
  },
  {
    id: 'smart-lock',
    title: 'أقفال أبواب ذكية',
    description: 'تركيب أقفال ذكية تعمل بالبصمة وتطبيقات الهاتف. أمان مثالي وراحة لا مثيل لها.',
    iconName: 'Lock',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&q=80&w=800',
    priceStart: 'اتصل للاستفسار'
  },
  {
    id: 'panel',
    title: 'لوحات توزيع الكهرباء',
    description: 'تمديد قسائم وحلول فعالة وموثوقة للوحات التوزيع لإدارة الأنظمة الكهربائية المنزلية والتجارية.',
    iconName: 'Settings',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800',
    priceStart: 'اتصل للاستفسار'
  },
  {
    id: 'landline',
    title: 'تصليح هواتف أرضية',
    description: 'تصليح هواتف أرضية وفايبر. استجابة سريعة لتوصيل الخدمات للمنازل والمكاتب.',
    iconName: 'PhoneCall',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80&w=800',
    priceStart: 'اتصل للاستفسار'
  }
];

const TESTIMONIALS_EN: Testimonial[] = [
  {
    id: '1',
    name: 'Abdullah Al-Zad',
    role: 'Businessman',
    comment: 'I own three commercial buildings. Home Setup Kuwait maintains them regularly. Any need is addressed immediately upon contact. Moreover, their support is excellent.',
    rating: 5
  },
  {
    id: '2',
    name: 'Hussein',
    role: 'Manager',
    comment: 'I\'m the manager of a private company. They handle all the management of our office. We haven\'t received any negative reports because their technicians seem highly skilled.',
    rating: 5
  },
  {
    id: '3',
    name: 'Munir Choudhry',
    role: 'Homeowner',
    comment: 'I have five construction companies, and they work on all of them around the clock. Their work techniques, advanced equipment, and overall service are top-notch.',
    rating: 5
  },
  {
    id: '4',
    name: 'Redaoul Ahmed',
    role: 'Teacher',
    comment: 'I desperately needed to set up a CCTV camera, so I contacted them. They arrived on time and completed all the work efficiently. I am very happy with their work.',
    rating: 5
  }
];

const TESTIMONIALS_AR: Testimonial[] = [
  {
    id: '1',
    name: 'عبدالله الزاد',
    role: 'رجل أعمال',
    comment: 'أمتلك ثلاثة مبانٍ تجارية، وتقوم هوم سيت اب الكويت بصيانتها بانتظام. يتم تلبية أي احتياج فور الاتصال. علاوة على ذلك، دعمهم ممتاز.',
    rating: 5
  },
  {
    id: '2',
    name: 'حسين',
    role: 'مدير شركة',
    comment: 'أنا مدير لشركة خاصة. هم يتولون كل إدارة مكاتبنا. لم نتلق أي تقارير سلبية لأن فنييهم يبدون ذوي مهارة وخبرة عالية.',
    rating: 5
  },
  {
    id: '3',
    name: 'منير تشودري',
    role: 'مالك منزل',
    comment: 'لدي خمس شركات مقاولات، وهم يعملون فيها جميعاً على مدار الساعة. تقنيات عملهم ومعداتهم المتقدمة وخدمتهم الشاملة من الطراز الأول.',
    rating: 5
  },
  {
    id: '4',
    name: 'رضا أحمد',
    role: 'معلم',
    comment: 'كنت بحاجة ماسة لتركيب كاميرا مراقبة، فاتصلت بهم. وصلوا في الوقت المحدد وأنجزوا العمل بكفاءة. أنا سعيد جداً بعملهم.',
    rating: 5
  }
];

const BLOG_EN: BlogPost[] = [
  {
    id: '1',
    title: 'Fingerprint attendance and departure device',
    excerpt: 'The smart solution for time management and increased productivity. Essential tools that companies rely on.',
    date: 'Oct 15, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    title: 'Top 10 CCTV Cameras in Kuwait',
    excerpt: 'Security is no longer a luxury, but a necessity. Ensuring the safety of your home, office, or business has become a top priority.',
    date: 'Nov 02, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    title: 'Fiber optic landline phone repair technician',
    excerpt: 'High-quality installation and repair services with fast response times. We provide 24-hour home and office service.',
    date: 'Dec 10, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1520869562399-e772f042f422?auto=format&fit=crop&q=80&w=600'
  }
];

const BLOG_AR: BlogPost[] = [
  {
    id: '1',
    title: 'جهاز بصمة الحضور والانصراف',
    excerpt: 'الحل الذكي لإدارة الوقت وزيادة الإنتاجية. أدوات أساسية تعتمد عليها الشركات لتحسين كفاءة الموارد البشرية.',
    date: '١٥ أكتوبر ٢٠٢٣',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    title: 'أفضل 10 كاميرات مراقبة في الكويت',
    excerpt: 'الأمن لم يعد رفاهية، بل ضرورة. ضمان سلامة منزلك أو مكتبك أو عملك أصبح أولوية قصوى في الكويت.',
    date: '٠٢ نوفمبر ٢٠٢٣',
    imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    title: 'فني تصليح هواتف أرضية وفايبر',
    excerpt: 'خدمات تركيب وإصلاح عالية الجودة مع استجابة سريعة. نقدم خدمة 24 ساعة للمنازل والمكاتب.',
    date: '١٠ ديسمبر ٢٠٢٣',
    imageUrl: 'https://images.unsplash.com/photo-1520869562399-e772f042f422?auto=format&fit=crop&q=80&w=600'
  }
];

export const CONTENT = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      whyUs: 'Why Us',
      blog: 'Blog',
      contact: 'Contact',
      callNow: 'Call Now'
    },
    hero: {
      tagline: '#1 Home Service in Kuwait',
      titleLine1: 'Smart Living',
      titleLine2: 'Starts Here.',
      description: 'Seven years of expertise in securing and upgrading homes across Kuwait. From CCTV to smart locks, we handle the tech so you can enjoy the comfort.',
      ctaCall: `Call ${PHONE_NUMBER}`,
      ctaServices: 'Explore Services',
      features: [
        "Seven years of experience",
        "Always-on customer support",
        "Monthly maintenance subscription",
        "Fully trained team",
        "Frequent discounts",
        "Five-star service"
      ],
      stats: {
        secure: 'System Secure',
        monitoring: 'Monitoring Active',
        fiveStar: '5-Star Service',
        reviews: 'Based on 230+ Reviews'
      }
    },
    services: {
      title: 'Professional Installation & Setup Services',
      subtitle: 'Our Expertise',
      cta: 'Get a Custom Quote',
      list: SERVICES_EN
    },
    whyUs: {
      title: 'The Standard for Home Service',
      subtitle: 'Why Choose Us',
      description: "We don't just fix things; we upgrade your lifestyle. Here's why 400+ projects rely on our team.",
      list: [
        { iconName: 'Wrench', title: "Customizable", desc: "Hourly, daily, or fixed rates tailored to your specific list of needs." },
        { iconName: 'Wallet', title: "Transparent Pricing", desc: "No hidden fees. We work within your budget and offer regular discounts." },
        { iconName: 'Users', title: "Dedicated Team", desc: "Vetted, trained, and certified experts. Always the same friendly faces." },
        { iconName: 'Clock', title: "Advanced Tools", desc: "We bring state-of-the-art equipment to ensure a damage-free, fast install." }
      ]
    },
    testimonials: {
      title: 'Trusted by Kuwait',
      subtitle: 'Testimonials',
      list: TESTIMONIALS_EN
    },
    blog: {
      title: 'Latest Tech Updates',
      subtitle: 'Our Blog',
      cta: 'View All Articles',
      readMore: 'Read Article',
      list: BLOG_EN
    },
    contact: {
      tagline: 'Book Now',
      title: 'Ready to Secure Your Property?',
      description: 'Get a free quote today. Our team is ready to visit your location for a comprehensive inspection.',
      guarantees: [
        "100% Satisfaction Guarantee",
        "Free On-site Inspection",
        "Warranty on All Installations"
      ],
      callUs: 'Call Us 24/7',
      emailUs: 'Email Us',
      formTitle: 'Request a Service',
      nameLabel: 'Your Name',
      phoneLabel: 'Phone Number',
      serviceLabel: 'Select Service',
      messageLabel: 'Message',
      submitBtn: 'Send Request',
      disclaimer: 'By submitting, you agree to our privacy policy.'
    },
    stats: [
      { label: 'Service Guarantee', value: '100%' },
      { label: 'Happy Customers', value: '230+' },
      { label: 'Expert Team', value: '30+' },
      { label: 'Projects Completed', value: '400+' },
    ],
    footer: {
      about: 'We bring professional smart home security and automation to your doorstep. Trusted by hundreds of Kuwaiti homes for our speed, quality, and transparent pricing.',
      company: 'Company',
      popularBrands: 'Popular Brands',
      serviceAreas: 'Service Areas',
      getInTouch: 'Get in Touch',
      rights: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      more: 'more'
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      services: 'خدماتنا',
      whyUs: 'لماذا نحن',
      blog: 'المدونة',
      contact: 'اتصل بنا',
      callNow: 'اتصل الآن'
    },
    hero: {
      tagline: 'الخدمة المنزلية رقم ١ في الكويت',
      titleLine1: 'الحياة الذكية',
      titleLine2: 'تبدأ هنا.',
      description: 'سبع سنوات من الخبرة في تأمين وتطوير المنازل في جميع أنحاء الكويت. من كاميرات المراقبة إلى الأقفال الذكية، نحن نتولى التكنولوجيا لتستمتع بالراحة.',
      ctaCall: `اتصل ${PHONE_NUMBER}`,
      ctaServices: 'استكشف خدماتنا',
      features: [
        "سبع سنوات من الخبرة",
        "دعم فني دائم للعملاء",
        "عقود صيانة شهرية",
        "فريق مدرب بالكامل",
        "خصومات متكررة",
        "خدمة خمس نجوم"
      ],
      stats: {
        secure: 'نظام آمن',
        monitoring: 'المراقبة نشطة',
        fiveStar: 'خدمة 5 نجوم',
        reviews: 'بناءً على 230+ مراجعة'
      }
    },
    services: {
      title: 'خدمات التركيب والإعداد الاحترافية',
      subtitle: 'خبراتنا',
      cta: 'اطلب عرض سعر',
      list: SERVICES_AR
    },
    whyUs: {
      title: 'المعيار الذهبي للخدمات المنزلية',
      subtitle: 'لماذا تختارنا',
      description: "نحن لا نقوم بالإصلاح فقط؛ نحن نرتقي بأسلوب حياتك. إليك السبب الذي يجعل أكثر من 400 مشروع يعتمد على فريقنا.",
      list: [
        { iconName: 'Wrench', title: "خدمة مخصصة", desc: "أسعار بالساعة، يومية، أو ثابتة مصممة خصيصاً لقائمة احتياجاتك." },
        { iconName: 'Wallet', title: "أسعار شفافة", desc: "لا رسوم مخفية. نعمل ضمن ميزانيتك ونقدم خصومات منتظمة." },
        { iconName: 'Users', title: "فريق مخصص", desc: "خبراء معتمدون ومدربون. دائماً نفس الوجوه الودودة لخدمتك." },
        { iconName: 'Clock', title: "أدوات متطورة", desc: "نحضر أحدث المعدات لضمان تركيب سريع وخالٍ من الأضرار." }
      ]
    },
    testimonials: {
      title: 'موثوقون في الكويت',
      subtitle: 'آراء العملاء',
      list: TESTIMONIALS_AR
    },
    blog: {
      title: 'أحدث التقنيات',
      subtitle: 'مدونتنا',
      cta: 'عرض جميع المقالات',
      readMore: 'اقرأ المقال',
      list: BLOG_AR
    },
    contact: {
      tagline: 'احجز الآن',
      title: 'جاهز لتأمين ممتلكاتك؟',
      description: 'احصل على عرض سعر مجاني اليوم. فريقنا مستعد لزيارة موقعك لإجراء فحص شامل.',
      guarantees: [
        "ضمان رضا ١٠٠٪",
        "فحص مجاني في الموقع",
        "كفالة على جميع التركيبات"
      ],
      callUs: 'اتصل بنا ٢٤/٧',
      emailUs: 'راسلنا',
      formTitle: 'طلب خدمة',
      nameLabel: 'الاسم',
      phoneLabel: 'رقم الهاتف',
      serviceLabel: 'اختر الخدمة',
      messageLabel: 'الرسالة',
      submitBtn: 'أرسل الطلب',
      disclaimer: 'بإرسال الطلب، أنت توافق على سياسة الخصوصية الخاصة بنا.'
    },
    stats: [
      { label: 'ضمان الخدمة', value: '١٠٠٪' },
      { label: 'عملاء سعداء', value: '٢٣٠+' },
      { label: 'فريق خبير', value: '٣٠+' },
      { label: 'مشاريع منجزة', value: '٤٠٠+' },
    ],
    footer: {
      about: 'نحن نجلب أمن المنازل الذكية والأتمتة الاحترافية إلى عتبة داركم. موثوق بنا من قبل مئات المنازل الكويتية لسرعتنا وجودتنا وأسعارنا الشفافة.',
      company: 'الشركة',
      popularBrands: 'أشهر الماركات',
      serviceAreas: 'مناطق الخدمة',
      getInTouch: 'تواصل معنا',
      rights: 'جميع الحقوق محفوظة.',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      more: 'المزيد'
    }
  }
};

export const BRANDS = {
  intercom: ['Commex', 'Fermax', 'Panasonic', 'Hikvision', 'Dahua'],
  sound: ['Bosch', 'Boom', 'Bose', 'Dasppa'],
  camera: ['Dahua', 'Hikvision', 'Ezviz', 'Imou', 'Solar'],
  locks: ['Tuya', 'Smart lock', 'Philips'],
  pbx: ['Panasonic'],
  fingerprint: ['Zkteco', 'Hikvision'],
  router: ['TP-Link', 'D-Link']
};

export const SERVICE_AREAS = [
  "Kuwait", "Ahmadi", "Farwaniya", "Sabah Al-Ahmad", "Mubarak Al-Kabeer", "Jahra", "Asma", "Hawalli", "Al-Mutla"
];