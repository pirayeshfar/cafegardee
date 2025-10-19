import React, { useState, useMemo, useEffect } from 'react';
import { CoffeeBeanIcon, WorldIcon, ArrowRightIcon, TeaIcon, ColdDrinkIcon, ChatIcon } from './components/icons.js';
import CountryCard from './components/CountryCard.js';
import RecipeCard from './components/RecipeCard.js';
import RecipeModal from './components/RecipeModal.js';
import Chatbot from './components/Chatbot.js';
import CategorySelectionCard from './components/CategorySelectionCard.js';

const e = React.createElement;

const allRecipes = [
  // Coffee Recipes
  { name: 'اسپرسو', origin: 'ایتالیا', description: 'پایه بسیاری از نوشیدنی‌های قهوه، با عبور پرفشار آب داغ از میان پودر قهوه فشرده شده تهیه می‌شود.', category: 'کلاسیک', type: 'قهوه', ingredients: ['۷-۹ گرم پودر قهوه اسپرسو', '۳۰ میلی‌لیتر آب داغ'], instructions: ['قهوه را در پرتافیلتر تمپ کنید.', 'پرتافیلتر را به دستگاه اسپرسو متصل کنید.', 'شات اسپرسو را در حدود ۲۵-۳۰ ثانیه بگیرید.'] },
  { name: 'آمریکانو', origin: 'ایتالیا', description: 'نوشیدنی مبتنی بر اسپرسو که با اضافه کردن آب داغ به یک شات اسپرسو تهیه می‌شود و طعمی ملایم‌تر دارد.', category: 'کلاسیک', type: 'قهوه', ingredients: ['۱ شات اسپرسو', '۱۲۰ میلی‌لیتر آب داغ'], instructions: ['یک شات اسپرسو در فنجان بگیرید.', 'آب داغ را به آرامی به آن اضافه کنید.'] },
  { name: 'لاته', origin: 'ایتالیا', description: 'ترکیبی از یک شات اسپرسو با شیر بخار داده شده و لایه نازکی از فوم شیر در بالای آن.', category: 'کلاسیک', type: 'قهوه', ingredients: ['۱ شات اسپرسو', '۱۸۰ میلی‌لیتر شیر', 'فوم شیر برای تزئین'], instructions: ['شیر را بخار دهید تا به دمای ۶۵-۷۰ درجه سانتی‌گراد برسد.', 'اسپرسو را در فنجان بریزید.', 'شیر بخار داده شده را به اسپرسو اضافه کنید و با لایه نازکی از فوم تمام کنید.'] },
  { name: 'کاپوچینو', origin: 'ایتالیا', description: 'یک نوشیدنی محبوب با ترکیبی مساوی از اسپرسو، شیر بخار داده شده و فوم شیر غلیظ.', category: 'کلاسیک', type: 'قهوه', ingredients: ['۱ شات اسپرسو', '۶۰ میلی‌لیتر شیر بخار داده شده', '۶۰ میلی‌لیتر فوم شیر'], instructions: ['اسپرسو را در فنجان بگیرید.', 'شیر را بخار دهید تا فوم غلیظی ایجاد شود.', 'شیر و سپس فوم را به اسپرسو اضافه کنید.'] },
  { name: 'موکا', origin: 'آمریکا', description: 'ترکیبی دلپذیر از اسپرسو، شیر بخار داده شده و شکلات. معمولاً با خامه فرم گرفته تزئین می‌شود.', category: 'کلاسیک', type: 'قهوه', ingredients: ['۱ شات اسپرسو', '۱ قاشق غذاخوری سس شکلات', '۱۵۰ میلی‌لیتر شیر بخار داده شده', 'خامه فرم گرفته (اختیاری)'], instructions: ['سس شکلات را در فنجان بریزید.', 'اسپرسو را روی سس بریزید و مخلوط کنید.', 'شیر بخار داده شده را اضافه کنید.', 'در صورت تمایل با خامه فرم گرفته تزئین کنید.'] },
  { name: 'قهوه ترک', origin: 'ترکیه', description: 'یک روش دم‌آوری قهوه با پودر بسیار ریز که به همراه شکر در قهوه‌جوش مخصوص (جذوه) دم می‌شود.', category: 'کشورها', type: 'قهوه', ingredients: ['۱ قاشق چای‌خوری پودر قهوه ترک', '۱ فنجان آب سرد', 'شکر (اختیاری)'], instructions: ['آب، قهوه و شکر را در جذوه مخلوط کنید.', 'روی حرارت ملایم قرار دهید و هم نزنید.', 'قبل از به جوش آمدن کامل و بالا آمدن کف، از روی حرارت بردارید و سرو کنید.'] },
  { name: 'قهوه تخم‌مرغ ویتنامی', origin: 'ویتنام', city: 'هانوی', description: 'یک دسر قهوه غلیظ و کرمی که از زرده تخم‌مرغ، شکر، شیرعسلی و قهوه دمی غلیظ تهیه می‌شود.', category: 'کشورها', type: 'قهوه', ingredients: ['۲ زرده تخم‌مرغ', '۲ قاشق غذاخوری شیرعسلی', '۱ قاشق چای‌خوری شکر', '۱ فنجان قهوه دمی ویتنامی (یا اسپرسو)'], instructions: ['زرده تخم‌مرغ، شیرعسلی و شکر را با همزن برقی آنقدر بزنید تا کرمی، غلیظ و روشن شود.', 'قهوه داغ را در یک فنجان بریزید.', 'کرم تخم‌مرغ را به آرامی روی قهوه بریزید و سرو کنید.'] },
  { name: 'فلت وایت', origin: 'استرالیا', description: 'نوشیدنی شبیه به لاته اما با لایه بسیار نازک‌تری از میکروفوم شیر که طعم اسپرسو را برجسته‌تر می‌کند.', category: 'کشورها', type: 'قهوه', ingredients: ['۱ شات اسپرسو دوبل (ریسترتو)', '۱۲۰ میلی‌لیتر شیر بخار داده شده با میکروفوم'], instructions: ['یک شات اسپرسو دوبل در فنجان بگیرید.', 'شیر را بخار دهید تا میکروفوم نرم و مخملی ایجاد شود.', 'شیر را با دقت روی اسپرسو بریزید تا یک لایه نازک سفید روی آن تشکیل شود.'] },
  { name: 'آیریش کافی (قهوه ایرلندی)', origin: 'ایرلند', description: 'یک کوکتل قهوه گرم که از قهوه داغ، ویسکی ایرلندی، شکر و لایه‌ای از خامه غلیظ روی آن تشکیل شده است.', category: 'کشورها', type: 'قهوه', ingredients: ['۱ فنجان قهوه دمی داغ', '۱.۵ اونس ویسکی ایرلندی', '۲ قاشق چای‌خوری شکر قهوه‌ای', 'خامه غلیظ'], instructions: ['لیوان را با آب داغ گرم کرده و خالی کنید.', 'شکر قهوه‌ای و ویسکی را در لیوان بریزید و هم بزنید تا حل شود.', 'قهوه داغ را اضافه کنید و هم بزنید.', 'خامه را به آرامی روی پشت یک قاشق روی قهوه بریزید تا لایه‌ای جدا تشکیل دهد.'] },
  { name: 'کافه دِ اویا (Café de Olla)', origin: 'مکزیک', description: 'قهوه سنتی مکزیکی که در یک قابلمه سفالی با چوب دارچین و شکر نیشکر تصفیه نشده (پیلونسیلو) دم می‌شود.', category: 'کشورها', type: 'قهوه', ingredients: ['۴ فنجان آب', '۲ تکه چوب دارچین', '۲ اونس شکر پیلونسیلو (یا شکر قهوه‌ای)', '۴ قاشق غذاخوری قهوه آسیاب شده درشت'], instructions: ['آب، دارچین و شکر را در قابلمه سفالی به جوش آورید.', 'حرارت را کم کرده و ۵ دقیقه بجوشانید تا شکر حل شود.', 'قهوه را اضافه کرده، از روی حرارت بردارید، در آن را بگذارید و ۵ دقیقه دم کنید.', 'قهوه را از صافی رد کرده و سرو کنید.'] },

  // Herbal Tea Recipes
  { name: 'چای نعنای مراکشی', origin: 'مراکش', description: 'یک نوشیدنی گرم و شیرین سنتی که با چای سبز، برگ‌های نعنای تازه و شکر فراوان تهیه می‌شود و نماد مهمان‌نوازی است.', category: 'کشورها', type: 'دمنوش', ingredients: ['۱ قاشق غذاخوری چای سبز', '۱ دسته بزرگ نعنای تازه', '۴ قاشق غذاخوری شکر', '۱ لیتر آب جوش'], instructions: ['چای سبز را در قوری با کمی آب جوش برای ۱ دقیقه خیسانده و آب آن را خالی کنید تا تلخی آن گرفته شود.', 'نعنا و شکر را به قوری اضافه کنید.', 'آب جوش را روی آن ریخته و ۵ دقیقه دم کنید.', 'چای را از ارتفاع در استکان‌های کوچک بریزید تا کف کند و سرو کنید.'] },
  { name: 'چای بابونه', origin: 'جهانی', description: 'یک دمنوش آرام‌بخش و محبوب در سراسر جهان که از گل‌های خشک شده بابونه تهیه می‌شود و به خواص خواب‌آور و ضد استرس خود معروف است.', category: 'کلاسیک', type: 'دمنوش', ingredients: ['۱ قاشق غذاخوری گل بابونه خشک', '۱ فنجان آب جوش', 'عسل یا لیمو (اختیاری)'], instructions: ['گل‌های بابونه را در یک فنجان یا قوری قرار دهید.', 'آب جوش را روی آن بریزید.', 'به مدت ۵ تا ۱۰ دقیقه دم کنید.', 'صاف کرده و در صورت تمایل با عسل یا لیمو شیرین کنید.'] },
  { name: 'چای ماسالا', origin: 'هند', description: 'یک چای شیرین و پرادویه که از جوشاندن چای سیاه در شیر و آب به همراه مخلوطی از ادویه‌جات معطر مانند هل، دارچین، زنجبیل و میخک تهیه می‌شود.', category: 'کشورها', type: 'دمنوش', ingredients: ['۱ فنجان آب', '۱ فنجان شیر', '۲ قاشق چای‌خوری چای سیاه', '۲-۳ عدد هل سبز', '۱ تکه کوچک چوب دارچین', '۲-۳ عدد میخک', '۱ تکه کوچک زنجبیل تازه', 'شکر به میزان لازم'], instructions: ['آب، چای و تمام ادویه‌ها را در یک شیرجوش به جوش آورید.', 'حرارت را کم کرده و ۵ دقیقه بجوشانید.', 'شیر و شکر را اضافه کرده و دوباره تا نزدیک نقطه جوش گرم کنید.', 'چای را صاف کرده و در فنجان بریزید.'] },
  { name: 'یربا ماته', origin: 'آرژانتین', description: 'یک نوشیدنی سنتی در آمریکای جنوبی که از برگ‌های خشک شده درخت یربا ماته تهیه می‌شود و در یک کدو مخصوص با نی فلزی (بومبیلا) سرو می‌شود.', category: 'کشورها', type: 'دمنوش', ingredients: ['۱/۴ فنجان برگ یربا ماته', 'آب داغ (نه جوش، حدود ۸۰ درجه سانتی‌گراد)'], instructions: ['کدو را تا نیمه از برگ ماته پر کنید.', 'کدو را کج کرده و تکان دهید تا برگ‌ها در یک سمت جمع شوند.', 'کمی آب سرد ریخته و صبر کنید تا جذب شود.', 'بومبیلا را در قسمت خالی قرار دهید.', 'آب داغ را به آرامی در قسمت خالی بریزید و بنوشید.'] },
  { name: 'دمنوش زنجبیل و لیمو', origin: 'جهانی', description: 'یک دمنوش کلاسیک و انرژی‌بخش با طعم تند زنجبیل و ترشی لیمو که برای سرماخوردگی و تقویت سیستم ایمنی بسیار محبوب است.', category: 'کلاسیک', type: 'دمنوش', ingredients: ['۱ تکه ۲ سانتی‌متری زنجبیل تازه (ورقه شده)', '۱ عدد لیمو ترش (نصف آن ورقه شده، نصف دیگر برای آب‌گیری)', '۱ قاشق غذاخوری عسل', '۱ فنجان آب جوش'], instructions: ['ورقه‌های زنجبیل و لیمو را در فنجان قرار دهید.', 'آب جوش را روی آن بریزید و ۱۰ دقیقه دم کنید.', 'عسل و آب نصف دیگر لیمو را اضافه کرده، هم بزنید و سرو کنید.'] },
  
  // Cold Drink Recipes
  { name: 'چای سرد تایلندی (چا ین)', origin: 'تایلند', description: 'یک نوشیدنی خامه‌ای، شیرین و خوش‌رنگ که از چای سیاه غلیظ، شیرعسلی و ادویه‌هایی مانند بادیان ستاره‌ای تهیه می‌شود و با یخ فراوان سرو می‌گردد.', category: 'کشورها', type: 'نوشیدنی', ingredients: ['۲ قاشق غذاخوری پودر چای تایلندی', '۱ فنجان آب جوش', '۲ قاشق غذاخوری شیرعسلی', '۲ قاشق غذاخوری شیر تبخیر شده یا شیر نارگیل', 'یخ'], instructions: ['چای را در آب جوش به مدت ۵ دقیقه دم کنید و سپس آن را صاف کنید.', 'شیرعسلی را در چای داغ حل کنید و بگذارید کاملاً خنک شود.', 'یک لیوان بلند را پر از یخ کنید.', 'مخلوط چای را روی یخ بریزید.', 'شیر تبخیر شده را به آرامی روی آن اضافه کنید تا لایه‌ای زیبا ایجاد شود و سرو کنید.'] },
  { name: 'بابل تی (چای حبابی)', origin: 'تایوان', description: 'یک نوشیدنی تایوانی مبتنی بر چای که با مرواریدهای جویدنی تاپیوکا ("بوبا") مخلوط می‌شود. این نوشیدنی در طعم‌های بی‌شماری وجود دارد.', category: 'کشورها', type: 'نوشیدنی', ingredients: ['۱/۴ فنجان مروارید تاپیوکای خام', '۱ فنجان چای سیاه دم‌کرده و خنک‌شده', '۲ قاشق غذاخوری شیر یا شیر گیاهی', '۱-۲ قاشق غذاخوری شربت ساده یا عسل'], instructions: ['مرواریدهای تاپیوکا را طبق دستورالعمل بسته بپزید، سپس آبکش کرده و در شربت ساده قرار دهید.', 'در یک لیوان بلند، مرواریدهای تاپیوکا را بریزید.', 'یخ، چای، شیر و شیرین‌کننده را اضافه کرده و خوب هم بزنید.', 'با یک نی پهن مخصوص سرو کنید.'] },
  { name: 'موهیتو (بدون الکل)', origin: 'کوبا', description: 'نسخه بدون الکل این نوشیدنی کلاسیک کوبایی که با نعنای تازه، لیمو ترش، شکر و آب گازدار تهیه می‌شود و بسیار خنک و باطراوت است.', category: 'کشورها', type: 'نوشیدنی', ingredients: ['۱۰-۱۲ برگ نعنای تازه', 'نصف یک لیمو ترش (۴ قاچ)', '۲ قاشق چای‌خوری شکر', 'یخ خرد شده', 'آب گازدار'], instructions: ['نعنا، لیمو و شکر را در یک لیوان بلند با گوشت‌کوب کمی بکوبید تا عطر آنها آزاد شود.', 'لیوان را با یخ خرد شده پر کنید.', 'روی آن آب گازدار بریزید و به آرامی هم بزنید.', 'با یک شاخه نعنا و یک برش لیمو تزئین کنید.'] },
  { name: 'لاسی انبه', origin: 'هند', description: 'یک نوشیدنی محبوب هندی بر پایه ماست که از ترکیب ماست، انبه رسیده، شیر و کمی شکر تهیه می‌شود. غلیظ، خنک و شیرین است.', category: 'کشورها', type: 'نوشیدنی', ingredients: ['۱ فنجان انبه خرد شده', '۱ فنجان ماست ساده', '۱/۲ فنجان شیر', '۱ قاشق غذاخوری شکر یا عسل (اختیاری)', 'چند قطره گلاب (اختیاری)'], instructions: ['تمام مواد را در مخلوط‌کن بریزید.', 'آنقدر مخلوط کنید تا کاملاً یکدست و نرم شود.', 'در لیوان‌های سرد ریخته و بلافاصله سرو کنید.'] },
  { name: 'آب طعم‌دار (Agua Fresca)', origin: 'مکزیک', description: 'یک نوشیدنی سبک و خنک مکزیکی که از ترکیب میوه‌های تازه (مانند هندوانه یا خیار)، آب، کمی آبلیمو و شیرین‌کننده تهیه می‌شود.', category: 'کشورها', type: 'نوشیدنی', ingredients: ['۴ فنجان هندوانه خرد شده', '۲ فنجان آب سرد', 'آب ۱ عدد لیمو ترش', '۱-۲ قاشق غذاخوری شکر یا عسل (اختیاری)'], instructions: ['هندوانه و آب را در مخلوط‌کن بریزید و تا یکدست شدن کامل مخلوط کنید.', 'مخلوط را از یک صافی ریز رد کنید تا تفاله آن جدا شود.', 'آب لیمو و شیرین‌کننده را اضافه کرده و هم بزنید.', 'با یخ فراوان سرو کنید.'] },
];

