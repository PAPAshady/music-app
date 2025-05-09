import { useContext } from 'react';

export default function useSafeContext(context) {
  const contextValue = useContext(context);

  if (!contextValue) {
    throw new Error(
      `"${context._hookName || 'Unknown Hook'}" must be used within "${context._providerName || 'Unknown Provider'}"`
    );
  }

  return contextValue;
}
