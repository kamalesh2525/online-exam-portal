import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toastState, setToastState] = useState(null);
  const timerRef = useRef(null);

  const toast = useCallback((msg, type = 'success') => {
    setToastState({ msg, type, visible: true });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToastState((s) => (s ? { ...s, visible: false } : s));
    }, 2800);
  }, []);

  const bg = toastState?.type === 'success' ? '#16a34a' : toastState?.type === 'error' ? '#dc2626' : '#2563eb';

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {toastState && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            padding: '12px 20px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            zIndex: 9999,
            transition: 'opacity .3s',
            boxShadow: '0 4px 12px rgba(0,0,0,.15)',
            background: bg,
            color: 'white',
            opacity: toastState.visible ? 1 : 0,
          }}
        >
          {toastState.msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