const App = () => {
  const [viewState, setViewState] = useState('initial');
  const [selectedType, setSelectedType] = useState(null);
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [listTitle, setListTitle] = useState('');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
    // This check runs once on component mount to detect if the API key is missing.
    // This is crucial for diagnosing issues in the deployed environment.
    if (!process.env.API_KEY) {
        setIsApiKeyMissing(true);
    }
  }, []);

  const filteredRecipes = useMemo(() => {
    if (!selectedType) return [];
    return allRecipes.filter(r => r.type === selectedType);
  }, [selectedType]);

  const classicRecipes = useMemo(() => filteredRecipes.filter(r => r.category === 'کلاسیک'), [filteredRecipes]);
  const countryRecipes = useMemo(() => filteredRecipes.filter(r => r.category === 'کشورها'), [filteredRecipes]);
  const countries = useMemo(() => [...new Set(countryRecipes.map(r => r.origin))].sort(), [countryRecipes]);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setViewState('subCategorySelection');
  };

  const handleShowClassic = () => {
    setListTitle(`رسپی‌های کلاسیک ${selectedType}`);
    setCurrentRecipes(classicRecipes);
    setViewState('recipeList');
  };

  const handleShowCountries = () => {
    setViewState('countrySelection');
  };

  const handleSelectCountry = (country) => {
    const recipesForCountry = countryRecipes.filter(r => r.origin === country);
    setListTitle(`رسپی‌های محبوب در ${country}`);
    setCurrentRecipes(recipesForCountry);
    setViewState('recipeList');
  };

  const handleGoBack = () => {
    if (viewState === 'recipeList') {
        const isCountryList = countries.some(c => listTitle.includes(c));
        setViewState(isCountryList ? 'countrySelection' : 'subCategorySelection');
    } else if (viewState === 'countrySelection') {
        setViewState('subCategorySelection');
    } else if (viewState === 'subCategorySelection') {
        setViewState('initial');
        setSelectedType(null);
    } else {
        setViewState('initial');
    }
    setCurrentRecipes([]);
  };

  const getBackButtonText = () => {
    if (viewState === 'recipeList') {
        return countries.some(c => listTitle.includes(c)) ? 'بازگشت به لیست کشورها' : 'بازگشت به انتخاب دسته';
    }
    if (viewState === 'countrySelection') return 'بازگشت به انتخاب دسته';
    if (viewState === 'subCategorySelection') return 'بازگشت به صفحه اصلی';
    return '';
  };
  
  const typeTitles = {
    'قهوه': 'دنیای قهوه',
    'دمنوش': 'باغ دمنوش‌ها',
    'نوشیدنی': 'نوشیدنی‌های خنک'
  };

  return e(React.Fragment, null,
    e('style', null, `
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-in-out forwards; }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { opacity: 0; animation: fade-in-up 0.5s ease-in-out forwards; }
        @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.3s ease-in-out forwards; }
      `),
    e('div', { className: "bg-[#DCD7C9] min-h-screen text-[#4A2C2A]" },
        isApiKeyMissing && e('div', { className: "bg-yellow-200 border-b-2 border-yellow-400 text-yellow-800 p-3 text-center text-sm font-semibold", role: "alert" },
            e('strong', null, "هشدار: "),
            "کلید API برای هوش مصنوعی تنظیم نشده است. بخش چت‌بات کار نخواهد کرد. لطفاً متغیر محیطی `API_KEY` را در هاست خود تنظیم کنید."
        ),
      e('header', { className: "py-6 px-4 text-center bg-[#4A2C2A]/10 backdrop-blur-sm flex flex-col items-center" },
        e('div', { className: "w-20 h-20 bg-[#4A2C2A] rounded-full flex items-center justify-center mb-4 shadow-lg animate-fade-in" }, e(CoffeeBeanIcon, { className: "w-12 h-12 text-[#DCD7C9]" })),
        e('h1', { className: "text-4xl md:text-5xl font-bold text-[#4A2C2A]" }, "کافه گردی"),
        e('p', { className: "mt-2 text-lg text-[#A27B5C]" }, "راهنمای جامع نوشیدنی‌های کافه")
      ),
      e('main', { className: "container mx-auto p-4 md:p-8" },
        viewState !== 'initial' && e('div', { className: "text-center mb-8 animate-fade-in" },
          e('button', { onClick: handleGoBack, className: "group relative inline-flex items-center justify-center px-6 py-3 font-bold text-[#4A2C2A] transition-all duration-300 ease-in-out bg-white/60 rounded-lg shadow-md hover:bg-white overflow-hidden" },
            e('span', { className: "absolute top-0 right-0 w-0 h-full transition-all duration-300 ease-in-out bg-[#A27B5C] group-hover:w-full" }),
            e('span', { className: "relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white" }, e(ArrowRightIcon, { className: "w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" }), getBackButtonText())
          )
        ),
        viewState === 'initial' && e('div', { className: "animate-fade-in-up" },
          e('h2', { className: "text-3xl md:text-4xl font-bold mb-4 text-center" }, "به کافه گردی خوش آمدید!"),
          e('p', { className: "text-lg md:text-xl mb-12 max-w-3xl mx-auto text-center" }, "دنیای شگفت‌انگیز نوشیدنی‌ها را کشف کنید. برای شروع، یکی از دسته‌بندی‌های زیر را انتخاب کنید."),
          e('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" },
            e(CategorySelectionCard, { title: "دنیای قهوه", description: "از اسپرسو تا کلد برو", imageUrl: "https://source.unsplash.com/800x600/?coffee,dark", icon: e(CoffeeBeanIcon, { className: "w-12 h-12" }), onSelect: () => handleTypeSelect('قهوه') }),
            e(CategorySelectionCard, { title: "باغ دمنوش‌ها", description: "آرامش با طعم طبیعت", imageUrl: "https://source.unsplash.com/800x600/?tea,leaves", icon: e(TeaIcon, { className: "w-12 h-12" }), onSelect: () => handleTypeSelect('دمنوش') }),
            e(CategorySelectionCard, { title: "نوشیدنی‌های خنک", description: "خنکای لذت‌بخش", imageUrl: "https://source.unsplash.com/800x600/?cocktail,juice", icon: e(ColdDrinkIcon, { className: "w-12 h-12" }), onSelect: () => handleTypeSelect('نوشیدنی') })
          )
        ),
        viewState === 'subCategorySelection' && selectedType && e('div', { className: "text-center py-10 animate-fade-in-up" },
          e('h2', { className: "text-3xl md:text-4xl font-bold mb-4" }, typeTitles[selectedType]),
          e('p', { className: "text-lg md:text-xl mb-8 max-w-3xl mx-auto" }, "روش کاوش خود را انتخاب کنید."),
          e('div', { className: "flex flex-col md:flex-row gap-4 justify-center max-w-4xl mx-auto" },
            e('button', { onClick: handleShowClassic, className: "flex-1 flex items-center justify-center gap-3 bg-[#4A2C2A] text-white text-lg font-semibold py-4 px-8 rounded-xl shadow-lg hover:bg-[#382220] transform hover:-translate-y-1 transition-all duration-300" }, e(CoffeeBeanIcon, { className: "w-6 h-6" }), "مرجع رسپی‌های کلاسیک"),
            e('button', { onClick: handleShowCountries, className: "flex-1 flex items-center justify-center gap-3 bg-[#A27B5C] text-white text-lg font-semibold py-4 px-8 rounded-xl shadow-lg hover:bg-[#8e694d] transform hover:-translate-y-1 transition-all duration-300" }, e(WorldIcon, { className: "w-6 h-6" }), "رسپی بر اساس کشورها")
          )
        ),
        viewState === 'countrySelection' && countries.length > 0 && e('div', { className: "animate-fade-in" },
          e('h2', { className: "text-2xl md:text-3xl font-bold text-center mb-8" }, "یک کشور را انتخاب کنید"),
          e('div', { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" }, countries.map((c, i) => e(CountryCard, { key: c, countryName: c, index: i, onSelect: () => handleSelectCountry(c) })))
        ),
        viewState === 'recipeList' && currentRecipes.length > 0 && e('div', { className: "animate-fade-in" },
          e('h2', { className: "text-2xl md:text-3xl font-bold text-center mb-8" }, listTitle),
          e('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, currentRecipes.map((r, i) => e(RecipeCard, { key: `${r.name}-${i}`, recipe: r, index: i, onView: () => setSelectedRecipe(r) })))
        )
      ),
      e(RecipeModal, { recipe: selectedRecipe, onClose: () => setSelectedRecipe(null) }),
      e('button', { onClick: () => setIsChatbotOpen(true), className: "fixed bottom-6 right-6 bg-[#4A2C2A] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300 z-40", 'aria-label': "باز کردن چت با باریستای هوشمند" },
        e(ChatIcon, { className: "w-8 h-8" })
      ),
      e(Chatbot, { isOpen: isChatbotOpen, onClose: () => setIsChatbotOpen(false) }),
      e('footer', { className: "text-center py-6 mt-12 border-t border-[#A27B5C]/30" },
        e('p', { className: "text-[#A27B5C]" }, `طراحی شده با عشق برای علاقه‌مندان به نوشیدنی © ${new Date().getFullYear()}`)
      )
    )
  );
};

export default App;