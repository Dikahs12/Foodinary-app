import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { globalStyles, isWebPlatform } from '../styles/globalStyles';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false,
  disabled = false,
  style 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getButtonStyle = () => {
    const baseStyle = [globalStyles.button, style];
    
    if (variant === 'secondary') {
      baseStyle.push(globalStyles.buttonSecondary);
    } else if (variant === 'danger') {
      baseStyle.push({ backgroundColor: '#dc2626' });
    }
    
    if (isHovered && !disabled && !loading) {
      baseStyle.push(globalStyles.buttonHover);
    }
    
    if (disabled) {
      baseStyle.push({ backgroundColor: '#cbd5e1', opacity: 0.6 });
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return globalStyles.buttonSecondaryText;
      default:
        return globalStyles.buttonText;
    }
  };

  return (
    <TouchableOpacity 
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      onMouseEnter={() => isWebPlatform && setIsHovered(true)}
      onMouseLeave={() => isWebPlatform && setIsHovered(false)}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;