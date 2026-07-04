import { Alert, Platform } from 'react-native';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export function showAlert(title: string, message?: string, buttons?: AlertButton[]) {
  if (Platform.OS === 'web') {
    // Web no soporta botones estilizados; usamos confirm si hay 2+ opciones, alert si es informativo
    if (buttons && buttons.length > 1) {
      const confirmed = window.confirm(`${title}\n\n${message ?? ''}`);
      if (confirmed) {
        const confirmButton = buttons.find((b) => b.style !== 'cancel');
        confirmButton?.onPress?.();
      } else {
        const cancelButton = buttons.find((b) => b.style === 'cancel');
        cancelButton?.onPress?.();
      }
    } else {
      window.alert(`${title}${message ? `\n\n${message}` : ''}`);
      buttons?.[0]?.onPress?.();
    }
    return;
  }

  Alert.alert(title, message, buttons);
}