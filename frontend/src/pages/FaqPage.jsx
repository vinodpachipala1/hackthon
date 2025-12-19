import React, { useState, useMemo } from "react";

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqData = [
    {
      category: "General Information",
      questions: [
        {
          q: "What are the working hours of India Post offices?",
          a: "Most India Post offices operate from 9:30 AM to 5:30 PM, Monday to Saturday. Some major post offices have extended hours and may operate on Sundays. The exact timings may vary by location. You can check specific post office timings on the official India Post website."
        },
        {
          q: "How can I find my nearest post office?",
          a: "You can find your nearest post office by visiting the India Post official website and using the 'Post Office Locator' feature. You can search by PIN code, city, or locality. Alternatively, you can download the India Post mobile app which has GPS-based location services."
        },
        {
          q: "What services does India Post provide?",
          a: "India Post provides a wide range of services including Speed Post, Registered Post, Parcel Services, Money Order, Postal Savings Bank, Insurance Services, Passport Services, Aadhaar Services, Bill Payments, and many more. India Post also offers e-commerce delivery services across the country."
        }
      ]
    },
    {
      category: "Speed Post & Registered Post",
      questions: [
        {
          q: "What is the delivery time for Speed Post?",
          a: "Speed Post generally delivers within 1-3 days for major cities and 3-7 days for other locations. For express destinations, delivery is within 1-2 days. International Speed Post delivery times vary by country, typically 3-7 working days."
        },
        {
          q: "How can I track my Speed Post/Registered Post?",
          a: "You can track your Speed Post or Registered Post by visiting the India Post tracking website and entering your 13-digit tracking number. You can also track via SMS by sending the tracking number to 166 or 51969, or use the India Post mobile app for real-time updates."
        },
        {
          q: "What is the maximum weight limit for Speed Post?",
          a: "The maximum weight limit for domestic Speed Post is 35 kg. For international Speed Post, the limit varies by destination country but generally ranges from 20-30 kg. There are also size restrictions, so please check with your local post office for specific requirements."
        },
        {
          q: "Can I send cash through Registered Post?",
          a: "No, you cannot send cash through Registered Post. For sending money, you should use India Post Money Order services or use the India Post Payments Bank facilities. Registered Post is only for documents and parcels, not for currency."
        }
      ]
    },
    {
      category: "Parcel Services",
      questions: [
        {
          q: "How do I calculate parcel charges?",
          a: "Parcel charges are calculated based on weight and distance. You can use the 'Rate Calculator' on the India Post website or mobile app. Charges vary for different services - Parcel, Book Post, etc. You can also get accurate charges from your local post office counter."
        },
        {
          q: "What items are prohibited in India Post parcels?",
          a: "Prohibited items include explosives, flammable materials, drugs, weapons, perishable items without proper packaging, live animals, currency, jewelry, and hazardous chemicals. A complete list is available at all post offices and on the India Post website."
        },
        {
          q: "Can I insure my parcel?",
          a: "Yes, India Post offers insurance for parcels up to ₹50,000 for domestic parcels and varying amounts for international parcels based on destination. Insurance charges are nominal and provide coverage against loss or damage during transit."
        },
        {
          q: "How do I pack items properly for sending by post?",
          a: "Use strong corrugated boxes, seal all openings properly with tape, wrap fragile items in bubble wrap, use adequate cushioning material, label clearly with complete addresses, and mark 'Fragile' if needed. Post offices also offer professional packing services."
        }
      ]
    },
    {
      category: "Complaints & Grievances",
      questions: [
        {
          q: "How do I register a complaint about postal services?",
          a: "You can register complaints through multiple channels: (1) Online via the India Post website complaint portal, (2) Toll-free number 1800-266-6868, (3) Email at helpindiapost.gov.in, (4) Visit your local post office, or (5) Use the mobile app complaint feature."
        },
        {
          q: "What is the complaint resolution time?",
          a: "Simple complaints are usually resolved within 24-48 hours. Complex cases may take 5-7 working days. You will receive regular updates via SMS/email. You can track complaint status online using your complaint ID provided during registration."
        },
        {
          q: "What if my parcel is lost or damaged?",
          a: "If your parcel is lost or damaged, immediately file a complaint with proof of posting and tracking details. For insured parcels, you can claim compensation. Uninsured parcels may have limited compensation as per postal rules. Keep all receipts and documents safe."
        },
        {
          q: "Can I escalate my complaint if not resolved?",
          a: "Yes, if your complaint is not resolved within the stipulated time, you can escalate it to the higher authorities: Postmaster General of the region → Chief Postmaster General → Postal Directorate. Details are available on the India Post website."
        }
      ]
    },
    {
      category: "Financial Services",
      questions: [
        {
          q: "What banking services does India Post offer?",
          a: "India Post Payments Bank (IPPB) offers savings accounts, current accounts, money transfers, bill payments, insurance, mutual funds, pension services, and government scheme payments. Traditional post offices also offer savings schemes like PPF, NSC, and Sukanya Samriddhi."
        },
        {
          q: "How do I open a Post Office Savings Account?",
          a: "To open a Post Office Savings Account, visit any post office with identity proof (Aadhaar, PAN, Voter ID), address proof, two passport photos, and KYC documents. Fill the application form and deposit the minimum amount (₹500 for IPPB, ₹20 for regular savings)."
        },
        {
          q: "What are the interest rates on Post Office schemes?",
          a: "Interest rates vary: PPF (7.1%), NSC (7.7%), Sukanya Samriddhi (8.2%), Monthly Income Scheme (7.4%), Time Deposits (6.8-7.5% based on tenure). Rates are revised quarterly by the government. Current rates are displayed at all post offices and on the website."
        },
        {
          q: "Can I transfer my savings account to another post office?",
          a: "Yes, you can transfer your Post Office Savings Account to another post office by submitting a transfer application at your current post office. The process usually takes 7-10 working days. There is no charge for this transfer service."
        }
      ]
    },
    {
      category: "International Services",
      questions: [
        {
          q: "How do I send documents internationally?",
          a: "For international documents, use International Speed Post or Registered Post. Visit your post office with the document, complete the customs declaration form, provide recipient details, and pay the applicable charges based on destination and weight."
        },
        {
          q: "What documents are required for international parcels?",
          a: "Required documents: Commercial Invoice (3 copies), Packing List, Customs Declaration Form (CN22/CN23), Certificate of Origin if applicable, Import/Export License for restricted items. Your post office will guide you through the documentation process."
        },
        {
          q: "How long does international delivery take?",
          a: "International delivery times vary: USA/UK/Europe (5-7 days), Middle East (3-5 days), Asia (4-6 days), Africa (7-10 days). These are working days and exclude customs clearance time which may add 2-3 additional days."
        },
        {
          q: "Can I track international shipments?",
          a: "Yes, international shipments are trackable until they reach the destination country. Once handed over to the foreign postal service, tracking may continue depending on the destination country's postal system. Use the same 13-digit tracking number."
        }
      ]
    },
    {
      category: "Special Services",
      questions: [
        {
          q: "Does India Post handle passport applications?",
          a: "Yes, many post offices serve as Passport Seva Kendras. They accept passport applications, collect documents, take photographs and biometrics, and forward applications to passport offices. Check the India Post website for authorized post offices offering this service."
        },
        {
          q: "Can I get Aadhaar services at post offices?",
          a: "Yes, selected post offices serve as Aadhaar Enrollment Centers. You can enroll for Aadhaar, update details (name, address, mobile number, etc.), and get Aadhaar printouts. Bring original documents for verification. Service charges apply for updates and printouts."
        },
        {
          q: "Does India Post offer e-commerce delivery?",
          a: "Yes, India Post has partnered with major e-commerce platforms for delivery services across India, including remote areas. They offer cash-on-delivery, reverse pickup, and return services. Contact your local post office for business partnership details."
        },
        {
          q: "Are there special services for senior citizens?",
          a: "Yes, India Post offers priority services for senior citizens (above 60 years) including separate counters, home delivery of pensions, assistance with banking services, and concessional rates for certain services. Senior citizens can also avail of free financial counseling."
        }
      ]
    },
    {
      category: "Technology & Digital Services",
      questions: [
        {
          q: "How do I use the India Post mobile app?",
          a: "Download 'India Post' app from Google Play Store or Apple App Store. Register with your mobile number. The app allows tracking, post office locator, rate calculator, complaint registration, and access to various postal services. It's available in multiple Indian languages."
        },
        {
          q: "Can I pay postal charges online?",
          a: "Yes, you can pay postal charges online through the India Post website or mobile app using debit/credit cards, net banking, UPI, or digital wallets. After online payment, you receive a QR code to be shown at the post office counter for service availing."
        },
        {
          q: "Is there SMS alert service for postal items?",
          a: "Yes, India Post provides free SMS alerts for Speed Post, Registered Post, and parcels. You'll receive alerts for dispatch, transit updates, out for delivery, and delivery confirmation. Ensure your mobile number is correctly provided during booking."
        },
        {
          q: "How do I get digital receipts for postal services?",
          a: "For services availed through the India Post website or app, you receive digital receipts via email and in your account. For counter services, you can request email receipts. Digital receipts are valid for all official purposes including tax documentation."
        }
      ]
    }
  ];

  const toggleQuestion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Filter questions based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return faqData;

    const searchLower = searchTerm.toLowerCase();
    return faqData
      .map(category => ({
        ...category,
        questions: category.questions.filter(qa => 
          qa.q.toLowerCase().includes(searchLower) || 
          qa.a.toLowerCase().includes(searchLower)
        )
      }))
      .filter(category => category.questions.length > 0);
  }, [searchTerm, faqData]);

  const allQuestions = useMemo(() => {
    return faqData.flatMap(category => category.questions);
  }, [faqData]);

  const randomQuestions = useMemo(() => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [allQuestions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-6 shadow-xl ring-4 ring-red-100">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-red-700">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about India Post services
          </p>
          <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold mt-4">
            भारतीय डाक | India Post
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for questions about postal services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 text-gray-700 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-3 text-center">
              Found {filteredData.flatMap(c => c.questions).length} results for "{searchTerm}"
            </p>
          )}
        </div>

        {/* Quick Questions Section */}
        {!searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </div>
              Most Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {randomQuestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Find and expand the question
                    let foundIndex = -1;
                    faqData.forEach((category, catIndex) => {
                      const qIndex = category.questions.findIndex(q => q.q === item.q);
                      if (qIndex !== -1) {
                        foundIndex = catIndex * 100 + qIndex;
                      }
                    });
                    if (foundIndex !== -1) {
                      setExpandedIndex(foundIndex);
                      document.getElementById(`question-${foundIndex}`)?.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-200 text-left group"
                >
                  <div className="flex items-start">
                    <div className="bg-red-50 p-2 rounded-lg mr-3 group-hover:bg-red-100 transition-colors">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-800 font-medium group-hover:text-red-700 transition-colors">
                      {item.q}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredData.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-red-600 to-red-800"></div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="bg-red-100 p-2.5 rounded-xl mr-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  {category.category}
                </h2>
                
                <div className="space-y-4">
                  {category.questions.map((qa, qIndex) => {
                    const globalIndex = catIndex * 100 + qIndex;
                    return (
                      <div 
                        key={qIndex} 
                        id={`question-${globalIndex}`}
                        className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${
                          expandedIndex === globalIndex ? 'bg-red-50 border-red-200' : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <button
                          onClick={() => toggleQuestion(globalIndex)}
                          className="w-full p-5 text-left flex items-center justify-between focus:outline-none"
                        >
                          <div className="flex items-start flex-1">
                            <div className={`p-2 rounded-lg mr-4 ${
                              expandedIndex === globalIndex ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className={`text-lg font-semibold flex-1 ${
                              expandedIndex === globalIndex ? 'text-red-700' : 'text-gray-800'
                            }`}>
                              {qa.q}
                            </h3>
                          </div>
                          <div className={`ml-4 transform transition-transform duration-300 ${
                            expandedIndex === globalIndex ? 'rotate-180' : ''
                          }`}>
                            <svg className={`w-6 h-6 ${expandedIndex === globalIndex ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ${
                          expandedIndex === globalIndex ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="px-5 pb-5 pt-0">
                            <div className="pl-11">
                              <div className="bg-white p-5 rounded-xl border border-gray-200">
                                <div className="flex items-start mb-3">
                                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  <h4 className="font-semibold text-gray-900">Answer</h4>
                                </div>
                                <p className="text-gray-700 leading-relaxed">
                                  {qa.a}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-200 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                <p className="text-gray-700">Contact our customer support team for assistance</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:18002666868"
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call: 1800-266-6868
                </a>
                <a
                  href="mailto:helpindiapost.gov.in"
                  className="bg-white border-2 border-red-600 text-red-600 font-bold py-3 px-6 rounded-xl hover:bg-red-50 transition-all duration-300 flex items-center justify-center shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">300+</div>
            <div className="text-sm text-gray-600">Questions Answered</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">98%</div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Postal Services</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;