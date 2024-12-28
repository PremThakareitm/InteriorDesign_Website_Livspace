import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';

const PaymentModal = ({ isOpen, onClose, amount, currency, title, status }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>

            <div className="text-center">
              {status === 'processing' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mx-auto mb-4 w-16 h-16 text-indigo-600"
                >
                  <FiLoader size={64} />
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500"
                >
                  <FiCheck size={32} />
                </motion.div>
              )}

              <h3 className="text-xl font-semibold mb-2">
                {status === 'processing' ? 'Processing Payment' : 'Payment Successful!'}
              </h3>

              <p className="text-gray-600 mb-4">
                {status === 'processing' ? (
                  'Please wait while we process your payment...'
                ) : (
                  'Your payment has been processed successfully.'
                )}
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Payment Details</p>
                <p className="font-semibold text-lg">{currency} {amount}</p>
                <p className="text-gray-500 text-sm">{title}</p>
              </div>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-600"
                >
                  Redirecting to your project page...
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
