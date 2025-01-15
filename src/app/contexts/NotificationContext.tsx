// NotificationContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface NotificationContextType {
    isNotificationVisible: boolean;
    hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [isNotificationVisible, setIsNotificationVisible] = useState(true);

    const hideNotification = () => {
        setIsNotificationVisible(false);
    };

    return (
        <NotificationContext.Provider value={{ isNotificationVisible, hideNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
