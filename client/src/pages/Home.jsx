import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons'
import { faUsers, faComments, faMask, faCoins, faLaptopCode, faChalkboard,  } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons'

const testimonials = [
  {
    text: "EdPeer helped me understand complex programming concepts that I was struggling with in my university courses. The real-time code editor made it easy to collaborate and learn.",
    author: "Ahmed H.",
    role: "Computer Science Student",
    avatar: "https://via.placeholder.com/50"
  },
  {
    text: "I love being able to share my knowledge while remaining anonymous. It creates a pressure-free environment where I can focus on helping others without judgment.",
    author: "Sara M.",
    role: "Mathematics Tutor",
    avatar: "https://via.placeholder.com/50"
  },
  {
    text: "The credit system is brilliant! I help others with English literature and use my earned credits to get help with calculus. It's a win-win situation for everyone.",
    author: "Rahim K.",
    role: "Liberal Arts Student",
    avatar: "https://via.placeholder.com/50"
  }
];

export default function Home() {
  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Learn and Teach Through Peer-to-Peer Interaction
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          EdPeer connects tutees with expert peers for real-time learning
            sessions. Exchange your expertise, earn credits, and build your
            knowledge network.
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <a href="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Get Started
            </a>
            <a href="#how-it-works" className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              Learn More
            </a>
          </div>
          <img src={`${process.env.PUBLIC_URL}/images/peertopeer.png`}  alt="Platform" className="rounded-lg shadow-xl mx-auto" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EdPeer?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers unique features designed to enhance your learning experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: faUsers, title: 'Peer-to-Peer Learning', text: 'Connect with peers who have expertise...' },
              { icon: faComments, title: 'Real-Time Communication', text: 'Chat, use interactive whiteboards...' },
              { icon: faMask, title: 'Optional Anonymity', text: 'Tutors can choose to remain anonymous...' },
              { icon: faCoins, title: 'Credit-Based System', text: 'Earn credits by teaching others...' },
              { icon: faLaptopCode, title: 'Code Editor', text: 'Collaborate on code with syntax highlighting...' },
              { icon: faChalkboard, title: 'Interactive Whiteboard', text: 'Explain complex concepts visually...' },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <FontAwesomeIcon icon={feature.icon} className="text-blue-600 text-3xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How EdPeer Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started with EdPeer is simple and straightforward.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {['Create Account', 'Request Help', 'Connect & Learn', 'Pay It Forward'].map((step, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step}</h3>
                <p className="text-gray-600">Description for {step.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from students and professionals who have experienced the benefits of EdPeer.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="p-6 bg-gray-50 rounded-xl">
                <div className="mb-4 text-blue-600">
                  <FontAwesomeIcon icon={faQuoteLeft} className="mr-2" />
                  <span className="text-gray-600 italic">{testimonial.text}</span>
                  <FontAwesomeIcon icon={faQuoteRight} className="ml-2" />
                </div>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join EdPeer today and connect with peers who can help you succeed academically and professionally.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/register" 
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
            >
              Sign Up Now
            </a>
            <a 
              href="#how-it-works" 
              className="px-8 py-3 border border-white rounded-lg hover:bg-white/10 font-semibold transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about-us" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">EdPeer</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="/careers" className="hover:text-white">Careers</a></li>
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-white">Help Center</a></li>
                <li><a href="/tutorials" className="hover:text-white">Tutorials</a></li>
                <li><a href="/faq" className="hover:text-white">FAQ</a></li>
                <li><a href="/community" className="hover:text-white">Community</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/cookies" className="hover:text-white">Cookie Policy</a></li>
                <li><a href="/security" className="hover:text-white">Security</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:info@edpeer.com" className="hover:text-white">info@edpeer.com</a></li>
                <li><a href="tel:+8801700000000" className="hover:text-white">+880 1700 000 000</a></li>
                <li>Green University of Bangladesh</li>
                <li>Dhaka, Bangladesh</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <div className="flex justify-center gap-6 mb-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faYoutube} size="lg" />
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 EdPeer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}