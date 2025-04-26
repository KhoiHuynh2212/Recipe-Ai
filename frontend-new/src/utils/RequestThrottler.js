// src/components/ChatUI/RequestThrottler.js
import { useState, useEffect } from 'react';

/**
 * A utility hook to manage request throttling with a cooldown period
 * @param {number} maxRequests - Maximum allowed requests before cooldown
 * @param {number} cooldownPeriod - Cooldown period in milliseconds
 * @param {function} onCooldownStart - Optional callback when cooldown starts
 * @param {function} onCooldownEnd - Optional callback when cooldown ends
 * @returns {Object} - Throttling state and request handling methods
 */
const useRequestThrottler = (
  maxRequests = 5,
  cooldownPeriod = 30000, // 30 seconds
  onCooldownStart = null,
  onCooldownEnd = null
) => {
  const [requestCount, setRequestCount] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const [cooldownStartTime, setCooldownStartTime] = useState(null);

  // Check for existing cooldown state in localStorage on initialization
  useEffect(() => {
    const storedCooldown = localStorage.getItem('requestCooldown');
    if (storedCooldown) {
      try {
        const { startTime, endTime } = JSON.parse(storedCooldown);
        const now = Date.now();
        
        // If the stored cooldown is still active
        if (now < endTime) {
          setCooldownStartTime(startTime);
          setIsInCooldown(true);
          setCooldownTimeLeft(endTime - now);
        } else {
          // Clear expired cooldown
          localStorage.removeItem('requestCooldown');
        }
      } catch (error) {
        // Handle parsing error
        console.error('Error parsing cooldown data:', error);
        localStorage.removeItem('requestCooldown');
      }
    }
    
    // Load stored request count
    const storedCount = localStorage.getItem('requestCount');
    if (storedCount) {
      try {
        setRequestCount(parseInt(storedCount, 10));
      } catch (error) {
        console.error('Error parsing request count:', error);
        localStorage.removeItem('requestCount');
      }
    }
  }, []);
  
  // Handle active cooldown countdown
  useEffect(() => {
    let timer;
    
    if (isInCooldown && cooldownTimeLeft > 0) {
      timer = setInterval(() => {
        setCooldownTimeLeft(prevTime => {
          const newTime = prevTime - 1000;
          if (newTime <= 0) {
            clearInterval(timer);
            setIsInCooldown(false);
            localStorage.removeItem('requestCooldown');
            if (onCooldownEnd) onCooldownEnd();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInCooldown, cooldownTimeLeft, onCooldownEnd]);
  
  // Track request count and trigger cooldown if needed
  const trackRequest = () => {
    // If already in cooldown, don't count
    if (isInCooldown) return false;
    
    const newCount = requestCount + 1;
    setRequestCount(newCount);
    localStorage.setItem('requestCount', newCount);
    
    // Check if we've hit the limit
    if (newCount >= maxRequests) {
      startCooldown();
      return false;
    }
    
    return true;
  };
  
  // Start cooldown period
  const startCooldown = () => {
    const startTime = Date.now();
    const endTime = startTime + cooldownPeriod;
    
    setIsInCooldown(true);
    setCooldownStartTime(startTime);
    setCooldownTimeLeft(cooldownPeriod);
    setRequestCount(0);
    localStorage.setItem('requestCount', '0');
    localStorage.setItem('requestCooldown', JSON.stringify({ startTime, endTime }));
    
    if (onCooldownStart) onCooldownStart(cooldownPeriod / 1000);
  };
  
  // Reset the request counter
  const resetCounter = () => {
    setRequestCount(0);
    localStorage.setItem('requestCount', '0');
  };
  
  // Force end cooldown (for admin/testing purposes)
  const forceCooldownEnd = () => {
    setIsInCooldown(false);
    setCooldownTimeLeft(0);
    localStorage.removeItem('requestCooldown');
    if (onCooldownEnd) onCooldownEnd();
  };
  
  return {
    requestCount,
    isInCooldown,
    cooldownTimeLeft,
    cooldownTimeLeftSeconds: Math.ceil(cooldownTimeLeft / 1000),
    canMakeRequest: !isInCooldown,
    trackRequest,
    resetCounter,
    forceCooldownEnd
  };
};

export default useRequestThrottler;