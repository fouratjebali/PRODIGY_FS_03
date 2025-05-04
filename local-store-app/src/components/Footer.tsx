import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-[#0e1b25] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#98dcbe]">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#98dcbe]">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#98dcbe]">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#98dcbe]">
                <FontAwesomeIcon icon={faYoutube} size="lg" />
              </a>
            </div>
          </div>

          {/* Store Location */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Location</h3>
            <p>225 Smith St. (at Butler), Brooklyn</p>
            <p>122 Montague St. (at Henry), Brooklyn</p>
            <a
              href="https://www.google.com/maps?q=225+Smith+St,+Brooklyn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#98dcbe] hover:underline"
            >
              View on Google Maps
            </a>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p>Email: support@tunishop.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Hours: 10am - 6pm, Everyday</p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} TuniShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;