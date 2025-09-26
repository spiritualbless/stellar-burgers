import React from 'react';
import styles from './error-message.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className={styles.container}>
    <div className={styles.content}>
      <h3 className={`text text_type_main-medium ${styles.title}`}>
        Произошла ошибка
      </h3>
      <p className={`text text_type_main-default ${styles.message}`}>
        {message}
      </p>
      {onRetry && (
        <button 
          className={`text text_type_main-default ${styles.retryButton}`}
          onClick={onRetry}
        >
          Попробовать снова
        </button>
      )}
    </div>
  </div>
);
