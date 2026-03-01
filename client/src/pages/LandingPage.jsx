import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Zap, 
  Shield, 
  Users, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  Building2, 
  GraduationCap, 
  MessageSquare,
  Database,
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { NavLink } from 'react-router';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const featureRef = useRef();
  const howItWorkRef = useRef();
  const useCasesRef = useRef();
  const heroRef = useRef();

   const handleScroll = (ref) => {
     ref.current.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Isolated & Secure",
      description: "Every organization's data stays completely separate. Enterprise-grade encryption and access control built in."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Answers",
      description: "Ask questions in plain language. Get accurate answers sourced exclusively from your documents in seconds."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Universal Document Support",
      description: "Upload PDFs, Word docs, text files, and more. Our system intelligently processes and indexes everything."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team-Ready",
      description: "Built for collaboration. Invite teammates, set permissions, and ensure everyone has the answers they need."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your Documents",
      description: "Drag and drop your company files, knowledge bases, policies, or research papers into your secure workspace."
    },
    {
      number: "02",
      title: "Automatic Processing",
      description: "Our AI breaks down, analyzes, and indexes your content using advanced embedding technology—no setup required."
    },
    {
      number: "03",
      title: "Ask Anything",
      description: "Type your question naturally. Get precise answers with source citations, pulled directly from your uploaded materials."
    }
  ];

  const useCases = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Internal Teams",
      category: "Companies",
      examples: [
        "HR teams finding policy answers instantly",
        "Legal departments searching contract archives",
        "Support teams accessing product documentation",
        "Engineering teams querying technical specs"
      ]
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Educational Institutions",
      category: "Colleges & Universities",
      examples: [
        "Students searching course materials and syllabi",
        "Faculty accessing institutional research",
        "Admin teams querying regulations and guidelines",
        "Libraries making archives searchable"
      ]
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Growing Teams",
      category: "Startups",
      examples: [
        "Founders centralizing company knowledge",
        "Product teams organizing research insights",
        "Remote teams staying aligned on processes",
        "Scale knowledge without scaling headcount"
      ]
    }
  ];

  const techPoints = [
    "Retrieval-Augmented Generation (RAG) ensures answers come from your data, not hallucinated content",
    "Vector embeddings enable semantic search—find relevant information even without exact keyword matches",
    "Modern MERN stack architecture delivers speed, reliability, and scalability",
    "Multi-tenant architecture with complete data isolation between organizations"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .font-display {
          font-family: 'Syne', sans-serif;
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .slide-up-delay-1 {
          animation: slideUp 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .slide-up-delay-2 {
          animation: slideUp 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
        
        .float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #1e40af 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .blob {
          border-radius: 50%;
          position: absolute;
          filter: blur(60px);
          opacity: 0.3;
        }

        .blob-left{
          animation: blobFloat-left 5s linear infinite;
        }

        .blob-right{
          animation: blobFloat-right 10s linear infinite;
        }
        
        @keyframes blobFloat-left {
          0%, 100% { transform: translate(0, -20px) scale(1); }
          33% { transform: translate(80%, 10%) scale(1.5); }
          66% { transform: translate(0px, 50%) scale(1); }
        }

        @keyframes blobFloat-right {
          0%, 100% { transform: translate(-20%, -20%) scale(1); }
          33% { transform: translate(-80%, 30%) scale(1.5); }
          66% { transform: translate(-60%, -80%) scale(1); }
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2" onClick={() => handleScroll(heroRef)}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-slate-900">Chatbot</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink onClick={() => handleScroll(featureRef)} className={(isActive) => isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900 transition-colors" } >Features </NavLink>

            <NavLink onClick={() => handleScroll(howItWorkRef)}   className={(isActive) => isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900 transition-colors" } >How It Works </NavLink>

            <NavLink onClick={() => handleScroll(useCasesRef)}  className={(isActive) => isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900 transition-colors" } >Use Cases </NavLink>
            <button className="px-5 py-2.5 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden" ref={heroRef}>
        <div className="blob-left blob w-96 h-96 bg-blue-500 top-20 -left-48"></div>
        <div className="blob-right blob w-96 h-96 bg-cyan-400 top-40 -right-48"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-25 relative">
          <div className={`text-center max-w-4xl mx-auto ${isVisible ? 'slide-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-8 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Intelligent Knowledge Management</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Your Organization.<br />
              <span className="gradient-text">Your AI Assistant.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Transform your organization's documents into an intelligent knowledge base. 
              Get instant, accurate answers from your own data—not the entire internet.
            </p>
            
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${isVisible ? 'slide-up-delay-1' : ''}`}>
              <button className="px-8 py-3 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg flex items-center space-x-2 shadow-lg hover:shadow-xl">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold text-lg border-2 border-slate-200">
                Watch Demo
              </button>
            </div>
            
            <div className={`mt-12 flex items-center justify-center space-x-8 text-sm text-slate-500 ${isVisible ? 'slide-up-delay-2' : ''}`}>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-slate-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Drowning in Documents?<br />
                You're Not Alone.
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                Most organizations store valuable knowledge in scattered documents, wikis, and drives. 
                Finding the right information wastes hours every week. Generic AI tools can't help because 
                they don't have access to your specific data.
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                "Teams repeatedly ask the same questions",
                "Critical information buried in PDF archives",
                "New employees struggle to find company policies",
                "ChatGPT can't answer questions about YOUR documents",
                "Knowledge locked away instead of accessible"
              ].map((pain, idx) => (
                <div key={idx} className="flex items-start space-x-3  bg-gray-00 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 p-4 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                  </div>
                  <span className="text-slate-200">{pain}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" ref={howItWorkRef}  className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Simple to Use.<br />Powerful Under the Hood.
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three steps to unlock your organization's knowledge
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border-2 border-slate-200 card-hover h-full">
                  <div className="text-6xl font-display font-bold text-blue-200 mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" ref={featureRef} className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600">
              Built for modern teams who value security and accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-8 border-2 border-slate-200 card-hover cursor-pointer"
                onMouseEnter={() => setActiveFeature(idx)}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${
                  activeFeature === idx 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Organization & Security */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-800/50 text-blue-200 px-4 py-2 rounded-full mb-6 font-medium">
                <Shield className="w-4 h-4" />
                <span>Enterprise-Grade Security</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Your Data Stays Yours
              </h2>
              
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Built from the ground up with multi-tenant architecture. Each organization operates 
                in complete isolation—your data is never shared, never mixed, and never exposed to 
                other users.
              </p>
              
              <div className="space-y-4">
                {[
                  "Complete data isolation between organizations",
                  "End-to-end encryption for all documents",
                  "Role-based access control for team members",
                  "Secure storage with regular backups",
                  "GDPR and privacy-compliant infrastructure"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-blue-900/30 rounded-lg border border-blue-700/50">
                    <Lock className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="font-semibold text-white">Organization A</div>
                      <div className="text-sm text-slate-400">1,247 documents • 12 users</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-green-900/30 rounded-lg border border-green-700/50">
                    <Lock className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="font-semibold text-white">Organization B</div>
                      <div className="text-sm text-slate-400">892 documents • 8 users</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-purple-900/30 rounded-lg border border-purple-700/50">
                    <Lock className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="font-semibold text-white">Organization C</div>
                      <div className="text-sm text-slate-400">2,103 documents • 25 users</div>
                    </div>
                  </div>
                  
                  <div className="text-center pt-4 text-slate-400 text-sm">
                    ↑ Completely isolated data environments
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" ref={useCasesRef} className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Built for Every Team
            </h2>
            <p className="text-xl text-slate-600">
              From startups to institutions, unlock your knowledge
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-200 card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4 text-white">
                  {useCase.icon}
                </div>
                <div className="text-sm font-semibold text-blue-600 mb-2">{useCase.category}</div>
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-4">
                  {useCase.title}
                </h3>
                <ul className="space-y-2">
                  {useCase.examples.map((example, exIdx) => (
                    <li key={exIdx} className="flex items-start space-x-2 text-slate-600">
                      <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose This Over ChatGPT */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-16">
            Why Not Just Use ChatGPT?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-900/20 border-2 border-red-700/50 rounded-2xl p-8">
              <div className="text-red-400 font-semibold mb-3 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Generic AI Tools</span>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Can't access your private documents</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Answers based on general internet knowledge</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>No source citations or verification</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Potential data privacy concerns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Frequent hallucinations and inaccuracies</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-900/20 border-2 border-green-700/50 rounded-2xl p-8">
              <div className="text-green-400 font-semibold mb-3 flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>KnowledgeRAG Platform</span>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Answers exclusively from YOUR documents</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Company-specific, accurate knowledge</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Every answer includes source citations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Your data stays private and secure</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Grounded in your actual content—no hallucinations</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 bg-blue-900/30 border-2 border-blue-700/50 rounded-2xl p-8 text-center">
            <p className="text-xl text-slate-200 leading-relaxed">
              <span className="font-bold text-white">Generic AI = Internet knowledge.</span>
              <br />
              <span className="font-bold text-white">KnowledgeRAG = Your organization's intelligence.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Tech Credibility */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4 font-medium">
              <Database className="w-4 h-4" />
              <span>Built on Modern Technology</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We leverage cutting-edge retrieval technology to ensure you get accurate, 
              relevant answers every time
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {techPoints.map((point, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border-2 border-slate-200 flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <p className="text-slate-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm max-w-2xl mx-auto">
              Built with MongoDB, Express, React, and Node.js for reliability and performance. 
              Deployed on secure cloud infrastructure with automatic scaling and 99.9% uptime.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform Your Knowledge?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed">
            Join teams who've already unlocked their organization's intelligence. 
            Get started in minutes, no technical expertise required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button className="px-10 py-5 bg-white text-blue-600 rounded-xl hover:bg-slate-50 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl flex items-center space-x-2">
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="px-10 py-5 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all font-bold text-lg border-2 border-blue-400">
              Schedule a Demo
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card needed</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span className="font-display text-xl font-bold text-white">KnowledgeRAG</span>
              </div>
              <p className="text-sm leading-relaxed">
                Secure, intelligent knowledge management for modern organizations.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Use Cases</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
            <p>© 2024 KnowledgeRAG. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-green-500" />
                <span>256-bit Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;