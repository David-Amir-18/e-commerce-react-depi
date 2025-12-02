import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export const AlertModal = ({
  isOpen,
  type = "info",
  title,
  message,
  showCancel = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle size={48} className="text-green-400" />,
    error: <AlertCircle size={48} className="text-red-400" />,
    warning: <AlertCircle size={48} className="text-amber-400" />,
    info: <Info size={48} className="text-blue-400" />,
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{icons[type] || icons.info}</div>

          <h2 className="text-xl sm:text-2xl font-semibold text-amber-400 mb-3">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-gray-300 mb-6 whitespace-pre-line">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {showCancel ? (
              <>
                <button
                  onClick={onConfirm}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 sm:py-3 rounded-lg flex-1 transition-all text-sm sm:text-base"
                >
                  Confirm
                </button>

                <button
                  onClick={onCancel}
                  className="border border-white/20 hover:bg-white/10 text-white font-semibold px-4 py-2 sm:py-3 rounded-lg flex-1 transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={onConfirm}
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 sm:py-3 rounded-lg w-full transition-all text-sm sm:text-base"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const useAlert = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, title, message, onConfirm = null, showCancel = false) => {
    setAlert({ type, title, message, onConfirm, showCancel });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const handleAlertConfirm = () => {
    if (alert?.onConfirm) {
      alert.onConfirm();
    }
    closeAlert();
  };

  const AlertComponent = () => (
    <AlertModal
      isOpen={!!alert}
      type={alert?.type}
      title={alert?.title}
      message={alert?.message}
      showCancel={alert?.showCancel}
      onConfirm={handleAlertConfirm}
      onCancel={closeAlert}
    />
  );

  return {
    alert,
    showAlert,
    closeAlert,
    handleAlertConfirm,
    AlertComponent,
  };
};